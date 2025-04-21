import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

type FilterProps = Partial<{
  prefix: string;
  hobbies: number[];
  nationality: string;
}>;

type UseFiltersFromQuery = FilterProps & {
  updateFilters: (data: FilterProps) => void;
};

export function useFiltersFromQuery(): UseFiltersFromQuery {
  const [searchParams, setSearchParams] = useSearchParams();

  const prefix = searchParams.get('prefix') || '';
  const filterRaw = searchParams.get('filter') || '';

  const { hobbies, nationality } = useMemo(() => {
    const result: { hobbies: number[]; nationality?: string } = {
      hobbies: [],
      nationality: undefined,
    };

    const rules = filterRaw
      .split(';')
      .map(r => r.trim())
      .filter(Boolean);

    for (const rule of rules) {
      const [key, csv] = rule.split(':', 2);
      if (!key || !csv) continue;

      const values = csv
        .split(',')
        .map(v => v.trim())
        .filter(Boolean);

      if (key === 'hobbies') {
        result.hobbies = values.map(v => parseInt(v)).filter(v => !isNaN(v));
      } else if (key === 'nationalities') {
        result.nationality = values[0];
      }
    }

    return result;
  }, [filterRaw]);

  const updateFilters = ({ prefix, hobbies, nationality }: FilterProps) => {
    const currentParams = new URLSearchParams(searchParams);

    if (prefix) {
      currentParams.set('prefix', prefix);
    } else {
      currentParams.delete('prefix');
    }

    const parts: string[] = [];
    if (hobbies && hobbies.length) parts.push(`hobbies:${hobbies.join(',')}`);
    if (nationality) parts.push(`nationalities:${nationality}`);

    if (parts.length > 0) {
      currentParams.set('filter', parts.join(';'));
    } else {
      currentParams.delete('filter');
    }

    currentParams.delete('cursor');
    currentParams.delete('page');

    setSearchParams(currentParams);
  };

  return {
    prefix,
    hobbies,
    nationality,
    updateFilters,
  };
}
