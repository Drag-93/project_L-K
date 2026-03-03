import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import { useDispatch, useSelector } from "react-redux";

const CommunityNoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [noticeDetail, setNoticeDetail] = useState({});
  const url = API_JSON_SERVER_URL;

  const user = useSelector((state) => state.input.user);
  const isadmin = user?.role === "ROLE_ADMIN";

  const noticeUpdateFn = () => {
    navigate(`/community/notice/update/${id}`);
  };

  const noticeDeleteFn = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios.delete(`${API_JSON_SERVER_URL}/notice/${id}`);
        alert("공지삭제 성공");
        navigate(`/community/notice`);
      } catch (err) {
        alert("삭제실패: " + err);
      }
    }
  };

  //한국 날짜 표시
  const getKoreaDate = (date) => {
    const today = new Date(date);
    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  };
  useEffect(() => {
    const noticeDetailFn = async () => {
      try {
        const res = await axios.get(`${url}/notice/${id}`);
        setNoticeDetail(res.data);
      } catch (err) {
        alert("데이터를 불러오는데 실패했습니다.");
      }
    };
    noticeDetailFn();
  }, [id, url]);

  return (
    <div className="detail inner2">
      <div className="detail-con">
        <h1>{noticeDetail.title}</h1>
        <ul className="detail-info">
          <li><span>제목:</span>{noticeDetail.title}</li>
          <li><span>작성일:</span>{getKoreaDate(noticeDetail.date)}</li>
          <h2>공지내용:</h2>
          <li className="info-desc">{noticeDetail.description}</li>
          <button className="btn-list" onClick={() => navigate("/community/notice")}>목록</button>
          {isadmin && (
            <div className="admin-control">
              <button onClick={noticeUpdateFn}>수정</button>
              <button onClick={noticeDeleteFn}>삭제</button>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CommunityNoticeDetail;
