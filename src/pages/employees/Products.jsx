import React from 'react';
import useCustomAxios from '../authentication/customHooks/useCustomAxios';
import { useState, useEffect } from 'react';
import DeleteProduct from './DeleteProduct';
import { useNavigate } from 'react-router-dom';
import Context from '../authentication/customHooks/Auth';
import useAuth from '../authentication/customHooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';


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
    const {auth} = useAuth();

 
  
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


    const handleNewCategory = () => {

        const newCategory = {
            category: category

        }
        const newCategoryEndpoint = '/product/newCatalogCategory'

        customAxios.post(newCategoryEndpoint,newCategory , {
            headers: {
                Authorization: `Bearer ${auth.accessToken}`
            }
        })
            .then((response) => {
                console.log(response.data, "new category response")
                handleSuccess();
            })
            .catch((error) => {
                toast.error('There was an error while updating. Try again.');
                console.error('Error', error);
            });
    };


    return (
        <div>
              <ToastContainer />
            <h1>Products</h1>

            {/* Filter */}
            <input
                type="text"
                placeholder="Filter by category"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />

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
                    {currentProducts.map((product) => (
                        <tr key={product.id}>
                            <td>{product.title}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.parameters}</td>
                            <td>{product.weight}</td>
                            <td>{product.volume}</td>
                            <td>{product.quantityStock}</td>
                            <td>
                                <button onClick={() => navigate(`/updateProduct`, {
                                    state: {
                                        productId: product.id,
                                    }
                                })}>
                                    Update Product
                                </button>
                            </td>
                            <td>
                                <button
                                    onClick={() => {
                                        setDeleteProduct(product.id);
                                        setShowConfirmation(true);
                                    }}
                                >
                                    Delete Product
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
                        setProducts((prevProducts) =>
                            prevProducts.filter((product) => product.id !== deletedId)
                        );
                        setDeleteProduct(null);
                        setShowConfirmation(false);
                    }}
                />
            )}

            {/* Pagination */}
            <div>
                {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
                    <button key={index} onClick={() => paginate(index + 1)}>
                        {index + 1}
                    </button>
                ))}
            </div>

            <div>
                <button onClick={() => navigate('/addProduct')}>Create Product</button>
            </div>

            <div>
                <h6 className="mb-3">Create New Category</h6>
                <form onSubmit={handleNewCategory} className="row g-3">
                    <div className="col-12 col-md-6">
                        <label className="form-label">New Category:</label>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary ms-2">
                                Create
                            </button>
                        </div>
                    </div>
                </form>
            </div>


        </div>
    )
}

export default Products;