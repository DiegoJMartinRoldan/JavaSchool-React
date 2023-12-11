import React, { useState, useEffect } from 'react';
import Context from '../../authentication/customHooks/Auth';
import useAuth from '../../authentication/customHooks/useAuth';
import { useNavigate } from 'react-router-dom';
import useCustomAxios from '../../authentication/customHooks/useCustomAxios';
import DeleteAddress from '../clientsAddress/DeleteAddress';
import '../profile/css/UserProfile.css';

function UserProfile() {
  const [client, setClient] = useState({});
  const [deleteAddressId, setDeleteAddressId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const { auth, updateUser } = useAuth(Context);
  const customAxios = useCustomAxios();

  const fetchClientData = async () => {
    try {
      const response = await customAxios.get(`/client/getby/${auth.id}`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      const clientData = response.data;
      setClient(clientData);
                                                      console.log('response' , response.data)
                                                      console.log('cambios', clientData)
      
    } catch (error) {
      console.error('Error getting client' + error);
    }
  };


  useEffect(() => {
     console.log("updateUser changed. Fetching client data...");
    if (auth.accessToken) {
      fetchClientData();
    }
  }, [updateUser]);


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

    // Nota: No es necesario imprimir el estado aquí, ya que puede no estar actualizado inmediatamente después de esta llamada.
  }, [client.clientsAddresses, customAxios]);

  useEffect(() => {
    if (client.orders) {
      const orderPromises = client.orders.map((allOrders) =>
        customAxios.get(`/orders/getby/${allOrders.id}`)
      );
      Promise.all(orderPromises)
        .then((orderResponses) => {
          const clientOrders = orderResponses.map((response) => response.data);
          // Puedes actualizar el estado con los datos de las órdenes si es necesario
        })
        .catch((error) => {
          console.error('Error getting orders: ' + error);
        });
    }
  }, [client.orders, customAxios]);

  return (
    <div className="user-profile-container-unique-user-profile-container">
      <div className="p-profile-row">
        <div className="p-profile-column">
          <h1 className="p-profile-heading">Hi {client.name}!</h1>
          <h5>Personal Data:</h5>
          <p><strong>Surname:</strong> {client.surname}</p>
          <p><strong>Date of Birth:</strong> {client.dateOfBirth}</p>
          <p><strong>Email:</strong> {client.email}</p>
          <button
            onClick={() => navigate(`/userInformationChange/${client.id}`, {
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
          <h5>Address:</h5>

          {client.clientsAddresses && client.clientsAddresses.map((address) => (
            <div key={address.id} className="p-profile-card">
              <p><strong>Country:</strong> {address.country}</p>
              <p><strong>City:</strong> {address.city}</p>
              <p><strong>Postal Code:</strong> {address.postalCode}</p>
              <p><strong>Street:</strong> {address.street}</p>
              <p><strong>Home:</strong> {address.home}</p>
              <p><strong>Apartment:</strong> {address.apartment}</p>

              <button onClick={() => {
                setDeleteAddressId(address.id);
                setShowConfirmation(true);
              }} className="p-profile-btn btn">
                Delete Address
              </button>

              <button
                className='update-address-btn btn'
                onClick={() => navigate(`/updateAddress/${address.id}`)}
              >
                Update Address
              </button>
            </div>
          ))}

          <button onClick={() => navigate('/clientAddress')} className="create-p-profile-btn btn ">Create new Address</button>
        </div>

        <div className="p-profile-column">
          <h5>Orders:</h5>

          {client.orders && client.orders.map((allOrders) => (
            <div key={allOrders.id} className="p-profile-card">
              <p><strong>Payment Method:</strong> {allOrders.paymentMethod}</p>
              <p><strong>Delivery Method:</strong> {allOrders.deliveryMethod}</p>
              <p><strong>Payment Status:</strong> {allOrders.paymentStatus}</p>
              <p><strong>Order Status:</strong> {allOrders.orderStatus}</p>
              <p><strong>Order Date:</strong> {allOrders.orderDate}</p>

              <button onClick={() => navigate(`/reorder/${allOrders.id}`)} className="reorder-p-profile-btn btn">
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
