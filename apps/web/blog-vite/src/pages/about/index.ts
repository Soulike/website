import React from 'react';

export const About = React.lazy(async () => {
  const {About} = await import('./container');
  return {default: About};
});
