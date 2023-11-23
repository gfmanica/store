import { Api } from '@/lib/axios';
import { TConnection } from '@/types';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

type TAuthContext = {
  user: string;
  setUser: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  validateDBConnection: () => Promise<TConnection>;
};

type TAuthProvider = {
  children?: ReactNode;
};

const AuthContext = createContext<TAuthContext>({} as TAuthContext);

export function AuthProvider({ children }: TAuthProvider) {
  const [user, setUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const validateDBConnection = useCallback(async (): Promise<TConnection> => {
    const authConnection: Promise<TConnection> = (
      await Api.get('/api/auth', {
        headers: { user: user, password: password },
      })
    ).data;

    return authConnection;
  }, [password, user]);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      password,
      setPassword,
      validateDBConnection,
      isAuthenticated,
      setIsAuthenticated,
    }),
    [user, password, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuthContext = (): TAuthContext => useContext(AuthContext);
