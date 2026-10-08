import React, { useState, useEffect } from 'react';
import './FilterPanel.css';

const FilterPanel = ({ 
  onFiltersChange, 
  initialFilters = {},
  className = ''
}) => {
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 5000 },
    regions: [],
    activities: [],
    duration: '',
    ...initialFilters
  });

  const regions = [
    'Europe',
    'Asia',
    'North America',
    'South America',
    'Africa',
    'Oceania',
    'Middle East'
  ];

  const activities = [
    'Adventure',
    'Culture',
    'Relaxation',
    'Wildlife',
    'Food & Drink',
    'History',
    'Beach',
    'Mountains',
    'Cities',
    'Nature'
  ];

  const durations = [
    { value: '', label: 'Any Duration' },
    { value: '1-3', label: '1-3 days' },
    { value: '4-7', label: '4-7 days' },
    { value: '8-14', label: '1-2 weeks' },
    { value: '15-30', label: '2-4 weeks' },
    { value: '30+', label: '1+ month' }
  ];

  useEffect(() => {
    onFiltersChange && onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handlePriceRangeChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: parseInt(value)
      }
    }));
  };

  const handleRegionChange = (region, checked) => {
    setFilters(prev => ({
      ...prev,
      regions: checked 
        ? [...prev.regions, region]
        : prev.regions.filter(r => r !== region)
    }));
  };

  const handleActivityChange = (activity, checked) => {
    setFilters(prev => ({
      ...prev,
      activities: checked 
        ? [...prev.activities, activity]
        : prev.activities.filter(a => a !== activity)
    }));
  };

  const handleDurationChange = (duration) => {
    setFilters(prev => ({
      ...prev,
      duration
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 5000 },
      regions: [],
      activities: [],
      duration: ''
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.priceRange.min > 0 || 
      filters.priceRange.max < 5000 ||
      filters.regions.length > 0 ||
      filters.activities.length > 0 ||
      filters.duration !== ''
    );
  };

  return (
    <div className={`filter-panel ${className}`}>
      <div className="filter-header">
        <h3>Filter Results</h3>
        {hasActiveFilters() && (
          <button 
            className="clear-filters-btn"
            onClick={clearFilters}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-range-container">
          <div className="price-inputs">
            <div className="price-input-group">
              <label>Min</label>
              <input
                type="number"
                value={filters.priceRange.min}
                onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                min="0"
                max={filters.priceRange.max}
              />
            </div>
            <div className="price-input-group">
              <label>Max</label>
              <input
                type="number"
                value={filters.priceRange.max}
                onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                min={filters.priceRange.min}
                max="10000"
              />
            </div>
          </div>
          <div className="price-range-slider">
            <input
              type="range"
              className="range-min"
              min="0"
              max="5000"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceRangeChange('min', e.target.value)}
            />
            <input
              type="range"
              className="range-max"
              min="0"
              max="5000"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceRangeChange('max', e.target.value)}
            />
          </div>
          <div className="price-display">
            ${filters.priceRange.min} - ${filters.priceRange.max}
          </div>
        </div>
      </div>

      <div className="filter-section">
        <h4>Duration</h4>
        <select 
          value={filters.duration}
          onChange={(e) => handleDurationChange(e.target.value)}
          className="duration-select"
        >
          {durations.map(duration => (
            <option key={duration.value} value={duration.value}>
              {duration.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-section">
        <h4>Regions</h4>
        <div className="checkbox-group">
          {regions.map(region => (
            <label key={region} className="checkbox-item">
              <input
                type="checkbox"
                checked={filters.regions.includes(region)}
                onChange={(e) => handleRegionChange(region, e.target.checked)}
              />
              <span className="checkmark"></span>
              {region}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h4>Activities</h4>
        <div className="checkbox-group">
          {activities.map(activity => (
            <label key={activity} className="checkbox-item">
              <input
                type="checkbox"
                checked={filters.activities.includes(activity)}
                onChange={(e) => handleActivityChange(activity, e.target.checked)}
              />
              <span className="checkmark"></span>
              {activity}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-summary">
        <div className="active-filters-count">
          {hasActiveFilters() && (
            <span>{Object.values(filters).flat().filter(Boolean).length} filters active</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;