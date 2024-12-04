import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useNotification } from './NotificationProvider';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const logged = sessionStorage.getItem("token"); // Check token in session
  const { pathname } = useLocation(); // Current path
  const { showNotification } = useNotification();
  const [isChecking, setIsChecking] = useState(true); // Track if authorization check is ongoing
  const [isAuthorized, setIsAuthorized] = useState(false); // Track if user is authorized

  useEffect(() => {
    if (!logged) {
      // Guest user: Show notification and mark as unauthorized
      showNotification('You must be logged in to access this page', 'warning');
      setIsAuthorized(false);
    } else {
      // Logged-in user: Mark as authorized
      setIsAuthorized(true);
    }
    setIsChecking(false); // Authorization check complete
  }, [logged, pathname, showNotification]);

  // While checking, render nothing (or a loader, if desired)
  if (isChecking) {
    return null; // Or replace with a loading spinner if needed
  }

  // Redirect unauthorized users to /home
  if (!isAuthorized) {
    return <Navigate to="/home" replace />;
  }

  // Render protected content for authorized users
  return children;
};

export default ProtectedRoute;
