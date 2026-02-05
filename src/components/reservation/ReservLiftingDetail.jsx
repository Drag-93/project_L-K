import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_JSON_SERVER_URL } from '../../api/commonApi';
import Calendar from 'react-calendar';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const reserveData={
  id:'',
  category:'',
  name:'',
  timespan:0,
  price:0,
  img:'',
  description:'',
  date: "",
  time: "",
  settime:[]
}

const ReservLiftingDetail = () => {


  const isState=useSelector(state=>state.input.isState)

  
  const {id}=useParams();

  const [reserve, setReserve]=useState(reserveData)

  const url = API_JSON_SERVER_URL

  useEffect(()=>{
    
    const fetchLiftingDetail=async ()=>{
      try{
        const res=await fetch(`${url}/reservation/${id}`)
        const resData=await res.json();
        console.log(resData)

        // category 확인 (보안체크)
        if (resData.category === 'lifting'){
          setReserve(resData);
        }else{
          console.error('카테고리가 일치하지 않습니다.');
        }
      }catch(err){
        console.log('로딩 실패')
      }
    }
    fetchLiftingDetail();
  },[])


  //캘린더
   //날짜 계산
   const minDate = new Date(); // 현재 날짜
   minDate.setDate(minDate.getDate()+1) // 내일 날짜
   const maxDate = new Date();
   maxDate.setMonth(maxDate.getMonth() + 3); // 3개월 후

   //날짜 선택 value 값
   const [dateValue, setDateValue] = useState(minDate);
   const availableTimes = reserve.settime;
 
   //주말만 가져오기
   const isWeekend = (date) => {
     const day = date.getDay();
     return day == 6 || day == 0; // 6:토,0:일
   };
 
 
    // tileDisabled 속성을 사용하여 주말 날짜를 비활성화
   const tileDisabled = ({ date }) => {
      //주말 날짜를 비활성화
     return isWeekend(date);
   };

   // 날짜 변경 핸들러
  const handleDateChange = (newDate) => {
    setDateValue(newDate);
    const formattedDate = newDate.toLocaleDateString('sv-SE'); // YYYY-MM-DD 형식
    setReserve(prev => ({ ...prev, date: formattedDate, time: "" })); // 날짜 변경 시 시간 초기화
  };

  // 시간 선택 핸들러
  const handleTimeSelect = async (selectedTime) => {

    if (!reserve.date) {
      alert("날짜를 먼저 선택해주세요.");
      return;
    }

    try {
      // 서버에서 해당 날짜와 시간에 이미 예약이 있는지 확인 (쿼리 파라미터 활용)
      const res = await axios.get(`${url}/cart?date=${reserve.date}&time=${selectedTime}`);
      
      if (res.data.length > 0) {
        alert("이미 예약된 시간대입니다. 다른 시간을 선택해주세요.");
        return;
      }
      
      // 예약 가능할 경우 상태 업데이트
      setReserve(prev => ({ ...prev, time: selectedTime }));
    } catch (err) {
      console.error("중복 체크 실패", err);
    }
    
  };
  
  
  


  const onPaymentFn = async () => {
    if (!reserve.date || !reserve.time) {
      alert('예약 날짜와 시간을 모두 선택해주세요.');
      return;
    }
    
    if (!window.confirm(`${reserve.date} ${reserve.time}에 예약하시겠습니까?`)) return;

    if (isState) {
      alert('로그인해주세요.');
      return;
    }

    try {
      // JSON-SERVER를 사용할 경우 보통 /bookedList 또는 /orders 경로를 사용합니다.
      const res = await fetch(`${url}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reserve,
          userId: "user01", // 실제 프로젝트에선 로그인된 유저 ID 전달
        })
      });

      if (res.ok) {
        alert('예약이 완료되었습니다');
        // navigate('/shop/mypage');
      }
    } catch (err) {
      alert('통신 오류가 발생했습니다.');
    }
  };




  return (
    <>
    <div className="reservlfting-detail">
      <div className="reservlifting-detail-con">
        <h1>진료 상세페이지</h1>
        <div className="detail-top">
          <div className="detail-top-left">
            <img src={`/images/${reserve.img}`} alt={reserve.img} />
          </div>
          <div className="detail-top-right">
            <ul>
              <li>진료명: {reserve.name}</li>
              <li>소요시간: {reserve.timespan}시간</li>
              <li>가격: {reserve.price}원</li>
              <li>진료정보: {reserve.description}</li>
              <li>
                <Calendar
                    onChange={handleDateChange} 
                    value={dateValue} 
                    showNeighboringMonth={false}
                    next2Label={null} 
                    prev2Label={null}
                    minDetail="year"  
                    // 오늘기준 과거는 클릭 비활성화
                    minDate={minDate}
                    // 오늘기준 3개월 까지만 클릭 활성화
                    maxDate={maxDate}
                    //날짜 칸에 보여지는 컨텐츠
                    tileDisabled={tileDisabled}
                    //비활성화 날짜 목록
                  />
              </li>
              <li className="time-selection">
                <p>예약 시간 선택:</p>
                <div className="time-btns">
                  {availableTimes.map(t => (
                    <button 
                      key={t}
                      className={`time-btn ${reserve.time === t ? 'active' : ''}`}
                      onClick={() => handleTimeSelect(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </li>
              <li>
                선택한 날짜 : <span>{reserve.date}</span>
                선택한 시간 : <span>{reserve.time}</span>
              </li>
              <li>
              <button onClick={onPaymentFn}>장바구니에 담기</button>
              </li>
            </ul>
          </div>
        </div>
        <div className="detail-bottom">
          <ul>
            <li>상세정보</li>
            <li>후기</li>
          </ul>
        </div>
      </div>
    </div>
    </>
  )
}

export default ReservLiftingDetail