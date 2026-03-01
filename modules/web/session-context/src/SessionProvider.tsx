import {
  createSession as createSessionApi,
  CreateSessionResult,
  deleteSession as deleteSessionApi,
  getSession,
} from '@module/session-sdk';
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {SessionContext} from './SessionContext.js';

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({children}: SessionProviderProps) {
  const [session, setSession] =
    useState<Awaited<ReturnType<typeof getSession>>>(null);
  const [sessionError, setSessionError] = useState<Error | null>(null);
  const [isLoadingSessionOnMount, setIsLoadingSessionOnMount] = useState(false);

  const lastReloadSessionIdRef = useRef(0);

  const reloadSession = useCallback(async () => {
    lastReloadSessionIdRef.current++;
    const reloadSessionId = lastReloadSessionIdRef.current;
    try {
      const session = await getSession();
      if (reloadSessionId !== lastReloadSessionIdRef.current) {
        // Outdated. Abandon.
        return;
      }
      setSession(session);
      setSessionError(null);
    } catch (e: unknown) {
      if (reloadSessionId !== lastReloadSessionIdRef.current) {
        // Outdated. Abandon.
        return;
      }
      if (e instanceof Error) {
        setSessionError(e);
      } else {
        setSessionError(new Error(String(e)));
      }
    }
  }, []);

  // Load session on mounted.
  useEffect(() => {
    setIsLoadingSessionOnMount(true);
    void reloadSession().finally(() => {
      setIsLoadingSessionOnMount(false);
    });
  }, [reloadSession]);

  const wrappedCreateSession = useCallback(
    async (...args: Parameters<typeof createSessionApi>) => {
      const result = await createSessionApi(...args);
      if (result === CreateSessionResult.SUCCESS) {
        await reloadSession();
      }
      return result;
    },
    [reloadSession],
  );

  const wrappedDeleteSession = useCallback(
    async (...args: Parameters<typeof deleteSessionApi>) => {
      await deleteSessionApi(...args);
      setSession(null);
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      session,
      sessionError,
      isLoadingSession: isLoadingSessionOnMount,
      reloadSession,
      createSession: wrappedCreateSession,
      deleteSession: wrappedDeleteSession,
    }),
    [
      isLoadingSessionOnMount,
      reloadSession,
      session,
      sessionError,
      wrappedCreateSession,
      wrappedDeleteSession,
    ],
  );

  return (
    <SessionContext value={contextValue}>
      {children}
    </SessionContext>
  );
}
