import {useContext} from 'react';

import {SessionContext} from './SessionContext.js';
import {SessionProvider} from './SessionProvider.js';

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error(`useSession must be used within ${SessionProvider.name}`);
  }
  return context;
}
