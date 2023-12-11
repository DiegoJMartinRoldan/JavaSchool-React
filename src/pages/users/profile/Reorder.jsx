import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useCustomAxios from '../../authentication/customHooks/useCustomAxios';
import useAuth from '../../authentication/customHooks/useAuth';
import Context from '../../authentication/customHooks/Auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Reorder() {
  const { id } = useParams();
  const customAxios = useCustomAxios();
  const { auth } = useAuth(Context);
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast.success('Reorder created successfully');

    
      navigate('/profile');
  
  };

  useEffect(() => {
    const endpoint = `/orders/reorder/${id}`;

    customAxios
      .post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        handleSuccess();
      })
      .catch((error) => {
        console.error('Error', error);
      });
  }, [id, auth.accessToken, customAxios, handleSuccess, navigate]);

  return null;
}

export default Reorder;
