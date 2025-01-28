// src/components/auth/PrivateRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PrivateRoute = ({ children }) => {  
    const authState = useSelector(state => state.auth);
  const { isAuthenticated, role } = authState;

  const location = useLocation();
  console.log('PrivateRoute state:', { isAuthenticated, role, pathname: location.pathname });
  if (!isAuthenticated) {
    // Redirect to login page with return url
   // sole.log('Not authenticated, redirecting to /');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // For practice user inbox, check role
//   if (location.pathname === '/inbox' && role !== 'UserRoleType.practice_user') {
//     // Redirect to appropriate dashboard based on role
//     if (role === 'UserRoleType.admin') {
//       return <Navigate to="/admin-dashboard" replace />;
//     }
//     if (role === 'Practice by Numbers Support') {
//       return <Navigate to="/super-admin-dashboard" replace />;
//     }
//   }
// if (location.pathname === '/super-admin-dashboard' && role !== 'Practice by Numbers Support') {
//     // Redirect non-super admins
//     if (role === 'Admin') {
//       return <Navigate to="/admin-dashboard" replace />;
//     }
//     return <Navigate to="/inbox" replace />;
//   }
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
  console.log('Authenticated, rendering children');
  return children;
};