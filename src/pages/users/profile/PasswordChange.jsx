import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import useCustomAxios from '../../authentication/customHooks/useCustomAxios';
import useAuth from '../../authentication/customHooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '../profile/css/PasswordChange.css'

function PasswordChange() {
  const [email, setEmail] = useState('');
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const customAxios = useCustomAxios();
  const { updateAuth, auth } = useAuth();
  const navigate = useNavigate();

  const handleChangeSuccess = () => {
    toast.success('Password changed correctly');

    setTimeout(()=>{
      navigate('/profile');
    }, 1000);
  
  };

  const IsValidate = () => {
    let isProceed = true;
    let errormessage = 'Please enter the value in ';

    if (email === null || email === '') {
      isProceed = false;
      errormessage += 'Email';
    }
    if (oldPwd === null || oldPwd === '') {
      isProceed = false;
      errormessage += 'Old password';
    }
    if (newPwd === null || newPwd === '') {
      isProceed = false;
      errormessage += 'New password';
    }

    if (!isProceed) {
      toast.warning(errormessage);
    }
    return isProceed;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (IsValidate()) {
      const updatePwd = {
        email: email,
        oldPwd: oldPwd,
        newPwd: newPwd,
      };

      console.log('User ID before update:', auth.id);

      const endpoint = '/client/changePassword';

      customAxios
        .post(endpoint, updatePwd, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        })
        .then((response) => {
            updateAuth({
              password:newPwd,
            });
            //console.log(updateAuth)
          handleChangeSuccess();
        })
        .catch((error) => {
          toast.error('There was an error while updating. Try again.');
          console.error('Error', error);
        });
    }
  };

  return (
    <div className="passwordchange container mt-5">
      <ToastContainer />
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Old Password:</label>
          <input
            type="password"
            className="form-control"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password:</label>
          <input
            type="password"
            className="form-control"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default PasswordChange;
