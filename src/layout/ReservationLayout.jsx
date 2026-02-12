import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { NavLink, Outlet } from "react-router-dom";

const ReservationLayout = () => {
  return (
    <>
      <Header />
      <div className="aside_wrap">
        <ul className="category">
          <li><NavLink to={`/reservation/list`}>전체</NavLink></li>
          <li><NavLink to={`/reservation/list/lifting`}>리프팅</NavLink></li>
          <li><NavLink to={`/reservation/list/faceline`}>페이스라인</NavLink></li>
          <li><NavLink to={`/reservation/list/regen`}>피부재생</NavLink></li>
          <li><NavLink to={`/reservation/list/immune`}>면역력</NavLink></li>
        </ul>
      </div>
        <Outlet />
      <Footer />
    </>
  );
};

export default ReservationLayout;
