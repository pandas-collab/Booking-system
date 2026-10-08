import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Stack,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const ITEMS_PER_PAGE = 12;

const fetchPackages = async ({ page = 1, search = '', sortBy = 'name', sortOrder = 'asc', category = '', status = '' }) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: ITEMS_PER_PAGE.toString(),
    search,
    sortBy,
    sortOrder,
    ...(category && { category }),
    ...(status && { status })
  });

  const response = await fetch(`/api/packages?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch packages');
  }
  return response.json();
};

const PackagesPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['packages', page, debouncedSearch, sortBy, sortOrder, categoryFilter, statusFilter],
    queryFn: () => fetchPackages({
      page,
      search: debouncedSearch,
      sortBy,
      sortOrder,
      category: categoryFilter,
      status: statusFilter
    }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  });

  const packages = data?.packages || [];
  const totalPages = Math.ceil((data?.total || 0) / ITEMS_PER_PAGE);
  const totalCount = data?.total || 0;

  const categories = useMemo(() => [
    'Web Framework',
    'Database',
    'Authentication',
    'Utilities',
    'UI Components',
    'Testing',
    'Build Tools',
    'Development'
  ], []);

  const statuses = useMemo(() => [
    'active',
    'deprecated',
    'beta',
    'stable'
  ], []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
    setSortBy('name');
    setSortOrder('asc');
    setPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'deprecated':
        return 'error';
      case 'beta':
        return 'warning';
      case 'stable':
        return 'primary';
      default:
        return 'default';
    }
  };

  const formatDownloads = (downloads) => {
    if (downloads >= 1000000) {
      return `${(downloads / 1000000).toFixed(1)}M`;
    }
    if (downloads >= 1000) {
      return `${(downloads / 1000).toFixed(1)}K`;
    }
    return downloads.toString();
  };

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          Error loading packages: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Package Registry
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover and manage packages in your registry
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="version">Version</MenuItem>
                <MenuItem value="downloads">Downloads</MenuItem>
                <MenuItem value="updated">Updated</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Stack direction="row" spacing={1}>
              <Tooltip title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
                <IconButton onClick={() => handleSortChange(sortBy)}>
                  <SortIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh">
                <IconButton onClick={() => refetch()} disabled={isFetching}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Grid>
        </Grid>

        {(searchTerm || categoryFilter || statusFilter) && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Active filters:
            </Typography>
            {searchTerm && (
              <Chip
                label={`Search: ${searchTerm}`}
                onDelete={() => setSearchTerm('')}
                size="small"
              />
            )}
            {categoryFilter && (
              <Chip
                label={`Category: ${categoryFilter}`}
                onDelete={() => setCategoryFilter('')}
                size="small"
              />
            )}
            {statusFilter && (
              <Chip
                label={`Status: ${statusFilter}`}
                onDelete={() => setStatusFilter('')}
                size="small"
              />
            )}
            <Button size="small" onClick={handleClearFilters}>
              Clear All
            </Button>
          </Box>
        )}
      </Paper>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {isLoading ? 'Loading...' : `${totalCount} packages found`}
        </Typography>
        {isFetching && <CircularProgress size={20} />}
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {packages.map((pkg) => (
              <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="h2" noWrap>
                        {pkg.name}
                      </Typography>
                      <Chip
                        label={pkg.status}
                        color={getStatusColor(pkg.status)}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      v{pkg.version}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 2, minHeight: 40 }}>
                      {pkg.description || 'No description available'}
                    </Typography>
                    
                    {pkg.category && (
                      <Chip
                        label={pkg.category}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDownloads(pkg.downloads || 0)} downloads
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(pkg.updatedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<InfoIcon />}
                      onClick={() => window.open(`/packages/${pkg.name}`, '_blank')}
                    >
                      Details
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => window.open(`/packages/${pkg.name}/download`, '_blank')}
                    >
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {packages.length === 0 && !isLoading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No packages found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria or filters
              </Typography>
            </Box>
          )}

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default PackagesPage;