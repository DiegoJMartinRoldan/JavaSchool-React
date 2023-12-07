import React, { useState, useEffect } from 'react';
import Context from '../../authentication/customHooks/Auth';
import useAuth from '../../authentication/customHooks/useAuth';
import { useNavigate } from 'react-router-dom';
import useCustomAxios from '../../authentication/customHooks/useCustomAxios';
import DeleteAddress from '../clientsAddress/DeleteAddress';
import '../profile/css/UserProfile.css';




function UserProfile() {

  const [client, setClient] = useState({});

  const { auth } = useAuth(Context);
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


  const handleClientUpdate = (updatedClient) => {
    setClient(updatedClient);
    setUpdateTrigger(prevState => !prevState);


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




  return (
    <div className="p-profile-container">
      <div className="p-profile-row">
        <div className="p-profile-column">
          <h1 className="p-profile-heading">Hi {client.name}!</h1>
          <h5>Personal Data:</h5>
          <p><strong>Surname:</strong> {client.surname}</p>
          <p><strong>Date of Birth:</strong> {client.dateOfBirth}</p>
          <p><strong>Email:</strong> {client.email}</p>
          <button
            onClick={() => navigate(`/userInformationChange/${client.id}`, {
              state: {
                handleClientUpdate: handleClientUpdate,
                setUpdateTrigger: setUpdateTrigger,
              }
            })}
            className="personal-data-p-profile-btn btn "
          >
            Change personal data
          </button>
          <button onClick={() => navigate('/passwordChange')} className="change-password-p-profile-btn btn">
            Change Password
          </button>
        </div>
      </div>

      <div className="p-profile-row mt-4">
        <div className="p-profile-column">
          <h5>Addresses:</h5>
          {client.clientsAddresses && client.clientsAddresses.map((address) => (
            <div key={address.id} className="p-profile-card">
              <p>
                {address.country}, {address.city}, {address.postalCode}, {address.street}, {address.home}, {address.apartment}
              </p>
              <button onClick={() => {
                setDeleteAddressId(address.id);
                setShowConfirmation(true);
              }} className="p-profile-btn btn">
                Delete Address
              </button>
            </div>
          ))}
          <button onClick={() => navigate('/clientAddress')} className="create-p-profile-btn btn ">Create new Address</button>
        </div>

        <div className="p-profile-column">
          <h5>Orders:</h5>
          {client.orders && client.orders.map((allOrders) => (
            <div key={allOrders.id} className="p-profile-card">
              <p>
                {allOrders.paymentMethod}, {allOrders.deliveryMethod}, {allOrders.paymentStatus}, {allOrders.orderStatus}, {allOrders.orderDate}
              </p>
              <button onClick={() => navigate(`/reorder/${allOrders.id}`)} className="reorder-p-profile-btn btn ">
                Reorder
              </button>
            </div>
          ))}
        </div>
      </div>

      {deleteAddressId && (
        <DeleteAddress
          addressId={deleteAddressId}
          showConfirmation={showConfirmation}
          onCancel={() => setShowConfirmation(false)}
          onDelete={(deletedId) => {
            setClient((prevClient) => ({
              ...prevClient,
              clientsAddresses: prevClient.clientsAddresses.filter((address) => address.id !== deletedId),
            }));
            setDeleteAddressId(null);
            setShowConfirmation(false);
          }}
        />
      )}
    </div>
  );
}

export default UserProfile;
