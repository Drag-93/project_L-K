import React from "react";
import { Link, NavLink } from "react-router-dom";

const AdminLeft = () => {
  const linkClass = ({ isActive }) => (isActive ? "active" : "");
  return (
    <div className="adminLeft">
      <div className="adminLeft-con">
        <h1 className="logo">
          <Link to={"/"}>
            <img src={`/images/logo.png`} alt="logo" />
          </Link>
        </h1>
        <ul>
          <li>
            <NavLink to={"/admin/members"} className={linkClass}>
              회원관리
            </NavLink>
          </li>
          <li>
            <NavLink to={"/admin/product"} className={linkClass}>
              상품관리
            </NavLink>
          </li>
          <li>
            <NavLink to={"/admin/reservation"} className={linkClass}>
              예약관리
            </NavLink>
          </li>
          <li>
            <NavLink to={"/admin/proorder"} className={linkClass}>
              상품결제관리
            </NavLink>
          </li>
          <li>
            <NavLink to={"/admin/resorder"} className={linkClass}>
              예약결제관리
            </NavLink>
          </li>
          <li>
            <NavLink to={"/admin/shop"} className={linkClass}>
              지점관리
            </NavLink>
          </li>
          <li>
            <NavLink to={"/admin/notice"} className={linkClass}>
              공지사항
            </NavLink>
          </li>
          <li>
            <NavLink to={"/admin/qna"} className={linkClass}>
              Q&A
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminLeft;
