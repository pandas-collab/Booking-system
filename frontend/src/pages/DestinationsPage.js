import React, { useState, useEffect } from 'react';
import { useDestinations } from '../hooks/useDestinations';
import { SearchInput } from '../components/SearchInput';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { DestinationCard } from '../components/DestinationCard';
import './DestinationsPage.css';

export const DestinationsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  
  const { 
    destinations, 
    loading, 
    error, 
    refetch 
  } = useDestinations();

  useEffect(() => {
    if (destinations) {
      const filtered = destinations.filter(destination =>
        destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDestinations(filtered);
    }
  }, [destinations, searchQuery]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleRetry = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="destinations-page">
        <div className="destinations-header">
          <h1>Destinations</h1>
        </div>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="destinations-page">
        <div className="destinations-header">
          <h1>Destinations</h1>
        </div>
        <ErrorMessage 
          message="Failed to load destinations. Please try again."
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="destinations-page">
      <div className="destinations-header">
        <h1>Discover Amazing Destinations</h1>
        <p>Explore breathtaking places around the world</p>
      </div>
      
      <div className="destinations-search">
        <SearchInput
          placeholder="Search destinations, countries, or activities..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="destinations-stats">
        <span className="destinations-count">
          {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} found
        </span>
      </div>

      {filteredDestinations.length === 0 ? (
        <div className="no-destinations">
          <h3>No destinations found</h3>
          <p>Try adjusting your search criteria or browse all available destinations.</p>
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="destinations-grid">
          {filteredDestinations.map(destination => (
            <DestinationCard
              key={destination.id}
              destination={destination}
            />
          ))}
        </div>
      )}
    </div>
  );
};