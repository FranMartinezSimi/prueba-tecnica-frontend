import { createContext, useContext, useState, type ReactNode } from 'react';
import { JwtUtils } from '../utils/jwt.utils';

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const defaultContext: AuthContextType = {
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {}
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = JwtUtils.getToken();
    if (!storedToken || !JwtUtils.isTokenValid()) {
      JwtUtils.removeToken();
      return null;
    }
    return storedToken;
  });

  const value: AuthContextType = {
    isAuthenticated: Boolean(token) && JwtUtils.isTokenValid(),
    token,
    login: (newToken: string) => {
      JwtUtils.setToken(newToken);
      setToken(newToken);
    },
    logout: () => {
      JwtUtils.removeToken();
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};