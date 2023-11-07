import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom App.jsx element
const useProtectedRoute = ({ element, role }) => {

  const isAuthenticated = sessionStorage.getItem('accessToken') !== null;
  const userRole = sessionStorage.getItem('role');


  const navigate = useNavigate();

  //console.log(isAuthenticated);
  //console.log(userRole);

  useEffect(() => {

    if (!isAuthenticated) {
      navigate("/login");

    } else if (!role.includes(userRole)) {
      navigate("/");
    }
  }, [isAuthenticated, userRole, navigate]);

  return isAuthenticated && role.includes(userRole) ? element : null;
};

export default useProtectedRoute;
