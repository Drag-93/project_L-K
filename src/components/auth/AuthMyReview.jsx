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

const AuthMyReview = () => {
  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const isState = useSelector((state) => state.input.isState);

  const param = useParams();
  console.log(param);

  const navigate = useNavigate();

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

  useEffect(() => {
    if (isState === true) {
      navigate(`/`);
    }
  }, [state]);


  const url = API_JSON_SERVER_URL;

  // myReview(product&reservation)  -->  통합시키기
  const [myProdReviewList, setMyProdReviewList] = useState([]);
  const myProdReviewListFn = async () => {
    try {
      const res = await axios.get(`${url}/productReview?userEmail=${myData.userEmail}`);
      setMyProdReviewList(res.data)
      console.log(res.data)
    } catch (err) {
      alert(err);
    }
  }
  useEffect(() => {
    if (!myData?.userEmail) return;
    myProdReviewListFn();
  }, [myData?.userEmail])
  
  const [myReservReviewList, setMyReservReviewList] = useState([]);
  const myReservReviewListFn = async () => {
    try {
      const res = await axios.get(`${url}/reservReview?userEmail=${myData.userEmail}`);
      setMyReservReviewList(res.data)
      console.log(res.data)
    } catch (err) {
      alert(err);
    }
  }
  useEffect(() => {
    if (!myData?.userEmail) return;
    myReservReviewListFn();
  }, [myData?.userEmail])


  return (
    <>
      <div className="mypage_inner">
        <div className="mypage_wrap">
        <h2 className="community_title">내 리뷰</h2>
        <div className="notice_list">
          {myProdReviewList.length > 0 || myReservReviewList.length > 0 ? (
            <table> 
              <thead>
                <tr>
                  <td>작성일</td>
                  <td>상품/진료명</td>
                  <td>내용</td>
                  <td>추천수</td>
                </tr>
              </thead>
              <tbody>
                {myProdReviewList.length > 0 && myProdReviewList.map((el)=>{
                  return (
                <tr
                  key={el.id}
                  onClick={(e)=> {
                  e.stopPropagation();
                  navigate(`/product/detail/${el.category}/${el.productId}`, 
                            {state: { scrollTo: 'review' } })}
                  }
                >
                  <td>{new Date(el.date).toLocaleDateString()}</td>
                  <td>{el.productName}</td>
                  <td>{el.description && el.description.length > 15 
                      ? `${el.description.slice(0, 15)}...`
                      : el.description}
                  </td>
                  <td>{el.like}회</td>
                </tr>
                  )
                })}
                {myReservReviewList.length > 0 && myReservReviewList.map((el)=>{
                  return (
                <tr
                  key={el.id}
                  onClick={(e)=> {
                  e.stopPropagation();
                  navigate(`/reservation/detail/${el.category}/${el.reservId}`, 
                            {state: { scrollTo: 'review' } })}
                  }
                >
                  <td>{new Date(el.date).toLocaleDateString()}</td>
                  <td>{el.reservName}</td>
                  <td>{el.description && el.description.length > 15 
                      ? `${el.description.slice(0, 15)}...`
                      : el.description}
                  </td>
                  <td>{el.like}회</td>
                </tr>
                  )
                })}
              </tbody>
            </table>                                
            ) : (
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

export default AuthMyReview;
