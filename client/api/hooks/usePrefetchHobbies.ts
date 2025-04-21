import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { api } from '../apiProduction';
import { Hobbies } from '../types';

export default function usePrefetchHobbies() {
  const {
    data: hobbies,
    isLoading,
    error,
  } = useQuery<{ results: Hobbies }>({
    queryKey: ['hobbies'],
    queryFn: () => api.getHobbies(),
    meta: {
      errorTitle: 'Failed to load hobbies',
    },
  });

  return useMemo(
    () => ({
      hobbies,
      isLoading,
      error,
    }),
    [error, hobbies, isLoading],
  );
}
