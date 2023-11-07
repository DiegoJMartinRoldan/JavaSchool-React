import React from "react";
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from "../NavLink";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


function Navbar() {

  // Provisional logout, this logout will be in Profile
  const navigate = useNavigate();
  useEffect(() => {
    // We obtain this sessionStorage when we login and clear it by
    let username = sessionStorage.getItem('username');
    if (username === '' || username === null) {
      navigate('/login');
    }
  }, [])


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="#">My App</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <NavLink to='/'>Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/register'>Register</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/login'>Login</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/profile'>Profile</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/shoppingCart'>Shopping Cart</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to='/login'>Logout</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
