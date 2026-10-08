import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { packagesAPI } from '../services/api';

export const usePackages = () => {
  return useQuery({
    queryKey: ['packages'],
    queryFn: packagesAPI.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePackage = (id) => {
  return useQuery({
    queryKey: ['packages', id],
    queryFn: () => packagesAPI.getById(id),
    enabled: !!id,
  });
};

export const usePackageSearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: packagesAPI.search,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['packages', 'search', variables], data);
    },
  });
};
