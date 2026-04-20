import React from 'react';
import { Navigate } from 'react-router';

// Define the shape of the props
interface ProtectedRouteProps {
  element: React.FC;
  authenticated: boolean;
}

const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({ element: Element, authenticated }) => {
  if (authenticated) {
    return <Element />;
  }

  // Redirect to login if not authenticated
  return <Navigate to="/login" replace />;
};

export default ProtectedRoutes;