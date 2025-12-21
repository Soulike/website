import axios from 'axios';

import {DATABASE} from '../CONFIG/index.js';

export const axiosInstance = axios.create({
  responseType: 'json',
  auth: {
    username: DATABASE.USERNAME,
    password: DATABASE.PASSWORD,
  },
});
