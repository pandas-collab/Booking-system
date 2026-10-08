const axios = require('axios');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache
const FLIGHT_API_BASE_URL = process.env.FLIGHT_API_BASE_URL || 'https://api.flightprovider.com/v1';
const API_KEY = process.env.FLIGHT_API_KEY;

class FlightServiceError extends Error {
  constructor(message, code = 500, details = null) {
    super(message);
    this.name = 'FlightServiceError';
    this.code = code;
    this.details = details;
  }
}

const apiClient = axios.create({
  baseURL: FLIGHT_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'User-Agent': 'FlightBookingApp/1.0'
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw new FlightServiceError(
        error.response.data.message || 'Flight API error',
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      throw new FlightServiceError('No response from flight service', 503);
    } else {
      throw new FlightServiceError('Request configuration error', 500);
    }
  }
);

const searchFlights = async (searchParams) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers = 1,
      cabinClass = 'economy',
      directFlight = false
    } = searchParams;

    if (!origin || !destination || !departureDate) {
      throw new FlightServiceError('Missing required search parameters', 400);
    }

    const cacheKey = `search_${JSON.stringify(searchParams)}`;
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      return cachedResult;
    }

    const requestParams = {
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departure_date: departureDate,
      passengers,
      cabin_class: cabinClass,
      direct_only: directFlight
    };

    if (returnDate) {
      requestParams.return_date = returnDate;
    }

    const response = await apiClient.get('/flights/search', {
      params: requestParams
    });

    const flights = response.data.flights.map(flight => ({
      id: flight.id,
      airline: flight.airline,
      flightNumber: flight.flight_number,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departure_time,
      arrivalTime: flight.arrival_time,
      duration: flight.duration,
      stops: flight.stops || 0,
      price: {
        amount: flight.price.amount,
        currency: flight.price.currency
      },
      availableSeats: flight.available_seats,
      cabinClass: flight.cabin_class,
      aircraft: flight.aircraft,
      amenities: flight.amenities || []
    }));

    const result = {
      flights,
      totalResults: response.data.total_results,
      searchId: response.data.search_id,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result);
    return result;

  } catch (error) {
    if (error instanceof FlightServiceError) {
      throw error;
    }
    throw new FlightServiceError('Flight search failed', 500, error.message);
  }
};

const getFlightDetails = async (flightId) => {
  try {
    if (!flightId) {
      throw new FlightServiceError('Flight ID is required', 400);
    }

    const cacheKey = `flight_${flightId}`;
    const cachedResult = cache.get(cacheKey);
    
    if (cachedResult) {
      return cachedResult;
    }

    const response = await apiClient.get(`/flights/${flightId}`);
    const flight = response.data;

    const flightDetails = {
      id: flight.id,
      airline: flight.airline,
      flightNumber: flight.flight_number,
      aircraft: flight.aircraft,
      origin: {
        airport: flight.origin.airport,
        city: flight.origin.city,
        country: flight.origin.country,
        terminal: flight.origin.terminal,
        gate: flight.origin.gate
      },
      destination: {
        airport: flight.destination.airport,
        city: flight.destination.city,
        country: flight.destination.country,
        terminal: flight.destination.terminal,
        gate: flight.destination.gate
      },
      departureTime: flight.departure_time,
      arrivalTime: flight.arrival_time,
      duration: flight.duration,
      distance: flight.distance,
      stops: flight.stops || [],
      price: flight.price,
      availableSeats: flight.available_seats,
      seatMap: flight.seat_map,
      amenities: flight.amenities || [],
      baggage: flight.baggage_policy,
      cancellationPolicy: flight.cancellation_policy,
      changePolicy: flight.change_policy,
      status: flight.status || 'scheduled'
    };

    cache.set(cacheKey, flightDetails);
    return flightDetails;

  } catch (error) {
    if (error instanceof FlightServiceError) {
      throw error;
    }
    throw new FlightServiceError('Failed to get flight details', 500, error.message);
  }
};

const bookFlight = async (bookingData) => {
  try {
    const {
      flightId,
      passengers,
      contactInfo,
      paymentInfo,
      seatPreferences = {},
      specialRequests = []
    } = bookingData;

    if (!flightId || !passengers || !contactInfo || !paymentInfo) {
      throw new FlightServiceError('Missing required booking information', 400);
    }

    if (!Array.isArray(passengers) || passengers.length === 0) {
      throw new FlightServiceError('At least one passenger is required', 400);
    }

    for (const passenger of passengers) {
      if (!passenger.firstName || !passenger.lastName || !passenger.dateOfBirth) {
        throw new FlightServiceError('Incomplete passenger information', 400);
      }
    }

    const bookingPayload = {
      flight_id: flightId,
      passengers: passengers.map(passenger => ({
        title: passenger.title,
        first_name: passenger.firstName,
        last_name: passenger.lastName,
        date_of_birth: passenger.dateOfBirth,
        gender: passenger.gender,
        passport_number: passenger.passportNumber,
        passport_expiry: passenger.passportExpiry,
        nationality: passenger.nationality,
        frequent_flyer_number: passenger.frequentFlyerNumber
      })),
      contact: {
        email: contactInfo.email,
        phone: contactInfo.phone,
        address: contactInfo.address
      },
      payment: {
        method: paymentInfo.method,
        token: paymentInfo.token,
        billing_address: paymentInfo.billingAddress
      },
      seat_preferences: seatPreferences,
      special_requests: specialRequests,
      booking_source: 'web_app'
    };

    const response = await apiClient.post('/bookings', bookingPayload);
    const booking = response.data;

    const bookingResult = {
      bookingReference: booking.booking_reference,
      pnr: booking.pnr,
      status: booking.status,
      flightDetails: booking.flight_details,
      passengers: booking.passengers,
      totalAmount: booking.total_amount,
      bookingDate: booking.booking_date,
      paymentStatus: booking.payment_status,
      eTickets: booking.e_tickets || [],
      cancellationDeadline: booking.cancellation_deadline,
      changeDeadline: booking.change_deadline
    };

    // Clear relevant cache entries
    cache.del(`flight_${flightId}`);
    
    return bookingResult;

  } catch (error) {
    if (error instanceof FlightServiceError) {
      throw error;
    }
    throw new FlightServiceError('Flight booking failed', 500, error.message);
  }
};

const cancelBooking = async (bookingReference, reason = null) => {
  try {
    if (!bookingReference) {
      throw new FlightServiceError('Booking reference is required', 400);
    }

    const cancelPayload = {
      booking_reference: bookingReference,
      cancellation_reason: reason,
      requested_by: 'passenger'
    };

    const response = await apiClient.post(`/bookings/${bookingReference}/cancel`, cancelPayload);
    const cancellation = response.data;

    return {
      bookingReference: cancellation.booking_reference,
      status: cancellation.status,
      cancellationDate: cancellation.cancellation_date,
      refundAmount: cancellation.refund_amount,
      refundMethod: cancellation.refund_method,
      refundTimeline: cancellation.refund_timeline,
      cancellationFee: cancellation.cancellation_fee,
      refundReference: cancellation.refund_reference
    };

  } catch (error) {
    if (error instanceof FlightServiceError) {
      throw error;
    }
    throw new FlightServiceError('Booking cancellation failed', 500, error.message);
  }
};

module.exports = {
  searchFlights,
  getFlightDetails,
  bookFlight,
  cancelBooking
};