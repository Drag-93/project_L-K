<<<<<<< HEAD
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import { useDispatch, useSelector } from "react-redux";
=======
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_JSON_SERVER_URL } from '../../api/commonApi';
import { useSelector } from 'react-redux';
>>>>>>> lhstk114

const CommunityNoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
<<<<<<< HEAD
  const dispatch = useDispatch();
=======
>>>>>>> lhstk114
  const [noticeDetail, setNoticeDetail] = useState({});
  const url = API_JSON_SERVER_URL;

  const user = useSelector((state) => state.input.user);
<<<<<<< HEAD
  const isadmin = user?.role === "ROLE_ADMIN";

  const noticeUpdateFn = async () => {
    navigate(`/community/notice/update/${id}`);
  };

  const noticeDeleteFn = async (e) => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        await axios.delete(`${API_JSON_SERVER_URL}/notice/${id}`);

        alert("공지삭제 성공");
        navigate(`/notice`);
      } catch (err) {
        alert("삭제실패" + err);
=======
  const isadmin = user?.role === 'ROLE_ADMIN';

  const noticeUpdateFn = () => {
    navigate(`/community/notice/update/${id}`);
  };

  const noticeDeleteFn = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await axios.delete(`${API_JSON_SERVER_URL}/notice/${id}`);
        alert('공지삭제 성공');
        navigate(`/community/notice`);
      } catch (err) {
        alert('삭제실패: ' + err);
>>>>>>> lhstk114
      }
    }
  };

<<<<<<< HEAD
  //한국 날짜 표시
  const getKoreaDate = () => {
    const today = new Date();
    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  };

=======
>>>>>>> lhstk114
  useEffect(() => {
    const noticeDetailFn = async () => {
      try {
        const res = await axios.get(`${url}/notice/${id}`);
        setNoticeDetail(res.data);
      } catch (err) {
<<<<<<< HEAD
        alert(err);
=======
        alert("데이터를 불러오는데 실패했습니다.");
>>>>>>> lhstk114
      }
    };
    noticeDetailFn();
  }, [id, url]);

  return (
    <div className="detail">
      <div className="detail-con">
        <h1>{noticeDetail.title}</h1>
        <ul>
<<<<<<< HEAD
          <li>{noticeDetail.title}</li>
          <li>{getKoreaDate(noticeDetail.date)}</li>
          <li>{noticeDetail.description}</li>
          <button onClick={() => navigate("/community/notice")}>목록</button>
          {isadmin && (
            <div className="admin-control">
              <button onClick={noticeUpdateFn}>수정</button>
              <button onClick={noticeDeleteFn}>삭제</button>
            </div>
          )}
        </ul>
=======
          <li><strong>작성일:</strong> {noticeDetail.date}</li>
          <h2>상세내용</h2>
          <li>{noticeDetail.description}</li>
        </ul>
        <div className="btn-group">
          {isadmin && (
            <button onClick={noticeUpdateFn}>수정</button>
          )}
          <button onClick={() => navigate('/community/notice')}>목록</button>
          {isadmin && (
            <button onClick={noticeDeleteFn}>삭제</button>
          )}
        </div>
>>>>>>> lhstk114
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default CommunityNoticeDetail;
=======
export default CommunityNoticeDetail;
>>>>>>> lhstk114
