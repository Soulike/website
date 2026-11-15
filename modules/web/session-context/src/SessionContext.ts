import {createSession, deleteSession} from '@module/session-sdk';
import type {Session} from '@schema/auth';
import {createContext} from 'react';

export interface SessionContextValue {
  session: Session | null;
  sessionError: Error | null;
  isLoadingSession: boolean;
  reloadSession: () => Promise<void>;
  createSession: typeof createSession;
  deleteSession: typeof deleteSession;
}

export const SessionContext = createContext<SessionContextValue | null>(null);
