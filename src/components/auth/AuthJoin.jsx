import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import axios from 'axios'

const joinData={
  userName:"",
  userEmail:"",
  userPw:"",
  phonenum:"",
  age:"",
  address:"",
  gender:"남",
  role:"ROLE_MEMBER",
  remark:""
};

const AuthJoin = () => {
  const navigate = useNavigate();
  const [join, setJoin] = useState(joinData);

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setJoin({ ...join, [name]: value });
  };

  const URL = API_JSON_SERVER_URL;

  const onJoinFn = async () => {
    try {
      if (!join.userEmail || !join.userName || !join.userPw) {
        alert("이메일, 이름, 비밀번호는 필수입니다!");
        return;
      }
      const res = await axios.get(`${URL}/members`)
      const existingUser = res.data.find(el => el.userEmail === join.userEmail)
      if (existingUser) {
        alert("중복된 이메일이 있습니다.");
        return;
      }
      const joinOk = await axios.post(`${URL}/members`, join)
      alert("회원가입 성공! 로그인 페이지로 이동합니다.")
      navigate("/auth/login")
    } catch (err) {
      console.error(err);
      alert("회원가입 실패! " + err);
    }
  };

  return (
    <div className="auth-join">
      <div className="auth-join-con">
        <h1>회원가입</h1>
        <ul>
          <li>
            이름 :{" "}
            <input
              type="text"
              name="userName"
              placeholder="이름을 입력해주세요"
              value={join.userName}
              onChange={onChangeFn}
            />
          </li>
          <li>
            이메일 :{" "}
            <input
              type="email"
              name="userEmail"
              placeholder="이메일을 입력해주세요"
              value={join.userEmail}
              onChange={onChangeFn}
            />
          </li>
          <li>
            비밀번호 :{" "}
            <input
              type="pw"
              name="userPw"
              placeholder="비밀번호를 입력해주세요"
              value={join.userPw}
              onChange={onChangeFn}
            />
          </li>
          <li>
            전화번호 :{" "}
            <input
              type="text"
              name="phonenum"
              placeholder="전화번호를 입력해주세요"
              value={join.phonenum}
              onChange={onChangeFn}
            />
          </li>
          <li>
            나이 :{" "}
            <input
              type="text"
              name="age"
              placeholder="나이를 입력해주세요"
              value={join.age}
              onChange={onChangeFn}
            />
          </li>
          <li>
            주소 :{" "}
            <input
              type="text"
              name="address"
              placeholder="주소를 입력해주세요"
              value={join.address}
              onChange={onChangeFn}
            />
          </li>
          <li>
            {" "}
            성별 :
            <select
              name="gender"
              id="gender"
              onChange={onChangeFn}
              value={join.gender}
            >
              <option value="남" defaultValue>
                남성
              </option>
              <option value="여">여성</option>
            </select>
          </li>
          <li>
            {" "}
            권한 :
            <select
              name="role"
              id="role"
              onChange={onChangeFn}
              value={joinData.role}
            >
              <option value="ROLE_MEMBER" defaultValue>
                일반회원
              </option>
            </select>
          </li>
          <li>
            <textarea
              type="text"
              name="note"
              placeholder="특이사항"
              value={join.note}
              onChange={onChangeFn}
            />
          </li>
          <li>
            <button type="button" onClick={onJoinFn}>
              회원가입
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/auth/login");
              }}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/");
              }}
            >
              메인화면
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AuthJoin;
