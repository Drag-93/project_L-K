import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logoutF } from "../../store/slice/inputSlice";

const myDataFrom = {
  id: "",
  userId: "",
  userName: "",
  userEmail: "",
  userPw: "",
  phonenum: "",
  age: "",
  address: "",
  gender: "남",
  role: "ROLE_MEMBER",
  remark: "",
};

const AuthMemberList = () => {
  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const isState = useSelector((state) => state.input.isState);

  const param = useParams();
  console.log(param);

  const [myData, setMyData] = useState(myDataFrom);
  

  const navigate = useNavigate();

  useEffect(() => {
    if (isState === true) {
      navigate(`/`);
    }
  }, [state]);

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setMyData({ ...myData, [name]: value });
  };

  const url = API_JSON_SERVER_URL;

  const myDataListFn = async (e) => {
    try {
      const res = await axios.get(`${url}/members/${param.id}`);
      setMyData(res.data);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    myDataListFn();
  }, []);

  const myUpdateFn = async (e) => {
    try {
      const res = await axios.put(`${url}/members/${myData.id}`, myData);
      alert(`회원수정 성공!`);
      setMyData(res.data);
    } catch (err) {
      alert(`오류발생!!`);
    }
  };

  const myDeleteFn = async (e) => {
    if (!confirm(`회원탈퇴하시겠습니까?`)) return;
    try {
      const res = await axios.delete(`${url}/members/${myData.id}`);
      alert(`탈퇴가 완료되었습니다.`);
      setMyData(res.data);

      dispatch(logoutF());
      navigate(`/`);
    } catch (err) {
      alert(`오류발생!!`);
    }
  };


  return (
    <>
    <div className="inner3">
        <div className="auth_wrap">
          <div className="auth_aside_wrap">
            <ul>
              <li><NavLink to={`/auth/mypage/${state.input.user?.id}`}>내 정보</NavLink></li>
              <li><NavLink to={`/auth/mypayment/${state.input.user?.id}`}>결제내역</NavLink></li>
              <li><NavLink to={`/auth/myqna/${state.input.user?.id}`}>내 Q&A</NavLink></li>
              <li><NavLink to={`/auth/myreview/${state.input.user?.id}`}>내 리뷰</NavLink></li>
            </ul>
          </div>
          <div className="auth_list_wrap">
            <h2 className="auth_payment_title">내 정보</h2>
            <div className="mypage_info">
              <ul>
                <li>
                  <b>이름</b>
                  <input
                    type="text"
                    name="userName"
                    placeholder="이름을 입력해주세요"
                    value={myData.userName}
                    onChange={onChangeFn}
                  />
                </li>
                <li>
                  <b>이메일</b>
                  <input
                    type="email"
                    name="userEmail"
                    placeholder="이메일을 입력해주세요"
                    value={myData.userEmail}
                    onChange={onChangeFn}
                    readOnly
                  />
                </li>
                <li>
                  비밀번호 :{" "}
                  <input
                    type="password"
                    name="userPw"
                    placeholder="비밀번호를 입력해주세요"
                    value={myData.userPw}
                    onChange={onChangeFn}
                  />
                </li>
                <li>
                  전화번호 :{" "}
                  <input
                    type="text"
                    name="phonenum"
                    placeholder="전화번호를 입력해주세요"
                    value={myData.phonenum}
                    onChange={onChangeFn}
                  />
                </li>
                <li>
                  나이 :{" "}
                  <input
                    type="text"
                    name="age"
                    placeholder="나이를 입력해주세요"
                    value={myData.age}
                    onChange={onChangeFn}
                  />
                </li>
                <li>
                  주소 :{" "}
                  <input
                    type="text"
                    name="address"
                    placeholder="주소를 입력해주세요"
                    value={myData.address}
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
                    value={myData.gender}
                  >
                    <option value="남" defaultValue>
                      남성
                    </option>
                    <option value="여">여성</option>
                  </select>
                </li>
                <li>
                  권한
                  <input
                    type="role"
                    name="role"
                    id="role"
                    placeholder="주소를 입력해주세요"
                    value={myDataFrom.role}
                    onChange={onChangeFn}
                    readOnly
                  />
                </li>
                <li className="mypage_info_w">
                  <textarea
                    type="text"
                    name="note"
                    placeholder="특이사항"
                    value={myData.note}
                    onChange={onChangeFn}
                  />
                </li>
                <li className="mypage_info_w">
                  <button onClick={myUpdateFn}>수정</button>
                  <button onClick={myDeleteFn}>탈퇴</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthMemberList;
