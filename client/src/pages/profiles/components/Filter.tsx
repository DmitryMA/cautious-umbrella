import { Hobbies, Hobby, Nationalities, Nationality } from '../../../../api/types';
import { useCheckboxFilter } from '../hooks/useCheckboxFilter';

import FilterLoader from './FilterLoader';

const FILTER_ITEMS = 20;
type Props = {
  isLoading: boolean;
  countries: Nationalities;
  hobbies: Hobbies;
  setNationalities: (data?: string) => void;
  setHobbies: (data: number[]) => void;
};

const Filter = ({ isLoading, countries, hobbies, setNationalities, setHobbies }: Props) => {
  const { selectedHobbies, selectedCountry, handleSelectCountry, handleSelectHobby } =
    useCheckboxFilter({
      setNationalities,
      setHobbies,
    });

  if (!countries?.length && !hobbies?.length) return null;
  if (isLoading) return <FilterLoader />;

  return (
    <div className='space-y-6'>
      {hobbies.length && (
        <fieldset className='p-4 bg-white rounded-lg shadow' key='hobbies'>
          <legend className='text-lg font-semibold mb-3'>
            Hobbies{' '}
            {selectedHobbies.length ? (
              <>
                <button
                  onClick={() => handleSelectHobby(undefined)}
                  className='text-blue-500 underline hover:text-blue-700 text-sm ml-5 mr-1 cursor-pointer'
                >
                  Reset
                </button>
                <small>[+{selectedHobbies.length}]</small>{' '}
              </>
            ) : (
              ''
            )}
          </legend>
          <div className='space-y-2 max-h-64 overflow-y-auto'>
            {hobbies.slice(0, FILTER_ITEMS).map((item: Hobby) => (
              <label key={item.id} className='flex items-center cursor-pointer'>
                <input
                  type='checkbox'
                  className='h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500'
                  value={item.id}
                  checked={selectedHobbies.includes(item.id)}
                  onChange={() => handleSelectHobby(item.id)}
                />
                <span className='ml-2 text-gray-700'>{item.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {countries.length && (
        <fieldset className='p-4 bg-white rounded-lg shadow'>
          <legend className='flex items-center justify-between text-lg font-semibold mb-3'>
            Nationality
            {selectedCountry ? (
              <>
                <button
                  onClick={() => handleSelectCountry(undefined)}
                  className='text-blue-500 underline hover:text-blue-700 text-sm ml-5 mr-1 cursor-pointer'
                >
                  Reset
                </button>
                <small>[{selectedCountry}]</small>{' '}
              </>
            ) : (
              ''
            )}
          </legend>

          <div className='space-y-2 max-h-64 overflow-y-auto'>
            {countries.slice(0, FILTER_ITEMS).map((item: Nationality) => (
              <label key={item.id} className='flex items-center cursor-pointer'>
                <input
                  checked={item.countryCode === selectedCountry}
                  type='radio'
                  name='country'
                  className='h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500'
                  onChange={() => handleSelectCountry(item.countryCode)}
                />
                <span className='ml-2 text-gray-700'>{item.country}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
};

export default Filter;
