import React from 'react';

export const RootLayout = React.lazy(async () => {
  const {RootLayout} = await import('./container');
  return {default: RootLayout};
});
