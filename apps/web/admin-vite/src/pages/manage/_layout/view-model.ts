import {useSession} from '@module/session-context';
import {useCallback, useState} from 'react';

export function useViewModel() {
  const {session, isLoadingSession, deleteSession} = useSession();
  const {logout, logoutLoading} = useLogoutViewModel(deleteSession);

  return {
    session,
    isLoadingSession,
    logout,
    logoutLoading,
  };
}

function useLogoutViewModel(deleteSession: () => Promise<void>) {
  const [logoutLoading, setLogoutLoading] = useState(false);

  const logout = useCallback(
    (onSuccess: () => void, onError: (e: Error) => void) => {
      setLogoutLoading(true);
      deleteSession()
        .then(onSuccess)
        .catch(onError)
        .finally(() => {
          setLogoutLoading(false);
        });
    },
    [deleteSession],
  );

  return {
    logout,
    logoutLoading,
  };
}
