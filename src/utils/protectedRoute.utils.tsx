import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth.context';
import { JwtUtils } from './jwt.utils';

export const ProtectedRoute = () => {
  const { isAuthenticated, token } = useAuth();

  if (!isAuthenticated || !token || !JwtUtils.isTokenValid()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};