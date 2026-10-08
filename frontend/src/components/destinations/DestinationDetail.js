import React, { useState, useEffect } from 'react';
import './DestinationDetail.css';

const DestinationDetail = ({ destinationId }) => {
  const [destination, setDestination] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Persist to localStorage or API
  };

  useEffect(() => {
    fetchDestinationData();
  }, [destinationId]);

  const fetchDestinationData = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockDestination = {
        id: destinationId,
        name: "Santorini",
        country: "Greece",
        heroImages: [
          "/images/santorini1.jpg",
          "/images/santorini2.jpg",
          "/images/santorini3.jpg",
          "/images/santorini4.jpg",
          "/images/santorini5.jpg"
        ],
        rating: 4.8,
        reviewCount: 234,
        description: "Santorini is a stunning Greek island known for its white-washed buildings, blue domes, and breathtaking sunsets.",
        highlights: {
          bestTime: "April to October",
          currency: "EUR",
          language: "Greek"
        },
        packages: [1, 2, 3, 4, 5, 6],
        activities: [1, 2, 3, 4, 5, 6],
        reviews: []
      };

      setDestination(mockDestination);
      setError(null);
    } catch (err) {
      setError('Failed to load destination data');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (destination?.heroImages) {
      setCurrentImageIndex((prev) =>
        prev === destination.heroImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (destination?.heroImages) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? destination.heroImages.length - 1 : prev - 1
      );
    }
  };

  if (loading) return <div className="loading">Loading destination...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!destination) return <div className="error">Destination not found</div>;

  return (
    <div className="destination-detail">
      {/* Hero Image Gallery */}
      <div className="hero-gallery">
        <div className="image-container">
          <img
            src={destination.heroImages[currentImageIndex]}
            alt={`${destination.name} ${currentImageIndex + 1}`}
            className="hero-image"
          />
          <button className="nav-btn prev" onClick={prevImage}></button>
          <button className="nav-btn next" onClick={nextImage}></button>

          {/* Book Now Overlay Button */}
          <button className="book-now-overlay">Book Now</button>
        </div>

        {/* Navigation Dots */}
        <div className="image-dots">
          {destination.heroImages.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Destination Header with Wishlist */}
      <div className="destination-header">
        <div className="destination-info">
          <h1 className="destination-name">{destination.name}, {destination.country}</h1>
          <div className="rating-section">
            <div className="stars">
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} className={star <= Math.floor(destination.rating) ? 'star filled' : 'star'}>

                </span>
              ))}
              <span className="rating-text">{destination.rating}/5 from {destination.reviewCount} reviews</span>
            </div>
          </div>
        </div>

        {/* Wishlist Heart Icon */}
        <button
          className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={toggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <span className="heart-icon">{isWishlisted ? '' : ''}</span>
        </button>
      </div>

      {/* Sticky Book Now Button */}
      <button className="sticky-book-now">Book Now</button>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {['overview', 'packages', 'activities', 'reviews'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="description">
              <p>{destination.description}</p>
            </div>

            <div className="highlights">
              <h3>Key Highlights</h3>
              <div className="highlight-grid">
                <div className="highlight-item">
                  <strong>Best Time to Visit:</strong> {destination.highlights.bestTime}
                </div>
                <div className="highlight-item">
                  <strong>Currency:</strong> {destination.highlights.currency}
                </div>
                <div className="highlight-item">
                  <strong>Language:</strong> {destination.highlights.language}
                </div>
              </div>
            </div>

            <div className="popular-activities">
              <h3>Popular Activities</h3>
              <div className="activity-grid">
                {destination.activities.slice(0, 6).map(activityId => (
                  <div key={activityId} className="activity-card">
                    <img src={`/images/activity${activityId}.jpg`} alt={`Activity ${activityId}`} />
                    <h4>Activity {activityId}</h4>
                    <p className="price">From $85</p>
                    <button className="view-activity-btn">View Details</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'packages' && (
          <div className="packages-content">
            <div className="package-grid">
              {destination.packages.map(packageId => (
                <div key={packageId} className="package-card">
                  <img src={`/images/package${packageId}.jpg`} alt={`Package ${packageId}`} />
                  <h3>Package {packageId}</h3>
                  <p className="duration">7 days / 6 nights</p>
                  <div className="pricing">
                    <span className="original-price">$1,299</span>
                    <span className="discounted-price">$999</span>
                  </div>
                  <button className="view-package-btn">View Package</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="activities-content">
            <div className="activity-list">
              {destination.activities.map(activityId => (
                <div key={activityId} className="activity-item">
                  <h4>Activity {activityId}</h4>
                  <p>From $85</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-content">
            <div className="reviews-header">
              <h3>Reviews ({destination.reviewCount})</h3>
              <button className="write-review-btn">Write Review</button>
            </div>
            <div className="reviews-list">
              {[1, 2, 3, 4, 5].map(reviewId => (
                <div key={reviewId} className="review-item">
                  <div className="reviewer-info">
                    <h4>Reviewer {reviewId}</h4>
                    <div className="review-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className="star filled"></span>
                      ))}
                    </div>
                    <span className="review-date">2 days ago</span>
                  </div>
                  <p className="review-text">Amazing destination! Highly recommended.</p>
                  <button className="helpful-btn">Helpful (5)</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetail;
