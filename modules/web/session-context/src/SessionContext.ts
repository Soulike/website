import {UserInfo} from '@module/classes';
import {createSession, deleteSession} from '@module/session-sdk';
import {createContext} from 'react';

export interface SessionContextValue {
  userInfo: UserInfo | null;
  isLoadingUserInfo: boolean;
  reloadSession: () => Promise<void>;
  createSession: typeof createSession;
  deleteSession: typeof deleteSession;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
