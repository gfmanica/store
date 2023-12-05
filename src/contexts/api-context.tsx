import axios, { AxiosInstance } from 'axios';
import { createContext, ReactNode, useContext } from 'react';
import { useAuthContext } from './auth-context';

type TApiContext = AxiosInstance;

type TApiProvider = {
  children?: ReactNode;
};

const ApiContext = createContext<TApiContext>({} as TApiContext);

export function ApiProvider({ children }: TApiProvider) {
  const { user, password } = useAuthContext();
  const Api = axios.create({
    headers: {
      datasourceUrl: `postgresql://${user}:${password}@localhost:5432/taste-horizon`,
    },
  });

  return <ApiContext.Provider value={Api}>{children}</ApiContext.Provider>;
}

export const useApiContext = (): TApiContext => useContext(ApiContext);
