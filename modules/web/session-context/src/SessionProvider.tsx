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
  const [userInfo, setUserInfo] =
    useState<Awaited<ReturnType<typeof getSession>>>(null);
  const [isLoadingUserInfoOnMount, setIsLoadingUserInfoOnMount] =
    useState(false);

  const lastReloadSessionIdRef = useRef(0);

  const reloadSession = useCallback(async () => {
    lastReloadSessionIdRef.current++;
    const reloadSessionId = lastReloadSessionIdRef.current;
    try {
      const userInfo = await getSession();
      if (reloadSessionId !== lastReloadSessionIdRef.current) {
        // Outdated. Abandon.
        return;
      }
      setUserInfo(userInfo);
    } catch (e: unknown) {
      console.error(e);
    }
  }, []);

  // Load session on mounted.
  useEffect(() => {
    setIsLoadingUserInfoOnMount(true);
    void reloadSession().finally(() => {
      setIsLoadingUserInfoOnMount(false);
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
      setUserInfo(null);
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      userInfo,
      isLoadingUserInfo: isLoadingUserInfoOnMount,
      reloadSession,
      createSession: wrappedCreateSession,
      deleteSession: wrappedDeleteSession,
    }),
    [
      isLoadingUserInfoOnMount,
      reloadSession,
      userInfo,
      wrappedCreateSession,
      wrappedDeleteSession,
    ],
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}
