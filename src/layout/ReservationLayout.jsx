import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { NavLink, Outlet } from "react-router-dom";

const ReservationLayout = () => {
  return (
    <>
      <Header />
        <Outlet />
      <Footer />
    </>
  );
};

export default ReservationLayout;
