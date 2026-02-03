import React from "react";
import { Link } from "react-router-dom";

const AdminLeft = () => {
  return (
    <div className="adminLeft">
      <div className="adminLeft-con">
        <h1 className="logo">
          <Link to={"/"}>
            <img src="" alt="logo" />
          </Link>
        </h1>
        <ul>
          <li>
            <Link to={"/admin/members"}>회원관리</Link>
          </li>
          <li>
            <Link to={"/admin/reservation"}>예약관리</Link>
          </li>
          <li>
            <Link to={"/admin/product"}>상품관리</Link>
          </li>
          <li>
            <Link to={"/admin/order"}>주문관리</Link>
          </li>
          <li>
            <Link to={"/admin/shop"}>지점관리</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminLeft;
