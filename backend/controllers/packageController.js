const Package = require('../models/Package');
const Destination = require('../models/Destination');
const Activity = require('../models/Activity');

// Get all packages with populated relationships
const getAllPackages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const packages = await Package.find({ isActive: true })
      .populate({
        path: 'destinations',
        select: 'name description location images',
        populate: {
          path: 'activities',
          select: 'name type duration difficulty price'
        }
      })
      .populate('activities', 'name type duration difficulty price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Package.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: packages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching packages',
      error: error.message
    });
  }
};

// Get single package by ID
const getPackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    const package = await Package.findById(packageId)
      .populate({
        path: 'destinations',
        select: 'name description location images weather',
        populate: {
          path: 'activities',
          select: 'name type duration difficulty price description requirements'
        }
      })
      .populate('activities', 'name type duration difficulty price description requirements')
      .populate('reviews.user', 'name email avatar');

    if (!package || !package.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Increment view count
    package.viewCount += 1;
    await package.save();

    res.status(200).json({
      success: true,
      data: package
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching package',
      error: error.message
    });
  }
};

// Create new package
const createPackage = async (req, res) => {
  try {
    const {
      name,
      description,
      destinations,
      activities,
      duration,
      price,
      maxGroupSize,
      difficulty,
      category,
      inclusions,
      exclusions,
      itinerary,
      images,
      tags
    } = req.body;

    // Validate destinations exist
    if (destinations && destinations.length > 0) {
      const destinationCount = await Destination.countDocuments({
        _id: { $in: destinations },
        isActive: true
      });
      if (destinationCount !== destinations.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more destinations not found'
        });
      }
    }

    // Validate activities exist
    if (activities && activities.length > 0) {
      const activityCount = await Activity.countDocuments({
        _id: { $in: activities },
        isActive: true
      });
      if (activityCount !== activities.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more activities not found'
        });
      }
    }

    const package = new Package({
      name,
      description,
      destinations: destinations || [],
      activities: activities || [],
      duration,
      price,
      maxGroupSize,
      difficulty,
      category,
      inclusions: inclusions || [],
      exclusions: exclusions || [],
      itinerary: itinerary || [],
      images: images || [],
      tags: tags || []
    });

    const savedPackage = await package.save();

    const populatedPackage = await Package.findById(savedPackage._id)
      .populate('destinations', 'name location')
      .populate('activities', 'name type duration');

    res.status(201).json({
      success: true,
      data: populatedPackage,
      message: 'Package created successfully'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating package',
      error: error.message
    });
  }
};

// Update package
const updatePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    const updateData = req.body;

    // Validate destinations if provided
    if (updateData.destinations && updateData.destinations.length > 0) {
      const destinationCount = await Destination.countDocuments({
        _id: { $in: updateData.destinations },
        isActive: true
      });
      if (destinationCount !== updateData.destinations.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more destinations not found'
        });
      }
    }

    // Validate activities if provided
    if (updateData.activities && updateData.activities.length > 0) {
      const activityCount = await Activity.countDocuments({
        _id: { $in: updateData.activities },
        isActive: true
      });
      if (activityCount !== updateData.activities.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more activities not found'
        });
      }
    }

    const package = await Package.findByIdAndUpdate(
      packageId,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate('destinations', 'name location')
      .populate('activities', 'name type duration');

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(200).json({
      success: true,
      data: package,
      message: 'Package updated successfully'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating package',
      error: error.message
    });
  }
};

// Delete package (soft delete)
const deletePackage = async (req, res) => {
  try {
    const packageId = req.params.id;

    const package = await Package.findByIdAndUpdate(
      packageId,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting package',
      error: error.message
    });
  }
};

// Search packages with filters
const searchPackages = async (req, res) => {
  try {
    const {
      q,
      destination,
      activity,
      category,
      difficulty,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    const query = { isActive: true };
    const sort = {};

    // Text search
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }

    // Filter by destination
    if (destination) {
      query.destinations = { $in: [destination] };
    }

    // Filter by activity
    if (activity) {
      query.activities = { $in: [activity] };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Duration range filter
    if (minDuration || maxDuration) {
      query.duration = {};
      if (minDuration) query.duration.$gte = parseInt(minDuration);
      if (maxDuration) query.duration.$lte = parseInt(maxDuration);
    }

    // Sorting
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const packages = await Package.find(query)
      .populate('destinations', 'name location images')
      .populate('activities', 'name type')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Package.countDocuments(query);

    res.status(200).json({
      success: true,
      data: packages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: {
        q,
        destination,
        activity,
        category,
        difficulty,
        priceRange: { min: minPrice, max: maxPrice },
        durationRange: { min: minDuration, max: maxDuration }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching packages',
      error: error.message
    });
  }
};

module.exports = {
  getAllPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage,
  searchPackages
};