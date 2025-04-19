import React from 'react';

export const ArticleList = React.lazy(async () => {
  const {ArticleList} = await import('./container');
  return {default: ArticleList};
});
