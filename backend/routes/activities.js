const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const Destination = require('../models/Destination');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// GET /api/activities - Get all activities with optional destination filter
router.get('/', async (req, res) => {
  try {
    const { destination, category, page = 1, limit = 10 } = req.query;
    const query = {};
    
    if (destination) {
      query.destination = destination;
    }
    
    if (category) {
      query.category = category;
    }
    
    const skip = (page - 1) * limit;
    
    const activities = await Activity.find(query)
      .populate('destination', 'name city country')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Activity.countDocuments(query);
    
    res.json({
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/activities/:id - Get activity by ID
router.get('/:id', async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('destination', 'name city country description images');
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/activities - Create new activity
router.post('/', 
  auth,
  [
    body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('destination').isMongoId().withMessage('Valid destination ID is required'),
    body('category').trim().isLength({ min: 1 }).withMessage('Category is required'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('difficulty').isIn(['easy', 'moderate', 'hard']).withMessage('Difficulty must be easy, moderate, or hard')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { name, description, destination, category, duration, price, difficulty, images, inclusions, requirements } = req.body;
      
      // Verify destination exists
      const destinationExists = await Destination.findById(destination);
      if (!destinationExists) {
        return res.status(404).json({ error: 'Destination not found' });
      }
      
      const activity = new Activity({
        name,
        description,
        destination,
        category,
        duration,
        price,
        difficulty,
        images: images || [],
        inclusions: inclusions || [],
        requirements: requirements || [],
        createdBy: req.user.id
      });
      
      await activity.save();
      await activity.populate('destination', 'name city country');
      
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// PUT /api/activities/:id - Update activity
router.put('/:id',
  auth,
  [
    body('name').optional().trim().isLength({ min: 1 }).withMessage('Name cannot be empty'),
    body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    body('destination').optional().isMongoId().withMessage('Valid destination ID is required'),
    body('category').optional().trim().isLength({ min: 1 }).withMessage('Category cannot be empty'),
    body('duration').optional().isNumeric().withMessage('Duration must be a number'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('difficulty').optional().isIn(['easy', 'moderate', 'hard']).withMessage('Difficulty must be easy, moderate, or hard')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const activity = await Activity.findById(req.params.id);
      
      if (!activity) {
        return res.status(404).json({ error: 'Activity not found' });
      }
      
      // Check if user is authorized to update
      if (activity.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to update this activity' });
      }
      
      // If destination is being updated, verify it exists
      if (req.body.destination && req.body.destination !== activity.destination.toString()) {
        const destinationExists = await Destination.findById(req.body.destination);
        if (!destinationExists) {
          return res.status(404).json({ error: 'Destination not found' });
        }
      }
      
      const updatedActivity = await Activity.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      ).populate('destination', 'name city country');
      
      res.json(updatedActivity);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// DELETE /api/activities/:id - Delete activity
router.delete('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    // Check if user is authorized to delete
    if (activity.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this activity' });
    }
    
    await Activity.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/activities/destination/:destinationId - Get activities by destination
router.get('/destination/:destinationId', async (req, res) => {
  try {
    const { category, difficulty, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    const query = { destination: req.params.destinationId };
    
    if (category) {
      query.category = category;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    const skip = (page - 1) * limit;
    
    const activities = await Activity.find(query)
      .populate('destination', 'name city country')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ rating: -1, createdAt: -1 });
    
    const total = await Activity.countDocuments(query);
    
    res.json({
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/activities/categories - Get unique activity categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Activity.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;