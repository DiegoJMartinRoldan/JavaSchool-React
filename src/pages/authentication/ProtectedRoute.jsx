import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element, role }) => {
    const navigate = useNavigate();

    // Check if the user is authenticated and get the user's role from the session storage
    const isAuthenticated = sessionStorage.getItem('accessToken') !== null;
    const userRole = sessionStorage.getItem('role');

    // Function to get a new access token using the refresh token
    const getNewAccessToken = async (refreshToken) => {
        const endpoint = 'http://localhost:8080/client/refreshToken';
        try {
            const response = await axios.post(endpoint, { refreshToken });
            const newAccessToken = response.data.accessToken; 
            console.log(newAccessToken)
            return newAccessToken;
            
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // Check the authentication status and handle redirection
    useEffect(() => {

        const checkAuthentication = async () => {

            const accessToken = sessionStorage.getItem('accessToken');

            // If there is no access token, attempt to get a new one using the refresh token
            if (!accessToken) {
                const refreshToken = sessionStorage.getItem('refreshToken');
                const newAccessToken = await getNewAccessToken(refreshToken);
                sessionStorage.setItem('accessToken', newAccessToken);

                console.log(newAccessToken);
            }

            // Check if the user is authenticated and if their role has the necessary permissions
            if (!accessToken || !role.includes(userRole)) {
                navigate("/login"); 

            } else if (!role.includes(userRole)) {
                navigate("/unauthorized"); 
            }
        };
        checkAuthentication(); 
    }, [userRole, navigate, role]);


    // Suscessfull Authentication response: 
    if (isAuthenticated && role.includes(userRole)) {
        return element; 
    }
};

export default ProtectedRoute;
