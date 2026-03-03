import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';
import MarketTicker from '../MarketTicker/MarketTicker';
import styles from './Layout.module.css';

const Layout = () => {
  return (
    <div className={styles.layout}>
      {/* Live market ticker — fixed at top like Binance */}
      <MarketTicker />

      <div className={styles.mainContainer}>
        <Sidebar />
        <main className={styles.mainContent}>
          <div className={styles.contentWrapper}>
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
