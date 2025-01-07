import React from 'react';

export const Add = React.lazy(async () => {
  const {Add} = await import('./container.js');
  return {default: Add};
});
