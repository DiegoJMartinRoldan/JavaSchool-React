import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import '../catalog/css/SingleProductInfo.css';
import useAuth from '../../authentication/customHooks/useAuth';
import Context from '../../authentication/customHooks/Auth';
import { ToastContainer, toast } from 'react-toastify';



function SingleProductInfo() {
  const [products, setProduct] = useState({});
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);
  const { auth } = useAuth(Context);
  const [quantities, setQuantities] = useState({});
  const [clientAddress, setClientAddress] = useState(null);



  // Obtener dirección del cliente
  useEffect(() => {
    const getClientByIdUrl = `http://localhost:8080/client/getby/${auth.id}`;

    axios
      .get(getClientByIdUrl, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        console.log('auth.id:', auth.id);
        console.log('auth.accessToken:', auth.accessToken);

        const clientData = response.data;
        console.log('clientData:', clientData);

        const addressIds = clientData.clientsAddresses.map((address) => address.id);
        console.log('addressIds:', addressIds);
        setClientAddress(addressIds);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          console.log('Error 403');
        } else {
          console.error('Error al obtener el cliente' + error);
        }
      });
  }, [auth.id, auth.accessToken]);

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => product.category.toLowerCase().includes(filter.toLowerCase()))
    : [];

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddToCart = async (product) => {
    try {
      let clientAddressId = null;
      console.log('clientAddress:', clientAddress);

      if (auth.accessToken) {
        await new Promise((resolve) => setTimeout(resolve, 800)); 

        if (clientAddress && clientAddress.length > 0) {
          clientAddressId = clientAddress[0];
        }
      }

      const addProduct = {
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        parameters: product.parameters,
        weight: product.weight,
        volume: product.volume,
        quantityStock: product.quantityStock,
        image: product.image,  
      };

      const addProductRequest = {
        clientId: auth.id || null,
        clientAddressId: clientAddressId || null,
        products: [addProduct],
        quantities: [quantities[product.id] || 1],
      };
      console.log(addProductRequest);
      const addToCartEndpoint = 'http://localhost:8080/client/addToCart';
      const response = await axios.post(addToCartEndpoint, addProductRequest, {
        headers: auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {},
        withCredentials: true,
      });
      toast.success('Producto agregado al carrito');
      console.log('Respuesta de agregar al carrito:', response.data);
      console.log(`Agregado al carrito: ${product.title}`);
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };
  const updateQuantity = (productId, amount) => {
    setQuantities((prevQuantities) => ({ ...prevQuantities, [productId]: Math.max(1, (prevQuantities[productId] || 1) + amount) }));
  };



  useEffect(() => {
    const endpoint = `http://localhost:8080/product/getby/${id}`;
    axios
      .get(endpoint)
      .then((response) => {
        const productData = response.data;
        setProduct(productData);
        console.log(productData);
      })
      .catch((error) => {
        console.error('Error with this product', error);
      });
  }, [id]);


  return (
    <div className="product-info-container">
      <ToastContainer />
      <div className="row">
        <div className="col-md-6">
          <h1 className="product-info-heading">Product Info:</h1>
          <p className="product-info-item"><strong>Name:</strong> {products.title}</p>
          <p className="product-info-item"><strong>Price:</strong> {products.price}$</p>
          <p className="product-info-item"><strong>Category:</strong> {products.category}</p>
          <p className="product-info-item"><strong>Parameters:</strong> {products.parameters}</p>
          <p className="product-info-item"><strong>Weight:</strong> {products.weight}g</p>
          <p className="product-info-item"><strong>Volume:</strong> {products.volume}</p>
          <p className="product-info-item"><strong>Quantity Stock:</strong> {products.quantityStock} units</p>
        </div>
        <div className="col-md-6">
          <img
            className="single-product-image"
            src={`data:image/jpeg;base64,${products.image}`}
            alt={products.title}
          />
        </div>
      </div>
      <div className="product-buttons">
        <button
          className="add-to-cart-btn"
          onClick={() => handleAddToCart(products)}
        >
          Add To cart
        </button>
      </div>
    </div>
  );


}

export default SingleProductInfo