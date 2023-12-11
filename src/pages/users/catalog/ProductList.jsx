import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../../authentication/customHooks/useAuth';
import Context from '../../authentication/customHooks/Auth';
import useCustomAxios from '../../authentication/customHooks/useCustomAxios';
import { ToastContainer, toast } from 'react-toastify';
import '../catalog/css/ProductList.css';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';


function ProductList() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [filter, setFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const { auth } = useAuth(Context);
  const [quantities, setQuantities] = useState({});

  const { updateCart, cart } = useContext(Context);




  const navigate = useNavigate();


  const handleSuccess = () => {
    toast.success('Added To Cart');

    setTimeout(() => {
      navigate('/catalog');
    }, 1000);
  };

  // Product List
  useEffect(() => {
    const endpoint = 'http://localhost:8080/product/list';
    axios
      .get(endpoint)
      .then((response) => {
        const productData = response.data;
        setProducts(productData);

        // Obtener y almacenar las categorías únicas
        const uniqueCategories = [...new Set(productData.map((product) => product.category))];
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
      });
  }, []);


  const filteredProducts = Array.isArray(products)
    ? products.filter((product) => product.category.toLowerCase().includes(filter.toLowerCase()))
    : [];




  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);



  const handleAddToCart = async (product) => {
    try {

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
        products: [addProduct],
        quantities: [quantities[product.id] || 1],
      };
      console.log(addProductRequest);

      const addToCartEndpoint = 'http://localhost:8080/client/addToCart';

      const response = await axios.post(addToCartEndpoint, addProductRequest, {
        headers: auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {},
        withCredentials: true,
      });

      await updateCart({ recentlyAddedProduct: product });

      console.log('Carrito actualizado desde ProductList:', cart); // Check the updated cart

      handleSuccess();

      console.log('Update Cart', cart);

      console.log('Add to cart repsonse:', response.data);
      console.log(`Added To Cart: ${product.title}`);
  } catch (error) {
      console.error('Error adding to cart:', error);
  }
};

  const updateQuantity = (productId, amount) => {
    setQuantities((prevQuantities) => ({ ...prevQuantities, [productId]: Math.max(1, (prevQuantities[productId] || 1) + amount) }));

  };



  return (
    <div className="product-list-container">
      <ToastContainer></ToastContainer>
      <h1 className='product-list-title'>Catalog</h1>
      <div className="category-dropdown">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
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