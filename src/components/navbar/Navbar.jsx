import React, { useContext } from "react";
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from "../NavLink";
import useAuth from "../../pages/authentication/customHooks/useAuth";
import Context from "../../pages/authentication/customHooks/Auth";







function Navbar() {

  const { auth } = useContext(Context);
  //console.log('Auth state:', auth);


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
          {!auth.accessToken && (
            <>
              <li className="nav-item">
                <NavLink to='/register'>Register</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to='/login'>Login</NavLink>
              </li>
            </>
          )}
          {auth.accessToken && (
            <>
              <li className="nav-item">
                <NavLink to='/profile'>Profile</NavLink>
              </li>
            </>
          )}
          
          <li className="nav-item">
                <NavLink to='/shoppingCart'>Shopping Cart</NavLink>
              </li>

        </ul>
      </div>
    </nav>
  );
}

export default Navbar;