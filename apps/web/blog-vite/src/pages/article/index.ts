import React from 'react';

export const Article = React.lazy(async () => {
  const {Article} = await import('./container');
  return {default: Article};
});
