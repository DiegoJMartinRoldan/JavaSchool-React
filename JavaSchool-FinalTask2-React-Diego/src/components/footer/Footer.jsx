
import React from 'react';


import './Footer.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container p-4">
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4">
            <h5 className="mb-3 footer-title">JavaSchool Diego J Martín Roldán</h5>
            <p>
          Testing footer
            </p>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="mb-3 footer-title">Links</h5>
            <ul className="list-unstyled mb-0">
              <li className="mb-1">
                <a href="#">Links</a>
              </li>
              <li className="mb-1">
                <a href="#">Links</a>
              </li>

            </ul>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="mb-1 footer-title">Opening hours</h5>
            <table className="table footer-table">
              <tbody>
                <tr>
                  <td>Monday - Friday</td>
                  <td>8am - 7pm</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="text-center p-3 footer-bottom">
        © 2023 JavaSchool
        <a href="#" className="text-dark"></a>
      </div>
    </footer>
  );
}

export default Footer;
