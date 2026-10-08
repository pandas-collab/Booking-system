const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'travel_app.db');

// SQLite database configuration
const dbConfig = {
  filename: dbPath,
  driver: sqlite3.Database,
  options: {
    verbose: console.log
  }
};

// Create database connection
const createConnection = () => {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening SQLite database:', err.message);
    } else {
      console.log('Connected to SQLite database successfully');
    }
  });
};

// Initialize database with basic tables
const initializeDatabase = (db) => {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT,
      lastName TEXT,
      role TEXT DEFAULT 'user',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Travel packages table
    db.run(`CREATE TABLE IF NOT EXISTS travel_packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10,2),
      destination TEXT,
      duration INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Bookings table
    db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      packageId INTEGER,
      status TEXT DEFAULT 'pending',
      totalAmount DECIMAL(10,2),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (packageId) REFERENCES travel_packages(id)
    )`);
  });
};

module.exports = {
  dbConfig,
  createConnection,
  initializeDatabase,
  dbPath
};
