import React from 'react';

export const Manage = React.lazy(async () => {
  const {Manage} = await import('./container.js');
  return {default: Manage};
});
