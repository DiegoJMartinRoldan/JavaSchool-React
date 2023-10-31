import React from "react";
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="#">My App</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="#">Home <span className="sr-only"></span></a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Register</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Login</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Profile
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Shopping Cart</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
