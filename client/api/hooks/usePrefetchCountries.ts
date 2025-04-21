import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { api } from '../apiProduction';
import { Nationalities } from '../types';

export default function usePrefetchCountries() {
  const {
    data: countries,
    isLoading,
    error,
  } = useQuery<{ results: Nationalities }>({
    queryKey: ['countries'],
    queryFn: () => api.getNationalities(),
    meta: {
      errorTitle: 'Failed to load countries',
    },
  });

  return useMemo(() => ({ countries, isLoading, error }), [countries, error, isLoading]);
}
