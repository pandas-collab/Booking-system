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
import Header from '../components/common/Header';
import DestinationList from '../components/destinations/DestinationList';
import FilterPanel from '../components/search/FilterPanel';
import { destinations } from '../utils/mockData';

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
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    regions: [],
    activities: [],
    duration: ''
  });
  const [filteredDestinations, setFilteredDestinations] = useState(destinations);

  useEffect(() => {
    let filtered = destinations.filter(dest =>
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply filters
    if (filters.regions.length > 0) {
      filtered = filtered.filter(dest => filters.regions.includes(dest.region));
    }
    if (filters.activities.length > 0) {
      filtered = filtered.filter(dest =>
        filters.activities.some(activity => dest.activities.includes(activity))
      );
    }
    if (filters.duration) {
      filtered = filtered.filter(dest => dest.duration === filters.duration);
    }
    filtered = filtered.filter(dest =>
      dest.startingPrice >= filters.priceRange[0] &&
      dest.startingPrice <= filters.priceRange[1]
    );

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.startingPrice - a.startingPrice);
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
  }, [searchTerm, sortBy, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <HeroSection>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Discover Your Next Adventure
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Explore amazing destinations around the world
          </Typography>

          <SearchContainer>
            <TextField
              fullWidth
              placeholder="Search destinations..."
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
        </Container>
      </HeroSection>

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

          <DestinationList destinations={filteredDestinations} />
        </MainContent>
      </ContentContainer>
    </>
  );
};

export default DestinationsPage;
