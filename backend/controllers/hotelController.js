const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// Search hotels with location-based filtering
const searchHotels = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const {
      location,
      checkIn,
      checkOut,
      guests,
      minPrice,
      maxPrice,
      amenities,
      rating,
      latitude,
      longitude,
      radius = 10
    } = req.query;

    let query = {};
    let sortOptions = {};

    // Location-based filtering
    if (latitude && longitude) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    } else if (location) {
      query.$or = [
        { 'address.city': { $regex: location, $options: 'i' } },
        { 'address.state': { $regex: location, $options: 'i' } },
        { 'address.country': { $regex: location, $options: 'i' } },
        { name: { $regex: location, $options: 'i' } }
      ];
    }

    // Price filtering
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerNight.$lte = parseFloat(maxPrice);
    }

    // Rating filtering
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Amenities filtering
    if (amenities) {
      const amenitiesList = Array.isArray(amenities) ? amenities : amenities.split(',');
      query.amenities = { $in: amenitiesList };
    }

    // Capacity filtering
    if (guests) {
      query.maxGuests = { $gte: parseInt(guests) };
    }

    // Availability filtering
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      const unavailableHotels = await Booking.distinct('hotelId', {
        $or: [
          {
            checkIn: { $lt: checkOutDate },
            checkOut: { $gt: checkInDate }
          }
        ],
        status: { $in: ['confirmed', 'checked-in'] }
      });

      query._id = { $nin: unavailableHotels };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    sortOptions[sortBy] = sortOrder;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('reviews', 'rating comment user createdAt')
      .lean();

    const total = await Hotel.countDocuments(query);

    // Calculate distance if coordinates provided
    if (latitude && longitude) {
      hotels.forEach(hotel => {
        if (hotel.location && hotel.location.coordinates) {
          const [hotelLng, hotelLat] = hotel.location.coordinates;
          hotel.distance = calculateDistance(
            parseFloat(latitude),
            parseFloat(longitude),
            hotelLat,
            hotelLng
          );
        }
      });
    }

    res.json({
      success: true,
      data: {
        hotels,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Hotel search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching hotels',
      error: error.message
    });
  }
};

// Get single hotel details
const getHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findById(id)
      .populate('reviews', 'rating comment user createdAt')
      .populate('reviews.user', 'name avatar')
      .lean();

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Calculate average rating
    if (hotel.reviews && hotel.reviews.length > 0) {
      const avgRating = hotel.reviews.reduce((acc, review) => acc + review.rating, 0) / hotel.reviews.length;
      hotel.averageRating = Math.round(avgRating * 10) / 10;
    }

    res.json({
      success: true,
      data: hotel
    });

  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotel details',
      error: error.message
    });
  }
};

// Check hotel availability
const checkAvailability = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { hotelId } = req.params;
    const { checkIn, checkOut, guests } = req.query;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Check if hotel has capacity
    if (guests && parseInt(guests) > hotel.maxGuests) {
      return res.json({
        success: true,
        data: {
          available: false,
          reason: 'Exceeds maximum guest capacity',
          maxGuests: hotel.maxGuests
        }
      });
    }

    // Check for conflicting bookings
    const conflictingBookings = await Booking.find({
      hotelId: hotelId,
      status: { $in: ['confirmed', 'checked-in'] },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ]
    });

    const available = conflictingBookings.length === 0;
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * hotel.pricePerNight;

    res.json({
      success: true,
      data: {
        available,
        hotelId: hotel._id,
        hotelName: hotel.name,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        pricePerNight: hotel.pricePerNight,
        totalPrice: available ? totalPrice : null,
        conflictingDates: !available ? conflictingBookings.map(booking => ({
          checkIn: booking.checkIn,
          checkOut: booking.checkOut
        })) : null
      }
    });

  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message
    });
  }
};

// Book hotel
const bookHotel = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { hotelId } = req.params;
    const {
      checkIn,
      checkOut,
      guests,
      guestDetails,
      specialRequests,
      paymentMethod
    } = req.body;

    const userId = req.user.id; // Assuming authentication middleware sets req.user

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    if (checkInDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past'
      });
    }

    // Check availability again
    const conflictingBookings = await Booking.find({
      hotelId: hotelId,
      status: { $in: ['confirmed', 'checked-in'] },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ]
    });

    if (conflictingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Hotel is not available for selected dates'
      });
    }

    // Check guest capacity
    if (guests > hotel.maxGuests) {
      return res.status(400).json({
        success: false,
        message: `Hotel can accommodate maximum ${hotel.maxGuests} guests`
      });
    }

    // Calculate booking details
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const subtotal = nights * hotel.pricePerNight;
    const taxes = subtotal * 0.12; // 12% tax
    const serviceFee = subtotal * 0.05; // 5% service fee
    const totalAmount = subtotal + taxes + serviceFee;

    // Create booking
    const booking = new Booking({
      userId,
      hotelId,
      hotelName: hotel.name,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      guestDetails,
      specialRequests,
      nights,
      pricePerNight: hotel.pricePerNight,
      subtotal,
      taxes,
      serviceFee,
      totalAmount,
      paymentMethod,
      status: 'confirmed',
      bookingReference: generateBookingReference(),
      createdAt: new Date()
    });

    await booking.save();

    // Update hotel booking count
    await Hotel.findByIdAndUpdate(hotelId, {
      $inc: { totalBookings: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Hotel booked successfully',
      data: {
        bookingId: booking._id,
        bookingReference: booking.bookingReference,
        hotel: {
          id: hotel._id,
          name: hotel.name,
          address: hotel.address
        },
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        nights,
        totalAmount,
        status: booking.status
      }
    });

  } catch (error) {
    console.error('Book hotel error:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking hotel',
      error: error.message
    });
  }
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

// Helper function to generate booking reference
function generateBookingReference() {
  const prefix = 'HTL';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

module.exports = {
  searchHotels,
  getHotel,
  checkAvailability,
  bookHotel
};