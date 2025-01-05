import React from 'react';

export const ArticleEditor = React.lazy(async () => {
  const {ArticleEditor} = await import('./view.js');
  return {default: ArticleEditor};
});
