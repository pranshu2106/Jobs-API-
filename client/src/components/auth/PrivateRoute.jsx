import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isTokenValid } from '../../utils/authHelpers';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Check both Redux state and actual token validity
    if (!isAuthenticated || !isTokenValid()) {
        // Redirect to login with the current location for redirect after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;
