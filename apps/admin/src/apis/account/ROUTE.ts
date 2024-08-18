import {AUTH_SERVER_URL} from '@/config/ServerUrl';

export const LOGIN = new URL('login', AUTH_SERVER_URL);
export const LOGOUT = new URL('logout', AUTH_SERVER_URL);
export const CHECK_SESSION = new URL('checkSession', AUTH_SERVER_URL);
