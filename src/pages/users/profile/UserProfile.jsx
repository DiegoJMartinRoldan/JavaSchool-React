import React, { useState, useEffect } from 'react';
import Context from '../../authentication/customHooks/Auth';
import useAuth from '../../authentication/customHooks/useAuth';
import { useNavigate } from 'react-router-dom';
import useCustomAxios from '../../authentication/customHooks/useCustomAxios';
import DeleteAddress from '../clientsAddress/DeleteAddress';





function UserProfile() {

  const [client, setClient] = useState({});

  const { auth, logout } = useAuth(Context);
  const customAxios = useCustomAxios();
  const { updateTrigger, setUpdateTrigger } = useAuth(Context);
  const [deleteAddressId, setDeleteAddressId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
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
          console.error('Error getting client' + error);
        }
      });
  }, [auth.id, auth.accessToken, updateTrigger]);



  const handleUpdateAfterNavigation = (updatedClient) => {
    setClient(updatedClient);
    setUpdateTrigger((prevState) => !prevState);
  };





  //Get client Addresses
  useEffect(() => {
    if (client.clientsAddresses) {
      const addressPromises = client.clientsAddresses.map((address) =>
        customAxios.get(`/clientsAddress/getby/${address.id}`)
      );
      Promise.all(addressPromises)
        .then((addressResponses) => {
          const clientAddresses = addressResponses.map((response) => response.data);

        })
        .catch((error) => {
          console.error('Error getting addresses: ' + error);
        });
    }


    console.log('Client Addresses:', client.clientsAddresses);
  }, [client.clientsAddresses]);


  //Get client Orders
  useEffect(() => {
    if (client.orders) {
      const orderPromises = client.orders.map((allOrders) =>
        customAxios.get(`/orders/getby/${allOrders.id}`)
      );
      Promise.all(orderPromises)
        .then((orderResponses) => {
          const clientOrders = orderResponses.map((response) => response.data);
          //console.log(clientOrders);

        })
        .catch((error) => {
          console.error('Error getting orders: ' + error);
        });
    }
  }, [client.orders]);

  console.log(client.clientsAddresses)

  //Logout
  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate('/');
  };


  return (
    <div>
      <h1>Hi {client.name}!</h1>
      <h5>Personal Data:</h5>
      <p>Surname: {client.surname}</p>
      <p>Date of Birth: {client.dateOfBirth}</p>
      <p>Email: {client.email}</p>
      <button
        onClick={() => {
          navigate(`/userInformationChange/${client.id}`, {
            state: {
              setUpdateTrigger: setUpdateTrigger,
              onUpdateAfterNavigationData: {
                handleUpdateAfterNavigation: handleUpdateAfterNavigation,
              },
            },
          });
        }}
      >
        Change personal data
      </button>

      <button onClick={() => navigate('/passwordChange')}>
        Change Password
      </button>

      <p>------------------</p>

      <ul>
        <h5>Addresses:</h5>

        {client.clientsAddresses && client.clientsAddresses.map((address) => (
          <li key={address.id}>
            {address.country},
            {address.city},
            {address.postalCode},
            {address.street},
            {address.home},
            {address.apartment} <br />

            {/*  <NavLink to='/updateAddress'>Update address</NavLink><br />  */}
            <button onClick={() => {
              setDeleteAddressId(address.id);
              setShowConfirmation(true);
            }}>
              Delete Address
            </button>
          </li>
        ))}

      </ul>

      {deleteAddressId && (
        <DeleteAddress
          addressId={deleteAddressId}
          showConfirmation={showConfirmation}
          onCancel={() => setShowConfirmation(false)}
          onDelete={(deletedId) => {
            setClient((prevClient) => ({
              ...prevClient,
              clientsAddresses: prevClient.clientsAddresses.filter(
                (address) => address.id !== deletedId
              ),
            }));
            setDeleteAddressId(null);
            setShowConfirmation(false);
          }}
        />
      )}
      <button onClick={() => navigate('/clientAddress')}>Create new Address</button>



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
            <button onClick={() => navigate(`/reorder/${allOrders.id}`)}>Reorder</button>
          </li>

        ))}
      </ul>
      {/* <NavLink >Delete Order</NavLink><br />*/}
      <p>--------------</p>


      <button onClick={handleLogout}>Logout</button>



    </div>
  );

}

export default UserProfile;
