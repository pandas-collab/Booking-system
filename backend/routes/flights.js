const express = require('express');
const router = express.Router();
const axios = require('axios');
const { body, validationResult, query } = require('express-validator');

// Mock database - in production, use a real database
const bookings = [];
let bookingIdCounter = 1;

// Flight search endpoint
router.get('/search', [
  query('origin').notEmpty().withMessage('Origin is required'),
  query('destination').notEmpty().withMessage('Destination is required'),
  query('departureDate').isISO8601().withMessage('Valid departure date is required'),
  query('passengers').isInt({ min: 1, max: 9 }).withMessage('Passengers must be between 1 and 9'),
  query('returnDate').optional().isISO8601().withMessage('Valid return date required if provided')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { origin, destination, departureDate, returnDate, passengers, class: travelClass = 'economy' } = req.query;

    // Mock flight data - in production, integrate with real flight APIs
    const mockFlights = generateMockFlights(origin, destination, departureDate, passengers, travelClass);
    
    let returnFlights = [];
    if (returnDate) {
      returnFlights = generateMockFlights(destination, origin, returnDate, passengers, travelClass);
    }

    res.json({
      success: true,
      data: {
        outbound: mockFlights,
        return: returnFlights,
        searchParams: {
          origin,
          destination,
          departureDate,
          returnDate,
          passengers: parseInt(passengers),
          class: travelClass
        }
      }
    });
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching flights',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get flight details by ID
router.get('/:flightId', async (req, res) => {
  try {
    const { flightId } = req.params;
    
    // Mock flight details - in production, fetch from database/API
    const flightDetails = generateFlightDetails(flightId);
    
    if (!flightDetails) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    res.json({
      success: true,
      data: flightDetails
    });
  } catch (error) {
    console.error('Flight details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching flight details'
    });
  }
});

// Flight booking endpoint
router.post('/book', [
  body('flightId').notEmpty().withMessage('Flight ID is required'),
  body('returnFlightId').optional(),
  body('passengers').isArray({ min: 1 }).withMessage('At least one passenger is required'),
  body('passengers.*.firstName').notEmpty().withMessage('First name is required'),
  body('passengers.*.lastName').notEmpty().withMessage('Last name is required'),
  body('passengers.*.email').isEmail().withMessage('Valid email is required'),
  body('passengers.*.phone').notEmpty().withMessage('Phone number is required'),
  body('passengers.*.dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('contactInfo.email').isEmail().withMessage('Valid contact email is required'),
  body('contactInfo.phone').notEmpty().withMessage('Contact phone is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { flightId, returnFlightId, passengers, contactInfo, specialRequests } = req.body;

    // Validate flight availability
    const flight = generateFlightDetails(flightId);
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Flight not found'
      });
    }

    let returnFlight = null;
    if (returnFlightId) {
      returnFlight = generateFlightDetails(returnFlightId);
      if (!returnFlight) {
        return res.status(404).json({
          success: false,
          message: 'Return flight not found'
        });
      }
    }

    // Check seat availability
    if (passengers.length > flight.availableSeats) {
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available'
      });
    }

    // Create booking
    const booking = {
      id: bookingIdCounter++,
      bookingReference: generateBookingReference(),
      status: 'confirmed',
      flight: flight,
      returnFlight: returnFlight,
      passengers: passengers,
      contactInfo: contactInfo,
      specialRequests: specialRequests || [],
      totalPrice: calculateTotalPrice(flight, returnFlight, passengers),
      bookingDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    bookings.push(booking);

    // In production, integrate with payment processing
    // await processPayment(booking);

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Flight booked successfully'
    });
  } catch (error) {
    console.error('Flight booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing booking'
    });
  }
});

// Get booking by reference
router.get('/booking/:reference', async (req, res) => {
  try {
    const { reference } = req.params;
    
    const booking = bookings.find(b => b.bookingReference === reference);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Booking retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking'
    });
  }
});

// Cancel booking
router.post('/booking/:reference/cancel', async (req, res) => {
  try {
    const { reference } = req.params;
    
    const bookingIndex = bookings.findIndex(b => b.bookingReference === reference);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const booking = bookings[bookingIndex];
    
    // Check if cancellation is allowed
    const departureTime = new Date(booking.flight.departureTime);
    const now = new Date();
    const hoursDifference = (departureTime - now) / (1000 * 60 * 60);
    
    if (hoursDifference < 24) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking less than 24 hours before departure'
      });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date().toISOString();

    res.json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Booking cancellation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking'
    });
  }
});

// Get real-time flight status
router.get('/:flightId/status', async (req, res) => {
  try {
    const { flightId } = req.params;
    
    // Mock real-time status - in production, integrate with flight tracking APIs
    const status = {
      flightId,
      status: 'on-time', // on-time, delayed, cancelled, boarding, departed, arrived
      scheduledDeparture: '2023-12-01T14:30:00Z',
      estimatedDeparture: '2023-12-01T14:30:00Z',
      scheduledArrival: '2023-12-01T18:45:00Z',
      estimatedArrival: '2023-12-01T18:45:00Z',
      gate: 'A12',
      terminal: '1',
      aircraft: 'Boeing 737-800',
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Flight status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching flight status'
    });
  }
});

// Helper functions
function generateMockFlights(origin, destination, date, passengers, travelClass) {
  const airlines = ['American Airlines', 'Delta Air Lines', 'United Airlines', 'Southwest Airlines'];
  const flights = [];
  
  for (let i = 0; i < 5; i++) {
    const basePrice = Math.floor(Math.random() * 500) + 200;
    const multiplier = travelClass === 'business' ? 3 : travelClass === 'first' ? 5 : 1;
    
    flights.push({
      id: `FL${Date.now()}-${i}`,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      flightNumber: `${['AA', 'DL', 'UA', 'WN'][i % 4]}${Math.floor(Math.random() * 9000) + 1000}`,
      origin: origin,
      destination: destination,
      departureTime: new Date(date + 'T' + String(6 + i * 3).padStart(2, '0') + ':00:00Z').toISOString(),
      arrivalTime: new Date(date + 'T' + String(9 + i * 3).padStart(2, '0') + ':30:00Z').toISOString(),
      duration: '3h 30m',
      price: Math.floor(basePrice * multiplier),
      currency: 'USD',
      class: travelClass,
      availableSeats: Math.floor(Math.random() * 50) + 10,
      stops: Math.random() > 0.7 ? 1 : 0,
      aircraft: 'Boeing 737-800'
    });
  }
  
  return flights.sort((a, b) => a.price - b.price);
}

function generateFlightDetails(flightId) {
  // Mock flight details
  return {
    id: flightId,
    airline: 'American Airlines',
    flightNumber: 'AA1234',
    origin: 'JFK',
    destination: 'LAX',
    departureTime: '2023-12-01T14:30:00Z',
    arrivalTime: '2023-12-01T18:45:00Z',
    duration: '4h 15m',
    price: 299,
    currency: 'USD',
    class: 'economy',
    availableSeats: 45,
    stops: 0,
    aircraft: 'Boeing 737-800',
    amenities: ['WiFi', 'In-flight entertainment', 'Meals'],
    baggage: {
      carry: '1 carry-on bag',
      checked: '1 checked bag (50lbs)'
    }
  };
}

function generateBookingReference() {
  return 'BK' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

function calculateTotalPrice(flight, returnFlight, passengers) {
  let total = flight.price * passengers.length;
  if (returnFlight) {
    total += returnFlight.price * passengers.length;
  }
  return total;
}

module.exports = router;