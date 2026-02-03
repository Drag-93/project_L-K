import React from "react";
import { Outlet } from "react-router-dom";
import AdminLeft from "../components/admin/AdminLeft";
import AdminHeader from "../components/admin/AdminHeader";

const AdminLayout = () => {
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
