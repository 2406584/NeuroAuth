import React from 'react';

// Define the shape of the props
interface ProtectedRouteProps {
  element: React.FC;
  authenticated: boolean;
}

/**
 * Renders the children component only if the user is authenticated.
 * Otherwise, redirects to the login page.
 */
const ProtectedRoutes: React.FC<ProtectedRouteProps> = ({ element: Element, authenticated }) => {


  if (authenticated) {
    return <Element />;
  }
};

export default ProtectedRoutes;