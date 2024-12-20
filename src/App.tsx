import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import { AuthProvider } from './context/auth.context';
import Dashboard from './pages/dashboard';
import { ProtectedRoute } from './utils/protectedRoute.utils';
import NavDrawerLayout from './layout/layout';
import Brands from './pages/brands';
import Perfumes from './pages/perfumes';
export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element = {<Navigate to="/login" replace />} />        
        <Route element={<ProtectedRoute />}>
          <Route element={<NavDrawerLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/perfumes" element={<Perfumes />} />
            {/* Más rutas protegidas aquí */}
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}