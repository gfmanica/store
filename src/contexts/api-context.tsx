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
      datasourceUrl: `postgres://${user}:${password}@ep-twilight-scene-54661059-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15`,
    },
  });

  return <ApiContext.Provider value={Api}>{children}</ApiContext.Provider>;
}

export const useApiContext = (): TApiContext => useContext(ApiContext);
