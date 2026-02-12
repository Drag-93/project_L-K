import React from "react";
import Header from "../components/common/Header";
import { NavLink, Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";

const ProductLayout = () => {
  return (
    <>
      <Header />
      <div className="aside_wrap">
        <ul className="category">
          <li><NavLink to={`/product/list`}>전체</NavLink></li>
          <li><NavLink to={`/product/list/hydro`}>보습</NavLink></li>
          <li><NavLink to={`/product/list/trouble`}>트러블케어</NavLink></li>
          <li><NavLink to={`/product/list/white`}>미백</NavLink></li>
          <li><NavLink to={`/product/list/antiage`}>안티에이징</NavLink></li>
          <li><NavLink to={`/product/list/uv`}>UV</NavLink></li>
        </ul>
      </div>
      <Outlet />
      <Footer />
    </>
  );
};

export default ProductLayout;
