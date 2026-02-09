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
    <div className="update">
      <div className="update-con">
        <ul>
          <li>
            <input 
              type="text" 
              name='title' 
              value={noticeUpdate.title} 
              onChange={onChangeFn}
            />
          </li>
          <li>
            <textarea 
              name='description' 
              value={noticeUpdate.description} 
              onChange={onChangeFn}
            />
          </li>
          <li><button onClick={noticeUpdateFn}>수정</button></li>
          <li><button onClick={() => navigate(-1)}>취소</button></li>
        </ul>
      </div>
    </div>
  );
};

export default CommunityNoticeUpdate;