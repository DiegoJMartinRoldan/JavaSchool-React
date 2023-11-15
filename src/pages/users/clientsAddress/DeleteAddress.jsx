import React, { useState } from 'react'
import customAxios from '../../authentication/customHooks/customAxios';
import { useNavigate } from 'react-router-dom';

function DeleteAddress({addressId, onDelete, onCancel, showConfirmation}){


  const navigation = useNavigate();



  const handleDelete = async () => {
    const endpoint = `/clientsAddress/delete/${addressId}`;
    console.log(endpoint);

    try {
      await customAxios.delete(endpoint);
      onDelete(addressId);
      console.log('Address deleted successfully');
    } catch (error) {
      console.error('Delete error', error);
    }
  };

  const handleCancel = async () => {
    onCancel();
    navigation('/profile')
  }


  return (
    <div style={{ display: showConfirmation ? 'block' : 'none' }}>
      <p>Are you sure you want to delete this address?</p>
      <button onClick={handleDelete}>Yes, delete it</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
}


export default DeleteAddress;