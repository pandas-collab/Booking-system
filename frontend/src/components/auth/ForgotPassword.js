import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (isSubmitted) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Check Your Email</h2>
            <p>
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className="text-muted">
              If you don't see the email, check your spam folder or try again.
            </p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
            >
              Try Different Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h2>Forgot Password?</h2>
          <p>Enter your email address and we'll send you instructions to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
              required
              className={error ? 'error' : ''}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={!email || !isValidEmail(email) || isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Instructions'}
          </button>

          <div className="forgot-password-footer">
            <a href="/login" className="back-to-login">
              ← Back to Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export { ForgotPassword };