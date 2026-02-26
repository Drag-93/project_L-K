import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminLeft from "../components/admin/AdminLeft";
import AdminHeader from "../components/admin/AdminHeader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const isState = useSelector((state) => state.input.isState);
  const user = useSelector((state) => state.input.user);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    const mq = window.matchMedia("(max-width:1080px)");

    const apply = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);
      if (!mobile) setIsOpen(false);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const showLeft = !isMobile || isOpen;

  return (
    <div className="adminLayout">
      <AdminHeader
        isMobile={isMobile}
        onToggle={() => setIsOpen((isOpen) => !isOpen)}
      />
      {isMobile && isOpen && (
        <div className="sidebarOverlay" onClick={() => setIsOpen(false)} />
      )}
      <AdminLeft
        show={showLeft}
        onClose={() => setIsOpen(false)}
        isMobile={isMobile}
      />
      <div
        className="adminContent"
        onClick={() => {
          if (isOpen && isMobile) setIsOpen(false);
        }}
      >
        {isOpen && isMobile ? <div className="adminContent-blur" /> : <></>}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
