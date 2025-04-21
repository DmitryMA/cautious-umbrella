import { Hobbies, Nationalities, Profiles } from './types';

export type GetAllProfiles = {
  pagination: { size: number; next_cursor: string };
  results: Profiles;
};

export type GetHobbies = {
  results: Hobbies;
};

export type GetNationalities = {
  results: Nationalities;
};

export type GetAllProfilesProps = {
  cursor: string;
  prefix: string;
  filter: string;
  size: number;
};

type ProfilesApi = {
  /**
   * @return profiles
   */
  getAllProfiles: (props: GetAllProfilesProps) => Promise<GetAllProfiles>;

  /**
   * @return hobbies for Side List filter
   */
  getHobbies: () => Promise<GetHobbies>;

  /**
   * @return nationalities for Side List filter
   */
  getNationalities: () => Promise<GetNationalities>;
};

export type ProfilesApiCreator = () => ProfilesApi;
