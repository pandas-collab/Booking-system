import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/search/SearchBar';
import SearchResults from '../components/search/SearchResults';
import UniversalFilters from '../components/search/UniversalFilters';
import Breadcrumb from '../components/common/Breadcrumb';
import { searchResults, searchSuggestions, searchHistory } from '../utils/mockData';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState('All');
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [0, 10000],
    dateRange: { start: null, end: null },
    duration: [],
    rating: 0
  });
  const [results, setResults] = useState(searchResults);

  const searchTabs = ['All', 'Destinations', 'Packages', 'Activities'];

  useEffect(() => {
    // Filter results based on query and active tab
    let filteredResults = { ...searchResults };

    if (activeTab !== 'All') {
      const tabKey = activeTab.toLowerCase();
      filteredResults = {
        destinations: tabKey === 'destinations' ? searchResults.destinations : [],
        packages: tabKey === 'packages' ? searchResults.packages : [],
        activities: tabKey === 'activities' ? searchResults.activities : []
      };
    }

    setResults(filteredResults);
  }, [query, activeTab, filters]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleResultClick = (type, id) => {
    // Navigate to detail pages
    if (type === 'destination') {
      navigate(`/destinations/${id}`);
    } else if (type === 'package') {
      navigate(`/packages/${id}`);
    } else if (type === 'activity') {
      navigate(`/activities/${id}`);
    }
  };

  const handleViewAll = (category) => {
    // Navigate to filtered category pages
    navigate(`/${category}?q=${encodeURIComponent(query)}`);
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Search Results', path: `/search?q=${query}` }
  ];

  return (
    <div className="search-page">
      <Breadcrumb items={breadcrumbItems} />

      <div className="search-header">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          suggestions={searchSuggestions}
          history={searchHistory}
        />

        <div className="search-tabs">
          {searchTabs.map(tab => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="search-content">
        <div className="filters-sidebar">
          <UniversalFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        <div className="search-results-container">
          <SearchResults
            results={results}
            onResultClick={handleResultClick}
            onViewAll={handleViewAll}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
