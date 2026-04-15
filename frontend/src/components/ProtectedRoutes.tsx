import React from 'react';
import { Navigate } from 'react-router';

// Define the shape of the props
interface ProtectedRouteProps {
  element: React.FC;
  authenticated: boolean;
}

/**
 * Renders the component only if the user is authenticated.
 * Otherwise, redirects to the login page.
 */
const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({ element: Element, authenticated }) => {
  if (authenticated) {
    return <Element />;
  }

  // Redirect to login if not authenticated
  return <Navigate to="/login" replace />;
};

export default ProtectedRoutes;