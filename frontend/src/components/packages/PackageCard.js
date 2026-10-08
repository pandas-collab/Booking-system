import React from 'react';
import { Link } from 'react-router-dom';
import './PackageCard.css';

const PackageCard = ({ 
  id,
  title,
  description,
  originalPrice,
  discountedPrice,
  discount,
  duration,
  location,
  image,
  inclusions = [],
  rating,
  reviewCount,
  availability = true
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const hasDiscount = discountedPrice && discountedPrice < originalPrice;

  return (
    <div className="package-card">
      <Link to={`/packages/${id}`} className="package-card-link">
        <div className="package-card-image">
          <img src={image} alt={title} />
          {discount && (
            <div className="discount-badge">
              {discount}% OFF
            </div>
          )}
        </div>
        
        <div className="package-card-content">
          <div className="package-header">
            <h3 className="package-title">{title}</h3>
            {rating && (
              <div className="package-rating">
                <span className="rating-stars">
                  {'★'.repeat(Math.floor(rating))}
                  {rating % 1 !== 0 && '☆'}
                </span>
                <span className="rating-value">({rating})</span>
                {reviewCount && (
                  <span className="review-count">{reviewCount} reviews</span>
                )}
              </div>
            )}
          </div>

          {location && (
            <div className="package-location">
              <span className="location-icon">📍</span>
              {location}
            </div>
          )}

          {duration && (
            <div className="package-duration">
              <span className="duration-icon">⏰</span>
              {duration}
            </div>
          )}

          <p className="package-description">{description}</p>

          {inclusions.length > 0 && (
            <div className="package-inclusions">
              <h4>What's Included:</h4>
              <ul>
                {inclusions.slice(0, 3).map((inclusion, index) => (
                  <li key={index}>
                    <span className="inclusion-icon">✓</span>
                    {inclusion}
                  </li>
                ))}
                {inclusions.length > 3 && (
                  <li className="more-inclusions">
                    +{inclusions.length - 3} more
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="package-footer">
            <div className="package-pricing">
              {hasDiscount ? (
                <>
                  <span className="original-price">{formatPrice(originalPrice)}</span>
                  <span className="discounted-price">{formatPrice(discountedPrice)}</span>
                </>
              ) : (
                <span className="price">{formatPrice(originalPrice)}</span>
              )}
              <span className="price-unit">per person</span>
            </div>

            <div className="package-actions">
              <button 
                className={`book-now-btn ${!availability ? 'unavailable' : ''}`}
                disabled={!availability}
                onClick={(e) => {
                  e.preventDefault();
                  if (availability) {
                    window.location.href = `/packages/${id}/book`;
                  }
                }}
              >
                {availability ? 'Book Now' : 'Unavailable'}
              </button>
            </div>
          </div>

          {!availability && (
            <div className="availability-notice">
              Currently unavailable
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PackageCard;