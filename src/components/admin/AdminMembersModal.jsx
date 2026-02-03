import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminMembersModal = ({ setAdminAddModal, memberId }) => {
  const [detail, setDetail] = useState(null);
  const memberUrl = API_JSON_SERVER_URL;
  const navigate = useNavigate();
  useEffect(() => {
    const openDetail = async () => {
      try {
        if (!memberId) return;
        const res = await axios.get(`${memberUrl}/members/${memberId}`);
        setDetail(res.data);
      } catch (err) {
        alert(err);
      }
    };
    openDetail();
  }, [memberId, memberUrl]);

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setDetail({ ...detail, [name]: value });
  };
  const onUpdateFn = async (e) => {
    try {
      const res = await axios.put(`${memberUrl}/members/${memberId}`, detail);
      alert("수정 되었습니다");
      setDetail(res.data);
      navigate("/admin/members");
    } catch (err) {
      alert(err);
    }
  };

  const onDeleteFn = async (e) => {
    if (!window.confirm("정말 삭제 하시겠습니까")) {
      return;
    } else {
      try {
        const res = await axios.delete(`${memberUrl}/members/${memberId}`);
        alert("삭제 되었습니다");
        closeFn();
        navigate("/admin/members");
      } catch (err) {
        alert(err);
      }
    }
  };
  const closeFn = (e) => {
    setAdminAddModal(false);
  };
  if (!detail) {
    return (
      <div className="adminMembersModal">
        <div className="adminMembersModal-con">
          <span className="close" onClick={closeFn}>
            X
          </span>
          <div className="loading">
            <h1>...Loading</h1>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="adminMembersModal">
      <div className="adminMembersModal-con">
        <span className="close" onClick={closeFn}>
          X
        </span>
        <div className="title">{detail.userName}님</div>

        <ul>
          <li>
            <label htmlFor="userEmail">이메일</label>
            <input
              type="email"
              name="userEmail"
              id="userEmail"
              value={detail.userEmail}
              readOnly
            />
          </li>
          <li>
            <label htmlFor="userPw">비밀번호</label>
            <input
              type="password"
              name="userPw"
              id="userPw"
              value={detail.userPw}
              onChange={onChangeFn}
            />
          </li>
          <li>
            <label htmlFor="name">이름</label>
            <input
              type="text"
              name="userName"
              id="userName"
              value={detail.userName}
              onChange={onChangeFn}
            />
          </li>
          <li>
            <label htmlFor="phonenum">전화번호</label>
            <input
              type="text"
              name="phonenum"
              id="phonenum"
              value={detail.phonenum}
              onChange={onChangeFn}
            />
          </li>
          <li>
            <label htmlFor="age">나이</label>
            <input
              type="text"
              name="age"
              id="age"
              value={detail.age}
              onChange={onChangeFn}
            />
          </li>
          <li>
            <label htmlFor="gender">성별</label>
            <select
              name="gender"
              id="gender"
              defaultValue={detail.gender}
              onChange={onChangeFn}
            >
              <option value="여">여</option>
              <option value="남">남</option>
            </select>
          </li>
          <li>
            <label htmlFor="address">주소</label>
            <input
              type="text"
              name="address"
              id="address"
              value={detail.address}
              onChange={onChangeFn}
            />
          </li>
          <li className="remark-row">
            <label htmlFor="remark">특이사항</label>
            <textarea
              name="remark"
              id="remark"
              value={detail.remark || ""}
              onChange={onChangeFn}
              className="remark-textarea"
            />
          </li>
          <li>
            <label htmlFor="role">권한</label>
            <select
              name="role"
              id="role"
              defaultValue={detail.role}
              onChange={onChangeFn}
            >
              <option value="ROLE_MEMBER">일반회원</option>
              <option value="ROLE_ADMIN">관리자</option>
            </select>
          </li>
          <li>
            <button onClick={onUpdateFn}>회원수정</button>
            <button onClick={onDeleteFn}>회원삭제</button>
            <button onClick={closeFn}>닫기</button>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default AdminMembersModal;
