const winston = require('winston');
const path = require('path');

const logDir = 'logs';

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define colors for each log level
winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
});

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

// Create transports array
const transports = [];

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: consoleFormat
    })
  );
}

// Add file transports
transports.push(
  // Error log file
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    format: logFormat,
    maxsize: 10485760, // 10MB
    maxFiles: 5,
    tailable: true
  }),
  
  // Combined log file
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    format: logFormat,
    maxsize: 10485760, // 10MB
    maxFiles: 10,
    tailable: true
  })
);

// Add daily rotate file transport for production
if (process.env.NODE_ENV === 'production') {
  const DailyRotateFile = require('winston-daily-rotate-file');
  
  transports.push(
    new DailyRotateFile({
      filename: path.join(logDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: logFormat
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: logFormat,
  transports,
  exitOnError: false
});

// Handle uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new winston.transports.File({ 
    filename: path.join(logDir, 'exceptions.log'),
    maxsize: 10485760,
    maxFiles: 5
  })
);

logger.rejections.handle(
  new winston.transports.File({ 
    filename: path.join(logDir, 'rejections.log'),
    maxsize: 10485760,
    maxFiles: 5
  })
);

// Add custom methods
logger.stream = {
  write: function(message) {
    logger.http(message.trim());
  }
};

// Override console methods in production
if (process.env.NODE_ENV === 'production') {
  console.log = (...args) => logger.info(args.join(' '));
  console.error = (...args) => logger.error(args.join(' '));
  console.warn = (...args) => logger.warn(args.join(' '));
  console.info = (...args) => logger.info(args.join(' '));
  console.debug = (...args) => logger.debug(args.join(' '));
}

module.exports = { logger };