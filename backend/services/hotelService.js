const axios = require('axios');
const config = require('../config');
const logger = require('../utils/logger');

class HotelService {
  constructor() {
    this.apiBaseUrl = config.hotelApi.baseUrl || 'https://api.hotelpartner.com/v1';
    this.apiKey = config.hotelApi.apiKey;
    this.timeout = config.hotelApi.timeout || 30000;
    
    this.client = axios.create({
      baseURL: this.apiBaseUrl,
      timeout: this.timeout,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'HotelBooking/1.0'
      }
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        logger.error('Hotel API Error:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data
        });
        throw error;
      }
    );
  }

  async searchHotels(searchParams) {
    try {
      const {
        destination,
        checkIn,
        checkOut,
        adults = 1,
        children = 0,
        rooms = 1,
        currency = 'USD',
        minPrice,
        maxPrice,
        amenities = [],
        hotelClass,
        sortBy = 'price'
      } = searchParams;

      if (!destination || !checkIn || !checkOut) {
        throw new Error('Missing required search parameters: destination, checkIn, checkOut');
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      if (checkInDate >= checkOutDate) {
        throw new Error('Check-out date must be after check-in date');
      }

      if (checkInDate < new Date()) {
        throw new Error('Check-in date must be in the future');
      }

      const queryParams = {
        destination: encodeURIComponent(destination),
        checkin: checkInDate.toISOString().split('T')[0],
        checkout: checkOutDate.toISOString().split('T')[0],
        adults,
        children,
        rooms,
        currency,
        sort: sortBy
      };

      if (minPrice) queryParams.min_price = minPrice;
      if (maxPrice) queryParams.max_price = maxPrice;
      if (hotelClass) queryParams.hotel_class = hotelClass;
      if (amenities.length > 0) queryParams.amenities = amenities.join(',');

      const response = await this.client.get('/hotels/search', { params: queryParams });
      
      const hotels = response.data.hotels.map(hotel => ({
        id: hotel.hotel_id,
        name: hotel.name,
        description: hotel.description,
        address: hotel.address,
        city: hotel.city,
        country: hotel.country,
        coordinates: {
          latitude: hotel.latitude,
          longitude: hotel.longitude
        },
        starRating: hotel.star_rating,
        userRating: hotel.user_rating,
        reviewCount: hotel.review_count,
        images: hotel.images || [],
        amenities: hotel.amenities || [],
        rooms: hotel.available_rooms?.map(room => ({
          id: room.room_id,
          type: room.room_type,
          name: room.name,
          description: room.description,
          maxOccupancy: room.max_occupancy,
          price: {
            amount: room.price,
            currency: room.currency,
            perNight: room.per_night
          },
          amenities: room.amenities || [],
          images: room.images || [],
          cancellationPolicy: room.cancellation_policy,
          availability: room.availability
        })) || [],
        policies: {
          checkIn: hotel.check_in_policy,
          checkOut: hotel.check_out_policy,
          cancellation: hotel.cancellation_policy,
          petPolicy: hotel.pet_policy
        }
      }));

      return {
        hotels,
        totalResults: response.data.total_results,
        searchId: response.data.search_id,
        filters: response.data.available_filters
      };

    } catch (error) {
      logger.error('Error searching hotels:', error);
      throw new Error(`Hotel search failed: ${error.message}`);
    }
  }

  async checkAvailability(hotelId, roomId, checkIn, checkOut, guests = 1) {
    try {
      if (!hotelId || !roomId || !checkIn || !checkOut) {
        throw new Error('Missing required parameters for availability check');
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (checkInDate >= checkOutDate) {
        throw new Error('Check-out date must be after check-in date');
      }

      const response = await this.client.get(`/hotels/${hotelId}/rooms/${roomId}/availability`, {
        params: {
          checkin: checkInDate.toISOString().split('T')[0],
          checkout: checkOutDate.toISOString().split('T')[0],
          guests
        }
      });

      const availability = response.data;

      return {
        available: availability.is_available,
        roomId: availability.room_id,
        hotelId: availability.hotel_id,
        price: {
          total: availability.total_price,
          basePrice: availability.base_price,
          taxes: availability.taxes,
          fees: availability.fees,
          currency: availability.currency
        },
        inventory: availability.rooms_available,
        rateDetails: {
          rateId: availability.rate_id,
          rateName: availability.rate_name,
          inclusions: availability.inclusions || [],
          restrictions: availability.restrictions || []
        },
        cancellationPolicy: availability.cancellation_policy,
        validUntil: availability.rate_valid_until
      };

    } catch (error) {
      logger.error('Error checking availability:', error);
      throw new Error(`Availability check failed: ${error.message}`);
    }
  }

  async bookRoom(bookingData) {
    try {
      const {
        hotelId,
        roomId,
        rateId,
        checkIn,
        checkOut,
        guests,
        guestDetails,
        paymentInfo,
        specialRequests
      } = bookingData;

      if (!hotelId || !roomId || !rateId || !checkIn || !checkOut || !guests || !guestDetails) {
        throw new Error('Missing required booking parameters');
      }

      const payload = {
        hotel_id: hotelId,
        room_id: roomId,
        rate_id: rateId,
        checkin_date: new Date(checkIn).toISOString().split('T')[0],
        checkout_date: new Date(checkOut).toISOString().split('T')[0],
        guests: {
          adults: guests.adults || 1,
          children: guests.children || 0
        },
        guest_details: {
          primary_guest: {
            first_name: guestDetails.firstName,
            last_name: guestDetails.lastName,
            email: guestDetails.email,
            phone: guestDetails.phone,
            address: guestDetails.address
          },
          additional_guests: guestDetails.additionalGuests || []
        },
        special_requests: specialRequests || '',
        booking_source: 'api'
      };

      if (paymentInfo) {
        payload.payment_info = {
          method: paymentInfo.method,
          card_token: paymentInfo.cardToken,
          billing_address: paymentInfo.billingAddress
        };
      }

      const response = await this.client.post('/bookings', payload);
      const booking = response.data;

      return {
        bookingId: booking.booking_id,
        confirmationNumber: booking.confirmation_number,
        status: booking.status,
        hotelDetails: {
          id: booking.hotel.id,
          name: booking.hotel.name,
          address: booking.hotel.address,
          phone: booking.hotel.phone
        },
        roomDetails: {
          id: booking.room.id,
          type: booking.room.type,
          name: booking.room.name
        },
        dates: {
          checkIn: booking.checkin_date,
          checkOut: booking.checkout_date,
          nights: booking.nights
        },
        guests: booking.guests,
        pricing: {
          total: booking.total_amount,
          currency: booking.currency,
          breakdown: booking.price_breakdown
        },
        policies: booking.policies,
        contact: {
          hotel_phone: booking.hotel_contact.phone,
          hotel_email: booking.hotel_contact.email
        },
        createdAt: booking.created_at,
        modifiedAt: booking.modified_at
      };

    } catch (error) {
      logger.error('Error booking room:', error);
      
      if (error.response?.status === 400) {
        throw new Error(`Booking failed: ${error.response.data.message || 'Invalid booking data'}`);
      }
      
      if (error.response?.status === 409) {
        throw new Error('Room is no longer available for the selected dates');
      }
      
      throw new Error(`Room booking failed: ${error.message}`);
    }
  }

  async cancelReservation(bookingId, cancellationReason = '') {
    try {
      if (!bookingId) {
        throw new Error('Booking ID is required for cancellation');
      }

      const payload = {
        reason: cancellationReason,
        cancelled_by: 'customer',
        timestamp: new Date().toISOString()
      };

      const response = await this.client.post(`/bookings/${bookingId}/cancel`, payload);
      const cancellation = response.data;

      return {
        bookingId: cancellation.booking_id,
        status: cancellation.status,
        cancellationId: cancellation.cancellation_id,
        cancelledAt: cancellation.cancelled_at,
        refundInfo: {
          refundAmount: cancellation.refund_amount,
          refundCurrency: cancellation.refund_currency,
          refundMethod: cancellation.refund_method,
          refundProcessingTime: cancellation.refund_processing_time,
          refundReference: cancellation.refund_reference
        },
        cancellationFees: cancellation.cancellation_fees || 0,
        policies: cancellation.applicable_policies
      };

    } catch (error) {
      logger.error('Error cancelling reservation:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Booking not found');
      }
      
      if (error.response?.status === 400) {
        throw new Error(`Cancellation failed: ${error.response.data.message || 'Invalid cancellation request'}`);
      }
      
      if (error.response?.status === 422) {
        throw new Error('Booking cannot be cancelled (outside cancellation window or already cancelled)');
      }
      
      throw new Error(`Reservation cancellation failed: ${error.message}`);
    }
  }

  async getBookingDetails(bookingId) {
    try {
      const response = await this.client.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      logger.error('Error fetching booking details:', error);
      throw new Error(`Failed to fetch booking details: ${error.message}`);
    }
  }
}

const hotelService = new HotelService();

module.exports = {
  searchHotels: (searchParams) => hotelService.searchHotels(searchParams),
  checkAvailability: (hotelId, roomId, checkIn, checkOut, guests) => 
    hotelService.checkAvailability(hotelId, roomId, checkIn, checkOut, guests),
  bookRoom: (bookingData) => hotelService.bookRoom(bookingData),
  cancelReservation: (bookingId, reason) => hotelService.cancelReservation(bookingId, reason)
};