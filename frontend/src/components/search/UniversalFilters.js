import { searchSuggestions } from "../../utils/mockData";
import React, { useState, useCallback, useMemo } from 'react';
import './UniversalFilters.css';

const UniversalFilters = ({ 
  onFiltersChange, 
  initialFilters = {},
  contentTypes = ['hotels', 'flights', 'tours', 'restaurants'],
  showLocationAutocomplete = true,
  showPriceRange = true,
  showDatePicker = true,
  showDuration = true,
  showRating = true
}) => {
  const [filters, setFilters] = useState({
    location: initialFilters.location || '',
    priceRange: initialFilters.priceRange || [0, 1000],
    startDate: initialFilters.startDate || '',
    endDate: initialFilters.endDate || '',
    duration: initialFilters.duration || [],
    rating: initialFilters.rating || 0,
    contentType: initialFilters.contentType || 'all',
    ...initialFilters
  });

  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const durationOptions = [
    { value: 'half-day', label: 'Half Day (< 4 hours)' },
    { value: 'full-day', label: 'Full Day (4-8 hours)' },
    { value: 'multi-day', label: 'Multi Day (1+ days)' },
    { value: 'weekend', label: 'Weekend (2-3 days)' },
    { value: 'week', label: 'Week (5-7 days)' },
    { value: 'extended', label: 'Extended (7+ days)' }
  ];

  const mockLocationData = [
    'New York, NY, USA',
    'Los Angeles, CA, USA',
    'London, UK',
    'Paris, France',
    'Tokyo, Japan',
    'Sydney, Australia',
    'Rome, Italy',
    'Barcelona, Spain',
    'Amsterdam, Netherlands',
    'Berlin, Germany'
  ];

  const handleLocationSearch = useCallback((query) => {
    if (query.length < 2) {
      setLocationSuggestions([]);
      return;
    }
    
    const filtered = mockLocationData.filter(location =>
      location.toLowerCase().includes(query.toLowerCase())
    );
    setLocationSuggestions(filtered.slice(0, 5));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange && onFiltersChange(updatedFilters);
  }, [filters, onFiltersChange]);

  const handleLocationChange = (value) => {
    updateFilters({ location: value });
    handleLocationSearch(value);
    setShowLocationDropdown(value.length > 0);
  };

  const handleLocationSelect = (location) => {
    updateFilters({ location });
    setLocationSuggestions([]);
    setShowLocationDropdown(false);
  };

  const handlePriceRangeChange = (event, index) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(event.target.value);
    if (newRange[0] <= newRange[1]) {
      updateFilters({ priceRange: newRange });
    }
  };

  const handleDurationChange = (duration) => {
    const newDuration = filters.duration.includes(duration)
      ? filters.duration.filter(d => d !== duration)
      : [...filters.duration, duration];
    updateFilters({ duration: newDuration });
  };

  const handleRatingChange = (rating) => {
    updateFilters({ rating: rating === filters.rating ? 0 : rating });
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: '',
      priceRange: [0, 1000],
      startDate: '',
      endDate: '',
      duration: [],
      rating: 0,
      contentType: 'all'
    };
    setFilters(clearedFilters);
    setLocationSuggestions([]);
    setShowLocationDropdown(false);
    onFiltersChange && onFiltersChange(clearedFilters);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
        onClick={() => handleRatingChange(index + 1)}
      >
        ★
      </span>
    ));
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.location) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    if (filters.duration.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.contentType !== 'all') count++;
    return count;
  }, [filters]);

  return (
    <div className="universal-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        {activeFiltersCount > 0 && (
          <div className="filters-actions">
            <span className="active-count">{activeFiltersCount} active</span>
            <button className="clear-filters" onClick={clearFilters}>
              Clear All
            </button>
          </div>
        )}
      </div>

      <div className="filters-content">
        {/* Content Type Filter */}
        <div className="filter-group">
          <label className="filter-label">Content Type</label>
          <select
            value={filters.contentType}
            onChange={(e) => updateFilters({ contentType: e.target.value })}
            className="content-type-select"
          >
            <option value="all">All Types</option>
            {contentTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Location Autocomplete */}
        {showLocationAutocomplete && (
          <div className="filter-group">
            <label className="filter-label">Location</label>
            <div className="location-input-container">
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleLocationChange(e.target.value)}
                placeholder="Where are you going?"
                className="location-input"
                onFocus={() => setShowLocationDropdown(filters.location.length > 0)}
                onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
              />
              {showLocationDropdown && locationSuggestions.length > 0 && (
                <div className="location-dropdown">
                  {locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="location-suggestion"
                      onClick={() => handleLocationSelect(suggestion)}
                    >
                      📍 {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Price Range */}
        {showPriceRange && (
          <div className="filter-group">
            <label className="filter-label">
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </label>
            <div className="price-range-container">
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(e, 0)}
                className="price-slider min-price"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(e, 1)}
                className="price-slider max-price"
              />
            </div>
            <div className="price-inputs">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => handlePriceRangeChange(e, 0)}
                className="price-input"
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => handlePriceRangeChange(e, 1)}
                className="price-input"
                placeholder="Max"
              />
            </div>
          </div>
        )}

        {/* Date Range */}
        {showDatePicker && (
          <div className="filter-group">
            <label className="filter-label">Date Range</label>
            <div className="date-inputs">
              <div className="date-input-group">
                <label>Check-in / Start</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => updateFilters({ startDate: e.target.value })}
                  className="date-input"
                />
              </div>
              <div className="date-input-group">
                <label>Check-out / End</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => updateFilters({ endDate: e.target.value })}
                  className="date-input"
                  min={filters.startDate}
                />
              </div>
            </div>
          </div>
        )}

        {/* Duration */}
        {showDuration && (
          <div className="filter-group">
            <label className="filter-label">Duration</label>
            <div className="duration-options">
              {durationOptions.map((option) => (
                <label key={option.value} className="duration-option">
                  <input
                    type="checkbox"
                    checked={filters.duration.includes(option.value)}
                    onChange={() => handleDurationChange(option.value)}
                  />
                  <span className="checkmark"></span>
                  {option.label}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Rating */}
        {showRating && (
          <div className="filter-group">
            <label className="filter-label">Minimum Rating</label>
            <div className="rating-selector">
              <div className="stars-container">
                {renderStars(filters.rating)}
              </div>
              <span className="rating-text">
                {filters.rating > 0 ? `${filters.rating}+ stars` : 'Any rating'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalFilters;