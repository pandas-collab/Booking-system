import React, { useState, useEffect } from 'react';
import './BookingForm.css';

const BookingForm = ({ serviceId, onBookingComplete, onCancel }) => {
  const [formData, setFormData] = useState({
    serviceId: serviceId || '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    bookingDate: '',
    bookingTime: '',
    duration: 60,
    notes: '',
    totalAmount: 0
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (formData.bookingDate) {
      fetchAvailableSlots(formData.bookingDate);
    }
  }, [formData.bookingDate]);

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await fetch(`/api/bookings/available-slots?date=${date}&serviceId=${serviceId}`);
      const data = await response.json();
      
      if (response.ok) {
        setAvailableSlots(data.slots || []);
      } else {
        setErrors({ date: 'Failed to fetch available slots' });
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setErrors({ date: 'Error loading available times' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Email is invalid';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = 'Phone number is invalid';
    }

    if (!formData.bookingDate) {
      newErrors.bookingDate = 'Date is required';
    } else {
      const selectedDate = new Date(formData.bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.bookingDate = 'Date cannot be in the past';
      }
    }

    if (!formData.bookingTime) {
      newErrors.bookingTime = 'Time is required';
    }

    if (!formData.duration || formData.duration < 15) {
      newErrors.duration = 'Duration must be at least 15 minutes';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        if (formData.totalAmount > 0) {
          await handlePayment(data.booking.id);
        } else {
          onBookingComplete && onBookingComplete(data.booking);
        }
      } else {
        setErrors({ submit: data.message || 'Failed to create booking' });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (bookingId) => {
    setPaymentLoading(true);

    try {
      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          amount: formData.totalAmount,
          paymentMethod,
          currency: 'USD'
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresAction) {
          // Handle 3D Secure or other payment confirmations
          window.location.href = data.confirmationUrl;
        } else {
          onBookingComplete && onBookingComplete({
            id: bookingId,
            paymentStatus: 'completed',
            ...formData
          });
        }
      } else {
        setErrors({ payment: data.message || 'Payment failed' });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setErrors({ payment: 'Payment processing error. Please try again.' });
    } finally {
      setPaymentLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="booking-form-container">
      <div className="booking-form-header">
        <h2>Book Your Appointment</h2>
        {onCancel && (
          <button type="button" className="close-button" onClick={onCancel}>
            ×
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-group">
            <label htmlFor="customerName">Full Name *</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              className={errors.customerName ? 'error' : ''}
              placeholder="Enter your full name"
            />
            {errors.customerName && <span className="error-message">{errors.customerName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="customerEmail">Email Address *</label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleInputChange}
              className={errors.customerEmail ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.customerEmail && <span className="error-message">{errors.customerEmail}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="customerPhone">Phone Number *</label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              className={errors.customerPhone ? 'error' : ''}
              placeholder="Enter your phone number"
            />
            {errors.customerPhone && <span className="error-message">{errors.customerPhone}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Appointment Details</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="bookingDate">Preferred Date *</label>
              <input
                type="date"
                id="bookingDate"
                name="bookingDate"
                value={formData.bookingDate}
                onChange={handleInputChange}
                min={getTomorrowDate()}
                className={errors.bookingDate ? 'error' : ''}
              />
              {errors.bookingDate && <span className="error-message">{errors.bookingDate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="bookingTime">Available Times *</label>
              <select
                id="bookingTime"
                name="bookingTime"
                value={formData.bookingTime}
                onChange={handleInputChange}
                className={errors.bookingTime ? 'error' : ''}
                disabled={!formData.bookingDate || availableSlots.length === 0}
              >
                <option value="">Select a time</option>
                {availableSlots.map(slot => (
                  <option key={slot.time} value={slot.time}>
                    {slot.time} {slot.available ? '' : '(Unavailable)'}
                  </option>
                ))}
              </select>
              {errors.bookingTime && <span className="error-message">{errors.bookingTime}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration (minutes) *</label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className={errors.duration ? 'error' : ''}
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
            {errors.duration && <span className="error-message">{errors.duration}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Special Requests or Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Any special requests or additional information..."
            />
          </div>
        </div>

        {formData.totalAmount > 0 && (
          <div className="form-section">
            <h3>Payment Information</h3>
            
            <div className="payment-summary">
              <div className="total-amount">
                Total: ${formData.totalAmount.toFixed(2)}
              </div>
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-methods">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>PayPal</span>
                </label>
              </div>
            </div>

            {errors.payment && (
              <div className="error-message payment-error">{errors.payment}</div>
            )}
          </div>
        )}

        {errors.submit && (
          <div className="error-message submit-error">{errors.submit}</div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading || paymentLoading}
            className="submit-button"
          >
            {loading || paymentLoading ? (
              <span className="loading-spinner">Processing...</span>
            ) : (
              `${formData.totalAmount > 0 ? 'Book & Pay' : 'Book Appointment'}`
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cancel-button"
              disabled={loading || paymentLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export { BookingForm };