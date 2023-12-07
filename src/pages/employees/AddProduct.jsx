import React from 'react';
import useCustomAxios from '../authentication/customHooks/useCustomAxios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import useAuth from '../authentication/customHooks/useAuth';
import Context from '../authentication/customHooks/Auth';


function AddProduct() {


  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [parameters, setParameters] = useState('');
  const [weight, setWeight] = useState('');
  const [volume, setVolume] = useState('');
  const [quantityStock, setQuantityStock] = useState('');
  const [image, setImage] = useState(null); // Nuevo estado para la imagen
  const customAxios = useCustomAxios();
  const navigate = useNavigate();
  const { auth } = useAuth(Context);


  const handleSuccess = () => {
    toast.success('Product created successfully');

    setTimeout(() => {
      navigate('/adminProducts');
    }, 1000);
  }




  const isValidate = () => {
    let isAdded = true;
    let errorMessage = 'Please enter the correct value in: ';

    if (!title) {
      isAdded = false;
      errorMessage += 'Title ';
    }
    if (!price || isNaN(Number(price))) {
      isAdded = false;
      errorMessage += 'Price';
    }
    if (!category) {
      isAdded = false;
      errorMessage += 'Category';
    }
    if (!parameters) {
      isAdded = false;
      errorMessage += 'Parameters';
    }
    if (!weight || isNaN(Number(weight))) {
      isAdded = false;
      errorMessage += 'Weight';
    }
    if (!volume || isNaN(Number(volume))) {
      isAdded = false;
      errorMessage += 'Volume';
    }
    if (!quantityStock || isNaN(Number(quantityStock))) {
      isAdded = false;
      errorMessage += 'Quantity Stock';
    }
    if (!image) {
      isAdded = false;
      errorMessage += 'Imagen ';
    }

    if (!isAdded) {
      toast.warning(errorMessage);
    }

    return isAdded;
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

  //Create Product
  const handleSubmit = (event) => {
    event.preventDefault();

    const createProductEndpoint = '/product/create';

    const productData = {
      title: title,
      price: price,
      category: category,
      parameters: parameters,
      weight: weight,
      volume: volume,
      quantityStock: quantityStock,
      image: image.split(",")[1], 
    };

    if (isValidate()) {
      customAxios
        .post(createProductEndpoint, productData, {
          headers: {
            Authorization: 'Bearer ' + auth.accessToken,
            'Content-Type': 'application/json'
          },
        })
        .then((response) => {
          console.log(response.data);
          handleSuccess();
        })
        .catch((error) => {
          toast.error('Inténtalo de nuevo.');
          console.error('Error', error);
        });
    }
  };



  return (
    <div className="container mt-5">
      <ToastContainer></ToastContainer>
      <h2>Crear Producto</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Title:</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Price:</label>
          <input
            type="text"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Category:</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Parameters:</label>
          <input
            type="text"
            className="form-control"
            value={parameters}
            onChange={(e) => setParameters(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Weight:</label>
          <input
            type="text"
            className="form-control"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Volume:</label>
          <input
            type="text"
            className="form-control"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Quantity Stock:</label>
          <input
            type="text"
            className="form-control"
            value={quantityStock}
            onChange={(e) => setQuantityStock(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Image:</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">
          Add
        </button>
        <button className="btn btn-primary" onClick={() => navigate('/adminProducts')}>
          Not now
        </button>
      </form>
    </div>
  );
}

export default AddProduct;