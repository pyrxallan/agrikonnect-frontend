import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

// Component to protect routes that require authentication, redirecting to login if not authenticated

const ProtectedRoute = ({ children }) => {
  const { token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    // Redirect to login page, preserving the intended destination in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child components
  return children;
};

export default ProtectedRoute;