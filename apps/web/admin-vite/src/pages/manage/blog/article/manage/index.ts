import React from 'react';

export const Manage = React.lazy(async () => {
  const {Manage} = await import('./view.js');
  return {default: Manage};
});
