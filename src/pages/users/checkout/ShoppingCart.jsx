// Importa estas líneas en las dependencias
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteProduct from '../../employees/DeleteProduct';
import useAuth from '../../authentication/customHooks/useAuth';
import Context from '../../authentication/customHooks/Auth';
import { useNavigate } from 'react-router-dom';
import '../checkout/css/ShoppingCart.css';
import useShoppingCartSidebar from '../../authentication/customHooks/useShoppingCartSidebar';



function ShoppingCart() {
  const [products, setProducts] = useState([]);
  const [orderHasProduct, setOrderHasProduct] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const { auth } = useAuth(Context);
  const navigate = useNavigate();
  const {handleDeleteProductFromCart} = useShoppingCartSidebar();


  //Shopping Cart
  const fetchCart = async () => {
    try {
      let response;

      response = await axios.get('http://localhost:8080/client/cart', {
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









  return (
    <div className="shopping-cart-container">
      <h2 className="shopping-cart-heading">Shopping Cart</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Parameters</th>
            <th>Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td>
                <img
                  className="cart-product-image"
                  src={`data:image/jpeg;base64,${product.image}`}
                  alt={product.title}
                />
              </td>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td>{product.parameters}</td>
              <td>{orderHasProduct[index].quantity}</td>
              <td>
              
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      

      <p>Total Price: {totalPrice} €</p>

      <button
        className="btn cart-checkout-btn"
        onClick={() => navigate('/checkout', { state: { shoppingCart: products, total: totalPrice, orderHasProduct } })}
      >
        Go to Checkout
      </button>




    </div>
  );
}

export default ShoppingCart;