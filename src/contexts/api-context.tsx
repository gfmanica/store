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
      datasourceUrl: `postgresql://${user}:${password}@ep-divine-dew-61652658.us-east-2.aws.neon.tech/taste-horizon?sslmode=require`,
    },
  });

  return <ApiContext.Provider value={Api}>{children}</ApiContext.Provider>;
}

export const useApiContext = (): TApiContext => useContext(ApiContext);
