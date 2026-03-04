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

  const [pwConfirm, setPwConfirm] = useState("");
  const [pwState, setPwState] = useState(false);

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    if (name === "pwConfirm") {
      setPwConfirm(value);
    } else {
      setDetail({ ...detail, [name]: value });

      if (name === "userEmail") {
        setEmailConfirm(false);
      }
    }
  };
  const onChangeNumFn = (e) => {
    const { name, value } = e.target;
    if (name !== "phonenum" && name !== "age") return;
    if (isNaN(value)) {
      alert("숫자만 입력해주세요");
      return;
    }
    {
      setDetail({ ...detail, [name]: value });
    }
  };

  //이메일 중복 여부
  const [emailConfirm, setEmailConfirm] = useState(false);
  const confirmEmailFn = async () => {
    const res = await axios.get(`${memberUrl}/members`);
    const emailCheck = res.data.filter(
      (em) => em.userEmail === detail.userEmail,
    );
    if (emailCheck.length === 0) {
      return setEmailConfirm(true);
    }
    console.log(emailConfirm);
  };
  //비밀번호 확인

  const confirmPwFn = () => {
    setPwState(detail?.userPw === pwConfirm);
  };
  useEffect(() => {
    confirmEmailFn();
    confirmPwFn();
  }, [detail?.userEmail, detail?.userPw, pwConfirm]);

  //이메일, 비밀번호 confirmText
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const confirmText = !detail?.userEmail
    ? ""
    : !emailRegex.test(detail?.userEmail)
      ? "이메일 형식이 맞지 않습니다."
      : !emailConfirm
        ? "중복된 이메일 입니다."
        : "사용할 수 있는 이메일 입니다.";

  const confirmColor = !emailRegex.test(detail?.userEmail)
    ? "red"
    : !emailConfirm
      ? "red"
      : "green";

  const pwConfirmText = !pwConfirm
    ? ""
    : pwState
      ? "비밀번호 확인"
      : "비밀번호가 일치하지 않습니다.";
  const pwConfirmColor = pwState ? "green" : "red";

  const onPostFn = async () => {
    if (
      !detail.userName?.trim() ||
      !detail.userEmail?.trim() ||
      !detail.userPw?.trim()
    ) {
      alert("이름, 이메일, 비밀번호 는 필수입력 사항입니다.");
      return;
    }
    //이메일 조건 일치 여부
    if (!emailConfirm || !emailRegex.test(detail?.userEmail)) {
      alert("이메일을 확인해 주세요");
      return;
    }
    //비밀번호 확인 일치 여부
    if (!pwState) {
      alert("비밀번호가 일치하지 않습니다");
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
      <div className="adminModal" onClick={closeFn}>
        <div
          className="adminModal-con"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="adminModal-close" onClick={closeFn}>
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
    <div className="adminModal" onClick={closeFn}>
      <div
        className="adminModal-con"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span className="adminModal-close" onClick={closeFn}>
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
          {postMember ? (
            <li>
              <span style={{ color: `${confirmColor}`, fontSize: "13px" }}>
                {confirmText}
              </span>
            </li>
          ) : (
            <></>
          )}

          <li>
            <label htmlFor="userPw">비밀번호</label>
            <input
              type="password"
              name="userPw"
              id="userPw"
              value={detail.userPw}
              onChange={onChangeFn}
              readOnly={!postMember}
            />
          </li>
          {postMember ? (
            <>
              <li>
                <label htmlFor="pwConfirm">비밀번호 확인</label>
                <input
                  type="password"
                  name="pwConfirm"
                  value={pwConfirm}
                  onChange={onChangeFn}
                />
              </li>
              <span style={{ color: `${pwConfirmColor}`, fontSize: "13px" }}>
                {pwConfirmText}
              </span>
            </>
          ) : (
            <></>
          )}
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
              onChange={onChangeNumFn}
            />
          </li>
          <li>
            <label htmlFor="age">나이</label>
            <input
              type="text"
              name="age"
              id="age"
              value={detail.age}
              onChange={onChangeNumFn}
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
              // className="remark-textarea"
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
        <div className="adminModal-footer">
          <div className="adminModal-footer-con">
            {memberId ? (
              <>
                <button onClick={onUpdateFn} className="editBtn">
                  회원수정
                </button>
                <button onClick={onDeleteFn} className="deleteBtn">
                  회원삭제
                </button>
              </>
            ) : (
              <button onClick={onPostFn} className="editBtn">
                회원추가
              </button>
            )}
            <button onClick={closeFn}>닫기</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminMembersModal;
