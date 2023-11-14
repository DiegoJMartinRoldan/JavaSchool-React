import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const ProtectedRoute = ({ element, role }) => {
    const navigate = useNavigate();

    // Check if the user is authenticated and get the user's role from the local storage
    const isAuthenticated = localStorage.getItem('accessToken') !== null;
    const userRole = localStorage.getItem('role');

    // Function to get a new access token using the refresh token
    const getNewAccessToken = async (token) => {
        const endpoint = 'http://localhost:8080/client/refreshToken';
        try {
            const response = await axios.post(endpoint, { token });
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

            const accessToken = localStorage.getItem('accessToken');

            // If there is no access token, attempt to get a new one using the refresh token
            if (!accessToken) {
                const refreshToken = localStorage.getItem('refreshToken');  // Corrected line
                const newAccessToken = await getNewAccessToken(refreshToken);
                localStorage.setItem('accessToken', newAccessToken);

                console.log(newAccessToken);
            }

            // Check if the user is authenticated and if their role has the necessary permissions
            if (!accessToken) {
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
