import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const endpoint = 'http://localhost:8080/product/list';
    axios
      .get(endpoint)
      .then((response) => {
        const productData = response.data;
        setProducts(productData); 
        //console.log(productData);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const filteredProducts = products.filter((product) =>
    product.category.toLowerCase().includes(filter.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Catalog</h1>

      {/* Filter */}
      <input
        type="text"
        placeholder="Filter by category"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      {currentProducts.map((product) => (
        <div key={product.id}>
          <p>{product.title}</p>
          <button>Add to cart</button>
          <button>Buy</button>
          <NavLink to={`/singleProductInfo/${product.id}`}>Product Info</NavLink>
        </div>
      ))}

      {/* Pagination */}
      <div>
        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
