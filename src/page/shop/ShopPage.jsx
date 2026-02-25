import React from 'react';
import ShopLeft from '../../components/shop/ShopLeft';
import Shop from '../../components/shop/Shop';

const ShopPage = () => {
  return (
    <div className="inner3">
      <div className="auth_wrap">
        <div className="auth_aside_wrap">
          <ShopLeft />
        </div>
        <div className="auth_list_wrap">
          <Shop />
        </div>
      </div>
    </div>
  );
};

export default ShopPage;