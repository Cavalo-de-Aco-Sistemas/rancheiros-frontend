import { createContext, ReactNode, useCallback, useEffect, useMemo } from 'react';
import axios, { AxiosInstance } from 'axios';
import { addHours, parseISO } from 'date-fns';
import { useLocalStorage } from '@mantine/hooks';
import { LoginPage } from '@/pages/LoginPage';
import { useContextProvider } from './useContextProvider';

export interface AuthContextType {
  axiosInstance: AxiosInstance;
  logout: () => void;
  authToken: string | null;
  username: string | null;
  permissions: Record<string, Record<'create' | 'read' | 'update' | 'delete', boolean>> | null;
}

export interface LoginProps {
  token: string;
  username: string;
  permissions: Record<string, Record<'create' | 'read' | 'update' | 'delete', boolean>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_DURATION_HOURS = 10;

export const useAuth = (): AuthContextType => {
  return useContextProvider(AuthContext, 'useAuth', 'AuthProvider');
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // the access token from login
  const [authToken, setAuthToken] = useLocalStorage<string | null>({
    key: 'access_token',
    getInitialValueInEffect: false, // avois blink of loading page before reading the token from local storage
  });

  // the date and time from last login
  const [authDate, setAuthDate] = useLocalStorage<string | null>({
    key: 'access_date',
    defaultValue: null,
  });

  // the date and time from last login
  const [username, setUsername] = useLocalStorage<string | null>({
    key: 'username',
    defaultValue: null,
  });

  const [permissions, setPermissions] = useLocalStorage<Record<
    string,
    Record<string, boolean>
  > | null>({
    key: 'permissions',
    defaultValue: null,
  });

  /**
   * Handles user login by saving the authentication token and the current authentication date
   * on state and local storage
   *
   * @param {string} token - The authentication token to be set.
   */
  const login = useCallback(
    ({ token, username, permissions }: LoginProps) => {
      setAuthToken(token);
      setAuthDate(new Date().toISOString());
      setUsername(username);
      setPermissions(permissions);
    },
    [setAuthToken, setAuthDate, setUsername, setPermissions]
  );

  /**
   * Handles user logout by clearing the authentication token and the authentication date
   * from state and local storage
   */
  const logout = useCallback(() => {
    setAuthToken(null);
    setAuthDate(null);
    setUsername(null);
    setPermissions(null);
  }, [setAuthDate, setAuthToken, setUsername, setPermissions]);

  /**
   * After each login or logout process:
   * if logged in then check token validity
   * if token expired then logout
   * if token not expired then schedule logout for token expiration
   */
  useEffect(() => {
    if (authDate) {
      const expiresAt = addHours(parseISO(authDate), TOKEN_DURATION_HOURS);
      const timeUntilLogout = expiresAt.getTime() - new Date().getTime();
      if (timeUntilLogout <= 0) {
        logout();
      } else {
        const logoutTimer = setTimeout(logout, timeUntilLogout);
        // Clean up timeout if the component unmounts or authDate changes
        return () => clearTimeout(logoutTimer);
      }
    }
  }, [authDate, logout]);

  // global axios instance
  const axiosInstance: AxiosInstance = useMemo(() => {
    const instance = axios.create({
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    });

    // intercept all requests and add the auth token
    instance.interceptors.request.use(
      (config) => {
        if (authToken) {
          config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // intercept all responses for token expired
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Unauthorized
        if (error.response && error.response.status === 401) {
          logout();
        }
        if (error.response && error.response.status === 403) {
          return Promise.reject(new Error('Você não tem permissão para manipular este recurso'));
        }
        // log response
        // eslint-disable-next-line no-console
        console.error('error', error);
        return Promise.reject(error);
      }
    );

    return instance;
  }, [authToken, logout]);

  // the value provided by auth context
  const value = {
    axiosInstance,
    logout,
    authToken,
    username,
    permissions,
  };

  return (
    <AuthContext.Provider value={value}>
      {authToken ? children : <LoginPage login={login} />}
    </AuthContext.Provider>
  );
};
