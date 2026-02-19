import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminMembersModal = ({ setAdminAddModal, memberId, onSuccess }) => {
  const [detail, setDetail] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [postMember, setPostMember] = useState(false);
  const memberUrl = API_JSON_SERVER_URL;
  const navigate = useNavigate();
  useEffect(() => {
    const openDetail = async () => {
      try {
        if (!memberId) {
          setPostMember(true);
          setDetail({
            userName: "",
            userEmail: "",
            userPw: "",
            phonenum: "",
            age: "",
            address: "",
            gender: "",
            role: "",
            remark: "",
          });
          return;
        }
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
  const onPostFn = async () => {
    if (
      !detail.userName?.trim() ||
      !detail.userEmail?.trim() ||
      !detail.userPw?.trim()
    ) {
      alert("이름, 이메일, 비밀번호 는 필수입력 사항입니다.");
      return;
    }
    setIsSaving(true);
    try {
      await axios.post(`${memberUrl}/members`, detail);

      alert("추가 되었습니다.");
      onSuccess?.();
      closeFn();
    } catch (err) {
      alert(err);
    } finally {
      setIsSaving(false);
    }
  };

  const onUpdateFn = async (e) => {
    setIsSaving(true);
    if (
      !detail.userName?.trim() ||
      !detail.userEmail?.trim() ||
      !detail.userPw?.trim()
    ) {
      alert("이름, 이메일, 비밀번호 는 필수입력 사항입니다.");
      return;
    }
    try {
      const res = await axios.put(`${memberUrl}/members/${memberId}`, detail);
      alert("수정 되었습니다");
      setDetail(res.data);
      onSuccess?.();
      closeFn();
    } catch (err) {
      alert(err);
    } finally {
      setIsSaving(false);
    }
  };

  const onDeleteFn = async (e) => {
    if (!window.confirm("정말 삭제 하시겠습니까")) {
      return;
    } else {
      setIsSaving(true);
      try {
        const res = await axios.delete(`${memberUrl}/members/${memberId}`);
        alert("삭제 되었습니다");
        onSuccess?.();
        closeFn();
        navigate("/admin/members");
      } catch (err) {
        alert(err);
      } finally {
        setIsSaving(false);
      }
    }
  };
  const closeFn = (e) => {
    setAdminAddModal(false);
  };
  if (!detail) {
    return (
      <div className="adminModal">
        <div className="adminModal-con">
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
    <div className="adminModal">
      <div className="adminModal-con">
        <span className="close" onClick={closeFn}>
          X
        </span>
        <div className="adminModal-title">{detail.userName}님</div>

        <ul>
          <li>
            <label htmlFor="userEmail">이메일</label>
            <input
              type="email"
              name="userEmail"
              id="userEmail"
              value={detail.userEmail}
              readOnly={!postMember}
              onChange={onChangeFn}
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
        </ul>
      </div>
      <div className="adminModal-footer">
        <div className="adminModal-footer-con">
          {memberId ? (
            <>
              <button onClick={onUpdateFn}>회원수정</button>
              <button onClick={onDeleteFn}>회원삭제</button>
            </>
          ) : (
            <button onClick={onPostFn}>회원추가</button>
          )}
          <button onClick={closeFn}>닫기</button>
        </div>
      </div>
    </div>
  );
};
export default AdminMembersModal;
