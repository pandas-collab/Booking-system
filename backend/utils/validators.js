const validator = require('validator');

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {object} - Validation result with isValid boolean and error message
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required and must be a string'
    };
  }

  const trimmedEmail = email.trim();
  
  if (!trimmedEmail) {
    return {
      isValid: false,
      error: 'Email cannot be empty'
    };
  }

  if (trimmedEmail.length > 254) {
    return {
      isValid: false,
      error: 'Email is too long'
    };
  }

  if (!validator.isEmail(trimmedEmail)) {
    return {
      isValid: false,
      error: 'Invalid email format'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid boolean and error message
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      error: 'Password is required and must be a string'
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long'
    };
  }

  if (password.length > 128) {
    return {
      isValid: false,
      error: 'Password is too long (maximum 128 characters)'
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter'
    };
  }

  if (!hasLowerCase) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter'
    };
  }

  if (!hasNumbers) {
    return {
      isValid: false,
      error: 'Password must contain at least one number'
    };
  }

  if (!hasSpecialChar) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character'
    };
  }

  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123', 
    'password123', 'admin', 'letmein', 'welcome', '12345678'
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    return {
      isValid: false,
      error: 'Password is too common'
    };
  }

  return {
    isValid: true,
    error: null
  };
}

/**
 * Validates user input fields
 * @param {object} userData - User data object to validate
 * @returns {object} - Validation result with isValid boolean and errors array
 */
function validateUserInput(userData) {
  const errors = [];
  
  if (!userData || typeof userData !== 'object') {
    return {
      isValid: false,
      errors: ['Invalid user data format']
    };
  }

  // Validate email if provided
  if (userData.email !== undefined) {
    const emailValidation = validateEmail(userData.email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error);
    }
  }

  // Validate password if provided
  if (userData.password !== undefined) {
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      errors.push(passwordValidation.error);
    }
  }

  // Validate name fields
  if (userData.firstName !== undefined) {
    if (!userData.firstName || typeof userData.firstName !== 'string') {
      errors.push('First name is required and must be a string');
    } else if (userData.firstName.trim().length < 1) {
      errors.push('First name cannot be empty');
    } else if (userData.firstName.length > 50) {
      errors.push('First name is too long (maximum 50 characters)');
    } else if (!/^[a-zA-Z\s'-]+$/.test(userData.firstName.trim())) {
      errors.push('First name contains invalid characters');
    }
  }

  if (userData.lastName !== undefined) {
    if (!userData.lastName || typeof userData.lastName !== 'string') {
      errors.push('Last name is required and must be a string');
    } else if (userData.lastName.trim().length < 1) {
      errors.push('Last name cannot be empty');
    } else if (userData.lastName.length > 50) {
      errors.push('Last name is too long (maximum 50 characters)');
    } else if (!/^[a-zA-Z\s'-]+$/.test(userData.lastName.trim())) {
      errors.push('Last name contains invalid characters');
    }
  }

  // Validate phone number if provided
  if (userData.phone !== undefined) {
    if (userData.phone && typeof userData.phone === 'string') {
      const cleanPhone = userData.phone.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        errors.push('Phone number must be between 10-15 digits');
      }
    } else if (userData.phone !== null && userData.phone !== '') {
      errors.push('Phone number must be a string');
    }
  }

  // Validate age if provided
  if (userData.age !== undefined) {
    if (!Number.isInteger(userData.age) || userData.age < 0 || userData.age > 150) {
      errors.push('Age must be a valid integer between 0 and 150');
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove or encode potentially dangerous characters
  let sanitized = input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/&/g, '&amp;');

  // Remove null bytes and control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length to prevent buffer overflow attacks
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }

  return sanitized;
}

module.exports = {
  validateEmail,
  validatePassword,
  validateUserInput,
  sanitizeInput
};