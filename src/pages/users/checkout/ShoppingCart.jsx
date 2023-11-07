import React, { useState, useEffect } from 'react';
import { NavLink } from '../../../components/NavLink';

function ShoppingCart() {

  const [products, setProducts] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [productsPerPage] = useState(5);

  useEffect(() => {
    const fetchedProducts = [
      { id: 1, name: 'Product 1', category: 'Category A' },
      { id: 2, name: 'Product 2', category: 'Category B' },
      { id: 3, name: 'Product 3', category: 'Category A' },
      { id: 4, name: 'Product 4', category: 'Category C' },
      { id: 5, name: 'Product 5', category: 'Category B' },
      { id: 6, name: 'Product 6', category: 'Category F' },
      { id: 7, name: 'Product 7', category: 'Category E' },
      { id: 8, name: 'Product 8', category: 'Category E' },

    ];
    setProducts(fetchedProducts);
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);


  return (
    <div>
        <h2>Shopping Cart</h2>
        <div>
            {/* Esto deberia redireccionarme a elegir la dirección de envio */}
            <NavLink to='/singleAddress'>Buy</NavLink>
            <p>Quantity</p>
            <p>Total</p>
            
        </div>
    </div>
    
  )
}

export default ShoppingCart