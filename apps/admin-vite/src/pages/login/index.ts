import React from 'react';

export const Login = React.lazy(async () => {
  const {Login} = await import('./container.js');
  return {default: Login};
});
