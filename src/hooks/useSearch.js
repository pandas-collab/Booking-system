import { useMutation, useQueryClient } from '@tanstack/react-query';
import { searchAPI } from '../services/api';

export const useGlobalSearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: searchAPI.searchAll,
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['search', variables.query], data);
    },
  });
};
