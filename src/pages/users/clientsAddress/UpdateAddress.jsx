import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import useAuth from '../../authentication/customHooks/useAuth';
import axios from 'axios';




function UpdateAddress() {

  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [street, setStreet] = useState('');
  const [home, setHome] = useState('');
  const [apartment, setApartment] = useState('');
  const { auth } = useAuth();
  const { id }= useParams();
  const navigate = useNavigate();



  const handleSuccess = () => {
    toast.success('Address updated successfully');
    setTimeout(() => {
        navigate('/profile');
    }, 1000);
};




const isValidate = () => {
  let isAdded = true;
  let errorMessage = 'Please enter the value in';

  if (!country) {
    isAdded = false;
    errorMessage += 'Country';
  }
  if (!city) {
    isAdded = false;
    errorMessage += 'City';
  }
  if (!postalCode) {
    isAdded = false;
    errorMessage += 'Postal Code';
  }
  if (!street) {
    isAdded = false;
    errorMessage += 'Street';
  }
  if (!home) {
    isAdded = false;
    errorMessage += 'Home';
  }
  if (!apartment) {
    isAdded = false;
    errorMessage += 'Apartment';
  }

  if (!isAdded) {
    toast.warning(errorMessage);
  }

  return isAdded;
};

const handleUpdate = (updatedAddress) => {
  console.log('Address updated successfully:', updatedAddress);
  handleSuccess();
};




const handleSubmit = (event) => {
  event.preventDefault();

  const addressData = {
    id:id,
    country: country,
    city: city,
    postalCode: postalCode,
    street: street,
    home: home,
    apartment: apartment,
    client: {
      id: auth.id 
    }

  }



  if (isValidate()) {
      const updateEndpoint = `http://localhost:8080/clientsAddress/update/${id}`
      console.log('Address ID', id)

      axios
          .put(updateEndpoint, addressData, {
              headers: {
                  Authorization: `Bearer ${auth.accessToken}`
              }
          })
          .then((response) => {
              console.log(response.data);
              handleUpdate(response.data);

          })
          .catch((error) => {
              toast.error('There was an error while updating. Try again.');
              console.error('Error', error);
          });
  }
}


  return (
    <div className="container mt-5">
    <ToastContainer></ToastContainer>
    <h2>Update Your Address</h2>
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <label className="form-label">Country:</label>
        <input
          type="text"
          className="form-control"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">City:</label>
        <input
          type="text"
          className="form-control"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Postal Code:</label>
        <input
          type="text"
          className="form-control"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Street:</label>
        <input
          type="text"
          className="form-control"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Home:</label>
        <input
          type="text"
          className="form-control"
          value={home}
          onChange={(e) => setHome(e.target.value)}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Apartment:</label>
        <input
          type="text"
          className="form-control"
          value={apartment}
          onChange={(e) => setApartment(e.target.value)}
        />
      </div>
      <div className="col-12">
        <button type="submit" className="btn btn-primary me-2">
           Update
        </button>
        <button  className="btn btn-primary" onClick={() => navigate('/profile')}>
         Not now
        </button>
      </div>
    </form>
  </div>
  )
}

export default UpdateAddress