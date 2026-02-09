import React from 'react';
import ShopLeft from '../../components/shop/ShopLeft';
import Shop from '../../components/shop/Shop';

const ShopPage = () => {
  return (
    <div className="shop-page-layout">
      <aside className="sidebar">
        <ShopLeft />
      </aside>
      <main className="main-content">
        <Shop />
      </main>
    </div>
  );
};

export default ShopPage;