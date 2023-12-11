// useShoppingCartSidebar.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuth from './useAuth';

const useShoppingCartSidebar = () => {
  const [products, setProducts] = useState([]);
  const [orderHasProduct, setOrderHasProduct] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { auth } = useAuth();

  const fetchCart = async () => {
    try {
      let response = await axios.get('http://localhost:8080/client/cart', {
        headers: auth.accessToken ? {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.accessToken}`,
        } : {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      const cartResponse = response.data;

      const productsArray = cartResponse.map(item => item.productDTO);
      const orderHasProductsArray = cartResponse.map(item => ({ id: item.productDTO.id, quantity: item.quantity }));

      setProducts(productsArray);
      setOrderHasProduct(orderHasProductsArray);

      let totalPrice = 0;
      for (let i = 0; i < productsArray.length; i++) {
        totalPrice += productsArray[i].price * orderHasProductsArray[i].quantity;
      }

      setTotalPrice(totalPrice);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [auth.id, auth.accessToken]);


  

  //Revisar porque está mal.
  const handleDeleteProductFromCart = async (productId) => {
    try {
      const endpointDeleteProductFromCart = 'http://localhost:8080/client/cartDelete';

      const requestBodyDeleteProductFromCart = {
        productDTO: {
          id: productId,
        },
        quantity: orderHasProduct.find((item) => item.id === productId)?.quantity,
      };

      const response = await axios.delete(endpointDeleteProductFromCart, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: requestBodyDeleteProductFromCart,
        withCredentials: true,
      });

      const deleteProduct = response.data;
      console.log(deleteProduct);

      fetchCart();
    } catch (error) {
      console.error('Error removing product from cart:', error.response ? error.response.data : error.message);
    }
  };

  return { products, orderHasProduct, totalPrice, fetchCart, handleDeleteProductFromCart };
};

export default useShoppingCartSidebar;
