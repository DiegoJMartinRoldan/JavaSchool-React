import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const [clientAddress, setClientAddress] = useState([]);
  const orderDate = new Date();
  const navigate = useNavigate();



  const { state } = useLocation();


  // Success
  const handleSuccess = () => {
    toast.success('Purchase completed successfully', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      progress: undefined,
      style: {
        background: 'green',
        color: 'white',
        fontSize: '18px',
      },
      progressBarStyle: {
        background: 'blue',
      },
    });

    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  // Get client id to get order -- Obtengo: 1. ClientAddress Id , 2. Pending Order
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

                                                  console.log ('clientData: ', clientData);


        const addressIds = clientData.clientsAddresses.map((address) => address.id);
        setClientAddress(addressIds);


                                                   console.log('address Id', addressIds);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          console.log('Error 403');
        } else {
          console.error('Error getting client', error);
        }
      });
  }, [auth.id, auth.accessToken]);



  // Validation
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

  // Submit para comprar
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isValidate()) {
      try {
        const endpoint = 'http://localhost:8080/orders/create';

        const makeOrder = {
          paymentMethod: paymentMethod,
          deliveryMethod: deliveryMethod,
          paymentStatus: 'COMPLETED',
          orderStatus: 'PACKED',
          orderDate: orderDate,
          client: {
            id: auth.id,
          },
          clientsAddress: {
            id: clientAddress[0],
          },
        };

                                                     console.log('order body', makeOrder);

        // Crear la orden
        const orderResponse = await axios.post(endpoint, makeOrder, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            'Content-Type': 'application/json',
          },

        });
        
        console.log('Order Response Data:', orderResponse.data);

        const orderId = orderResponse.data.id;
        console.log('Order Id:', orderId);


                                                                console.log('order Id', orderId);

        // Recorrer y crear las relaciones OrderHasProduct
        for (let i = 0; i < state.shoppingCart.length; i++) {
          const orderHasProductData = {
            orders: {
              id: orderId,
            },
            product: {
              id: state.shoppingCart[i].id,
            },
            quantity: state.orderHasProduct[i].quantity,
          };

                                                              console.log('OHP', orderHasProductData);

          const orderHasProductEndpoint = 'http://localhost:8080/orderHasProduct/create';

          await axios.post(orderHasProductEndpoint, orderHasProductData, {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
              'Content-Type': 'application/json',
            },
          });
        }

        const clearCartEndpoint = 'http://localhost:8080/client/clearCart';
        const clearCartBody = {
          userId: auth.id,
        };
  
        await axios.post(clearCartEndpoint, clearCartBody, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
  
        // Borrar la cookie en el lado del cliente
        document.cookie = "cart=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/client;";

        console.log(document.cookie);
  
        handleSuccess();
      } catch (error) {
        toast.error('Try again.');
        console.error('Error', error);
      }
    }
  };


  //Render Products-quantities
  const renderProductsAndQuantity = () => {
    if (state && state.shoppingCart && state.total && state.orderHasProduct) {
      const { shoppingCart, total, orderHasProduct } = state;
      return (
        <div>
          <p>Shopping Cart:</p>
          <ul>
            {shoppingCart.map((product, index) => (
              <li key={product.id}>
                {product.title} - Quantity: {orderHasProduct[index].quantity}
              </li>
            ))}
          </ul>
          <p>Total: {total} €</p>
        </div>
      );
    } else {
      return null;
    }
  };





  return (
    <div className="container mt-5">
      <ToastContainer></ToastContainer>
      <h2>Checkout</h2>

      {renderProductsAndQuantity()}

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
  );
}

export default CheckoutForm;
