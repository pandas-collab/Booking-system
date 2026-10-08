import React from 'react';
import { usePackages } from '../hooks/usePackages';

const LoadingSpinner = () => (
  <div className="loading-spinner">Loading packages...</div>
);

const ErrorMessage = ({ error, onRetry }) => (
  <div className="error-message">
    <p>Error loading packages: {error.message}</p>
    <button onClick={onRetry}>Retry</button>
  </div>
);

const Packages = () => {
  const { data: packages, isLoading, error, refetch } = usePackages();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={() => refetch()} />;
  }

  return (
    <div className="packages-page">
      <h1>Travel Packages</h1>
      <div className="packages-grid">
        {packages?.map(pkg => (
          <div key={pkg.id} className="package-card">
            <h3>{pkg.name}</h3>
            <p>{pkg.description}</p>
            <p>Duration: {pkg.duration} days</p>
            <p>Price: ${pkg.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Packages;
