import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Context from '../../authentication/customHooks/Auth';
import useAuth from '../../authentication/customHooks/useAuth';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useCustomAxios from '../../authentication/customHooks/useCustomAxios';



function UserProfile() {

  const [client, setClient] = useState({});
  const {auth, logout} = useAuth(Context);
  const customAxios = useCustomAxios();
  const navigate = useNavigate();

  //Get the client form the auth context by id
  useEffect(() => {
    //console.log(auth.id, auth.accessToken)
    const getClientByIdUrl = `/client/getby/${auth.id}`;

    customAxios
      .get(getClientByIdUrl, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        const clientData = response.data;
        setClient(clientData);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          console.log('Error 403');
        } else {
          console.error('Error al obtener los datos' + error);
        }
      });
  }, [auth.id, auth.accessToken]);

  const handleClientUpdate = (updatedClient) => {
    setClient(updatedClient);
    console.log('Client state updated:', updatedClient);
  };




  //Get client Addresses
  useEffect(() => {
    if (client.clientAddresses) {
      const addressPromises = client.clientAddresses.map((address) => {
        const getClientAddresses = `/clientsAddress/getby/${address.id}`;
        return customAxios.get(getClientAddresses);
      });

      Promise.all(addressPromises)
        .then((addressResponses) => {
          const addresses = addressResponses.map((response) => response.data);
          // Do something with the addresses

          console.log(addresses);
        })
        .catch((error) => {
          console.error('Error getting addresses: ' + error);
        });
    }
  }, [client.clientAddresses]);



  //Get client Orders
  useEffect(() => {
    if (client.orders) {
      const orderPromises = client.orders.map((allOrders) =>
      customAxios.get(`/orders/getby/${allOrders.id}`)
      );
      Promise.all(orderPromises)
        .then((orderResponses) => {
          const clientOrders = orderResponses.map((response) => response.data);

        })
        .catch((error) => {
          console.error('Error getting orders: ' + error);
        });
    }
  }, [client.orders]);




  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate('/');
  };


  return (
    <div>
      <h1>Hi {client.name}!</h1>
      <h5>Personal Data:</h5>
      <p>Apellido: {client.surname}</p>
      <p>Fecha de nacimiento: {client.dateOfBirth}</p>
      <p>Email: {client.email}</p>
      <NavLink
        to={{
          pathname: `/userInformationChange/${client.id}`,
          state: { handleClientUpdate: handleClientUpdate }
        }}
      >
        Change personal data
      </NavLink> <br />
      <NavLink to='/passwordChange'>Cambiar contraseña</NavLink><br />

      <p>------------------</p>

      <ul>
        <h5>Addresses:</h5>

        {client.clientAddresses && client.clientAddresses.map((address) => (


          <li key={address.id}>
            {address.country},
            {address.city},
            {address.postalCode},
            {address.street},
            {address.home},
            {address.apartment} <br />
          </li>

        ))}
      </ul>
      <NavLink to='/updateAddress'>Update address</NavLink><br />
      <NavLink to='/updateAddress'>Delete address</NavLink><br />
      <NavLink to='/clientAddress'>Create new Address</NavLink><br />

      <p>--------------</p>

      <ul>
        <h5>Orders:</h5>
        {client.orders && client.orders.map((allOrders) => (

          <li key={allOrders.id}>
            {allOrders.paymentMethod},
            {allOrders.deliveryMethod},
            {allOrders.paymentStatus},
            {allOrders.orderStatus},
            {allOrders.orderDate},

          </li>

        ))}
      </ul>
      <NavLink to='/reorder'>Reorder</NavLink><br /><br />
      <NavLink >Delete Order</NavLink><br />
      <p>--------------</p>

      
      <button onClick={handleLogout}>Logout</button>



    </div>
  );

}

export default UserProfile;
