const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Bookings',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['credit_card', 'debit_card', 'paypal', 'bank_transfer']]
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'completed', 'failed', 'refunded']]
    }
  },
  transactionId: {
    type: DataTypes.STRING,
    unique: true
  },
  processedAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'Payments',
  timestamps: true
});

module.exports = Payment;
