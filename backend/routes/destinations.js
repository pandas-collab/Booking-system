const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Destination = require('../models/Destination');
const { body, validationResult } = require('express-validator');

// GET /api/destinations - Get all destinations
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { city: { $regex: req.query.search, $options: 'i' } },
        { country: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    const destinations = await Destination.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'username email');

    const total = await Destination.countDocuments(query);

    res.json({
      destinations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/destinations/:id - Get single destination
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('reviews.user', 'username');

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/destinations - Create new destination
router.post('/', [
  auth,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('country').trim().notEmpty().withMessage('Country is required'),
    body('category').isIn(['beach', 'mountain', 'city', 'historical', 'adventure', 'cultural']).withMessage('Invalid category'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      city,
      country,
      category,
      latitude,
      longitude,
      images,
      amenities,
      bestTimeToVisit,
      averageCost
    } = req.body;

    const destination = new Destination({
      name,
      description,
      city,
      country,
      category,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      images: images || [],
      amenities: amenities || [],
      bestTimeToVisit,
      averageCost,
      createdBy: req.user.id
    });

    await destination.save();
    await destination.populate('createdBy', 'username email');

    res.status(201).json(destination);
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/destinations/:id - Update destination
router.put('/:id', [
  auth,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
    body('country').optional().trim().notEmpty().withMessage('Country cannot be empty'),
    body('category').optional().isIn(['beach', 'mountain', 'city', 'historical', 'adventure', 'cultural']).withMessage('Invalid category'),
    body('latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    if (destination.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this destination' });
    }

    const updateData = { ...req.body };
    
    if (req.body.latitude && req.body.longitude) {
      updateData.location = {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
      };
      delete updateData.latitude;
      delete updateData.longitude;
    }

    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username email');

    res.json(updatedDestination);
  } catch (error) {
    console.error('Error updating destination:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/destinations/:id - Delete destination
router.delete('/:id', auth, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    if (destination.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this destination' });
    }

    await Destination.findByIdAndDelete(req.params.id);

    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/destinations/:id/reviews - Add review to destination
router.post('/:id/reviews', [
  auth,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required')
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    const existingReview = destination.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this destination' });
    }

    const review = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment
    };

    destination.reviews.push(review);

    const totalRating = destination.reviews.reduce((acc, item) => item.rating + acc, 0);
    destination.averageRating = totalRating / destination.reviews.length;

    await destination.save();
    await destination.populate('reviews.user', 'username');

    res.status(201).json(destination.reviews[destination.reviews.length - 1]);
  } catch (error) {
    console.error('Error adding review:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/destinations/nearby/:latitude/:longitude - Get nearby destinations
router.get('/nearby/:latitude/:longitude', async (req, res) => {
  try {
    const { latitude, longitude } = req.params;
    const radius = parseInt(req.query.radius) || 10000; // Default 10km in meters

    const destinations = await Destination.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius
        }
      }
    }).populate('createdBy', 'username email');

    res.json(destinations);
  } catch (error) {
    console.error('Error fetching nearby destinations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;