// Layout.js
import React from 'react';
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';
import ShoppingCartSidebar from '../pages/users/checkout/ShoppingCartSidebar';

const Layout = ({ children }) => {
  return (
    <div className="body-wrapper">
      <Navbar />
      <div className="content-wrapper">
        {children}
        <ShoppingCartSidebar />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
