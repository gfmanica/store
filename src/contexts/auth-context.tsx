import { Api } from '@/lib/axios';
import { TConnection } from '@/types';
import { useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
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
  validateDBConnection: () => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
};

type TAuthProvider = {
  children?: ReactNode;
};

const AuthContext = createContext<TAuthContext>({} as TAuthContext);

export function AuthProvider({ children }: TAuthProvider) {
  const [user, setUser] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    if (!isAuthenticated) {
      onOpen();
    }
  }, []);

  const { refetch } = useQuery<TConnection>({
    queryKey: ['getValidationAuth'],
    queryFn: () =>
      Api.get('/api/auth', {
        headers: { user: user, password: password },
      }).then((res) => res.data),
    retry: false,
    enabled: false,
  });

  const validateDBConnection = useCallback(async (): Promise<void> => {
    return refetch().then((res) => {
      if (res?.data?.status === 200) {
        setIsAuthenticated(true);

        return Promise.resolve();
      } else {
        enqueueSnackbar('Usuário ou senha incorretos', {
          variant: 'error',
        });

        return Promise.reject();
      }
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      password,
      setPassword,
      validateDBConnection,
      isAuthenticated,
      setIsAuthenticated,
      isOpen,
      onClose,
    }),
    [user, password, isAuthenticated, isOpen]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export const useAuthContext = (): TAuthContext => useContext(AuthContext);
