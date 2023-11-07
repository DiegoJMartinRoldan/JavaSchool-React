import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';


function SingleProductInfo() {

    const [product, setProduct] = useState({});
    const {id} = useParams();

    useEffect(() => {

        const endpoint = `http://localhost:8080/product/getby/${id}`;
        axios
        .get(endpoint)
        .then((response) =>{
            const productData = response.data;
            setProduct(productData);
            console.log(productData);
        })
        .catch((error) =>{
            console.error('Error with this product', error);
        });
    },[id]);


  return (
    <div>
      <h1>Product Info:</h1>
      <p>Name: {product.title}</p>
      <p>Price: {product.price}</p>
      <p>Category: {product.category}</p>
      <p>Parameters: {product.parameters}</p>
      <p>Weight: {product.weight}</p>
      <p>Volume: {product.volume}</p>
      <p>Quantity Stock: {product.quantityStock}</p>
    </div>
  )
}

export default SingleProductInfo