import config from '../src/config';

import { ProfilesApiCreator } from './api';
import { Method, request } from './Http';

const BASE_API_PATH = config.apiBaseUrl;

const ProfilesProductionApiCreator: ProfilesApiCreator = () => ({
  getAllProfiles({ cursor, prefix, filter, size }) {
    const url = new URL(`${BASE_API_PATH}/profiles`);
    const params = url.searchParams;

    if (prefix) params.append('prefix', prefix);
    if (!prefix && filter) params.append('filter', filter);

    if (size !== undefined) params.append('size', String(size));
    if (cursor) params.append('cursor', String(cursor));

    return request({
      method: Method.Get,
      url: url.toString(),
    });
  },

  getHobbies() {
    return request({
      method: Method.Get,
      url: `${BASE_API_PATH}/prefetch-filter/hobbies`,
    });
  },

  getNationalities() {
    return request({
      method: Method.Get,
      url: `${BASE_API_PATH}/prefetch-filter/nationality`,
    });
  },
});

export const api = ProfilesProductionApiCreator();

export default ProfilesProductionApiCreator;
