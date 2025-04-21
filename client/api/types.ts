export type Profiles = Profile[];
export type Profile = {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  country: string;
  nationality: string;
  hobbies: number[];
  created_time: number;
};

export type Hobbies = Hobby[];
export type Hobby = {
  id: number;
  name: string;
};

export type Nationalities = Nationality[];
export type Nationality = {
  id: number;
  countryCode: string;
  country: string;
};
