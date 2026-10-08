import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear API error
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      // Update auth context
      await login(data.user || data);

      // Redirect to dashboard or intended page
      const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
      navigate(redirectPath);

    } catch (error) {
      console.error('Login error:', error);
      setApiError(error.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form" noValidate>
        <h2 className="login-form-title">Sign In</h2>
        
        {apiError && (
          <div className="error-message api-error" role="alert">
            {apiError}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Enter your email"
            disabled={isLoading}
            autoComplete="email"
            required
          />
          {errors.email && (
            <span className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Enter your password"
            disabled={isLoading}
            autoComplete="current-password"
            required
          />
          {errors.password && (
            <span className="error-message" role="alert">
              {errors.password}
            </span>
          )}
        </div>

        <div className="form-options">
          <label className="checkbox-label">
            <input type="checkbox" name="remember" />
            <span className="checkmark"></span>
            Remember me
          </label>
          <a href="/forgot-password" className="forgot-password-link">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className={`login-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <div className="form-footer">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="register-link">
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;