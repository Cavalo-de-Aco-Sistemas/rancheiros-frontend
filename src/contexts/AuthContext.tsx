import { createContext, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { addHours, parseISO } from 'date-fns';
import { useLocalStorage } from '@mantine/hooks';
import { createApolloClient } from '@/apollo/client';
import { Ranch } from '@/model/ranch';
import { LoginPage } from '@/pages/LoginPage';
import { useContextProvider } from './useContextProvider';

export interface AuthContextType {
  client: ApolloClient<NormalizedCacheObject>;
  logout: () => void;
  authToken: string | null;
  username: string | null;
  name: string | null;
  permissions: Record<string, Record<'create' | 'read' | 'update' | 'delete', boolean>> | null;
  ranches: Ranch[] | null;
  super_admin: boolean | null;
}

export interface LoginProps {
  token: string;
  username: string;
  name: string;
  permissions: Record<string, Record<'create' | 'read' | 'update' | 'delete', boolean>>;
  ranches: Ranch[];
  super_admin: boolean;
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

  // the ranches from last login
  const [ranches, setRanches] = useLocalStorage<Ranch[] | null>({
    key: 'ranches',
    defaultValue: null,
    getInitialValueInEffect: false,
    serialize: (value) => JSON.stringify(value),
    deserialize: (value) => {
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return null;
      }
    },
  });

  // the date and time from last login
  const [username, setUsername] = useLocalStorage<string | null>({
    key: 'username',
    defaultValue: null,
  });

  // the name from last login
  const [name, setName] = useLocalStorage<string | null>({
    key: 'name',
    defaultValue: null,
  });

  const [permissions, setPermissions] = useLocalStorage<Record<
    string,
    Record<string, boolean>
  > | null>({
    key: 'permissions',
    defaultValue: null,
  });

  const [super_admin, setSuper_admin] = useLocalStorage<boolean | null>({
    key: 'super_admin',
    defaultValue: null,
  });

  /**
   * Handles user login by saving the authentication token and the current authentication date
   * on state and local storage
   *
   * @param {string} token - The authentication token to be set.
   */
  const login = useCallback(
    ({ token, username, name, permissions, ranches, super_admin }: LoginProps) => {
      setAuthToken(token);
      setAuthDate(new Date().toISOString());
      setUsername(username);
      setName(name);
      setPermissions(permissions);
      setRanches(ranches);
      setSuper_admin(super_admin);
    },
    [setAuthToken, setAuthDate, setUsername, setName, setPermissions, setRanches, setSuper_admin]
  );

  /**
   * Handles user logout by clearing the authentication token and the authentication date
   * from state and local storage
   */
  const logout = useCallback(() => {
    setAuthToken(null);
    setAuthDate(null);
    setUsername(null);
    setName(null);
    setPermissions(null);
    setSuper_admin(null);
  }, [setAuthDate, setAuthToken, setUsername, setName, setPermissions, setSuper_admin]);

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

  // Apollo Client instance
  const client = useMemo(() => {
    return createApolloClient(authToken, logout);
  }, [authToken, logout]);

  // the value provided by auth context
  const value = {
    client,
    logout,
    authToken,
    username,
    name,
    permissions,
    ranches,
    super_admin,
  };

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={value}>
        {authToken ? children : <LoginPage login={login} />}
      </AuthContext.Provider>
    </ApolloProvider>
  );
};
