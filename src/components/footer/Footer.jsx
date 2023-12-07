// Footer.js

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4">
            <h5 className="mb-3 footer-title">JavaSchool Diego J Martín Roldán</h5>
            
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
          </div>
        </div>
        <p className='footer-content'>&copy; 2023 JavaSchool. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
