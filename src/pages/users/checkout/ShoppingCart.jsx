import React, { useState, useEffect } from 'react';
import useCustomAxios from '../../authentication/customHooks/useCustomAxios';
import useAuth from '../../authentication/customHooks/useAuth';
import Context from '../../authentication/customHooks/Auth';
import { useNavigate } from 'react-router-dom';



function ShoppingCart() {

  const [products, setProducts] = useState([]);
  const customAxios = useCustomAxios();
  const navigate = useNavigate();
  const { auth } = useAuth(Context);


  useEffect(() => {
    const shoppingCartEndpoint = '/client/cart';
  
    customAxios
      .get(shoppingCartEndpoint)
      .then((response) => {
        const cartResponse = response.data;
        const productsArray = Object.values(cartResponse);
        setProducts(productsArray);
      })
      .catch((error) => {
        console.error('Error', error);
      });
  }, []);
  



  return (
    <div>
      <h2>Shopping Cart</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Parameters</th>
            <th>Weight</th>
            <th>Volume</th>
            <th>Quantity Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td>{product.parameters}</td>
              <td>{product.weight}</td>
              <td>{product.volume}</td>
              <td>{product.quantityStock}</td>
              <td>
              
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => navigate('/checkout')}>Go to Checkout</button>
    </div>

  )
}

export default ShoppingCart