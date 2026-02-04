import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminLeft from "../components/admin/AdminLeft";
import AdminHeader from "../components/admin/AdminHeader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const isState = useSelector((state) => state.input.isState);
  const user = useSelector((state) => state.input.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (isState) {
      alert("로그인이 필요합니다");
      navigate("/auth/login");
    }
    if (user && user.role !== "ROLE_ADMIN") {
      alert("관리자 권한이 필요합니다");
      navigate("/auth/login");
    }
  }, [isState, user, navigate]);

  return (
    <>
      <AdminHeader />
      <AdminLeft />
      <div className="adminContent">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
