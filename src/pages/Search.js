import React, { useState } from 'react';
import { useGlobalSearch } from '../hooks/useSearch';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchMutation = useGlobalSearch();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchMutation.mutate({ query: searchQuery });
    }
  };

  return (
    <div className="search-page">
      <h1>Search Travel Options</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search destinations, packages..."
        />
        <button type="submit" disabled={searchMutation.isLoading}>
          {searchMutation.isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searchMutation.error && (
        <div className="error-message">
          <p>Search failed: {searchMutation.error.message}</p>
          <button onClick={() => searchMutation.reset()}>Clear Error</button>
        </div>
      )}

      {searchMutation.data && (
        <div className="search-results">
          <h2>Search Results</h2>
          {searchMutation.data.destinations?.length > 0 && (
            <div>
              <h3>Destinations</h3>
              {searchMutation.data.destinations.map(dest => (
                <div key={dest.id} className="result-item">
                  <h4>{dest.name}</h4>
                  <p>{dest.description}</p>
                </div>
              ))}
            </div>
          )}
          {searchMutation.data.packages?.length > 0 && (
            <div>
              <h3>Packages</h3>
              {searchMutation.data.packages.map(pkg => (
                <div key={pkg.id} className="result-item">
                  <h4>{pkg.name}</h4>
                  <p>{pkg.description}</p>
                  <p>Price: ${pkg.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
