// ProtectedRoute.jsx
// A "guard" for pages that need a login.
// If nobody is logged in, it sends the visitor to the login page.
// If someone is logged in, it shows the page (the <Outlet />).

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Still checking the saved token. Wait a moment.
  if (loading) {
    return <p className="page-message">Loading...</p>;
  }

  // Not logged in. Go to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in. Show the page.
  return <Outlet />;
}
