import React from 'react';
import './Home.css';

function Home() {
  return (

    <div className="home-container">

      <div className='homeImg'>
        <img src="/homeimg.png" alt="Home Image" className="background-image" />
      </div>
      <div className="content">

        <div className="text">
          Online Store Application
          <div>
            <button className='btn' onClick={() => window.location.href = '/catalog'}>
            <span className="shadow"></span>
            <span className="edge"></span>
            <span className="front">
              Catalog
              </span>
            </button>
          </div>
        </div>

        <div className="additional-content">
          aaaa
        </div>

      </div>

    </div>
  );
}

export default Home;
