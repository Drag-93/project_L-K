import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ReservLifting = () => {
  
  const [liftingList, setLiftingList]=useState(null)

  useEffect(()=>{
    const url=`http://localhost:3001`
    const liftingFn= async () =>{
      try{
        const res=await fetch(`${url}/reservation?category=lifting`)
        const resData=await res.json();
        console.log(resData)
        setLiftingList(resData)
      }catch(err){
        console.log('로딩 실패')
      }
    }
    liftingFn();
  },[])
  
  return (
    <>
    <div className="reservLifting">
      <div className="reservLifting-con">
        <div className="title">리프팅</div>
        <div className="liftingList">
          <div className="liftingList-con">
            <ul>
              {/* 리프팅라인 진료 */}
              {liftingList && liftingList.map((el,idx)=>{
                return(
                  <li key={el.id}>
                    <Link to={`detail/${el.id}`}>
                    <div className="top">
                      <img src={`/images/${el.img}`} alt={el.img} />
                    </div>
                    <div className="bottom">
                      <span>진료명: {el.name}</span>
                      <span>소요시간: {el.timespan}시간</span>
                      <span>가격: {el.price}원</span>
                    </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>

  )
};

export default ReservLifting;
