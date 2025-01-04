import React from 'react';

export const Layout = React.lazy(async () => {
  const {Layout} = await import('./container.tsx');
  return {default: Layout};
});
