import React from 'react';

export const ArticlePreviewModal = React.lazy(async () => {
  const {ArticlePreviewModal} = await import('./view.js');
  return {default: ArticlePreviewModal};
});
