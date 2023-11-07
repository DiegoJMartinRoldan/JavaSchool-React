import React, { useState } from 'react'
import { NavLink } from '../../../components/NavLink'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function AddAddress() {

  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [street, setStreet] = useState('');
  const [home, setHome] = useState('');
  const [apartment, setApartment] = useState('');
  const [client, setClient] = useState('');

  const navigate = useNavigate();

  const handleSuccess = () => {
    toast.success('Address added successfully');

    setTimeout(() => {
      navigate('/');
    }, 3000);
  }

  const isValidate = () => {

    let isAdded = true;
    let errorMessage = 'Please enter the value in'

    if (country === null || country === '') {
      isAdded = false,
        errorMessage += 'Country'
    }
    if (city === null || city === '') {
      isAdded = false,
        errorMessage += 'City'
    }
    if (postalCode === null || postalCode === '') {
      isAdded = false,
        errorMessage += 'Postal Code'
    }
    if (street === null || street === '') {
      isAdded = false,
        errorMessage += 'Street'
    }
    if (home === null || home === '') {
      isAdded = false,
        errorMessage += 'Home'
    }
    if (apartment === null || apartment === '') {
      isAdded = false,
        errorMessage += 'Apartment'
    }

    if (!isAdded) {
      toast.warning(errorMessage);
    }


  }





  const handleSubmit = (event) => {
    event.preventDefault();

    //Initialize an empty variable for the token
    let accessToken = sessionStorage.getItem('accessToken');

    const endpoint = 'http://localhost:8080/clientsAddress/create'

    const addressData = {
      country: country,
      city: city,
      postalCode: postalCode,
      street: street,
      home: home,
      apartment: apartment,
      client: client,
    }

    if (isValidate()){

      axios.post(endpoint, addressData, {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      })
        .then((response) => {

          handleSuccess();
          console.log(response);
        })
        .catch((error) => {
          toast.error('Try again.');
          console.error('Error', error);
        })

    }




  };


  return (
    <div className="container mt-5">
      <ToastContainer></ToastContainer>
      <h2>Add Your Address</h2>
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
             Add
          </button>
          <button  className="btn btn-primary" onClick={() => navigate('/')}>
           Not now
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddAddress;