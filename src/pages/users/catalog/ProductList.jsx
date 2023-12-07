import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../authentication/customHooks/useAuth';
import Context from '../../authentication/customHooks/Auth';
import useCustomAxios from '../../authentication/customHooks/useCustomAxios';
import { ToastContainer, toast } from 'react-toastify';
import '../catalog/css/ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [filter, setFilter] = useState('');
  const { auth } = useAuth(Context);
  const [quantities, setQuantities] = useState({});
  const [clientAddress, setClientAddress] = useState(null);
  const customAxios = useCustomAxios();



  // Lista de productos
  useEffect(() => {
    const endpoint = 'http://localhost:8080/product/list';
    axios
      .get(endpoint)
      .then((response) => {
        const productData = response.data;
        console.log('Response from backend:', productData); // Agrega este log

        setProducts(productData);
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
      });
  }, []);

  // Obtener dirección del cliente
  useEffect(() => {
    const getClientByIdUrl = `http://localhost:8080/client/getby/${auth.id}`;

    customAxios
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
        await new Promise((resolve) => setTimeout(resolve, 800)); // Esperando...

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
        image: product.image,  // Dejar la propiedad image como un array de bytes
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

  return (
    <div className="product-list-container">
      <h1 className='product-list-title'>Catalog</h1>
      <div className="product-list-filter">
        <input
          className="filter-input"
          type="text"
          placeholder="Filter by category"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="row product-container">
        {currentProducts.map((product) => (
          <div key={product.id} className="col-md-4 mb-4 col-xl-3">
            <div className="product">
              <img
                className="catalog-product-image"
                src={`data:image/jpeg;base64,${product.image}`}
                alt={product.title}
              />
              <p className="product-title">{product.title}</p>
              <div className="product-buttons">
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add To Cart
                </button>
              </div>

              <div className="quantity-controls justify-content-center">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(product.id, -1)}
                >
                  -
                </button>
                <span>{quantities[product.id] || 1}</span>
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(product.id, 1)}
                >
                  +
                </button>
              </div>

              <NavLink
                to={`/singleProductInfo/${product.id}`}
                className="product-info-link"
              >
                Product Info
              </NavLink>
            </div>
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
          <button
            key={index}
            className="page-btn"
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductList;