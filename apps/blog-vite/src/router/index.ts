import React from 'react';

const Router = React.lazy(async () => {
  const {Router} = await import('./router.js');
  return {default: Router};
});

export {Router};
