import React from 'react';

const Router = React.lazy(async () => {
  const {Router} = await import('@/router/router.tsx');
  return {default: Router};
});

export {Router};
