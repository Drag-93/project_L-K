import React from "react";
import Header from "../components/common/Header";
import { NavLink, Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import { useSelector } from "react-redux";

const AuthLayout = () => {
  const state = useSelector((state) => state);
  return (
    <>
      <Header />
      <div className="inner2">
        <div className="auth_list_wrap">
          <div className="auth_aside_wrap">
            <ul>
              <li><NavLink to={`/auth/mypage/${state.input.user.id}`}>내정보</NavLink></li>
              <li><NavLink to={`/auth/mypayment/${state.input.user.id}`}>결재내역</NavLink></li>
              <li><NavLink to={`/auth/myqna/${state.input.user.id}`}>내 Q&A</NavLink></li>
              <li><NavLink to={`/auth/myreview/${state.input.user.id}`}>내 리뷰</NavLink></li>
            </ul>
          </div>
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthLayout;
