const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Destination = sequelize.define('Destination', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 5000]
    }
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  coordinates: {
    type: DataTypes.JSON,
    allowNull: true,
    validate: {
      isValidCoordinates(value) {
        if (value && (!value.latitude || !value.longitude)) {
          throw new Error('Coordinates must include both latitude and longitude');
        }
        if (value && (Math.abs(value.latitude) > 90 || Math.abs(value.longitude) > 180)) {
          throw new Error('Invalid coordinate values');
        }
      }
    }
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
    validate: {
      isArray(value) {
        if (value && !Array.isArray(value)) {
          throw new Error('Images must be an array');
        }
      }
    }
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    validate: {
      min: 0,
      max: 5
    }
  },
  timezone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('beach', 'mountain', 'city', 'historical', 'nature', 'adventure', 'cultural', 'other'),
    allowNull: true,
    defaultValue: 'other'
  },
  bestTimeToVisit: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  estimatedCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'destinations',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      fields: ['country']
    },
    {
      fields: ['city']
    },
    {
      fields: ['category']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['name'],
      name: 'destination_name_index'
    }
  ],
  hooks: {
    beforeValidate: (destination) => {
      if (destination.name) {
        destination.name = destination.name.trim();
      }
      if (destination.country) {
        destination.country = destination.country.trim();
      }
      if (destination.city) {
        destination.city = destination.city.trim();
      }
    }
  }
});

Destination.prototype.getFullLocation = function() {
  return `${this.city}, ${this.country}`;
};

Destination.prototype.getMainImage = function() {
  return this.images && this.images.length > 0 ? this.images[0] : null;
};

module.exports = Destination;