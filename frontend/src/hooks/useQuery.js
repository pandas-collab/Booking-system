import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

// Default query options
const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  refetchOnWindowFocus: false,
};

// Generic fetch function
const fetchData = async (endpoint, params = {}) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    error.status = response.status;
    error.data = await response.json().catch(() => ({}));
    throw error;
  }

  return response.json();
};

// Destinations hook
export const useDestinations = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['destinations', filters],
    queryFn: () => fetchData('/destinations', filters),
    ...defaultQueryOptions,
    ...options,
  });
};

// Packages hook
export const usePackages = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['packages', filters],
    queryFn: () => fetchData('/packages', filters),
    ...defaultQueryOptions,
    ...options,
  });
};

// Flights hook
export const useFlights = (searchParams = {}, options = {}) => {
  const enabled = Boolean(
    searchParams.origin && 
    searchParams.destination && 
    searchParams.departureDate
  );

  return useQuery({
    queryKey: ['flights', searchParams],
    queryFn: () => fetchData('/flights/search', searchParams),
    ...defaultQueryOptions,
    enabled: enabled && options.enabled !== false,
    ...options,
  });
};

// Hotels hook
export const useHotels = (searchParams = {}, options = {}) => {
  const enabled = Boolean(
    searchParams.destination && 
    searchParams.checkIn && 
    searchParams.checkOut
  );

  return useQuery({
    queryKey: ['hotels', searchParams],
    queryFn: () => fetchData('/hotels/search', searchParams),
    ...defaultQueryOptions,
    enabled: enabled && options.enabled !== false,
    ...options,
  });
};

// Activities hook
export const useActivities = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['activities', filters],
    queryFn: () => fetchData('/activities', filters),
    ...defaultQueryOptions,
    ...options,
  });
};