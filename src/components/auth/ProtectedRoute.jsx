import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

// Component to protect routes that require authentication, redirecting to login if not authenticated

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page, preserving the intended destination in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child components
  return children;
};

export default ProtectedRoute;