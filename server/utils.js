const { PROFILES } = require('./data');

function getProfilesMatchesAllHobbies(profilesIdx, hobbies) {
    const res = new Set();
    
    for (const pIdx of profilesIdx) {
        const { hobbies: profilesHobbies } = PROFILES.get(pIdx);
        const isOk = hobbies.every(h => profilesHobbies.includes(Number(h)));

        if (isOk) {
            res.add(pIdx);
        }
    }

    return res;
}

function getProfilesMatchesAllCountries(profilesIdx, countriesCodes, filteredByHobbiesIds) {
    const res = new Set();
    
    for (const pIdx of profilesIdx) {
        const { nationality } = PROFILES.get(pIdx);
        const isOk = countriesCodes.every(code => code.includes(nationality));

        if (isOk) {
            res.add(pIdx);
        }
    }

    if (!res.size || !filteredByHobbiesIds?.size) return res;

    const result = new Set();
    for (const resProfileIdx of res) {
        if (!filteredByHobbiesIds.has(resProfileIdx)) continue;
        result.add(resProfileIdx);
    }

    return result;
}

module.exports = { getProfilesMatchesAllHobbies, getProfilesMatchesAllCountries };