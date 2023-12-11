import React from 'react';
import useCustomAxios from '../authentication/customHooks/useCustomAxios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../authentication/customHooks/useAuth';
import axios from 'axios';
import Context from '../authentication/customHooks/Auth';

function DeleteProduct({ deleteProduct, onDelete,  onCancel, showConfirmation }) {
    const navigate = useNavigate();
    const {auth} = useAuth(Context);


    const handleDelete = async () => {
        const endpoint = `http://localhost:8080/product/delete/${deleteProduct}`;

        try {
            await axios.delete(endpoint,{
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`
                }
            } );
            onDelete(deleteProduct);
            console.log('Product deleted successfully');
        } catch (error) {
            console.error('Delete error', error);
        }
    };

    const handleCancel = async () => {

            onCancel();
            navigate('/adminProducts');
        
       
    };

    return (
        <div style={{ display: showConfirmation ? 'block' : 'none' }}>
            <p>Are you sure you want to delete this product??</p>
            <button onClick={handleDelete}>Yes, delete it</button>
            <button onClick={handleCancel}>Cancel</button>
        </div>
    );
}

export default DeleteProduct;
