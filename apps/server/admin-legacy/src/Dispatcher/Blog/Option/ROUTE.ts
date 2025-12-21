import {prefix as blogPrefix} from '../Function.js';

function prefix(url: string): string {
  return blogPrefix(`/option${url}`);
}

export const GET_ABOUT = prefix('/getAbout');
export const SET_ABOUT = prefix('/setAbout');
