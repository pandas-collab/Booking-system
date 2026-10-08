import React from 'react';
import { useDestinations } from '../hooks/useDestinations';

const LoadingSpinner = () => (
  <div className="loading-spinner">Loading destinations...</div>
);

const ErrorMessage = ({ error, onRetry }) => (
  <div className="error-message">
    <p>Error loading destinations: {error.message}</p>
    <button onClick={onRetry}>Retry</button>
  </div>
);

const Destinations = () => {
  const { data: destinations, isLoading, error, refetch } = useDestinations();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="destinations-page">
      <h1>Destinations</h1>
      <div className="destinations-grid">
        {destinations?.map(destination => (
          <div key={destination.id} className="destination-card">
            <h3>{destination.name}</h3>
            <p>{destination.description}</p>
            <p>Price from: ${destination.priceFrom}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Destinations;
