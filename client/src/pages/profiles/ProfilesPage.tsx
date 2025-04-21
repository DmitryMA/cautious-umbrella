import { useMemo } from 'react';

import useProfiles from '../../../api/hooks/useProfiles';
import { Hobbies, Nationalities } from '../../../api/types';

import Filter from './components/Filter';
import ProfileList from './components/ProfileList';
import ProfileListLoader from './components/ProfileListLoader';
import SearchBox from './components/SearchBox';
import { useFiltersFromQuery } from './hooks/useFiltersFromQuery';

type Props = {
  countries: Nationalities;
  hobbies: Hobbies;
  isFilterLoading: boolean;
};

function ProfilesPage({ countries, hobbies, isFilterLoading }: Props) {
  const {
    prefix: initPrefix,
    hobbies: initHobbies,
    nationality: initNationalities,
  } = useFiltersFromQuery();

  const {
    setPrefix,
    pages,
    isLoading: loadingProfiles,
    setHobbies,
    setNationalities,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProfiles({
    initHobbies,
    initNationalities,
    initPrefix,
  });

  const profiles = useMemo(
    () => (pages?.length ? pages.flatMap(page => page.results) : []),
    [pages],
  );

  const nothingIsFound =
    !profiles.length && !isFilterLoading ? (
      <div className='text-center my-10'>Nothing is found</div>
    ) : null;

  return (
    <div className='min-h-screen flex flex-col w-full'>
      <header className='h-auto bg-white shadow-sm flex items-center px-4 w-full pt-[10px]'>
        <SearchBox setPrefix={setPrefix} />
      </header>
      <div className='flex flex-col md:flex-row w-full'>
        <aside className='w-full md:w-64 p-4 flex-shrink-0'>
          <Filter
            isLoading={isFilterLoading}
            setNationalities={setNationalities}
            setHobbies={setHobbies}
            countries={countries}
            hobbies={hobbies}
          />
        </aside>
        <main className='w-full flex-1 p-4 overflow-y-auto'>
          {nothingIsFound}
          {isFilterLoading ? (
            <ProfileListLoader />
          ) : (
            <ProfileList
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isLoading={loadingProfiles}
              profiles={profiles || []}
              hobbies={hobbies}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default ProfilesPage;
