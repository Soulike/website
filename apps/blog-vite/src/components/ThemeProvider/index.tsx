import React from 'react';

export const ThemeProvider = React.lazy(async () => {
  const {ThemeProvider} = await import('./ThemeProvider.js');
  return {default: ThemeProvider};
});
