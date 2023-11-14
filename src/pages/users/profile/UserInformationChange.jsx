import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import useAuth from '../../authentication/customHooks/useAuth';
import Context from '../../authentication/customHooks/Auth';




function UserInformationChange({ handleClientUpdate }) {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { updateAuth, auth} = useAuth();






  // Define navigation constant after form submission
  const navigate = useNavigate();


  // Define function for displaying success message (Toastify)
  const handleSuccess = () => {
    toast.success('Successful update');

    setTimeout(() => {
      navigate('/profile'); // 1 Second delay
    }, 1000);
  };
  // Acceso a setClient en UserInformationChange
  



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

  const handleUpdate = (updatedClient) => {
    if (handleClientUpdate) {
      handleClientUpdate(updatedClient);
      console.log('Client state updated:', updatedClient);
    }
    handleSuccess();
  };



  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Store form data in an object
    const clientData = {
      id: auth.id,
      name: name,
      surname: surname,
      dateOfBirth: dateOfBirth,
      email: email,
      password: password,
      role: 'ROLE_USER'
    };

    console.log('User ID before update:', auth.id);
    // Perform validation before sending the request
    if (IsValidate()) {
      // Api Url
      const endpoint = `http://localhost:8080/client/update/${auth.id}`;

      
      axios
        .put(endpoint, clientData, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`
          }
        })
        .then((response) => {
          console.log('Datos actualizados:', response.data);
          handleUpdate(response.data);
          console.log('User ID after update:', auth.id);

          if (updateAuth) {
            updateAuth({ ...auth, ...response.data });
            console.log('Auth context updated:', { ...auth, ...response.data });
          }

          handleSuccess();
        })
        .catch((error) => {
          toast.error('There was an error while updating. Try again.');
          console.error('Error', error);
        });
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2>Update</h2>
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
          Update
        </button>
      </form>

    </div>
  );
}

export default UserInformationChange;
