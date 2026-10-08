const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 12;

class AuthService {
  static generateToken(payload, options = {}) {
    try {
      const tokenOptions = {
        expiresIn: options.expiresIn || JWT_EXPIRES_IN,
        issuer: options.issuer || 'app',
        audience: options.audience || 'user',
        ...options
      };

      return jwt.sign(payload, JWT_SECRET, tokenOptions);
    } catch (error) {
      throw new Error(`Token generation failed: ${error.message}`);
    }
  }

  static verifyToken(token, options = {}) {
    try {
      if (!token) {
        throw new Error('Token is required');
      }

      const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
      
      const verifyOptions = {
        issuer: options.issuer || 'app',
        audience: options.audience || 'user',
        ...options
      };

      return jwt.verify(cleanToken, JWT_SECRET, verifyOptions);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      if (error.name === 'NotBeforeError') {
        throw new Error('Token not active');
      }
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  static async hashPassword(password) {
    try {
      if (!password) {
        throw new Error('Password is required');
      }

      if (typeof password !== 'string') {
        throw new Error('Password must be a string');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      if (error.message.includes('Password')) {
        throw error;
      }
      throw new Error(`Password hashing failed: ${error.message}`);
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    try {
      if (!plainPassword || !hashedPassword) {
        throw new Error('Both password and hash are required');
      }

      if (typeof plainPassword !== 'string' || typeof hashedPassword !== 'string') {
        throw new Error('Password and hash must be strings');
      }

      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      if (error.message.includes('password') || error.message.includes('hash')) {
        throw error;
      }
      throw new Error(`Password comparison failed: ${error.message}`);
    }
  }

  static async authenticateUser(credentials, userRepository) {
    try {
      const { email, username, password } = credentials;

      if (!password) {
        throw new Error('Password is required');
      }

      if (!email && !username) {
        throw new Error('Email or username is required');
      }

      if (!userRepository || typeof userRepository.findUser !== 'function') {
        throw new Error('Valid user repository is required');
      }

      const query = email ? { email } : { username };
      const user = await userRepository.findUser(query);

      if (!user) {
        throw new Error('Invalid credentials');
      }

      if (user.isLocked && user.lockUntil && user.lockUntil > Date.now()) {
        throw new Error('Account is temporarily locked');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      const isPasswordValid = await this.comparePassword(password, user.password);

      if (!isPasswordValid) {
        if (userRepository.incrementLoginAttempts) {
          await userRepository.incrementLoginAttempts(user._id || user.id);
        }
        throw new Error('Invalid credentials');
      }

      if (userRepository.resetLoginAttempts) {
        await userRepository.resetLoginAttempts(user._id || user.id);
      }

      const tokenPayload = {
        id: user._id || user.id,
        email: user.email,
        username: user.username,
        role: user.role || 'user'
      };

      const token = this.generateToken(tokenPayload);
      const refreshToken = this.generateToken(
        { id: user._id || user.id, type: 'refresh' },
        { expiresIn: '7d' }
      );

      return {
        user: {
          id: user._id || user.id,
          email: user.email,
          username: user.username,
          role: user.role || 'user',
          firstName: user.firstName,
          lastName: user.lastName
        },
        token,
        refreshToken,
        expiresIn: JWT_EXPIRES_IN
      };
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  static generateRefreshToken(userId) {
    try {
      return this.generateToken(
        { id: userId, type: 'refresh' },
        { expiresIn: '7d' }
      );
    } catch (error) {
      throw new Error(`Refresh token generation failed: ${error.message}`);
    }
  }

  static verifyRefreshToken(token) {
    try {
      const decoded = this.verifyToken(token);
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token type');
      }

      return decoded;
    } catch (error) {
      throw new Error(`Refresh token verification failed: ${error.message}`);
    }
  }

  static generatePasswordResetToken(userId) {
    try {
      return this.generateToken(
        { id: userId, type: 'password_reset' },
        { expiresIn: '1h' }
      );
    } catch (error) {
      throw new Error(`Password reset token generation failed: ${error.message}`);
    }
  }

  static verifyPasswordResetToken(token) {
    try {
      const decoded = this.verifyToken(token);
      
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid password reset token type');
      }

      return decoded;
    } catch (error) {
      throw new Error(`Password reset token verification failed: ${error.message}`);
    }
  }
}

const generateToken = AuthService.generateToken.bind(AuthService);
const verifyToken = AuthService.verifyToken.bind(AuthService);
const hashPassword = AuthService.hashPassword.bind(AuthService);
const comparePassword = AuthService.comparePassword.bind(AuthService);
const authenticateUser = AuthService.authenticateUser.bind(AuthService);

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  authenticateUser,
  AuthService
};