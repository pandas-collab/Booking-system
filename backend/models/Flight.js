const mongoose = require('mongoose');

const FlightSchema = new mongoose.Schema({
  flightNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  airline: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      trim: true
    },
    logo: {
      type: String,
      trim: true
    }
  },
  route: {
    origin: {
      airport: {
        type: String,
        required: true,
        trim: true
      },
      city: {
        type: String,
        required: true,
        trim: true
      },
      country: {
        type: String,
        required: true,
        trim: true
      },
      code: {
        type: String,
        required: true,
        trim: true
      }
    },
    destination: {
      airport: {
        type: String,
        required: true,
        trim: true
      },
      city: {
        type: String,
        required: true,
        trim: true
      },
      country: {
        type: String,
        required: true,
        trim: true
      },
      code: {
        type: String,
        required: true,
        trim: true
      }
    }
  },
  schedule: {
    departure: {
      date: {
        type: Date,
        required: true
      },
      time: {
        type: String,
        required: true
      },
      timezone: {
        type: String,
        required: true
      }
    },
    arrival: {
      date: {
        type: Date,
        required: true
      },
      time: {
        type: String,
        required: true
      },
      timezone: {
        type: String,
        required: true
      }
    },
    duration: {
      hours: {
        type: Number,
        required: true
      },
      minutes: {
        type: Number,
        required: true
      }
    }
  },
  aircraft: {
    model: {
      type: String,
      required: true,
      trim: true
    },
    capacity: {
      type: Number,
      required: true
    }
  },
  pricing: {
    economy: {
      price: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        required: true,
        default: 'USD'
      },
      availableSeats: {
        type: Number,
        required: true
      }
    },
    business: {
      price: {
        type: Number
      },
      currency: {
        type: String,
        default: 'USD'
      },
      availableSeats: {
        type: Number,
        default: 0
      }
    },
    firstClass: {
      price: {
        type: Number
      },
      currency: {
        type: String,
        default: 'USD'
      },
      availableSeats: {
        type: Number,
        default: 0
      }
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'delayed', 'cancelled', 'departed', 'arrived', 'boarding'],
    default: 'scheduled'
  },
  amenities: [{
    type: String,
    trim: true
  }],
  baggage: {
    carryOn: {
      included: {
        type: Boolean,
        default: true
      },
      weight: {
        type: Number
      },
      dimensions: {
        type: String
      }
    },
    checked: {
      included: {
        type: Boolean,
        default: false
      },
      weight: {
        type: Number
      },
      price: {
        type: Number
      }
    }
  },
  stops: [{
    airport: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true
    },
    code: {
      type: String,
      trim: true
    },
    duration: {
      hours: {
        type: Number
      },
      minutes: {
        type: Number
      }
    }
  }],
  gate: {
    type: String,
    trim: true
  },
  terminal: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

FlightSchema.index({ 'route.origin.code': 1, 'route.destination.code': 1, 'schedule.departure.date': 1 });
FlightSchema.index({ flightNumber: 1 });
FlightSchema.index({ 'airline.code': 1 });
FlightSchema.index({ status: 1 });
FlightSchema.index({ 'schedule.departure.date': 1 });

FlightSchema.methods.getTotalDurationMinutes = function() {
  return (this.schedule.duration.hours * 60) + this.schedule.duration.minutes;
};

FlightSchema.methods.getAvailableSeats = function() {
  return this.pricing.economy.availableSeats + 
         this.pricing.business.availableSeats + 
         this.pricing.firstClass.availableSeats;
};

FlightSchema.methods.getLowestPrice = function() {
  const prices = [this.pricing.economy.price];
  if (this.pricing.business.price) prices.push(this.pricing.business.price);
  if (this.pricing.firstClass.price) prices.push(this.pricing.firstClass.price);
  return Math.min(...prices);
};

FlightSchema.methods.isDirectFlight = function() {
  return this.stops.length === 0;
};

module.exports = mongoose.model('Flight', FlightSchema);