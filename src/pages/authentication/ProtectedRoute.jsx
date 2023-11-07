import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const ProtectedRoute = ({ element, role }) => {

    const isAuthenticated = sessionStorage.getItem('accessToken') !== null;
    const userRole = sessionStorage.getItem('role');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        } else if (!role.includes(userRole)) {
            navigate("/"); // Manage Unauthorized page later
        }
    }, [isAuthenticated, userRole, navigate, role]);

    if (isAuthenticated && role.includes(userRole)) {
        return element;
    }

};

export default ProtectedRoute;
