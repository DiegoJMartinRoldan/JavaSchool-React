import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import useCustomAxios from '../../authentication/customHooks/useCustomAxios';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const [filter, setFilter] = useState('');
  const customAxios = useCustomAxios();

  //Products List
  useEffect(() => {
    const endpoint = '/product/list';
    customAxios
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


  //AddToCart
  const handleAddToCart = (product) => {
    const addToCartEndpoint = '/client/addToCart';

        const addProduct = {
            id: product.id,
            title: product.title,
            category: product.category,
            parameters: product.parameters,
            volume: product.volume,
            weight: product.weight,
            quantityStock: product.quantityStock
        };

        customAxios
        .post(addToCartEndpoint, addProduct)
        .then((response)=> {
            console.log(response.data)
        })
        .catch((error) => {
            console.error('Error', error)
          })
    
    console.log(`Added to cart: ${product.title}`);
  };







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
          <button onClick={() => handleAddToCart(product)}>Add to cart</button>
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
