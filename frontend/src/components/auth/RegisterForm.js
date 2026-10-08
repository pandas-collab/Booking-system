import React, { useState } from 'react';

// Mock users for testing: john.doe@email.com/password123, sarah.chen@email.com/travel2024, admin@travelapp.com/admin123
import './RegisterForm.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordStrength = {
    score: 0,
    feedback: []
  };

  const calculatePasswordStrength = (password) => {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include uppercase letters');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include numbers');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Include special characters');
    }

    return { score, feedback };
  };

  const currentPasswordStrength = calculatePasswordStrength(formData.password);

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (currentPasswordStrength.score < 3) {
      newErrors.password = 'Password is too weak';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle successful registration
      console.log('Registration successful:', {
        fullName: formData.fullName,
        email: formData.email
      });

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (currentPasswordStrength.score) {
      case 0:
      case 1:
        return '#ff4757';
      case 2:
        return '#ffa502';
      case 3:
        return '#f1c40f';
      case 4:
      case 5:
        return '#2ed573';
      default:
        return '#ddd';
    }
  };

  const getPasswordStrengthText = () => {
    switch (currentPasswordStrength.score) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Fair';
      case 4:
        return 'Good';
      case 5:
        return 'Strong';
      default:
        return '';
    }
  };

  return (
    <div className="register-form-container">
      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <h2 className="register-form__title">Create Account</h2>

        <div className="register-form__field">
          <label htmlFor="fullName" className="register-form__label">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={`register-form__input ${errors.fullName ? 'register-form__input--error' : ''}`}
            placeholder="Enter your full name"
            disabled={isSubmitting}
          />
          {errors.fullName && (
            <span className="register-form__error">{errors.fullName}</span>
          )}
        </div>

        <div className="register-form__field">
          <label htmlFor="email" className="register-form__label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`register-form__input ${errors.email ? 'register-form__input--error' : ''}`}
            placeholder="Enter your email"
            disabled={isSubmitting}
          />
          {errors.email && (
            <span className="register-form__error">{errors.email}</span>
          )}
        </div>

        <div className="register-form__field">
          <label htmlFor="password" className="register-form__label">
            Password
          </label>
          <div className="register-form__password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`register-form__input ${errors.password ? 'register-form__input--error' : ''}`}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="register-form__password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isSubmitting}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          
          {formData.password && (
            <div className="register-form__password-strength">
              <div className="password-strength__bar">
                <div 
                  className="password-strength__fill"
                  style={{
                    width: `${(currentPasswordStrength.score / 5) * 100}%`,
                    backgroundColor: getPasswordStrengthColor()
                  }}
                />
              </div>
              <div className="password-strength__info">
                <span 
                  className="password-strength__text"
                  style={{ color: getPasswordStrengthColor() }}
                >
                  {getPasswordStrengthText()}
                </span>
                {currentPasswordStrength.feedback.length > 0 && (
                  <div className="password-strength__feedback">
                    {currentPasswordStrength.feedback.map((item, index) => (
                      <span key={index} className="password-strength__feedback-item">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {errors.password && (
            <span className="register-form__error">{errors.password}</span>
          )}
        </div>

        <div className="register-form__field">
          <label htmlFor="confirmPassword" className="register-form__label">
            Confirm Password
          </label>
          <div className="register-form__password-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`register-form__input ${errors.confirmPassword ? 'register-form__input--error' : ''}`}
              placeholder="Confirm your password"
              disabled={isSubmitting}
            />
            <button
              type="button"
              className="register-form__password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isSubmitting}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="register-form__error">{errors.confirmPassword}</span>
          )}
        </div>

        {errors.submit && (
          <div className="register-form__submit-error">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          className="register-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="register-form__footer">
          <p>
            Already have an account? 
            <a href="/login" className="register-form__link">
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export { RegisterForm };