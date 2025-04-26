import { useEffect, useState } from 'react';
import React from 'react';

import useDebounce from '../hooks/useDebounce';
import { useFiltersFromQuery } from '../hooks/useFiltersFromQuery';
import { useStableFn } from '../hooks/useStableFn';

type Props = {
  setPrefix: (term: string) => void;
};

function SearchBox({ setPrefix }: Props) {
  const { prefix: initPrefix, updateFilters } = useFiltersFromQuery();

  const [term, setTerm] = useState<string>(initPrefix ?? '');
  const debouncedTerm = useDebounce<string>(term, 50);

  useEffect(() => {
    setPrefix(debouncedTerm);
  }, [debouncedTerm, setPrefix]);

  const handleKeyDown = useStableFn((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') setPrefix(term);
  });

  const handleReset = useStableFn(() => {
    updateFilters({ prefix: '' });
    setTerm('');
    setPrefix('');
  });

  const isSearching = term.trim().length > 0;

  return (
    <div className='w-full py-2'>
      <input
        tabIndex={1}
        type='text'
        value={term}
        onChange={e => {
          const nextPrefix = e.target.value;
          updateFilters({ prefix: nextPrefix });
          setTerm(nextPrefix);
        }}
        placeholder='Start typing Name or Surname, at least 3 letters'
        className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500'
        onKeyDown={handleKeyDown}
      />

      <div className='min-h-[40px] text-sm text-gray-600 flex items-center justify-between px-1 pt-[8px]'>
        {isSearching ? (
          <>
            <span>Search is active. Filters are temporarily disabled.</span>
            <button
              onClick={handleReset}
              className='text-blue-500 underline hover:text-blue-700 text-sm cursor-pointer'
            >
              Reset Search back to Filter Search
            </button>
          </>
        ) : (
          <span className='text-gray-400'>Start typing to activate search...</span>
        )}
      </div>
    </div>
  );
}

export default React.memo(SearchBox);
