import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import ShopLeft from "../components/shop/ShopLeft";

const ShopLayout = () => {
  return (
    <>
      <Header />
      <ShopLeft/>
      <div className="Shopcontents">
      <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default ShopLayout;
