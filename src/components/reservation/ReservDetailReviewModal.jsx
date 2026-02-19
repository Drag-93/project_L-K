import axios from 'axios'
import React, { useState } from 'react'
import { API_JSON_SERVER_URL } from '../../api/commonApi'

const ReservDetailReviewModal = ({setReviewAddModal, user, reservId, onSuccess}) => {

  const closeFn=()=>{
    setReviewAddModal(false)
  }
  
  // const state=useSelector(state=>state)
  // console.log("전체스토어 구조", state)
  const url=API_JSON_SERVER_URL
  const [reservation, setReservation]=useState([])
  useEffect(()=>{
    const reservFn=async () =>{
      try{
        const res=await axios.get(`${url}/reservation/${reservId}`);
        console.log(res.data);
        setReservation(res.data);
      }catch(err){
        console.log('진료데이터 로딩 실패');
      }
    }
    reservFn();
  },[reservId])

  const [score, setScore]=useState(5)
  const [text, setText]=useState("")

  const submitFn= async () =>{
    if(text.length===0){
      alert('내용을 작성해 주세요');
      return;
    }
    try{
      const res=await axios.post(`${url}/reservReview`,{
        category: reservation.category,
        reservId: reservId,
        reservName: reservation.name,
        userEmail: user.userEmail,
        userName: user.userName,
        date: new Date().toISOString(),
        score: score,
        like: 0,
        likedUsers: [],
        description: text
      })
      onSuccess();
      closeFn();
    }catch(err){
      console.log('후기 등록 실패');
    }
  }
  

  return (
    <div className="review-modal">
      <div className="review-modal-con">
        <h1>후기 작성하기</h1>
        <span className='close' onClick={closeFn}>X</span>
        <div className="reviewer">
          <p>작성자: {user.userName}</p>
          <p>진료명: {reservation.name}</p>
        </div>
        <ul>
          <li className='score-selector'>
            <label htmlFor="score">평점:</label>
            {[1,2,3,4,5].map((num)=>(
            <span key={num}>
              <input type="radio" name="score" id="score"
              value={num}
              checked={score === num}
              onChange={(e) => setScore(Number(e.target.value))} />
              {num}점
            </span>
            ))}
          </li>
          <li>
            <label htmlFor="textarea">상세후기:</label>
            <textarea name="review-text" id="review-text"
            value={text}
            onChange={(e) => setText(e.target.value)} 
            placeholder='제품에 대한 솔직한 후기를 남겨주세요!'
            maxLength="500" />
            <p>{text.length}/500자</p>
          </li>
        </ul>
        <button onClick={submitFn}>후기등록</button>
      </div>
    </div>
  )
}

export default ReservDetailReviewModal