import React, { useState, useEffect } from 'react';
import './PackageDetail.css';

const PackageDetail = ({ packageId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchPackageData = () => {
      setTimeout(() => {
        setPackageData({
          id: packageId || 1,
          title: 'Tropical Paradise Getaway',
          subtitle: '7 Days / 6 Nights in Bali',
          price: 1299,
          originalPrice: 1599,
          rating: 4.8,
          reviewCount: 127,
          images: [
            '/api/placeholder/800/500',
            '/api/placeholder/800/500',
            '/api/placeholder/800/500',
            '/api/placeholder/800/500'
          ],
          overview: {
            description: 'Experience the ultimate tropical paradise with our carefully curated Bali package. Discover pristine beaches, ancient temples, lush rice terraces, and vibrant culture.',
            highlights: [
              'Visit iconic Tanah Lot Temple',
              'Explore Ubud Rice Terraces',
              'Traditional Balinese Spa Treatment',
              'Sunset dinner at Jimbaran Beach',
              'Cultural performance show'
            ],
            duration: '7 Days / 6 Nights',
            groupSize: 'Max 12 people',
            difficulty: 'Easy',
            bestTime: 'April - October'
          },
          itinerary: [
            {
              day: 1,
              title: 'Arrival in Denpasar',
              activities: ['Airport pickup', 'Hotel check-in', 'Welcome dinner', 'Rest and relaxation'],
              meals: ['Dinner'],
              accommodation: 'Luxury Beach Resort'
            },
            {
              day: 2,
              title: 'Ubud Cultural Tour',
              activities: ['Ubud Monkey Forest', 'Tegallalang Rice Terraces', 'Traditional Art Villages', 'Balinese cooking class'],
              meals: ['Breakfast', 'Lunch', 'Dinner'],
              accommodation: 'Luxury Beach Resort'
            },
            {
              day: 3,
              title: 'Temple Hopping',
              activities: ['Tanah Lot Temple', 'Uluwatu Temple', 'Kecak Fire Dance', 'Jimbaran seafood dinner'],
              meals: ['Breakfast', 'Lunch', 'Dinner'],
              accommodation: 'Luxury Beach Resort'
            },
            {
              day: 4,
              title: 'Beach Day & Water Sports',
              activities: ['Nusa Dua Beach', 'Water sports activities', 'Spa treatment', 'Sunset cocktails'],
              meals: ['Breakfast', 'Lunch'],
              accommodation: 'Luxury Beach Resort'
            },
            {
              day: 5,
              title: 'Mount Batur Sunrise Trek',
              activities: ['Early morning trek', 'Sunrise viewing', 'Hot springs relaxation', 'Coffee plantation visit'],
              meals: ['Breakfast', 'Lunch', 'Dinner'],
              accommodation: 'Luxury Beach Resort'
            },
            {
              day: 6,
              title: 'Shopping & Leisure',
              activities: ['Seminyak shopping', 'Beach club experience', 'Farewell dinner', 'Free time'],
              meals: ['Breakfast', 'Dinner'],
              accommodation: 'Luxury Beach Resort'
            },
            {
              day: 7,
              title: 'Departure',
              activities: ['Hotel check-out', 'Last-minute shopping', 'Airport transfer', 'Departure'],
              meals: ['Breakfast'],
              accommodation: null
            }
          ],
          inclusions: {
            included: [
              'Round-trip airport transfers',
              'Accommodation in luxury resort',
              'Daily breakfast',
              '4 lunches and 5 dinners',
              'All entrance fees to attractions',
              'Professional English-speaking guide',
              'Air-conditioned transportation',
              'Spa treatment session',
              'Cultural performance tickets',
              'Travel insurance'
            ],
            excluded: [
              'International flights',
              'Visa fees',
              'Personal expenses',
              'Tips and gratuities',
              'Additional meals not mentioned',
              'Optional activities',
              'Alcoholic beverages (except welcome drink)',
              'Laundry services'
            ]
          },
          reviews: [
            {
              id: 1,
              author: 'Sarah Johnson',
              rating: 5,
              date: '2024-01-15',
              comment: 'Amazing experience! The itinerary was perfect and our guide was incredibly knowledgeable. The hotels were luxurious and the food was fantastic.',
              avatar: '/api/placeholder/50/50'
            },
            {
              id: 2,
              author: 'Michael Chen',
              rating: 4,
              date: '2024-01-10',
              comment: 'Great package overall. The sunrise trek was absolutely breathtaking. Only minor issue was some activities felt a bit rushed, but still highly recommend.',
              avatar: '/api/placeholder/50/50'
            },
            {
              id: 3,
              author: 'Emma Wilson',
              rating: 5,
              date: '2024-01-05',
              comment: 'Perfect honeymoon trip! Everything was well organized and the staff went above and beyond to make our experience special. Will definitely book again.',
              avatar: '/api/placeholder/50/50'
            }
          ]
        });
        setLoading(false);
      }, 1000);
    };

    fetchPackageData();
  }, [packageId]);

  const nextImage = () => {
    if (packageData) {
      setCurrentImageIndex((prev) => (prev + 1) % packageData.images.length);
    }
  };

  const prevImage = () => {
    if (packageData) {
      setCurrentImageIndex((prev) => (prev - 1 + packageData.images.length) % packageData.images.length);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`star ${index < Math.floor(rating) ? 'filled' : ''}`}>
        ★
      </span>
    ));
  };

  const renderOverview = () => (
    <div className="overview-content">
      <div className="overview-main">
        <h3>About This Package</h3>
        <p>{packageData.overview.description}</p>
        
        <h4>Package Highlights</h4>
        <ul className="highlights-list">
          {packageData.overview.highlights.map((highlight, index) => (
            <li key={index}>{highlight}</li>
          ))}
        </ul>
      </div>
      
      <div className="overview-details">
        <div className="detail-card">
          <h4>Trip Details</h4>
          <div className="detail-item">
            <span className="detail-label">Duration:</span>
            <span>{packageData.overview.duration}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Group Size:</span>
            <span>{packageData.overview.groupSize}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Difficulty:</span>
            <span>{packageData.overview.difficulty}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Best Time:</span>
            <span>{packageData.overview.bestTime}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderItinerary = () => (
    <div className="itinerary-content">
      {packageData.itinerary.map((day) => (
        <div key={day.day} className="day-item">
          <div className="day-header">
            <span className="day-number">Day {day.day}</span>
            <h4>{day.title}</h4>
          </div>
          <div className="day-details">
            <div className="activities">
              <h5>Activities</h5>
              <ul>
                {day.activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
            <div className="day-info">
              <div className="meals">
                <strong>Meals:</strong> {day.meals.join(', ')}
              </div>
              {day.accommodation && (
                <div className="accommodation">
                  <strong>Accommodation:</strong> {day.accommodation}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderInclusions = () => (
    <div className="inclusions-content">
      <div className="inclusions-grid">
        <div className="included">
          <h4>What's Included</h4>
          <ul>
            {packageData.inclusions.included.map((item, index) => (
              <li key={index} className="included-item">
                <span className="check-icon">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="excluded">
          <h4>What's Not Included</h4>
          <ul>
            {packageData.inclusions.excluded.map((item, index) => (
              <li key={index} className="excluded-item">
                <span className="cross-icon">✗</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="reviews-content">
      <div className="reviews-header">
        <h4>Customer Reviews</h4>
        <div className="rating-summary">
          <div className="rating-display">
            {renderStars(packageData.rating)}
            <span className="rating-number">{packageData.rating}</span>
            <span className="review-count">({packageData.reviewCount} reviews)</span>
          </div>
        </div>
      </div>
      
      <div className="reviews-list">
        {packageData.reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <img src={review.avatar} alt={review.author} className="reviewer-avatar" />
              <div className="reviewer-info">
                <h5>{review.author}</h5>
                <div className="review-rating">{renderStars(review.rating)}</div>
                <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
              </div>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="package-detail loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="package-detail error">
        <div className="error-message">Package not found</div>
      </div>
    );
  }

  return (
    <div className="package-detail">
      {/* Hero Carousel */}
      <div className="hero-carousel">
        <div className="carousel-container">
          <button className="carousel-btn prev" onClick={prevImage}>‹</button>
          <img 
            src={packageData.images[currentImageIndex]} 
            alt={`Package image ${currentImageIndex + 1}`}
            className="carousel-image"
          />
          <button className="carousel-btn next" onClick={nextImage}>›</button>
          
          <div className="carousel-indicators">
            {packageData.images.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Package Header */}
      <div className="package-header">
        <div className="container">
          <div className="header-content">
            <div className="title-section">
              <h1>{packageData.title}</h1>
              <p className="subtitle">{packageData.subtitle}</p>
              <div className="rating-section">
                {renderStars(packageData.rating)}
                <span className="rating-text">{packageData.rating} ({packageData.reviewCount} reviews)</span>
              </div>
            </div>
            
            <div className="price-section">
              <div className="price-display">
                <span className="current-price">${packageData.price}</span>
                <span className="original-price">${packageData.originalPrice}</span>
                <span className="price-label">per person</span>
              </div>
              <button className="book-now-btn">Book Now</button>
        <div className="package-actions" style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <button 
            className="btn btn-outline wishlist-btn"
            onClick={() => {
              const isWishlisted = !packageDetail.isWishlisted;
              console.log("Wishlist toggled:", isWishlisted);
              alert(isWishlisted ? "Added to wishlist!" : "Removed from wishlist!");
            }}
          >
             Add to Wishlist
          </button>
          <button 
            className="btn btn-outline share-btn"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: packageDetail.name,
                  text: `Check out this amazing travel package: ${packageDetail.name}`,
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Package link copied to clipboard!");
              }
            }}
          >
             Share Package
          </button>
        </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-navigation">
        <div className="container">
          <nav className="tabs">
            <button
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab ${activeTab === 'itinerary' ? 'active' : ''}`}
              onClick={() => setActiveTab('itinerary')}
            >
              Itinerary
            </button>
            <button
              className={`tab ${activeTab === 'inclusions' ? 'active' : ''}`}
              onClick={() => setActiveTab('inclusions')}
            >
              Inclusions
            </button>
            <button
              className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <div className="container">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'itinerary' && renderItinerary()}
          {activeTab === 'inclusions' && renderInclusions()}
          {activeTab === 'reviews' && renderReviews()}
        </div>
      </div>

      {/* Sticky Booking Bar */}
      <div className="sticky-booking-bar">
        <div className="container">
          <div className="booking-bar-content">
            <div className="package-summary">
              <span className="package-name">{packageData.title}</span>
              <span className="package-price">${packageData.price}/person</span>
            </div>
            <button className="sticky-book-btn">Book This Package</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;