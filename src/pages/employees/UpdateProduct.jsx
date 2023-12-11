import React, { useState, useEffect } from 'react';
import useAuth from '../authentication/customHooks/useAuth';
import Context from '../authentication/customHooks/Auth';
import useCustomAxios from '../authentication/customHooks/useCustomAxios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function UpdateProduct() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [parameters, setParameters] = useState('');
    const [weight, setWeight] = useState('');
    const [volume, setVolume] = useState('');
    const [image, setImage] = useState();
    const [quantityStock, setQuantityStock] = useState('');
    const { auth } = useAuth(Context);
    const { id } = useParams(); 
    const navigate = useNavigate();

    const handleSuccess = () => {
        toast.success('Product updated successfully');
        setTimeout(() => {
            navigate('/adminProducts');
        }, 1000);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };


    const isValidate = () => {
        let isAdded = true;
        let errorMessage = 'Please enter the value in';

        if (!title) {
            isAdded = false;
            errorMessage += ' Title';
        }
        if (!price) {
            isAdded = false;
            errorMessage += ' Price';
        }
        if (!category) {
            isAdded = false;
            errorMessage += ' Category';
        }
        if (!parameters) {
            isAdded = false;
            errorMessage += ' Parameters';
        }
        if (!weight) {
            isAdded = false;
            errorMessage += ' Weight';
        }
        if (!volume) {
            isAdded = false;
            errorMessage += ' Volume';
        }
        if (!quantityStock) {
            isAdded = false;
            errorMessage += ' Quantity Stock';
        }

        if (!image) {
            isAdded = false;
            errorMessage += ' Image';
        }

        if (!isAdded) {
            toast.warning(errorMessage);
        }

        return isAdded;
    };


    const handleUpdate = (updatedProduct) => {
        console.log('Product updated successfully:', updatedProduct);
        handleSuccess();
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const productData = {
            id: id,
            title: title,
            price: price,
            category: category,
            parameters: parameters,
            weight: weight,
            volume: volume,
            quantityStock: quantityStock,
            image: image.split(",")[1], 
        }

        console.log(productData);

        if (isValidate()) {
            const updateEndpoint = `http://localhost:8080/product/update/${id}`
            console.log('Product ID', id)

            axios
                .put(updateEndpoint, productData, {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`
                    }
                })
                .then((response) => {
                    console.log(response.data);
                    handleUpdate(response.data);
                })
                .catch((error) => {
                    toast.error('There was an error while updating. Try again.');
                    console.error('Error', error);
                });
        }
    }


    return (
        <div className='container mt-5'>
            <ToastContainer />
            <h2>Update</h2>
            <form onSubmit={handleSubmit}>
                <div className="col-md-10">
                    <label className="form-label">Title:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="col-md-10">
                    <label className="form-label">Price:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div className="col-md-10">
                    <label className="form-label">Category:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div className="col-md-10">
                    <label className="form-label">Parameters:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={parameters}
                        onChange={(e) => setParameters(e.target.value)}
                    />
                </div>
                <div className="col-md-10">
                    <label className="form-label">Weight:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>
                <div className="col-md-10">
                    <label className="form-label">Volume:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                    />
                </div>
                <div className="col-md-10">
                    <label className="form-label">Quantity Stock:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={quantityStock}
                        onChange={(e) => setQuantityStock(e.target.value)}
                    />
                </div>

                <div className="col-md-10">
                    <label className="form-label">Image:</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleImageChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Update
                </button>
            </form>
        </div>
    )
}

export default UpdateProduct