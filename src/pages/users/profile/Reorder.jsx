import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useCustomAxios from '../../authentication/customHooks/useCustomAxios';
import useAuth from '../../authentication/customHooks/useAuth';
import Context from '../../authentication/customHooks/Auth';

function Reorder() {

  const {id} = useParams();
  const customAxios = useCustomAxios();
  const {auth} = useAuth(Context);
  console.log(id)

  useEffect(()=>{

    const endpoint = `/orders/reorder/${id}`
    customAxios
    .post(endpoint, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
    .then((response) => {
      console.log(response.data);

    })
    .catch((error) =>{
        console.error('Error', error);
    });
  }, [id])



  return null;
}

export default Reorder