const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  description: {
    type: String,
    required: true,
    maxLength: 2000
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  },
  starRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  amenities: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ['general', 'business', 'recreation', 'dining', 'wellness', 'transportation'],
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    additionalCost: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  roomTypes: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    capacity: {
      adults: {
        type: Number,
        required: true,
        min: 1
      },
      children: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    bedConfiguration: [{
      type: {
        type: String,
        enum: ['single', 'double', 'queen', 'king', 'sofa_bed'],
        required: true
      },
      count: {
        type: Number,
        required: true,
        min: 1
      }
    }],
    size: {
      type: Number,
      required: true,
      min: 1
    },
    sizeUnit: {
      type: String,
      enum: ['sqft', 'sqm'],
      default: 'sqft'
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    amenities: [String],
    images: [String],
    totalRooms: {
      type: Number,
      required: true,
      min: 1
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ['exterior', 'lobby', 'room', 'amenity', 'dining', 'other'],
      default: 'other'
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  contactInfo: {
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  policies: {
    checkIn: {
      type: String,
      required: true,
      default: '15:00'
    },
    checkOut: {
      type: String,
      required: true,
      default: '11:00'
    },
    cancellation: {
      type: String,
      required: true
    },
    petPolicy: {
      allowed: {
        type: Boolean,
        default: false
      },
      fee: {
        type: Number,
        default: 0,
        min: 0
      },
      restrictions: String
    },
    smokingPolicy: {
      type: String,
      enum: ['non_smoking', 'smoking_rooms_available', 'smoking_allowed'],
      default: 'non_smoking'
    }
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

hotelSchema.index({ location: '2dsphere' });
hotelSchema.index({ 'address.city': 1 });
hotelSchema.index({ 'address.country': 1 });
hotelSchema.index({ starRating: 1 });
hotelSchema.index({ 'ratings.average': -1 });
hotelSchema.index({ isActive: 1 });

hotelSchema.methods.getAverageRoomPrice = function() {
  if (this.roomTypes.length === 0) return 0;
  const total = this.roomTypes.reduce((sum, room) => sum + room.basePrice, 0);
  return total / this.roomTypes.length;
};

hotelSchema.methods.getTotalRoomCount = function() {
  return this.roomTypes.reduce((sum, room) => sum + room.totalRooms, 0);
};

hotelSchema.methods.getAmenitiesByCategory = function(category) {
  return this.amenities.filter(amenity => amenity.category === category && amenity.isAvailable);
};

hotelSchema.methods.getRoomTypeById = function(roomTypeId) {
  return this.roomTypes.id(roomTypeId);
};

hotelSchema.statics.findByLocation = function(coordinates, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    },
    isActive: true
  });
};

hotelSchema.statics.findByCity = function(city) {
  return this.find({
    'address.city': new RegExp(city, 'i'),
    isActive: true
  });
};

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;