import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Container,
  Typography,
  TextField,
  Box,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDestinations } from '../hooks/useDestinations';
import { SearchInput } from '../components/SearchInput';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { DestinationCard } from '../components/DestinationCard';
import Header from '../components/common/Header';
import DestinationList from '../components/destinations/DestinationList';
import FilterPanel from '../components/search/FilterPanel';
import { destinations } from '../utils/mockData';
import './DestinationsPage.css';

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  padding: '4rem 0',
  textAlign: 'center',
  marginBottom: '2rem'
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  maxWidth: '600px',
  margin: '2rem auto 0',
  padding: '0 1rem'
}));

const ContentContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  gap: '2rem',
  alignItems: 'flex-start'
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1
}));

const SortContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: '1rem'
}));

const DestinationsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    regions: [],
    activities: [],
    duration: ''
  });
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  
  const { 
    destinations: apiDestinations, 
    loading, 
    error, 
    refetch 
  } = useDestinations();

  useEffect(() => {
    const dataSource = apiDestinations || destinations;
    
    let filtered = dataSource.filter(dest =>
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dest.description && dest.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Apply additional search query filter
    if (searchQuery) {
      filtered = filtered.filter(destination =>
        destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (destination.description && destination.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.regions.length > 0) {
      filtered = filtered.filter(dest => filters.regions.includes(dest.region));
    }
    if (filters.activities.length > 0) {
      filtered = filtered.filter(dest =>
        filters.activities.some(activity => dest.activities && dest.activities.includes(activity))
      );
    }
    if (filters.duration) {
      filtered = filtered.filter(dest => dest.duration === filters.duration);
    }
    filtered = filtered.filter(dest =>
      (dest.startingPrice || dest.price || 0) >= filters.priceRange[0] &&
      (dest.startingPrice || dest.price || 0) <= filters.priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.startingPrice || a.price || 0) - (b.startingPrice || b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.startingPrice || b.price || 0) - (a.startingPrice || a.price || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'popular':
      default:
        filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
        break;
    }

    setFilteredDestinations(filtered);
  }, [searchTerm, searchQuery, sortBy, filters, apiDestinations]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleRetry = () => {
    refetch();
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="destinations-page">
          <div className="destinations-header">
            <h1>Destinations</h1>
          </div>
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="destinations-page">
          <div className="destinations-header">
            <h1>Destinations</h1>
          </div>
          <ErrorMessage 
            message="Failed to load destinations. Please try again."
            onRetry={handleRetry}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      {/* Hero Section */}
      <HeroSection>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Discover Amazing Destinations
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Explore breathtaking places around the world
          </Typography>

          <SearchContainer>
            <TextField
              fullWidth
              placeholder="Search destinations, countries, or activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                borderRadius: 1
              }}
            />
          </SearchContainer>
          
          <div className="destinations-search">
            <SearchInput
              placeholder="Search destinations, countries, or activities..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </Container>
      </HeroSection>

      <div className="destinations-stats">
        <span className="destinations-count">
          {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} found
        </span>
      </div>

      <ContentContainer>
        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />

        <MainContent>
          <SortContainer>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="popular">Popular</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="newest">Newest</MenuItem>
              </Select>
            </FormControl>
          </SortContainer>

          {filteredDestinations.length === 0 ? (
            <div className="no-destinations">
              <h3>No destinations found</h3>
              <p>Try adjusting your search criteria or browse all available destinations.</p>
              {(searchQuery || searchTerm) && (
                <button 
                  className="clear-search-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchTerm('');
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              <DestinationList destinations={filteredDestinations} />
              <div className="destinations-grid">
                {filteredDestinations.map(destination => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                  />
                ))}
              </div>
            </>
          )}
        </MainContent>
      </ContentContainer>
    </>
  );
};

export default DestinationsPage;
export { DestinationsPage };
