import React from "react";
import { Link, NavLink } from "react-router-dom";

const AdminLeft = ({ isMobile, show, onClose }) => {
  const linkClass = ({ isActive }) => (isActive ? "active" : "");
  return (
    <div className={`adminLeft ${show ? "" : "close"}`}>
      <div className="adminLeft-con">
        <h1 className="logo">
          <Link to={"/"}>
            <img src={`/images/logo_w.png`} alt="logo" />
          </Link>
        </h1>
        {/* {isMobile && show && (
          <span className="adminLeftCloseBtn" onClick={onClose}>
            X
          </span>
        )} */}

        <ul>
          <li>
            <NavLink
              to={"/admin/members"}
              className={linkClass}
              onClick={onClose}
            >
              회원관리
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/admin/product"}
              className={linkClass}
              onClick={onClose}
            >
              상품관리
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/admin/reservation"}
              className={linkClass}
              onClick={onClose}
            >
              예약관리
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/admin/proorder"}
              className={linkClass}
              onClick={onClose}
            >
              상품결제관리
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/admin/resorder"}
              className={linkClass}
              onClick={onClose}
            >
              예약결제관리
            </NavLink>
          </li>
          <li>
            <NavLink to={"/admin/shop"} className={linkClass} onClick={onClose}>
              지점관리
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/admin/notice"}
              className={linkClass}
              onClick={onClose}
            >
              공지사항
            </NavLink>
          </li>
          <li>
            <NavLink to={"/admin/qna"} className={linkClass} onClick={onClose}>
              Q&A
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminLeft;
