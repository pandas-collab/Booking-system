const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging || false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Destination = require('./destination')(sequelize, Sequelize.DataTypes);
const Package = require('./package')(sequelize, Sequelize.DataTypes);
const Activity = require('./activity')(sequelize, Sequelize.DataTypes);
const Booking = require('./booking')(sequelize, Sequelize.DataTypes);
const Payment = require('./payment')(sequelize, Sequelize.DataTypes);
const Review = require('./review')(sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Destination.hasMany(Package, { foreignKey: 'destinationId', as: 'packages' });
Package.belongsTo(Destination, { foreignKey: 'destinationId', as: 'destination' });

Destination.hasMany(Activity, { foreignKey: 'destinationId', as: 'activities' });
Activity.belongsTo(Destination, { foreignKey: 'destinationId', as: 'destination' });

Destination.hasMany(Review, { foreignKey: 'destinationId', as: 'reviews' });
Review.belongsTo(Destination, { foreignKey: 'destinationId', as: 'destination' });

Package.hasMany(Booking, { foreignKey: 'packageId', as: 'bookings' });
Booking.belongsTo(Package, { foreignKey: 'packageId', as: 'package' });

Package.hasMany(Review, { foreignKey: 'packageId', as: 'reviews' });
Review.belongsTo(Package, { foreignKey: 'packageId', as: 'package' });

Package.belongsToMany(Activity, { 
  through: 'PackageActivities', 
  foreignKey: 'packageId', 
  otherKey: 'activityId',
  as: 'activities' 
});
Activity.belongsToMany(Package, { 
  through: 'PackageActivities', 
  foreignKey: 'activityId', 
  otherKey: 'packageId',
  as: 'packages' 
});

Booking.hasOne(Payment, { foreignKey: 'bookingId', as: 'payment' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

Activity.hasMany(Review, { foreignKey: 'activityId', as: 'reviews' });
Review.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity' });

module.exports = {
  sequelize,
  User,
  Destination,
  Package,
  Activity,
  Booking,
  Payment,
  Review
};