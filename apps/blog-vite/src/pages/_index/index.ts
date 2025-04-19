import React from 'react';

export const Index = React.lazy(async () => {
  const {Index} = await import('./container');
  return {default: Index};
});
