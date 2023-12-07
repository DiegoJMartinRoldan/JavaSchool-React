import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../authentication/customHooks/useAuth';
import Context from '../../authentication/customHooks/Auth';
import useCustomAxios from '../../authentication/customHooks/useCustomAxios';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const { auth } = useAuth(Context);
  const customAxios = useCustomAxios();
  const [pendingOrders, setPendingOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getClientByIdUrl = `http://localhost:8080/client/getby/${auth.id}`;

    customAxios
      .get(getClientByIdUrl, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        const clientData = response.data;

        const orders = clientData.orders.filter(order => order.orderStatus === "PENDING").map(order => order.id);

        setPendingOrders(orders);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          console.log('Error 403');
        } else {
          console.error('Error getting client', error);
        }
      });
  }, [auth.id, auth.accessToken]);

  const handleSuccess = () => {
    toast.success('Compra efectuada correctamente');

    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const isValidate = () => {
    let isAdded = true;
    let errorMessage = 'Please enter the value in';

    if (!paymentMethod) {
      isAdded = false;
      errorMessage += ' Payment Method';
    }
    if (!deliveryMethod) {
      isAdded = false;
      errorMessage += ' Delivery Method';
    }

    if (!isAdded) {
      toast.warning(errorMessage);
    }

    return isAdded;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const endpoint = 'http://localhost:8080/orders/create';

    // Obtén la primera orden pendiente (podrías ajustar esto según tu lógica específica)
    const pendingOrderId = pendingOrders.length > 0 ? pendingOrders[0] : null;

    // Verifica si hay una orden pendiente
    if (pendingOrderId) {
      // Realiza una solicitud para obtener los detalles de la orden pendiente
      const getOrderDetailsUrl = `http://localhost:8080/orders/getby/${pendingOrderId}`;

      axios.get(getOrderDetailsUrl, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((orderResponse) => {
        const orderDetails = orderResponse.data;

        // Actualiza los campos necesarios en orderDetails
        orderDetails.orderStatus = 'PACKED';  // Puedes actualizar otros campos si es necesario
        orderDetails.paymentMethod = paymentMethod;
        orderDetails.deliveryMethod = deliveryMethod;
        // Asegúrate de que paymentMethod y deliveryMethod estén definidos

        // Realiza la solicitud de creación de la orden con los datos actualizados
        axios.post(endpoint, orderDetails, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        })
        .then((response) => {
          handleSuccess();
          console.log(response);
        })
        .catch((error) => {
          toast.error('Try again.');
          console.error('Error', error);
        });
      })
      .catch((error) => {
        console.error('Error getting order details:', error);
        console.log('Error response:', error.response); 
        console.log('Error response:', error.response.data);

      });
      
    } else {
      console.warn('No pending orders found');
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer></ToastContainer>
      <h2>Add Your Address</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Payment Method</label>
          <input
            type="text"
            className="form-control"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Delivery Method</label>
          <input
            type="text"
            className="form-control"
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(e.target.value)}
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary me-2">
            Finish
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Not now
          </button>
        </div>
      </form>
    </div>
  )
}

export default CheckoutForm;
