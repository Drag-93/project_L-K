import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const initLiftingDetail={
  id:'',
  category:'',
  name:'',
  timespan:0,
  price:0,
  img:'',
  description:''  
}

const ReservLiftingDetail = () => {
  
  const {id}=useParams();

  const [liftingDetail, setLiftingDetail]=useState(initLiftingDetail)

  const url=`http://localhost:3001`

  useEffect(()=>{
    
    const fetchLiftingDetail=async ()=>{
      try{
        const res=await fetch(`${url}/reservation/${id}`)
        const resData=await res.json();
        console.log(resData)

        // category 확인 (보안체크)
        if (resData.category === 'lifting'){
          setLiftingDetail(resData);
        }else{
          console.error('카테고리가 일치하지 않습니다.');
        }
      }catch(err){
        console.log('로딩 실패')
      }
    }
    fetchLiftingDetail();
  },[])

  return (
    <>
    <div className="reservlfting-detail">
      <div className="reservlifting-detail-con">
        <h1>진료 상세페이지</h1>
        <div className="detail-top">
          <div className="detail-top-left">
            <img src={`/images/${liftingDetail.img}`} alt={liftingDetail.img} />
          </div>
          <div className="detail-top-right">
            <ul>
              <li>진료명: {liftingDetail.name}</li>
              <li>소요시간: {liftingDetail.timespan}시간</li>
              <li>가격: {liftingDetail.name}원</li>
              <li>진료정보: {liftingDetail.name}</li>
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