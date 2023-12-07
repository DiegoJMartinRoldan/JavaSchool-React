// Home.js

import React from 'react';
import styles from './Home.module.css';

function Home() {
  return (
    <div className={styles['home-container']}>
      <div className={styles['text-and-img']}>
        <div className={styles.content}>
          <div className={styles.text}>
            <h1>Online Storage Application System</h1>
            <p>Diego J. Martín Roldán</p>
            <div>
              <button className={styles.pushable} onClick={() => window.location.href = '/catalog'}>
                <span className={styles.shadow}></span>
                <span className={styles.edge}></span>
                <span className={styles.front}>
                  Catalog
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className={styles.homeImg} >
          <img src="/homeimg.png" alt="Home Image" className={styles['background-image']} />
        </div>
      </div>
    </div>
  );
}


export default Home;
