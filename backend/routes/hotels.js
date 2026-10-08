const express = require('express');
const router = express.Router();

// Mock database - in production, use actual database
let hotels = [
  {
    id: 1,
    name: 'Grand Plaza Hotel',
    location: 'New York',
    rating: 4.5,
    pricePerNight: 250,
    amenities: ['WiFi', 'Pool', 'Gym', 'Spa'],
    images: ['hotel1.jpg'],
    description: 'Luxury hotel in downtown Manhattan',
    totalRooms: 100,
    availableRooms: 45
  },
  {
    id: 2,
    name: 'Seaside Resort',
    location: 'Miami',
    rating: 4.2,
    pricePerNight: 180,
    amenities: ['WiFi', 'Beach Access', 'Pool', 'Restaurant'],
    images: ['hotel2.jpg'],
    description: 'Beautiful beachfront resort',
    totalRooms: 80,
    availableRooms: 23
  }
];

let bookings = [];
let nextBookingId = 1;

// GET /api/hotels - Search hotels
router.get('/', (req, res) => {
  try {
    const { location, checkIn, checkOut, guests, minPrice, maxPrice, rating } = req.query;
    
    let filteredHotels = [...hotels];
    
    // Filter by location
    if (location) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Filter by price range
    if (minPrice) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.pricePerNight >= parseInt(minPrice)
      );
    }
    
    if (maxPrice) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.pricePerNight <= parseInt(maxPrice)
      );
    }
    
    // Filter by rating
    if (rating) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.rating >= parseFloat(rating)
      );
    }
    
    // Check availability for date range
    if (checkIn && checkOut) {
      filteredHotels = filteredHotels.map(hotel => {
        const bookedRooms = getBookedRoomsForDateRange(hotel.id, checkIn, checkOut);
        return {
          ...hotel,
          availableRooms: hotel.totalRooms - bookedRooms
        };
      }).filter(hotel => hotel.availableRooms > 0);
    }
    
    res.json({
      success: true,
      data: filteredHotels,
      total: filteredHotels.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching hotels',
      error: error.message
    });
  }
});

// GET /api/hotels/:id - Get hotel details
router.get('/:id', (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const hotel = hotels.find(h => h.id === hotelId);
    
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }
    
    res.json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hotel details',
      error: error.message
    });
  }
});

// GET /api/hotels/:id/availability - Check availability
router.get('/:id/availability', (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const { checkIn, checkOut } = req.query;
    
    if (!checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Check-in and check-out dates are required'
      });
    }
    
    const hotel = hotels.find(h => h.id === hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }
    
    const bookedRooms = getBookedRoomsForDateRange(hotelId, checkIn, checkOut);
    const availableRooms = hotel.totalRooms - bookedRooms;
    
    res.json({
      success: true,
      data: {
        hotelId,
        checkIn,
        checkOut,
        totalRooms: hotel.totalRooms,
        bookedRooms,
        availableRooms,
        isAvailable: availableRooms > 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message
    });
  }
});

// POST /api/hotels/:id/book - Book a hotel
router.post('/:id/book', (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const { checkIn, checkOut, guests, guestInfo, rooms = 1 } = req.body;
    
    // Validation
    if (!checkIn || !checkOut || !guests || !guestInfo) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking information'
      });
    }
    
    if (!guestInfo.firstName || !guestInfo.lastName || !guestInfo.email) {
      return res.status(400).json({
        success: false,
        message: 'Guest information is incomplete'
      });
    }
    
    const hotel = hotels.find(h => h.id === hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }
    
    // Check availability
    const bookedRooms = getBookedRoomsForDateRange(hotelId, checkIn, checkOut);
    const availableRooms = hotel.totalRooms - bookedRooms;
    
    if (availableRooms < rooms) {
      return res.status(400).json({
        success: false,
        message: 'Not enough rooms available for selected dates'
      });
    }
    
    // Calculate total price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * hotel.pricePerNight * rooms;
    
    // Create booking
    const booking = {
      id: nextBookingId++,
      hotelId,
      hotelName: hotel.name,
      checkIn,
      checkOut,
      nights,
      guests,
      rooms,
      guestInfo,
      totalPrice,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      confirmationCode: generateConfirmationCode()
    };
    
    bookings.push(booking);
    
    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing booking',
      error: error.message
    });
  }
});

// GET /api/hotels/bookings/:confirmationCode - Get booking details
router.get('/bookings/:confirmationCode', (req, res) => {
  try {
    const confirmationCode = req.params.confirmationCode;
    const booking = bookings.find(b => b.confirmationCode === confirmationCode);
    
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
    res.status(500).json({
      success: false,
      message: 'Error fetching booking details',
      error: error.message
    });
  }
});

// DELETE /api/hotels/bookings/:confirmationCode - Cancel booking
router.delete('/bookings/:confirmationCode', (req, res) => {
  try {
    const confirmationCode = req.params.confirmationCode;
    const bookingIndex = bookings.findIndex(b => b.confirmationCode === confirmationCode);
    
    if (bookingIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const booking = bookings[bookingIndex];
    const checkInDate = new Date(booking.checkIn);
    const now = new Date();
    const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);
    
    // Check if cancellation is allowed (24 hours before check-in)
    if (hoursUntilCheckIn < 24) {
      return res.status(400).json({
        success: false,
        message: 'Cancellation not allowed within 24 hours of check-in'
      });
    }
    
    booking.status = 'cancelled';
    booking.cancellationDate = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
});

// Helper function to get booked rooms for a date range
function getBookedRoomsForDateRange(hotelId, checkIn, checkOut) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  return bookings
    .filter(booking => {
      if (booking.hotelId !== hotelId || booking.status === 'cancelled') {
        return false;
      }
      
      const bookingCheckIn = new Date(booking.checkIn);
      const bookingCheckOut = new Date(booking.checkOut);
      
      // Check for date overlap
      return checkInDate < bookingCheckOut && checkOutDate > bookingCheckIn;
    })
    .reduce((total, booking) => total + booking.rooms, 0);
}

// Helper function to generate confirmation code
function generateConfirmationCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

module.exports = router;