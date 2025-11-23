import {createSession, deleteSession} from '@universal/session-sdk';
import {UserInfo} from '@website/classes';
import {createContext} from 'react';

export interface SessionContextValue {
  userInfo: UserInfo | null;
  isLoadingUserInfo: boolean;
  reloadSession: () => Promise<void>;
  createSession: typeof createSession;
  deleteSession: typeof deleteSession;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
