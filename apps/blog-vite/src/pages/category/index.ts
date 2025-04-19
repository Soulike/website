import React from 'react';

export const Category = React.lazy(async () => {
  const {Category} = await import('./container');
  return {default: Category};
});
