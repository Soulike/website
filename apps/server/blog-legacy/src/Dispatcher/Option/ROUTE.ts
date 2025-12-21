function prefix(url: string): string {
  return `/option${url}`;
}

export const GET_ABOUT = prefix('/getAbout');
