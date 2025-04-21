const { faker } = require('@faker-js/faker');
const { Trie } = require('./trie');


/**
 * @typedef {Object} Hobby
 * @property {number} id       — Unique numeric identifier of the hobby.
 * @property {string} name     — Name of the hobby.
 */

/** @type {string[]} HOBBY_LIST — Sorted list of hobby names. */
const HOBBY_LIST = [
  'Reading', 'Traveling', 'Cooking', 'Gardening', 'Fishing',
  'Music', 'Photography', 'Crafts', 'Writing', 'Exercise',
  'Knitting', 'Dancing', 'Video games', 'Running', 'Sports',
  'Painting', 'Yoga', 'Shopping', 'Gaming', 'Drawing'
].sort();

/** @type {Hobby[]} HOBBIES — Array of Hobby objects. */
const HOBBIES = HOBBY_LIST.map((name, idx) => ({
    id: idx,
    name
}));


/**
 * @typedef {Map<number, Set<string>>} HobbyProfiles
 * Map from Hobby.id to a Set of Profile.id (UUID).
 */
/** @type {HobbyProfiles} HOBBIES_PROFILES — Hobby-to-profiles index. */
const HOBBIES_PROFILES = new Map();
function populateHobbiesProfiles(hobbies, profileIdx) {
  for (const hobbyIdx of hobbies) {
    const hobbyData = HOBBIES_PROFILES.get(hobbyIdx);

    if (hobbyData) {
      hobbyData.add(profileIdx);
      continue;
    }

    HOBBIES_PROFILES.set(hobbyIdx, new Set([profileIdx]));
  }
}

/**
 * @typedef {Object} Country
 * @property {number} id            — Unique numeric identifier of the country.
 * @property {string} countryCode  — ISO-style country code (e.g., “US”).
 * @property {string} country      — Full country name.
 */

/** @type {Country[]} COUNTRIES — Array of Country objects. */
const COUNTRIES = [];
const track = new Set(); 

function populateCountries(countryCode, country) {
  if (track.has(countryCode)) return;
  track.add(countryCode);

  COUNTRIES.push({
    id: COUNTRIES.length,
    countryCode,
    country,
  })
}

/**
 * @typedef {Map<string, Set<string>>} CountriesProfiles
 * Map from Country.countryCode to a Set of Profile.id (UUID).
 */
/** @type {CountriesProfiles} COUNTRIES_PROFILES — Country-to-profiles index. */
const COUNTRIES_PROFILES = new Map();
function populateCountriesProfiles(countryCode, profileIdx) {
  const countryProfileData = COUNTRIES_PROFILES.get(countryCode);
  if (countryProfileData) {
      countryProfileData.add(profileIdx);
  }
  if (!countryProfileData) {
      COUNTRIES_PROFILES.set(countryCode, new Set([profileIdx]));
  }
}

function sampleUnique(array, count) {
  const copy = array.slice();
  for (let idx = copy.length - 1; idx > 0; idx--) {
    const jdx = Math.floor(Math.random() * (idx + 1));
    [copy[idx], copy[jdx]] = [copy[jdx], copy[idx]];
  }
  return copy.slice(0, count);
}


/**
 * @typedef {Object} Profile
 * @property {string}   id           — UUID of the profile.
 * @property {string}   avatar       — URL to avatar image.
 * @property {string}   first_name   — Person’s given name.
 * @property {string}   last_name    — Person’s family name.
 * @property {number}   age          — Age in years.
 * @property {string}   nationality  — ISO country code.
 * @property {string}   country      — Full country name.
 * @property {number[]} hobbies      — Array of Hobby.id values.
 * @property {number}   created_time — UNIX timestamp in milliseconds.
 */
/** @type {Map<string, Profile>} PROFILES — Map of Profile.id to Profile. */
/** @type {Profile[]} DATA — Array of all generated Profile objects. */
const PROFILES = new Map();
function populateProfiles(profile) {
  PROFILES.set(profile.id, profile);
}

function createRandomProfile() {
  const nationality = faker.location.countryCode();
  const hobbyCount = Math.floor(Math.random() * 10);
  const hobbies = sampleUnique(HOBBIES, hobbyCount).map(({ id }) => id);
  const country = faker.location.country();
  
  const newProfile = {
    id: faker.string.uuid(),
    avatar: faker.image.avatar(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    age: faker.number.int({ min: 18, max: 80 }),
    country,
    nationality,
    hobbies, 
    created_time: Date.now() - faker.number.int({ max: 1000000000 })
  };
  populateProfiles(newProfile);
  populateCountries(nationality, country);
  populateCountriesProfiles(nationality, newProfile.id);
  populateHobbiesProfiles(hobbies, newProfile.id);

  return newProfile;
}

const profiles = faker.helpers.multiple(createRandomProfile, {
  count: 150,
});

track.clear();

/** @type {import('./trie').Trie<string, string>} SEARCH_TRIE — Trie mapping lowercased names to Profile.id. */
const SEARCH_TRIE = new Trie();
for (const profile of profiles) {
  SEARCH_TRIE.insert(profile.first_name.toLowerCase(), profile.id);
  SEARCH_TRIE.insert(profile.last_name.toLowerCase(), profile.id);
}

COUNTRIES.sort((a, b) => a.country.localeCompare(b.country) );

module.exports = { DATA: profiles, SEARCH_TRIE, COUNTRIES, HOBBIES, HOBBIES_PROFILES, COUNTRIES_PROFILES, PROFILES };
