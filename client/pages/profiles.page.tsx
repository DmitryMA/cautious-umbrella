import usePrefetchCountries from '../api/hooks/usePrefetchCountries';
import usePrefetchHobbies from '../api/hooks/usePrefetchHobbies';
import Profiles from '../src/pages/profiles/ProfilesPage';

function ProfilesPage() {
  const { countries, isLoading: loadingCountries } = usePrefetchCountries();
  const { hobbies, isLoading: loadingHobbies } = usePrefetchHobbies();

  return (
    <>
      <h1 className='h-[30px] flex items-center justify-center text-center'>Task 1</h1>
      <Profiles
        countries={countries?.results || []}
        hobbies={hobbies?.results || []}
        isFilterLoading={loadingCountries || loadingHobbies}
      />
    </>
  );
}

export default ProfilesPage;
