import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import customAxios from '../../../authentication/customHooks/customAxios'

function Reorder() {

  const {id} = useParams();
  console.log(id)

  useEffect(()=>{

    const endpoint = `/orders/reorder/${id}`
    customAxios
    .post(endpoint)
    .then((response) => {
      console.log(response);

    })
    .catch((error) =>{
        console.error('Error', error);
    });
  }, [id])



  return (
    <div>Reorder</div>
  )
}

export default Reorder