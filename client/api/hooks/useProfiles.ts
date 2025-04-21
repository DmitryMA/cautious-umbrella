import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { GetAllProfiles } from '../api';
import { api } from '../apiProduction';

type UseProfilesProps = Partial<{
  initHobbies: number[];
  initNationalities: string;
  initPrefix: string;
  initSize?: number;
}>;

export default function useProfiles(init?: UseProfilesProps) {
  const [hobbies, setHobbies] = useState(init?.initHobbies || []);
  const [nationality, setNationalities] = useState(init?.initNationalities || undefined);
  const [size, setPageSize] = useState(init?.initSize || 20);
  const [prefix, setPrefix] = useState(init?.initPrefix || '');

  const filter = useMemo(() => {
    const parts: string[] = [];
    if (hobbies?.length) parts.push(`hobbies:${hobbies.join(',')}`);
    if (nationality) parts.push(`nationalities:${nationality}`);
    return parts.join(';');
  }, [hobbies, nationality]);

  const queryKey = ['profiles', { filter, prefix, size }] as const;

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading, error } =
    useInfiniteQuery<GetAllProfiles>({
      queryKey,
      queryFn: ({ pageParam = '' }) => {
        return api.getAllProfiles({ prefix, filter, size, cursor: (pageParam as string) || '' });
      },
      getNextPageParam: lastPage => lastPage.pagination.next_cursor,
      initialPageParam: undefined,
    });

  return {
    pages: data?.pages,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    setHobbies,
    setNationalities,
    setPageSize,
    setPrefix,
    searchPrefix: prefix,
    filteredHobbies: hobbies,
    filteredNationalities: nationality,
  };
}
