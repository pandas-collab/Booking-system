import React, { useState, useEffect } from 'react';
import './BookingWidget.css';

const BookingWidget = ({ packageData, onBookingSubmit }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [travelers, setTravelers] = useState({
    adults: 2,
    children: 0,
    infants: 0
  });
  const [selectedRoom, setSelectedRoom] = useState('standard');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const roomTypes = {
    standard: { name: 'Standard Room', multiplier: 1 },
    deluxe: { name: 'Deluxe Room', multiplier: 1.3 },
    suite: { name: 'Suite', multiplier: 1.8 }
  };

  const basePrice = packageData?.basePrice || 299;
  const currency = packageData?.currency || 'USD';

  useEffect(() => {
    calculateTotal();
  }, [travelers, selectedRoom, selectedDate]);

  const calculateTotal = () => {
    const adultPrice = basePrice * travelers.adults;
    const childPrice = basePrice * 0.7 * travelers.children;
    const infantPrice = basePrice * 0.1 * travelers.infants;
    const roomMultiplier = roomTypes[selectedRoom].multiplier;
    
    const subtotal = (adultPrice + childPrice + infantPrice) * roomMultiplier;
    const taxes = subtotal * 0.12;
    const total = subtotal + taxes;
    
    setTotalPrice(total);
  };

  const handleTravelerChange = (type, increment) => {
    setTravelers(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + increment)
    }));
  };

  const handleBookNow = async () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    if (travelers.adults === 0) {
      alert('At least one adult traveler is required');
      return;
    }

    setIsLoading(true);

    const bookingData = {
      packageId: packageData?.id,
      date: selectedDate,
      travelers,
      roomType: selectedRoom,
      totalPrice,
      currency
    };

    try {
      await onBookingSubmit(bookingData);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalTravelers = () => {
    return travelers.adults + travelers.children + travelers.infants;
  };

  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="booking-widget">
      <div className="booking-widget__header">
        <h3>Book This Package</h3>
        <div className="booking-widget__price">
          <span className="price-from">From</span>
          <span className="price-amount">${basePrice}</span>
          <span className="price-per">per person</span>
        </div>
      </div>

      <div className="booking-widget__form">
        <div className="form-group">
          <label htmlFor="date-picker">Travel Date</label>
          <input
            id="date-picker"
            type="date"
            value={selectedDate}
            min={getMinDate()}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Room Type</label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="form-control"
          >
            {Object.entries(roomTypes).map(([key, room]) => (
              <option key={key} value={key}>
                {room.name} (+{Math.round((room.multiplier - 1) * 100)}%)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Travelers</label>
          
          <div className="traveler-selector">
            <div className="traveler-row">
              <div className="traveler-info">
                <span className="traveler-type">Adults</span>
                <span className="traveler-desc">Age 13+</span>
              </div>
              <div className="traveler-controls">
                <button
                  type="button"
                  onClick={() => handleTravelerChange('adults', -1)}
                  disabled={travelers.adults <= 1}
                  className="traveler-btn"
                >
                  -
                </button>
                <span className="traveler-count">{travelers.adults}</span>
                <button
                  type="button"
                  onClick={() => handleTravelerChange('adults', 1)}
                  disabled={getTotalTravelers() >= 8}
                  className="traveler-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="traveler-row">
              <div className="traveler-info">
                <span className="traveler-type">Children</span>
                <span className="traveler-desc">Age 2-12</span>
              </div>
              <div className="traveler-controls">
                <button
                  type="button"
                  onClick={() => handleTravelerChange('children', -1)}
                  disabled={travelers.children <= 0}
                  className="traveler-btn"
                >
                  -
                </button>
                <span className="traveler-count">{travelers.children}</span>
                <button
                  type="button"
                  onClick={() => handleTravelerChange('children', 1)}
                  disabled={getTotalTravelers() >= 8}
                  className="traveler-btn"
                >
                  +
                </button>
              </div>
            </div>

            <div className="traveler-row">
              <div className="traveler-info">
                <span className="traveler-type">Infants</span>
                <span className="traveler-desc">Under 2</span>
              </div>
              <div className="traveler-controls">
                <button
                  type="button"
                  onClick={() => handleTravelerChange('infants', -1)}
                  disabled={travelers.infants <= 0}
                  className="traveler-btn"
                >
                  -
                </button>
                <span className="traveler-count">{travelers.infants}</span>
                <button
                  type="button"
                  onClick={() => handleTravelerChange('infants', 1)}
                  disabled={getTotalTravelers() >= 8}
                  className="traveler-btn"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pricing-breakdown">
          <div className="price-row">
            <span>Adults ({travelers.adults})</span>
            <span>${(basePrice * travelers.adults).toFixed(2)}</span>
          </div>
          
          {travelers.children > 0 && (
            <div className="price-row">
              <span>Children ({travelers.children})</span>
              <span>${(basePrice * 0.7 * travelers.children).toFixed(2)}</span>
            </div>
          )}
          
          {travelers.infants > 0 && (
            <div className="price-row">
              <span>Infants ({travelers.infants})</span>
              <span>${(basePrice * 0.1 * travelers.infants).toFixed(2)}</span>
            </div>
          )}
          
          <div className="price-row">
            <span>Room Upgrade</span>
            <span>×{roomTypes[selectedRoom].multiplier}</span>
          </div>
          
          <div className="price-row">
            <span>Taxes & Fees</span>
            <span>${(totalPrice * 0.12 / 1.12).toFixed(2)}</span>
          </div>
          
          <div className="price-row total-row">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={handleBookNow}
          disabled={isLoading || !selectedDate || travelers.adults === 0}
          className={`book-now-btn ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? 'Processing...' : 'Book Now'}
        </button>

        <div className="booking-widget__footer">
          <p>✓ Free cancellation up to 24 hours</p>
          <p>✓ Instant confirmation</p>
          <p>✓ Best price guarantee</p>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;