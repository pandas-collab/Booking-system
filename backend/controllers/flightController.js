const axios = require('axios');
const Flight = require('../models/Flight');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// External API configuration
const FLIGHT_API_BASE_URL = process.env.FLIGHT_API_BASE_URL || 'https://api.flightservice.com/v1';
const API_KEY = process.env.FLIGHT_API_KEY;

const searchFlights = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      origin,
      destination,
      departureDate,
      returnDate,
      passengers = 1,
      class: travelClass = 'economy'
    } = req.query;

    const searchParams = {
      origin,
      destination,
      departure_date: departureDate,
      return_date: returnDate,
      passengers,
      class: travelClass
    };

    const response = await axios.get(`${FLIGHT_API_BASE_URL}/search`, {
      params: searchParams,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    const flights = response.data.flights || [];
    
    // Cache popular routes in database
    if (flights.length > 0) {
      try {
        await Flight.updateMany(
          { flightNumber: { $in: flights.map(f => f.flight_number) } },
          { $set: { lastSearched: new Date() } },
          { upsert: false }
        );
      } catch (cacheError) {
        console.error('Flight cache update failed:', cacheError);
      }
    }

    res.json({
      success: true,
      data: {
        flights: flights.map(flight => ({
          id: flight.id,
          flightNumber: flight.flight_number,
          airline: flight.airline,
          origin: flight.origin,
          destination: flight.destination,
          departureTime: flight.departure_time,
          arrivalTime: flight.arrival_time,
          duration: flight.duration,
          price: flight.price,
          currency: flight.currency,
          availableSeats: flight.available_seats,
          class: flight.class,
          aircraft: flight.aircraft
        })),
        searchParams,
        totalResults: flights.length
      }
    });

  } catch (error) {
    console.error('Flight search error:', error);
    
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        message: 'Flight search service timeout'
      });
    }

    if (error.response && error.response.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Flight search failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const getFlight = async (req, res) => {
  try {
    const { flightId } = req.params;

    if (!flightId) {
      return res.status(400).json({
        success: false,
        message: 'Flight ID is required'
      });
    }

    // Try to get from database first
    let flight = await Flight.findOne({ externalId: flightId });

    if (!flight) {
      // Fetch from external API
      const response = await axios.get(`${FLIGHT_API_BASE_URL}/flights/${flightId}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 8000
      });

      const flightData = response.data;
      
      // Save to database for caching
      flight = new Flight({
        externalId: flightData.id,
        flightNumber: flightData.flight_number,
        airline: flightData.airline,
        origin: flightData.origin,
        destination: flightData.destination,
        departureTime: new Date(flightData.departure_time),
        arrivalTime: new Date(flightData.arrival_time),
        duration: flightData.duration,
        price: flightData.price,
        currency: flightData.currency,
        availableSeats: flightData.available_seats,
        class: flightData.class,
        aircraft: flightData.aircraft,
        status: flightData.status
      });

      await flight.save();
    }

    res.json({
      success: true,
      data: flight
    });

  } catch (error) {
    console.error('Get flight error:', error);

    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve flight information',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const bookFlight = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { flightId } = req.params;
    const {
      passengers,
      contactInfo,
      paymentInfo,
      seatPreferences = []
    } = req.body;

    const userId = req.user ? req.user.id : null;

    // Validate flight exists and has availability
    const flight = await Flight.findOne({ externalId: flightId });
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    if (flight.availableSeats < passengers.length) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient seats available'
      });
    }

    // Create booking with external API
    const bookingData = {
      flight_id: flightId,
      passengers,
      contact_info: contactInfo,
      payment_info: paymentInfo,
      seat_preferences: seatPreferences
    };

    const response = await axios.post(`${FLIGHT_API_BASE_URL}/bookings`, bookingData, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    const bookingResponse = response.data;

    // Save booking to database
    const booking = new Booking({
      externalBookingId: bookingResponse.booking_id,
      userId,
      flightId: flight._id,
      passengers,
      contactInfo,
      totalPrice: bookingResponse.total_price,
      currency: bookingResponse.currency,
      status: bookingResponse.status,
      confirmationCode: bookingResponse.confirmation_code,
      seatAssignments: bookingResponse.seat_assignments || [],
      bookingDate: new Date()
    });

    await booking.save();

    // Update flight availability
    await Flight.findByIdAndUpdate(flight._id, {
      $inc: { availableSeats: -passengers.length }
    });

    res.status(201).json({
      success: true,
      data: {
        bookingId: booking._id,
        confirmationCode: booking.confirmationCode,
        status: booking.status,
        totalPrice: booking.totalPrice,
        currency: booking.currency,
        seatAssignments: booking.seatAssignments
      }
    });

  } catch (error) {
    console.error('Flight booking error:', error);

    if (error.response && error.response.status === 402) {
      return res.status(402).json({
        success: false,
        message: 'Payment failed'
      });
    }

    if (error.response && error.response.status === 409) {
      return res.status(409).json({
        success: false,
        message: 'Flight no longer available'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Booking failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

const cancelFlight = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(bookingId).populate('flightId');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (req.user && booking.userId && booking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this booking'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Cancel with external API
    const cancelData = {
      booking_id: booking.externalBookingId,
      reason: reason || 'Customer request'
    };

    const response = await axios.post(
      `${FLIGHT_API_BASE_URL}/bookings/${booking.externalBookingId}/cancel`,
      cancelData,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const cancellationResponse = response.data;

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellationDate = new Date();
    booking.cancellationReason = reason;
    booking.refundAmount = cancellationResponse.refund_amount || 0;
    booking.refundStatus = cancellationResponse.refund_status || 'pending';

    await booking.save();

    // Restore flight availability
    await Flight.findByIdAndUpdate(booking.flightId._id, {
      $inc: { availableSeats: booking.passengers.length }
    });

    res.json({
      success: true,
      data: {
        bookingId: booking._id,
        status: booking.status,
        cancellationDate: booking.cancellationDate,
        refundAmount: booking.refundAmount,
        refundStatus: booking.refundStatus
      }
    });

  } catch (error) {
    console.error('Flight cancellation error:', error);

    if (error.response && error.response.status === 400) {
      return res.status(400).json({
        success: false,
        message: 'Cancellation not allowed for this booking'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Cancellation failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  searchFlights,
  getFlight,
  bookFlight,
  cancelFlight
};