import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../../authentication/customHooks/useAuth';
import Context from '../../authentication/customHooks/Auth';
import useCustomAxios from '../../authentication/customHooks/useCustomAxios';
import { useContext } from 'react';
import useRefreshToken from '../../authentication/customHooks/useRefreshToken';



function UserInformationChange(){
  const { auth, updateUser } = useAuth(Context);
  const customAxios = useCustomAxios();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();


  // Define function for displaying success message (Toastify)
  const handleSuccess = () => {
    toast.success('Successful update');

    setTimeout(() => {
      navigate('/'); // 1 Second delay
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
      id: auth.id,
      name: name,
      surname: surname,
      dateOfBirth: dateOfBirth,
      email: email,
      role: 'ROLE_USER'
    };

    console.log('User ID before update:', auth.id);
    
    // Perform validation before sending the request
    if (IsValidate()) {
      // Api Url
      const endpoint = `/client/update/${auth.id}`;

      let respuesta;  

      customAxios
        .patch(endpoint, clientData, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`
          }
        })
        .then((response) => {
          respuesta = response.data;  // Almacenar la respuesta en la variable
          console.log('Datos actualizados:', response.data);
          console.log('User ID after update:', auth.id);
          updateUser(respuesta);
          handleSuccess();
          console.log('new token', useRefreshToken);
          setIsUserUpdated(true); // Cambia el estado cuando el usuario se actualiza
        })
        .catch((error) => {
          toast.error('There was an error while updating. Try again.');
          console.error('Error', error);
        });

      // Ahora puedes acceder a `respuesta` fuera del bloque `then`
      console.log('Respuesta fuera de then:', respuesta);
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

        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>

    </div>
  );
}

export default UserInformationChange;
