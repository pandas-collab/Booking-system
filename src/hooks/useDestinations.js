import { useQuery } from '@tanstack/react-query';
import { destinationsAPI } from '../services/api';

export const useDestinations = () => {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: destinationsAPI.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDestination = (id) => {
  return useQuery({
    queryKey: ['destinations', id],
    queryFn: () => destinationsAPI.getById(id),
    enabled: !!id,
  });
};
