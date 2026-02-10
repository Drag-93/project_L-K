import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import axios from 'axios'

const reservationList = () => {
  
  const url=API_JSON_SERVER_URL;
  const [list, setList]=useState([]);
  const {category}=useParams();

  useEffect(()=>{
    const listFn=async () => {
      try{
        const res=await axios.get(`${url}/reservation?category=${category}`);
        console.log(res);
        setList(res.data);
      }catch(err){
        console.log('로딩 실패');
      }
    }
    listFn();
  },[category])
  
  return (
    <>
    <div className='prod-list'>
          <div className="prod-list-con">
            <div className="category">
              <li><Link to={`/reservation/list/lifting`}>리프팅</Link></li>
              <li><Link to={`/reservation/list/faceline`}>페이스라인</Link></li>
              <li><Link to={`/reservation/list/regen`}>피부재생</Link></li>
              <li><Link to={`/reservation/list/immune`}>면역력</Link></li>
            </div>
            <div className="list-con">
              <ul>
                {/* 카테고리별 상품 보여주기 */}
                {list && list.map((el,idx)=>{
                  return (
                    <li key={el.id}>
                      <Link to={`/reservation/detail/${el.category}/${el.id}`}>
                      <div className="top">
                        <img src={`/images/${el.category}/${el.img}`} alt={el.img} />
                      </div>
                      <div className="bottom">
                        <span>진료명: {el.name}</span>
                        <span>소요시간: {el.timespan}시간</span>
                        <span>가격: {el.price.toLocaleString()}원</span>
                      </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
    
        </div>
    </>

  )
};

export default reservationList;
