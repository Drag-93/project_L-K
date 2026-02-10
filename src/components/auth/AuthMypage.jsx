import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logoutF } from "../../store/slice/inputSlice";
import PaymentList from "../order/PaymentList";

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
      const res = await axios.get(`${url}/members?id=${param.id}`);
      setMyData(res.data[0]);
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

  // myQna
  const [myQnaList, setMyQnaList] = useState([]);
  const myQnaListFn = async () => {
    try {
      const res = await axios.get(`${url}/qna?writerEmail=${myData.userEmail}`);
      setMyQnaList(res.data);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    if (!myData?.userEmail) return;
    myQnaListFn();
  }, [myData?.userEmail]);

  return (
    <>
      <div className="mypage_inner">
        <div className="mypage_wrap">
          <h2>내 정보</h2>
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
            <li>
              <textarea
                type="text"
                name="note"
                placeholder="특이사항"
                value={myData.note}
                onChange={onChangeFn}
              />
            </li>
            <li>
              <button onClick={myUpdateFn}>수정</button>
              <button onClick={myDeleteFn}>삭제</button>
            </li>
          </ul>
        </div>
        <div className="mypage_wrap">
          <h2>내 활동내역</h2>
          <ul>
            <li>
              <button onClick={() => navigate(`/order/paymentList`)}>
                결제내역
              </button>
            </li>
          </ul>
          <h2>내 리뷰</h2>
          <ul>
            <li>내용</li>
          </ul>
          <h2>내 Q&A</h2>
          <ul>
            {/* myQna */}
            <li>
              {myQnaList.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <td>글번호</td>
                      <td>제목</td>
                      <td>작성일</td>
                      <td>작성자</td>
                      <td>답변상태</td>
                      <td>조회수</td>
                    </tr>
                  </thead>
                  <tbody>
                    {myQnaList.map((el) => {
                      return (
                        <tr
                          key={el.id}
                          onClick={() => navigate(`/community/qna/${el.id}`)}
                        >
                          <td onClick={(e) => e.stopPropagation()}>{el.no}</td>
                          <td>{el.title}</td>
                          <td>{el.date}</td>
                          <td>{el.writer}</td>
                          <td
                            className={`qnaStateBadge ${el.state === "답변완료" ? "done" : "wait"}`}
                          >
                            {el.state}
                          </td>
                          <td onClick={(e) => e.stopPropagation()}>
                            {el.viewrate}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : null}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AuthMemberList;
