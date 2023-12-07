import React from 'react';
import useCustomAxios from '../authentication/customHooks/useCustomAxios';
import { useState, useEffect } from 'react';
import DeleteProduct from './DeleteProduct';
import { useNavigate } from 'react-router-dom';
import Context from '../authentication/customHooks/Auth';
import useAuth from '../authentication/customHooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import '../employees/css/Products.css'


function Products() {

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);
    const [filter, setFilter] = useState('');
    const customAxios = useCustomAxios();
    const [deleteProduct, setDeleteProduct] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [category, setCategory] = useState('');
    const navigate = useNavigate();
    const { auth } = useAuth();



    const handleSuccess = () => {
        toast.success('New category created');

        setTimeout(() => {
            navigate('/adminProducts');
        }, 1000);
    };



    // List
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




    return (
        <div className="p-product-list-container">
          <ToastContainer />
          <h1 className="p-product-list-heading">Products</h1>
      
          {/* Filter */}
          <input
            type="text"
            placeholder="Filter by category"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-product-list-filter"
          />
      
          <table id="p-product-list-table" className="p-product-list-table">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Parameters</th>
                <th>Weight</th>
                <th>Volume</th>
                <th> Stock</th>
                <th>Update</th>
                <th>Delete </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      className="admin-p-product-list-image"
                      src={`data:image/jpeg;base64,${product.image}`}
                      alt={product.title}
                    />
                  </td>
                  <td>{product.title}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.parameters}</td>
                  <td>{product.weight}</td>
                  <td>{product.volume}</td>
                  <td>{product.quantityStock}</td>
                  <td>
                    <button className='update-admin-products-btn btn' onClick={() => navigate(`/updateProduct`, { state: { productId: product.id } })}>
                      Update 
                    </button>
                  </td>
                  <td>
                    <button className='delete-admin-products-btn btn'
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
                setProducts((prevProducts) => prevProducts.filter((product) => product.id !== deletedId));
                setDeleteProduct(null);
                setShowConfirmation(false);
              }}
            />
          )}
      
          {/* Pagination */}
          <div id="p-product-list-pagination" className="p-product-list-pagination">
            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
              <button key={index} onClick={() => paginate(index + 1)}>
                {index + 1}
              </button>
            ))}
          </div>
      
          <div >
            <button className="create-admin-product-btn btn" onClick={() => navigate('/addProduct')}>Create Product</button>
          </div>
        </div>
      );
      
}

export default Products;