import { useEffect, useState } from 'react';

import { useFiltersFromQuery } from './useFiltersFromQuery';
import { useStableFn } from './useStableFn';

type UseCheckboxFilter = {
  setNationalities: (data?: string) => void;
  setHobbies: (data: number[]) => void;
};

export function useCheckboxFilter({ setNationalities, setHobbies }: UseCheckboxFilter) {
  const {
    hobbies: initHobbies,
    nationality: initNationality,
    updateFilters,
  } = useFiltersFromQuery();

  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(initNationality);
  const [selectedHobbies, setSelectedHobby] = useState<number[]>(initHobbies ?? []);

  useEffect(() => {
    setNationalities(selectedCountry);
    setHobbies(selectedHobbies);
  }, [selectedCountry, selectedHobbies, setHobbies, setNationalities, updateFilters]);

  const handleSelectCountry = useStableFn((code?: string) => {
    setSelectedCountry(code);
    updateFilters({ nationality: code, hobbies: selectedHobbies });
  });

  const handleSelectHobby = useStableFn((id?: number) => {
    let nextHobbies: number[];
    if (id === undefined) {
      nextHobbies = [];
    } else {
      nextHobbies = selectedHobbies.includes(id)
        ? selectedHobbies.filter(itemId => itemId !== id)
        : [...selectedHobbies, id];
    }

    setSelectedHobby(nextHobbies);
    updateFilters({ hobbies: nextHobbies, nationality: selectedCountry });
  });

  return {
    selectedCountry,
    selectedHobbies,
    handleSelectCountry,
    handleSelectHobby,
  };
}
