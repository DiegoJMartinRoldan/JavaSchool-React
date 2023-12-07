// Importa estas líneas en las dependencias
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteProduct from '../../employees/DeleteProduct';
import useAuth from '../../authentication/customHooks/useAuth';
import Context from '../../authentication/customHooks/Auth';
import { useNavigate } from 'react-router-dom';
import '../checkout/css/ShoppingCart.css';

function ShoppingCart() {
  const [products, setProducts] = useState([]);
  const [orderHasProduct, setOrderHasProduct] = useState([]);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { auth } = useAuth(Context);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      let response;

      if (auth.accessToken) {
        // Authenticated
        response = await axios.get('http://localhost:8080/client/cart', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.accessToken}`,
          },
        });
      } else {
        // Not Authenticated
        response = await axios.get('http://localhost:8080/client/cart', {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
      }

      const cartResponse = response.data;

      // Product Filter
      const filteredProducts = auth.isAuthenticated
        ? cartResponse.filter(item => item.authenticated === true)
        : cartResponse.filter(item => item.authenticated !== true);

      const productsArray = filteredProducts.map(item => item.productDTO);
      const orderHasProductsArray = filteredProducts.map(item => ({ id: item.productDTO.id, quantity: item.quantity }));

      setProducts(productsArray);
      setOrderHasProduct(orderHasProductsArray);
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
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setDeleteProduct(product.id);
                    setShowConfirmation(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteProduct && (
        <DeleteProduct
          deleteProduct={deleteProduct}
          showConfirmation={showConfirmation}
          onCancel={() => setShowConfirmation(false)}
          onDelete={(deletedId) => {
            // Asegúrate de actualizar el estado de productos aquí
            // setProducts((prevProducts) =>
            //   prevProducts.filter((product) => product.id !== deletedId)
            // );
            setDeleteProduct(null);
            setShowConfirmation(false);
          }}
        />
      )}

      <button className="btn cart-checkout-btn" onClick={() => navigate('/checkout')}>
        Go to Checkout
      </button>
    </div>
  );
}

export default ShoppingCart;