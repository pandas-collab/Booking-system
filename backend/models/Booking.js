const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  bookingReference: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  packageId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Packages',
      key: 'id'
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isAfter: {
        args: new Date().toISOString().split('T')[0],
        msg: 'Start date must be in the future'
      }
    }
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isAfterStartDate(value) {
        if (value <= this.startDate) {
          throw new Error('End date must be after start date');
        }
      }
    }
  },
  numberOfPassengers: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 50
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'],
    defaultValue: 'pending',
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM,
    values: ['pending', 'paid', 'failed', 'refunded', 'partial'],
    defaultValue: 'pending',
    allowNull: false
  },
  paymentReference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  primaryContact: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidContact(value) {
        if (!value.firstName || !value.lastName || !value.email || !value.phone) {
          throw new Error('Primary contact must include firstName, lastName, email, and phone');
        }
      }
    }
  },
  passengerDetails: {
    type: DataTypes.JSON,
    allowNull: false,
    validate: {
      isValidPassengers(value) {
        if (!Array.isArray(value) || value.length !== this.numberOfPassengers) {
          throw new Error('Passenger details count must match numberOfPassengers');
        }
        value.forEach((passenger, index) => {
          if (!passenger.firstName || !passenger.lastName || !passenger.dateOfBirth) {
            throw new Error(`Passenger ${index + 1} must include firstName, lastName, and dateOfBirth`);
          }
        });
      }
    }
  },
  specialRequests: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cancellationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  confirmationDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'bookings',
  timestamps: true,
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['packageId']
    },
    {
      fields: ['status']
    },
    {
      fields: ['paymentStatus']
    },
    {
      fields: ['startDate']
    },
    {
      fields: ['bookingReference'],
      unique: true
    }
  ],
  hooks: {
    beforeCreate: (booking) => {
      if (!booking.bookingReference) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        booking.bookingReference = `BK-${timestamp}-${random}`.toUpperCase();
      }
    },
    beforeUpdate: (booking) => {
      if (booking.changed('status')) {
        if (booking.status === 'confirmed' && !booking.confirmationDate) {
          booking.confirmationDate = new Date();
        }
        if (booking.status === 'cancelled' && !booking.cancellationDate) {
          booking.cancellationDate = new Date();
        }
      }
    }
  }
});

module.exports = { Booking };