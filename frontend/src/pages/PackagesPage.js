import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import './PackagesPage.css';

const PackagesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [packages] = useState(travelPackages);
  const [showComparison, setShowComparison] = useState(false);
  const [packages] = useState(travelPackages);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    priceRange: [
      parseInt(searchParams.get('minPrice')) || 0,
      parseInt(searchParams.get('maxPrice')) || 10000
    ],
    duration: searchParams.get('duration') || '',
    rating: parseFloat(searchParams.get('rating')) || 0,
    sortBy: searchParams.get('sortBy') || 'popularity'
  });

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/packages');
        if (!response.ok) throw new Error('Failed to fetch packages');
        const data = await response.json();
        setPackages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'priceRange') {
        if (value[0] > 0) params.set('minPrice', value[0]);
        if (value[1] < 10000) params.set('maxPrice', value[1]);
      } else if (value && value !== '' && value !== 0) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Filter and sort packages
  const filteredPackages = useMemo(() => {
    let filtered = packages.filter(pkg => {
      const matchesSearch = !filters.search || 
        pkg.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        pkg.description.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesCategory = !filters.category || pkg.category === filters.category;
      
      const matchesPrice = pkg.price >= filters.priceRange[0] && 
        pkg.price <= filters.priceRange[1];
      
      const matchesDuration = !filters.duration || pkg.duration === filters.duration;
      
      const matchesRating = pkg.rating >= filters.rating;

      return matchesSearch && matchesCategory && matchesPrice && 
             matchesDuration && matchesRating;
    });

    // Sort packages
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'duration':
          return a.durationDays - b.durationDays;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

    return filtered;
  }, [packages, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePackageSelect = (packageId) => {
    setSelectedPackages(prev => {
      if (prev.includes(packageId)) {
        return prev.filter(id => id !== packageId);
      } else if (prev.length < 3) {
        return [...prev, packageId];
      }
      return prev;
    });
  };

  const handleComparePackages = () => {
    if (selectedPackages.length >= 2) {
      setShowComparison(true);
    }
  };

  const clearComparison = () => {
    setSelectedPackages([]);
    setShowComparison(false);
  };

  if (loading) {
    return (
    <div className="breadcrumb">
      <a href="/dashboard">Home</a> > <span>Packages</span>
    </div>
      <div className="packages-page">
        <div className="loading-spinner">
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
          <div className="spinner"></div>
          <p>Loading packages...</p>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
        </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
      </div>
    );
  }

  if (error) {
    return (
    <div className="breadcrumb">
      <a href="/dashboard">Home</a> > <span>Packages</span>
    </div>
      <div className="packages-page">
        <div className="error-message">
          <h2>Error Loading Packages</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
        </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
      </div>
    );
  }

  return (
    <div className="breadcrumb">
      <a href="/dashboard">Home</a> > <span>Packages</span>
    </div>
    <div className="packages-page">
      <div className="packages-header">
        <h1>Travel Packages</h1>
        <p className="subtitle">Curated experiences for every traveler</p>
        <p>Discover amazing destinations and create unforgettable memories</p>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
      </div>

      <div className="packages-content">
        <aside className="filters-sidebar">
          <PackageFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            totalPackages={packages.length}
            filteredCount={filteredPackages.length}
          />
        </aside>

        <main className="packages-main">
          <div className="packages-toolbar">
            <div className="results-info">
              <span>{filteredPackages.length} packages found</span>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
            </div>
            <div className="sort-controls">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="duration">Duration</option>
                <option value="name">Name</option>
              </select>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
            </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
          </div>

          <PackageList
            packages={filteredPackages}
            selectedPackages={selectedPackages}
            onPackageSelect={handlePackageSelect}
          />

          {filteredPackages.length === 0 && (
            <div className="no-results">
              <h3>No packages found</h3>
              <p>Try adjusting your filters or search criteria</p>
              <button onClick={() => setFilters({
                search: '',
                category: '',
                priceRange: [0, 10000],
                duration: '',
                rating: 0,
                sortBy: 'popularity'
              })}>
                Clear All Filters
              </button>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
            </div>
          )}
        </main>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
      </div>

      {selectedPackages.length > 0 && (
        <div className="compare-button-sticky">
          <div className="compare-button-content">
            <span>{selectedPackages.length} package(s) selected</span>
            <div className="compare-actions">
              <button
                className="btn-secondary"
                onClick={clearComparison}
              >
                Clear
              </button>
              <button
                className="btn-primary"
                onClick={handleComparePackages}
                disabled={selectedPackages.length < 2}
              >
                Compare ({selectedPackages.length})
              </button>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
            </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
          </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
        </div>
      )}

      {showComparison && (
        <ComparisonModal
          packageIds={selectedPackages}
          packages={packages}
          onClose={() => setShowComparison(false)}
          onClearSelection={clearComparison}
        />
      )}
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};

// PackageFilters Component
const PackageFilters = ({ filters, onFiltersChange, totalPackages, filteredCount }) => {
  const categories = [
    'Adventure', 'Beach', 'Cultural', 'Wildlife', 'Mountain', 
    'City Break', 'Cruise', 'Honeymoon', 'Family', 'Luxury'
  ];

  const durations = [
    { value: '1-3', label: '1-3 days' },
    { value: '4-7', label: '4-7 days' },
    { value: '8-14', label: '1-2 weeks' },
    { value: '15+', label: '2+ weeks' }
  ];

  return (
    <div className="breadcrumb">
      <a href="/dashboard">Home</a> > <span>Packages</span>
    </div>
    <div className="package-filters">
      <h3>Filters</h3>
      
      <div className="filter-group">
        <label>Search</label>
        <input
          type="text"
          placeholder="Search packages..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
        />
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select
          value={filters.category}
          onChange={(e) => onFiltersChange({ category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
      </div>

      <div className="filter-group">
        <label>Price Range</label>
        <div className="price-range">
          <input
            type="range"
            min="0"
            max="10000"
            value={filters.priceRange[0]}
            onChange={(e) => onFiltersChange({
              priceRange: [parseInt(e.target.value), filters.priceRange[1]]
            })}
          />
          <input
            type="range"
            min="0"
            max="10000"
            value={filters.priceRange[1]}
            onChange={(e) => onFiltersChange({
              priceRange: [filters.priceRange[0], parseInt(e.target.value)]
            })}
          />
          <div className="price-display">
            ${filters.priceRange[0]} - ${filters.priceRange[1]}
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
          </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
        </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
      </div>

      <div className="filter-group">
        <label>Duration</label>
        <select
          value={filters.duration}
          onChange={(e) => onFiltersChange({ duration: e.target.value })}
        >
          <option value="">Any Duration</option>
          {durations.map(dur => (
            <option key={dur.value} value={dur.value}>{dur.label}</option>
          ))}
        </select>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
      </div>

      <div className="filter-group">
        <label>Minimum Rating</label>
        <select
          value={filters.rating}
          onChange={(e) => onFiltersChange({ rating: parseFloat(e.target.value) })}
        >
          <option value="0">Any Rating</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
      </div>

      <div className="filter-results">
        <small>{filteredCount} of {totalPackages} packages</small>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
      </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};

// PackageList Component
const PackageList = ({ packages, selectedPackages, onPackageSelect }) => {
  return (
    <div className="breadcrumb">
      <a href="/dashboard">Home</a> > <span>Packages</span>
    </div>
    <div className="package-list">
      {packages.map(pkg => (
        <PackageCard
          key={pkg.id}
          package={pkg}
          isSelected={selectedPackages.includes(pkg.id)}
          onSelect={() => onPackageSelect(pkg.id)}
        />
      ))}
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};

// PackageCard Component
const PackageCard = ({ package: pkg, isSelected, onSelect }) => {
  return (
    <div className="breadcrumb">
      <a href="/dashboard">Home</a> > <span>Packages</span>
    </div>
    <div className={`package-card ${isSelected ? 'selected' : ''}`}>
      <div className="package-image">
        <img src={pkg.image} alt={pkg.name} />
        <div className="package-actions">
          <button
            className={`compare-btn ${isSelected ? 'active' : ''}`}
            onClick={onSelect}
          >
            {isSelected ? '✓' : '+'}
          </button>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
        </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
      </div>
      
      <div className="package-content">
        <div className="package-header">
          <h3>{pkg.name}</h3>
          <div className="package-rating">
            <span className="stars">{'★'.repeat(Math.floor(pkg.rating))}</span>
            <span className="rating-value">{pkg.rating}</span>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
          </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
        </div>
        
        <p className="package-description">{pkg.description}</p>
        
        <div className="package-details">
          <div className="detail-item">
            <span className="label">Duration:</span>
            <span>{pkg.duration}</span>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
          </div>
          <div className="detail-item">
            <span className="label">Category:</span>
            <span>{pkg.category}</span>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
          </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
        </div>
        
        <div className="package-footer">
          <div className="package-price">
            <span className="price">${pkg.price}</span>
            <span className="per-person">per person</span>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
          </div>
          <button className="btn-primary">View Details</button>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
        </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
      </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};

// ComparisonModal Component
const ComparisonModal = ({ packageIds, packages, onClose, onClearSelection }) => {
  const selectedPackages = packages.filter(pkg => packageIds.includes(pkg.id));
  
  return (
    <div className="breadcrumb">
      <a href="/dashboard">Home</a> > <span>Packages</span>
    </div>
    <div className="comparison-modal-overlay" onClick={onClose}>
      <div className="comparison-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Package Comparison</h2>
          <button className="close-btn" onClick={onClose}>×</button>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
        </div>
        
        <div className="comparison-content">
          <div className="comparison-table">
            {selectedPackages.map(pkg => (
              <div key={pkg.id} className="comparison-column">
                <img src={pkg.image} alt={pkg.name} />
                <h3>{pkg.name}</h3>
                <div className="comparison-details">
                  <div className="detail-row">
                    <span className="label">Price:</span>
                    <span>${pkg.price}</span>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
                  </div>
                  <div className="detail-row">
                    <span className="label">Duration:</span>
                    <span>{pkg.duration}</span>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
                  </div>
                  <div className="detail-row">
                    <span className="label">Rating:</span>
                    <span>{pkg.rating} ★</span>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
                  </div>
                  <div className="detail-row">
                    <span className="label">Category:</span>
                    <span>{pkg.category}</span>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
                  </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
                </div>
                <button className="btn-primary">Select Package</button>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
              </div>
            ))}
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
          </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClearSelection}>
            Clear Selection
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
        </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
      </div>
      {showComparison && (
        <PackageComparisonModal
          packages={selectedPackages}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
};

export { PackagesPage };
export default PackagesPage;
