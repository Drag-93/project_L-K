import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";

const AdminReservationModal = ({id, onClose}) => {
  const url=API_JSON_SERVER_URL
  const [detail, setDetail]=useState(null)

  useEffect(()=>{
    const fetchDetail = async(e)=>{
      try{
        if (!id) return
        const res = await axios.get(`${url}/reserveOrders/${id}`)
        console.log(res)
        setDetail(res.data)
      }catch(err){
        alert(err)
      }
    }
    fetchDetail()
  },[id, url])

  const onChangeFn = (e) => {
  const { name, value } = e.target;
  setDetail({ ...detail, [name]: value });
  };

  const reserveUpdateFn = async () => {
  try {
    await axios.put(`${url}/reserveOrders/${id}`, detail);
    alert("예약 수정 성공");
    onClose();
  } catch (err) {
    alert("예약 수정 실패" + err);
  }
  };


  const reserveCancelFn = async () => {
  try {
    await axios.delete(`${url}/reserveOrders/${id}`, detail);
    if(window.confirm('예약을 취소하시겠습니까?'))
    alert("예약을 취소하였습니다.");
    onClose();
  } catch (err) {
    alert("예약 취소 실패" + err);
}
  };




  if (!detail) {
    return <div className="modal">로딩 중...</div>
  }

  const items = detail.items?.[0]
  return(
    <div className="reservemodal">
      <div className="reservemodal-con">
        <h1>예약 상세내역</h1>
        <span onClick={onClose} style={{cursor:'pointer'}}>X</span>
        <ul key={detail.id}>
          <li>
            <label htmlFor="name">진료명</label>
            <input type="text" 
            name="name" 
            id="name" 
            onChange={onChangeFn} 
            value={items?.name}/>            
            </li>
          <li>
            <label htmlFor="name">고객명</label>
            <input type="text" 
            name="name" 
            id="name" 
            onChange={onChangeFn}
            value={detail.customer?.userName}/>
            </li>
          <li>
            <label htmlFor="phonenum">전화번호</label>
            <input type="text" 
            name="phonenum" 
            id="phonenum" 
            onChange={onChangeFn}
            value={detail.customer?.phonenum}/>
            </li>
          <li>
            <label htmlFor="date">날짜</label>
            <input type="text" 
            name="date" 
            id="date" 
            onChange={onChangeFn}
            value={items?.date}/>
            </li>
          <li>
            <label htmlFor="time">시간</label>
            <input type="text" 
            name="time" 
            id="time" 
            onChange={onChangeFn}
            value={items?.time}/>
            </li>
          <li>
            <label htmlFor="name">요청사항</label>
            <input type="text" 
            name="request" 
            id="request" 
            onChange={onChangeFn}
            value={detail.customer?.request}/>
            </li>
        </ul>
        <button onClick={reserveUpdateFn}>예약변경</button>
        <button onClick={reserveCancelFn}>예약취소</button>
      </div>
    </div>
  )
};

export default AdminReservationModal;
