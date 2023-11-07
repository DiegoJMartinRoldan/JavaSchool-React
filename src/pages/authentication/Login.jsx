import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NavLink } from '../../components/NavLink';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from './customHooks/useAuth';
import Context from './customHooks/Auth';





function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useAuth(Context);

  // Where are we going
  const navigate = useNavigate();

  // Where we come from
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // We return the client to the same page where they were before the login appeared

  // Success Login response
  const handleLoginSuccess = () => {
    toast.success('Successful Login!');

    setTimeout(() => {
      navigate(from, { replace: true });
    }, 1000);
  };


  // Login Submit (Token) 
  const handleSubmitByToken = (event) => {
    event.preventDefault();

    if (loginIsValidate()) {

      const loginEndpoint = 'http://localhost:8080/client/login';

      const loginData = {
        name: name,
        password: password,
      };

      axios
        .post(loginEndpoint, loginData)
        .then((response) => {

          // Get the token from the request
          const accessToken = response.data.accessToken;

          const token = response.data.token;

          //Get the client.role from the request
          const role = response.data.role;
          const id = response.data.id;


          // We save the credentials, the role, and the accessToken in the auth object and then in the context.
          setAuth({ name, password, accessToken, token, role: role, id });

          // We are saving the name information in the session (JWT)
          sessionStorage.setItem('username', name);
          sessionStorage.setItem('accessToken', accessToken);
          sessionStorage.setItem('refreshToken', token);
          sessionStorage.setItem('id', id);
          sessionStorage.setItem('role', role);

          handleLoginSuccess();

          //console.log(response);
          //console.log(setAuth)
          console.log('accessToken: '+ accessToken);
          console.log('refreshToken: ' + token);
          console.log('role: ' + role);
          console.log('id: ' + id)
          console.log(sessionStorage);
          

        })
        .catch((error) => {
          toast.error('Invalid username or password, try again');
          console.log(error);
        });
    }
  };

  // Login validation
  const loginIsValidate = () => {

    let isCorrect = true;
    let errorMessage = 'Enter ';

    if (name === '' || name === null) {
      isCorrect = false;
      errorMessage += 'Name or Email';
    }
    if (password === '' || password === null) {
      isCorrect = false;
      errorMessage += 'Password';
    }

    if (!isCorrect) {
      toast.warning(errorMessage);
    }
    return isCorrect;
  };



  // Here we clear the sessionStorage when the user logs out
  useEffect(() => {
    sessionStorage.clear();
  }, []);




  return (
    <div className="container mt-5">
      <ToastContainer />
      <div className="row">
        <div className="col-sm-6 text-black">
          <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
            <form onSubmit={handleSubmitByToken}>
              <h3 className="fw-normal mb-3 pb-3">Log in</h3>
              <div className="form outline mb-4">
                <input
                  type="text"
                  placeholder="Username"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form outline mb-4">
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="pt-1 mb-4">
                <button className="btn btn-primary btn-md btn-block" type="submit">
                  Login
                </button>
              </div>
              <p className="small mb pb-lg-2">
                <NavLink to="/forgot-password" className="link-info">
                  Forgot Password?
                </NavLink>
              </p>
              <p>
                Don't have an account yet? <NavLink to="/register">Register</NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
