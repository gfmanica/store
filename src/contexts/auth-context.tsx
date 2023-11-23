import { Api } from '@/lib/axios';
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
  getDBConnection: () => void;
};

type TAuthProvider = {
  children?: ReactNode;
};

const AuthContext = createContext<TAuthContext>({} as TAuthContext);

export function AuthProvider({ children }: TAuthProvider) {
  const [user, setUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const getDBConnection = useCallback(async () => {
    const a = await Api.post('/api/teste');
    debugger;
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      password,
      setPassword,
      getDBConnection,
    }),
    [user, password]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuthContext = (): TAuthContext => useContext(AuthContext);
