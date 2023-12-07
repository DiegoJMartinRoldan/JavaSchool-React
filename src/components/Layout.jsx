// Layout.js
import React from 'react';
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';


const Layout = ({ children }) => {
  return (
    <div className="body-wrapper">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
