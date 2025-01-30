// src/components/auth/PrivateRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PrivateRoute = ({ children }) => {  
  const authState = useSelector(state => state.auth);
  const { isAuthenticated, role } = authState;

  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

if (location.pathname === '/super-admin-dashboard') {
    if (role !== 'Practice by Numbers Support') {
        if (role === 'Admin') {
            return <Navigate to="/admin-dashboard" replace />;
        }
        return <Navigate to="/inbox" replace />;
    }
}

if (location.pathname === '/inbox') {
    if (role === 'Practice by Numbers Support') {
        return <Navigate to="/super-admin-dashboard" replace />;
    }
    if (role === 'Admin') {
        return <Navigate to="/admin-dashboard" replace />;
    }
}
  return children;
};