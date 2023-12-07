import React, { useContext, useState } from "react";
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from "../NavLink";
import useAuth from "../../pages/authentication/customHooks/useAuth";
import Context from "../../pages/authentication/customHooks/Auth";
import { useNavigate } from "react-router-dom";

import { BsCart2 } from "react-icons/bs";
import { HiOutlineBars3 } from "react-icons/hi2";

import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import { Home } from "@mui/icons-material";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HowToRegIcon from '@mui/icons-material/HowToReg';






function Navbar() {
  const { auth, logout } = useContext(Context);
  const navigate = useNavigate();


  const IsUser = auth.accessToken && auth.role === "ROLE_USER";
  const IsAdmin = auth.accessToken && auth.role === "ROLE_ADMIN";


  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate('/');
  };

  //console.log('Auth state:', auth);
  return (
    <nav id="navbar" className="navbar navbar-expand-lg">

      <div className="logo">
        <a className="navbar-brand" href="/">
          DMR
        </a>

      </div>


      <div className="features" >
        <ul className="menu">
          <li className="listItem">
            <NavLink to="/">Home</NavLink>
          </li  >
          {!auth.accessToken && (
            <>
              <li className="listItem">
                <NavLink to="/register">Register</NavLink>
              </li>
              <li className="listItem" >
                <NavLink to="/login">Login</NavLink>
              </li>
            </>
          )}
          {auth.accessToken && (
            <>
              <li className="listItem logout">
                <li onClick={handleLogout}>Logout</li>
              </li>
            </>
          )}

          {IsUser && (
            <>
              <li className="listItem">
                <NavLink to="/profile">Profile</NavLink>
              </li>
            </>

          )}

          {IsAdmin && (
            <>
              <li className="listItem">
                <NavLink to="/adminProducts">Products</NavLink>
              </li>
              <li className="listItem">
                <NavLink to="/statistics">Statistics</NavLink>
              </li>
              <li className="listItem">
                <NavLink to="/adminOrderHistory">Order History</NavLink>
              </li>
            </>
          )}

        </ul>
      </div>


      <div className="shoppingCarticon">
        <NavLink to="/shoppingCart">
          <ShoppingCartIcon className="cart" />
        </NavLink>
      </div>

    </nav >
  );
}

export default Navbar;
