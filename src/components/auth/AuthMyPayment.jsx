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

const AuthMyPayment = () => {
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

  return (
    <>
      <div className="mypage_inner">
        <div className="mypage_wrap">
          <h2>내 결제내역</h2>
          <PaymentList/>
        </div>
      </div>
    </>
  );
};

export default AuthMyPayment;
