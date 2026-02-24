import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

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

const AuthMyQna = () => {
  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const isState = useSelector((state) => state.input.isState);

  const param = useParams();
  console.log(param);

  const [myData, setMyData] = useState(myDataFrom);
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


  const navigate = useNavigate();

  useEffect(() => {
    if (isState === true) {
      navigate(`/`);
    }
  }, [state]);


  const url = API_JSON_SERVER_URL;


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
          <h2 className="community_title">내 Q&A</h2>
          <div className="notice_list">
            {myQnaList.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <td>작성일</td>
                  <td>제목</td>
                  <td>답변상태</td>
                </tr>
              </thead>
              <tbody>
                {myQnaList.map((el) => {
                  return (
                    <tr
                      key={el.id}
                      onClick={() => navigate(`/community/qna/${el.id}`)}
                    >
                      <td onClick={(e) => e.stopPropagation()}>
                        {el.date}
                      </td>
                      <td>{el.title}</td>
                      <td
                        onClick={(e) => e.stopPropagation()}
                        className={`qnaStateBadge ${el.state === "답변완료" ? "done" : "wait"}`}
                      >
                        {el.state}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) :(
            <div className="no_data_wrap">
                <div className="no_data_img"></div>
                <span className="no_data_text">등록된 상품이 없습니다</span>
              </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthMyQna;
