// src/components/auth/PrivateRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PrivateRoute = ({ children }) => {
    console.log('PrivateRoute component rendered');  
    const authState = useSelector(state => state.auth);
    console.log('Full auth state:', authState);

  const { isAuthenticated, role } = authState;

  const location = useLocation();
  console.log('PrivateRoute state:', { isAuthenticated, role, pathname: location.pathname });
  if (!isAuthenticated) {
    // Redirect to login page with return url
    console.log('Not authenticated, redirecting to /');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // For practice user inbox, check role
  if (location.pathname === '/inbox' && role !== 'UserRoleType.practice_user') {
    // Redirect to appropriate dashboard based on role
    if (role === 'UserRoleType.admin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    if (role === 'UserRoleType.super_admin') {
      return <Navigate to="/super-admin-dashboard" replace />;
    }
  }
  console.log('Authenticated, rendering children');
  return children;
};