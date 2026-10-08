import React from 'react';
import DestinationCard from '../destinations/DestinationCard';
import PackageCard from '../packages/PackageCard';

const SearchResults = ({ results, onResultClick, onViewAll }) => {
  const renderDestinations = () => {
    if (!results.destinations || results.destinations.length === 0) return null;

    const displayedDestinations = results.destinations.slice(0, 4);

    return (
      <div className="results-section">
        <div className="section-header">
          <h3>Destinations ({results.destinations.length} results)</h3>
          {results.destinations.length > 4 && (
            <button
              className="view-all-button"
              onClick={() => onViewAll('destinations')}
            >
              View All {results.destinations.length} Destinations
            </button>
          )}
        </div>

        <div className="results-grid">
          {displayedDestinations.map(destination => (
            <div
              key={destination.id}
              onClick={() => onResultClick('destination', destination.id)}
              className="result-item clickable"
            >
              <DestinationCard
                destination={{
                  ...destination,
                  image: destination.image || '/images/default-destination.jpg',
                  rating: destination.rating || 4.5,
                  location: destination.location || destination.name
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPackages = () => {
    if (!results.packages || results.packages.length === 0) return null;

    const displayedPackages = results.packages.slice(0, 4);

    return (
      <div className="results-section">
        <div className="section-header">
          <h3>Packages ({results.packages.length} results)</h3>
          {results.packages.length > 4 && (
            <button
              className="view-all-button"
              onClick={() => onViewAll('packages')}
            >
              View All {results.packages.length} Packages
            </button>
          )}
        </div>

        <div className="results-grid">
          {displayedPackages.map(pkg => (
            <div
              key={pkg.id}
              onClick={() => onResultClick('package', pkg.id)}
              className="result-item clickable"
            >
              <PackageCard
                package={{
                  ...pkg,
                  duration: pkg.duration || '7 days',
                  price: pkg.price || 1299,
                  image: pkg.image || '/images/default-package.jpg',
                  location: pkg.location || pkg.destination
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderActivities = () => {
    if (!results.activities || results.activities.length === 0) return null;

    const displayedActivities = results.activities.slice(0, 4);

    return (
      <div className="results-section">
        <div className="section-header">
          <h3>Activities ({results.activities.length} results)</h3>
          {results.activities.length > 4 && (
            <button
              className="view-all-button"
              onClick={() => onViewAll('activities')}
            >
              View All {results.activities.length} Activities
            </button>
          )}
        </div>

        <div className="results-grid">
          {displayedActivities.map(activity => (
            <div
              key={activity.id}
              onClick={() => onResultClick('activity', activity.id)}
              className="result-item clickable"
            >
              <div className="activity-card">
                <img
                  src={activity.image || '/images/default-activity.jpg'}
                  alt={activity.name}
                  className="activity-image"
                />
                <div className="activity-content">
                  <h4>{activity.name}</h4>
                  <p className="activity-location">{activity.location}</p>
                  <div className="activity-pricing">
                    <span className="price-range">
                      ${activity.priceFrom || 50} - ${activity.priceTo || 200}
                    </span>
                    <span className="rating"> {activity.rating || 4.2}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="search-results">
      {renderDestinations()}
      {renderPackages()}
      {renderActivities()}

      {(!results.destinations?.length && !results.packages?.length && !results.activities?.length) && (
        <div className="no-results">
          <h3>No results found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
