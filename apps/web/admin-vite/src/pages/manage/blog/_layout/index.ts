import React from 'react';

export const Layout = React.lazy(async () => {
  const {Layout} = await import('./container.js');
  return {default: Layout};
});
