import React, { useState, useEffect } from 'react';
import './PackageFilters.css';

const PackageFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    destination: '',
    duration: [],
    priceRange: [0, 10000],
    packageTypes: [],
    inclusions: [],
    ...initialFilters
  });

  const durationOptions = [
    { value: '1-3', label: '1-3 Days' },
    { value: '4-7', label: '4-7 Days' },
    { value: '8-14', label: '1-2 Weeks' },
    { value: '15-30', label: '2-4 Weeks' },
    { value: '30+', label: '1+ Month' }
  ];

  const packageTypeOptions = [
    { value: 'adventure', label: 'Adventure' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'family', label: 'Family' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'budget', label: 'Budget' },
    { value: 'business', label: 'Business' },
    { value: 'wellness', label: 'Wellness' }
  ];

  const inclusionOptions = [
    { value: 'flights', label: 'Flights Included' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'meals', label: 'Meals Included' },
    { value: 'transport', label: 'Local Transport' },
    { value: 'guide', label: 'Tour Guide' },
    { value: 'activities', label: 'Activities' },
    { value: 'insurance', label: 'Travel Insurance' },
    { value: 'visa', label: 'Visa Assistance' }
  ];

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleDestinationChange = (e) => {
    setFilters(prev => ({
      ...prev,
      destination: e.target.value
    }));
  };

  const handleDurationChange = (value) => {
    setFilters(prev => ({
      ...prev,
      duration: prev.duration.includes(value)
        ? prev.duration.filter(d => d !== value)
        : [...prev.duration, value]
    }));
  };

  const handlePriceRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      priceRange: name === 'min' 
        ? [parseInt(value) || 0, prev.priceRange[1]]
        : [prev.priceRange[0], parseInt(value) || 10000]
    }));
  };

  const handlePackageTypeChange = (value) => {
    setFilters(prev => ({
      ...prev,
      packageTypes: prev.packageTypes.includes(value)
        ? prev.packageTypes.filter(t => t !== value)
        : [...prev.packageTypes, value]
    }));
  };

  const handleInclusionChange = (value) => {
    setFilters(prev => ({
      ...prev,
      inclusions: prev.inclusions.includes(value)
        ? prev.inclusions.filter(i => i !== value)
        : [...prev.inclusions, value]
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      destination: '',
      duration: [],
      priceRange: [0, 10000],
      packageTypes: [],
      inclusions: []
    };
    setFilters(clearedFilters);
  };

  const clearDestination = () => {
    setFilters(prev => ({ ...prev, destination: '' }));
  };

  const clearDuration = () => {
    setFilters(prev => ({ ...prev, duration: [] }));
  };

  const clearPriceRange = () => {
    setFilters(prev => ({ ...prev, priceRange: [0, 10000] }));
  };

  const clearPackageTypes = () => {
    setFilters(prev => ({ ...prev, packageTypes: [] }));
  };

  const clearInclusions = () => {
    setFilters(prev => ({ ...prev, inclusions: [] }));
  };

  const hasActiveFilters = () => {
    return filters.destination !== '' ||
           filters.duration.length > 0 ||
           filters.priceRange[0] !== 0 ||
           filters.priceRange[1] !== 10000 ||
           filters.packageTypes.length > 0 ||
           filters.inclusions.length > 0;
  };

  return (
    <div className="package-filters">
      <div className="filters-header">
        <h3>Filter Packages</h3>
        {hasActiveFilters() && (
          <button 
            className="clear-all-btn"
            onClick={clearAllFilters}
          >
            Clear All
          </button>
        )}
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <h4>Destination</h4>
          {filters.destination && (
            <button className="clear-section-btn" onClick={clearDestination}>
              Clear
            </button>
          )}
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
        </div>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search destination..."
            value={filters.destination}
            onChange={handleDestinationChange}
            className="destination-search"
          />
          <span className="search-icon">🔍</span>
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
        </div>
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <h4>Duration</h4>
          {filters.duration.length > 0 && (
            <button className="clear-section-btn" onClick={clearDuration}>
              Clear
            </button>
          )}
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
        </div>
        <div className="checkbox-group">
          {durationOptions.map(option => (
            <label key={option.value} className="checkbox-item">
              <input
                type="checkbox"
                checked={filters.duration.includes(option.value)}
                onChange={() => handleDurationChange(option.value)}
              />
              <span className="checkbox-label">{option.label}</span>
            </label>
          ))}
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
        </div>
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <h4>Price Range</h4>
          {(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000) && (
            <button className="clear-section-btn" onClick={clearPriceRange}>
              Clear
            </button>
          )}
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
        </div>
        <div className="price-range-container">
          <div className="price-inputs">
            <div className="price-input-group">
              <label>Min Price</label>
              <input
                type="number"
                name="min"
                value={filters.priceRange[0]}
                onChange={handlePriceRangeChange}
                min="0"
                max="50000"
                className="price-input"
              />
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
            </div>
            <div className="price-input-group">
              <label>Max Price</label>
              <input
                type="number"
                name="max"
                value={filters.priceRange[1]}
                onChange={handlePriceRangeChange}
                min="0"
                max="50000"
                className="price-input"
              />
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
            </div>
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
          </div>
          <div className="price-display">
            ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
          </div>
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
        </div>
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <h4>Package Type</h4>
          {filters.packageTypes.length > 0 && (
            <button className="clear-section-btn" onClick={clearPackageTypes}>
              Clear
            </button>
          )}
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
        </div>
        <div className="checkbox-group">
          {packageTypeOptions.map(option => (
            <label key={option.value} className="checkbox-item">
              <input
                type="checkbox"
                checked={filters.packageTypes.includes(option.value)}
                onChange={() => handlePackageTypeChange(option.value)}
              />
              <span className="checkbox-label">{option.label}</span>
            </label>
          ))}
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
        </div>
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
      </div>

      <div className="filter-section">
        <div className="filter-header">
          <h4>Inclusions</h4>
          {filters.inclusions.length > 0 && (
            <button className="clear-section-btn" onClick={clearInclusions}>
              Clear
            </button>
          )}
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
        </div>
        <div className="checkbox-group">
          {inclusionOptions.map(option => (
            <label key={option.value} className="checkbox-item">
              <input
                type="checkbox"
                checked={filters.inclusions.includes(option.value)}
                onChange={() => handleInclusionChange(option.value)}
              />
              <span className="checkbox-label">{option.label}</span>
            </label>
          ))}
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
        </div>
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
      </div>

      <div className="active-filters-summary">
        <h4>Active Filters</h4>
        <div className="active-filters-count">
          {filters.duration.length + filters.packageTypes.length + filters.inclusions.length + 
           (filters.destination ? 1 : 0) + 
           ((filters.priceRange[0] !== 0 || filters.priceRange[1] !== 10000) ? 1 : 0)} filters applied
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
        </div>
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
      </div>
      <button onClick={clearFilters} className="clear-filters">
        Clear Filters
      </button>
    </div>
  );
};

export { PackageFilters };
export default PackageFilters;
