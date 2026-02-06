import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_JSON_SERVER_URL } from '../../api/commonApi';
import axios from 'axios';
import ProdDetailDesc from './ProdDetailDesc';
import ProdDetailReview from './ProdDetailReview';

const initDetail={
  id:"",
  category:"",
  name:"",
  price:0,
  img:"",
  description:""  
}

const ProdDetail = () => {

  const {category, id}=useParams();
  const url=API_JSON_SERVER_URL;
  const [detail, setDetail]=useState(initDetail);

  useEffect(()=>{

    const fetchDetail=async ()=>{
      try{
        const res=await axios.get(`${url}/product/${id}`);
        console.log(res);

        //category 확인
        if(res.data && res.data.category === `${category}`){
          setDetail(res.data);
        }else{
          console.error('카테고리가 일치하지 않습니다.');
        }
      }catch(err){
        console.log('로딩 실패')
      }
    }
    fetchDetail();
  },[category, id])

  const [count, setCount]=useState(1);

  const plusFn=(e)=>{
    setCount(count+1)
  }
  const minusFn=(e)=>{
    if(count<=1){
      setCount(1)
    }else{
      setCount(count-1)
    }
  }

  const navigate=useNavigate();
  const onCartFn=(e)=>{
    if(!confirm('장바구니로 이동하시겠습니까?')) return;
    navigate(`shop/mypage`);      {/* 장바구니 페이지로 이동~ 장바구니 경로 지정 필요! */}    
  }

  const [menuTab, setMenuTab]=useState('detaildesc');

  return (
    <div className='prod-detail'>
      <div className="prod-detail-con">
        <h1>제품 상세페이지</h1>
        <div className="detail-top">
          <div className="left">
            <img src={`/images/${detail.category}/${detail.img}`} alt={detail.img} />
          </div>
          <div className="right">
            {/* 상품정보(개요) */}
            <div className="right-top">
             <ul>
              <li><span>상품명:</span><span>{detail.name}</span></li>
              <li><span>상품가격:</span><span>{detail.price.toLocaleString()}원</span></li>
              <li><span>상품정보:</span><span>{detail.description}</span></li>
             </ul>              
            </div>
            {/* 상품선택 및 장바구니 담기 */}
            <div className="right-bottom">
              <ul>
                <li>
                  <div className="select">
                    <span>{detail.name}</span>
                    <div className="counter-wrapper">
                      <span className="counter-display">{count}</span>
                      <div className="counter-button">
                        <button onClick={plusFn} className="counter-btn">▲</button>
                        <button onClick={minusFn} className="counter-btn">▼</button>
                      </div>
                    </div>
                      <span>{(detail.price*count).toLocaleString()}원</span>
                  </div>
                </li>
                <li>
                  <span>총 상품금액(수량):</span>
                  <span>{(detail.price*count).toLocaleString()}원({count}개)</span>
                </li>
                <li>
                  <button onClick={onCartFn}>장바구니에 담기</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="detail-bottom">
           <ul>
            <li
            className={`bottom-menu ${menuTab === 'detaildesc' ? 'active' :''}`}
            onClick={()=>{setMenuTab('detaildesc')}}
            >
              상세정보
            </li>
            <li
            className={`bottom-menu ${menuTab === 'review' ? 'active' :''}`}
            onClick={()=>{setMenuTab('review')}}
            >
              후기
            </li>
           </ul>
           <div className="bottom-content">
            {menuTab === 'detaildesc' ? <ProdDetailDesc /> : <ProdDetailReview />}
           </div>
        </div>
      </div>
      
    </div>
  )
}

export default ProdDetail