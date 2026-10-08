import DestinationCard from './DestinationCard';
import React, { useState, useEffect } from 'react';
import './DestinationList.css';

const DestinationCard = ({ destination }) => {
  return (
    <div className="destination-card">
      <div className="destination-image">
        <img 
          src={destination.image || '/api/placeholder/300/200'} 
          alt={destination.name}
          onError={(e) => {
            e.target.src = '/api/placeholder/300/200';
          }}
        />
        <div className="destination-overlay">
          <span className="destination-price">${destination.price}</span>
        </div>
      </div>
      <div className="destination-info">
        <h3 className="destination-name">{destination.name}</h3>
        <p className="destination-location">{destination.location}</p>
        <div className="destination-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`star ${i < Math.floor(destination.rating || 0) ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-text">({destination.rating || 0})</span>
        </div>
        <p className="destination-description">{destination.description}</p>
        <div className="destination-tags">
          {destination.tags && destination.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="destination-card loading-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-info">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-line skeleton-location"></div>
        <div className="skeleton-line skeleton-rating"></div>
        <div className="skeleton-line skeleton-description"></div>
        <div className="skeleton-line skeleton-description short"></div>
      </div>
    </div>
  );
};

const DestinationList = ({ 
  destinations = [], 
  loading = false, 
  filters = {},
  onDestinationClick,
  className = ''
}) => {
  const [filteredDestinations, setFilteredDestinations] = useState([]);

  useEffect(() => {
    let filtered = [...destinations];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(dest => 
        dest.name?.toLowerCase().includes(searchTerm) ||
        dest.location?.toLowerCase().includes(searchTerm) ||
        dest.description?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter(dest => 
        dest.price >= filters.priceRange.min && 
        dest.price <= filters.priceRange.max
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(dest => 
        (dest.rating || 0) >= filters.rating
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(dest =>
        dest.tags && dest.tags.some(tag => filters.tags.includes(tag))
      );
    }

    if (filters.location) {
      filtered = filtered.filter(dest =>
        dest.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating-desc':
            return (b.rating || 0) - (a.rating || 0);
          case 'rating-asc':
            return (a.rating || 0) - (b.rating || 0);
          case 'name-asc':
            return a.name?.localeCompare(b.name || '') || 0;
          case 'name-desc':
            return b.name?.localeCompare(a.name || '') || 0;
          default:
            return 0;
        }
      });
    }

    setFilteredDestinations(filtered);
  }, [destinations, filters]);

  const handleDestinationClick = (destination) => {
    if (onDestinationClick) {
      onDestinationClick(destination);
    }
  };

  if (loading) {
    return (
      <div className={`destination-list ${className}`}>
        <div className="destination-grid">
          {[...Array(8)].map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (filteredDestinations.length === 0 && !loading) {
    return (
      <div className={`destination-list ${className}`}>
        <div className="empty-state">
          <div className="empty-icon">🗺️</div>
          <h3>No destinations found</h3>
          <p>Try adjusting your filters or search criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`destination-list ${className}`}>
      <div className="destination-grid">
        {filteredDestinations.map((destination) => (
          <div
            key={destination.id}
            className="destination-card-wrapper"
            onClick={() => handleDestinationClick(destination)}
          >
            <DestinationCard destination={destination} />
          </div>
        ))}
      </div>
      {filteredDestinations.length > 0 && (
        <div className="destination-count">
          Showing {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default DestinationList;