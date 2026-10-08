import React, { useState, useEffect } from 'react';
import './ReviewList.css';

const ReviewList = ({ productId, productName }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    userName: '',
    userEmail: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, filterRating]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}/reviews?sort=${sortBy}&filter=${filterRating}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRatingStats = () => {
    if (reviews.length === 0) return { average: 0, distribution: [0, 0, 0, 0, 0] };
    
    const distribution = [0, 0, 0, 0, 0];
    let total = 0;
    
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
      total += review.rating;
    });
    
    return {
      average: (total / reviews.length).toFixed(1),
      distribution,
      total: reviews.length
    };
  };

  const handleHelpfulVote = async (reviewId, isHelpful) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ helpful: isHelpful }),
      });
      
      if (response.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error voting on review:', error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newReview,
          productId,
          date: new Date().toISOString()
        }),
      });
      
      if (response.ok) {
        setShowWriteModal(false);
        setNewReview({
          rating: 5,
          title: '',
          comment: '',
          userName: '',
          userEmail: ''
        });
        fetchReviews();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const renderStars = (rating, size = 'medium') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={`star star-${size} filled`}>★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className={`star star-${size} half`}>★</span>);
      } else {
        stars.push(<span key={i} className={`star star-${size} empty`}>☆</span>);
      }
    }
    
    return <div className="star-rating">{stars}</div>;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stats = calculateRatingStats();

  if (loading) {
    return <div className="review-list-loading">Loading reviews...</div>;
  }

  return (
    <div className="review-list">
      <div className="review-header">
        <h3>Customer Reviews</h3>
        <button 
          className="write-review-btn"
          onClick={() => setShowWriteModal(true)}
        >
          Write a Review
        </button>
      </div>

      <div className="review-summary">
        <div className="rating-overview">
          <div className="average-rating">
            <span className="rating-number">{stats.average}</span>
            {renderStars(parseFloat(stats.average), 'large')}
            <span className="total-reviews">({stats.total} reviews)</span>
          </div>
          
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="rating-bar">
                <span className="rating-label">{rating} star</span>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: stats.total > 0 ? `${(stats.distribution[rating - 1] / stats.total) * 100}%` : '0%' 
                    }}
                  ></div>
                </div>
                <span className="rating-count">({stats.distribution[rating - 1]})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="review-filters">
        <div className="filter-group">
          <label htmlFor="sort-select">Sort by:</label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="filter-select">Filter by rating:</label>
          <select 
            id="filter-select"
            value={filterRating} 
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      <div className="reviews-container">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header-info">
                <div className="reviewer-info">
                  <span className="reviewer-name">{review.userName}</span>
                  <span className="review-date">{formatDate(review.date)}</span>
                </div>
                <div className="review-rating">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              {review.title && (
                <h4 className="review-title">{review.title}</h4>
              )}
              
              <p className="review-comment">{review.comment}</p>
              
              <div className="review-actions">
                <span className="helpful-text">Was this review helpful?</span>
                <button 
                  className="helpful-btn"
                  onClick={() => handleHelpfulVote(review.id, true)}
                >
                  Yes ({review.helpfulVotes || 0})
                </button>
                <button 
                  className="helpful-btn"
                  onClick={() => handleHelpfulVote(review.id, false)}
                >
                  No ({review.notHelpfulVotes || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showWriteModal && (
        <div className="modal-overlay" onClick={() => setShowWriteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Write a Review for {productName}</h3>
              <button 
                className="close-btn"
                onClick={() => setShowWriteModal(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={submitReview}>
              <div className="form-group">
                <label>Your Rating:</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      className={`star-btn ${newReview.rating >= rating ? 'selected' : ''}`}
                      onClick={() => setNewReview({...newReview, rating})}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="review-title">Review Title:</label>
                <input
                  id="review-title"
                  type="text"
                  value={newReview.title}
                  onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                  placeholder="Summarize your review"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="review-comment">Your Review: *</label>
                <textarea
                  id="review-comment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  placeholder="Tell others about your experience with this product"
                  rows="5"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="reviewer-name">Your Name: *</label>
                <input
                  id="reviewer-name"
                  type="text"
                  value={newReview.userName}
                  onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="reviewer-email">Email (won't be published): *</label>
                <input
                  id="reviewer-email"
                  type="email"
                  value={newReview.userEmail}
                  onChange={(e) => setNewReview({...newReview, userEmail: e.target.value})}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowWriteModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-review-btn">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewList;