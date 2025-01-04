import React from 'react';

export const Login = React.lazy(async () => {
  const {Login} = await import('./container.tsx');
  return {default: Login};
});
