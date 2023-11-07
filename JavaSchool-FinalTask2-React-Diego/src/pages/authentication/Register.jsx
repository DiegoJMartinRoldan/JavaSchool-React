import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './authenticationCss/UserRegister.css'

function Register() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  // Define navigation constant after form submission
  const navigate = useNavigate();


  // Define function for displaying success message (Toastify)
  const handleSuccess = () => {
    toast.success('Successful registration. Redirecting to login...');

    setTimeout(() => {
      navigate('/login'); // 1 Second delay
    }, 1000);
  };


  // Define a function for validating form inputs
  const IsValidate = () => {

    let isProceed = true;

    let errormessage = 'Please enter the value in '

    if (name === null || name === '') {
      isProceed = false;
      errormessage += 'Name'
    }
    if (surname === null || surname === '') {
      isProceed = false;
      errormessage += 'Surname'
    }
    if (dateOfBirth === null || dateOfBirth === '') {
      isProceed = false;
      errormessage += 'Date Of Birth'
    }
    if (email === null || email === '') {
      isProceed = false;
      errormessage += 'Email'
    }
    if (password === null || password === '') {
      isProceed = false;
      errormessage += 'Password'
    }

    // If any field is empty, display a warning toast with the error message
    if (!isProceed) {
      toast.warning(errormessage)
    }
    return isProceed;
  }



  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();


    // Store form data in an object
    const clientData = {
      name: name,
      surname: surname,
      dateOfBirth: dateOfBirth,
      email: email,
      password: password,
      role: 'ROLE_USER'
    };



    // Perform validation before sending the request  
    if (IsValidate()){

      //Api Url
      const endpoint = 'http://localhost:8080/client/create'

      axios.post(endpoint, clientData)
        .then((response) => {

          // Clear form fields, display success message, and redirect to login page
          setName('');
          setSurname('');
          setDateOfBirth('');
          setEmail(''),
            setPassword('');
          handleSuccess();
          // console.log(response)
        })
        .catch((error) => {
          toast.error('There was an error while registering. Try again.');
          console.error('Error', error);
        });


    }

  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Surname:</label>
          <input
            type="text"
            className="form-control"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date of Birth:</label>
          <input
            type="date"
            className="form-control"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Register
        </button>

        <div className="mt-3 d-flex align-items-center">
          <p className="mb-0 me-2">Already have an account?</p>
          <a href="/login" className="text-decoration-none">Login</a>
        </div>
      </form>

    </div>
  );
}

export default Register;
