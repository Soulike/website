import React from 'react';

export const Modify = React.lazy(async () => {
  const {Modify} = await import('./container.js');
  return {default: Modify};
});
