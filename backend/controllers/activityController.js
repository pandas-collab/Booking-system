const Activity = require('../models/Activity');
const Destination = require('../models/Destination');

const getAllActivities = async (req, res) => {
  try {
    const { category, destination, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    if (destination) {
      filter.destinationId = destination;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const activities = await Activity.find(filter)
      .populate('destinationId', 'name location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Activity.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        activities,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          hasNext: skip + activities.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activities',
      error: error.message
    });
  }
};

const getActivity = async (req, res) => {
  try {
    const { id } = req.params;
    
    const activity = await Activity.findById(id)
      .populate('destinationId', 'name location description');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activity',
      error: error.message
    });
  }
};

const createActivity = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      destinationId,
      duration,
      price,
      difficulty,
      images,
      requirements,
      included,
      excluded,
      itinerary,
      availableDates,
      maxGroupSize
    } = req.body;

    if (!name || !description || !category || !destinationId) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, category, and destination are required'
      });
    }

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(400).json({
        success: false,
        message: 'Invalid destination ID'
      });
    }

    const activity = new Activity({
      name,
      description,
      category,
      destinationId,
      duration,
      price,
      difficulty,
      images: images || [],
      requirements: requirements || [],
      included: included || [],
      excluded: excluded || [],
      itinerary: itinerary || [],
      availableDates: availableDates || [],
      maxGroupSize
    });

    const savedActivity = await activity.save();
    await savedActivity.populate('destinationId', 'name location');

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: savedActivity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating activity',
      error: error.message
    });
  }
};

const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.destinationId) {
      const destination = await Destination.findById(updateData.destinationId);
      if (!destination) {
        return res.status(400).json({
          success: false,
          message: 'Invalid destination ID'
        });
      }
    }

    const activity = await Activity.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('destinationId', 'name location');

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating activity',
      error: error.message
    });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByIdAndDelete(id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting activity',
      error: error.message
    });
  }
};

const getActivitiesByDestination = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const { category, page = 1, limit = 10 } = req.query;

    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    const filter = { destinationId };
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const activities = await Activity.find(filter)
      .populate('destinationId', 'name location')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Activity.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        destination,
        activities,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          hasNext: skip + activities.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activities by destination',
      error: error.message
    });
  }
};

module.exports = {
  getAllActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivitiesByDestination
};