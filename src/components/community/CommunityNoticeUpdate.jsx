import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_JSON_SERVER_URL } from '../../api/commonApi';
import axios from 'axios';

const CommunityNoticeUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const url = API_JSON_SERVER_URL;

  const [noticeUpdate, setNoticeUpdate] = useState({
    title: "",
    no: "",
    date: "",
    description: ""
  });

  useEffect(() => {
    const getNoticeData = async () => {
      try {
        const res = await axios.get(`${url}/notice/${id}`);
        setNoticeUpdate(res.data);
      } catch (err) {
        console.error("데이터 로드 실패: ", err);
      }
    };
    getNoticeData();
  }, [id, url]);

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setNoticeUpdate({ ...noticeUpdate, [name]: value });
  };

  const noticeUpdateFn = async () => {
    try {
      await axios.put(`${url}/notice/${id}`, noticeUpdate);
      alert("수정 성공");
      navigate(`/community/notice/${id}`);
    } catch (err) {
      alert("수정 실패" + err);
    }
  };

  return (
    <div className="update inner2">
      <div className="update-con">
        <div className="title">
          <h1>공지사항 수정</h1>
        </div>
        <ul>
          <li>            
           <label htmlFor="notice-title">제목</label>
            <input 
              type="text" 
              name='title' 
              value={noticeUpdate.title} 
              onChange={onChangeFn}
            />
          </li>
          <li>            
           <label htmlFor="notice-date">작성일</label>
            <input 
              type="date" 
              name="date" 
              value={
                noticeUpdate.date
                  ? new Date(noticeUpdate.date).toLocaleDateString("sv-SE")
                  : ""
              }
              readOnly
            />
          </li>
          <li>            
           <label htmlFor="notice-desc">공지내용</label>
            <textarea 
              name='description' 
              value={noticeUpdate.description} 
              onChange={onChangeFn}
            />
          </li>
          <li className='edit-btns'>
            <button onClick={noticeUpdateFn}>수정</button>
            <button onClick={() => navigate(-1)}>취소</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CommunityNoticeUpdate;