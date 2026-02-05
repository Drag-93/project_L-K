import React, { useEffect } from "react";
import CommunityQnAWrite from "../../components/community/CommunityQnAWrite";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CommunityQnAWritePage = () => {
  const isState = useSelector((state) => state.input.isState);
  const navigate = useNavigate();

  useEffect(() => {
    if (isState) {
      alert("로그인이 필요합니다");
      navigate("/auth/login");
    }
  }, [isState, navigate]);
  if (isState) return null;
  return (
    <>
      <CommunityQnAWrite />
    </>
  );
};

export default CommunityQnAWritePage;
