import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

const ProtectedRoute = ({ children }) => {
  const { token } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
