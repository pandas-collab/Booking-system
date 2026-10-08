const destinationService = require('../services/destinationService');
const { validationResult } = require('express-validator');

// Get all destinations with optional filtering
const getAllDestinations = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      country,
      category,
      priceRange,
      rating
    } = req.query;

    const filters = {};
    if (country) filters.country = country;
    if (category) filters.category = category;
    if (priceRange) filters.priceRange = priceRange;
    if (rating) filters.rating = { $gte: parseFloat(rating) };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
    };

    const result = await destinationService.getAllDestinations(filters, options);

    res.status(200).json({
      success: true,
      data: result.destinations,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalDestinations: result.totalDestinations,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      }
    });
  } catch (error) {
    console.error('Error in getAllDestinations:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get single destination by ID
const getDestination = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid destination ID format'
      });
    }

    const destination = await destinationService.getDestinationById(id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      data: destination
    });
  } catch (error) {
    console.error('Error in getDestination:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Create new destination
const createDestination = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const destinationData = {
      name: req.body.name,
      description: req.body.description,
      country: req.body.country,
      city: req.body.city,
      category: req.body.category,
      priceRange: req.body.priceRange,
      coordinates: req.body.coordinates,
      images: req.body.images || [],
      highlights: req.body.highlights || [],
      bestTimeToVisit: req.body.bestTimeToVisit,
      averageStay: req.body.averageStay,
      rating: req.body.rating || 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      createdBy: req.user ? req.user.id : null
    };

    const destination = await destinationService.createDestination(destinationData);

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: destination
    });
  } catch (error) {
    console.error('Error in createDestination:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Destination with this name and location already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update destination
const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const errors = validationResult(req);

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid destination ID format'
      });
    }

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updateData = { ...req.body };
    updateData.updatedAt = new Date();
    if (req.user) updateData.updatedBy = req.user.id;

    const destination = await destinationService.updateDestination(id, updateData);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Destination updated successfully',
      data: destination
    });
  } catch (error) {
    console.error('Error in updateDestination:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Destination with this name and location already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Delete destination
const deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid destination ID format'
      });
    }

    const destination = await destinationService.deleteDestination(id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteDestination:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Search destinations
const searchDestinations = async (req, res) => {
  try {
    const {
      q: query,
      page = 1,
      limit = 10,
      category,
      country,
      priceRange,
      rating,
      sortBy = 'relevance'
    } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchOptions = {
      query: query.trim(),
      page: parseInt(page),
      limit: parseInt(limit),
      filters: {
        category,
        country,
        priceRange,
        rating: rating ? { $gte: parseFloat(rating) } : undefined
      },
      sortBy
    };

    const result = await destinationService.searchDestinations(searchOptions);

    res.status(200).json({
      success: true,
      data: result.destinations,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalResults: result.totalResults,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage
      },
      searchQuery: query
    });
  } catch (error) {
    console.error('Error in searchDestinations:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
  searchDestinations
};