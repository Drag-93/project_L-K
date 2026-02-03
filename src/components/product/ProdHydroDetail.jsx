import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const initHydroDetail={
  id:'',
  category:'',
  name:'',
  price:0,
  img:'',
  description:''
}

const ProdHydroDetail = () => {

  const {id}=useParams();

  const [hydroDetail, setHydroDetail]=useState(initHydroDetail)

  const url=`http://localhost:3001`

  useEffect(()=>{
    
    const fetchHydroDetail=async () =>{
      try{
        const res=await fetch(`${url}/product/${id}`)
        const resData=await res.json();
        console.log(res)
        // setHydroDetail(resData)
        
        // category 확인 (보안 체크)
        if (resData.category === 'hydro') {
          setHydroDetail(resData);
        } else {
          console.error('카테고리가 일치하지 않습니다.');
        }
      }catch(err){
        console.log('상품로딩 실패')
      }
    }
    fetchHydroDetail();    
  },[])

  return (
    <>
    <div className="prodhydro-detail">
      <div className="prodhydro-detail-con">
        <h1>상품 상세페이지</h1>
        <div className="detail-top">
          <div className="detail-top-left">
            <img src={`/images/${hydroDetail.img}`} alt={hydroDetail.name} />
          </div>
          <div className="detail-top-right">
            <ul>
              <li>상품명:{hydroDetail.name}</li>
              <li>상품가격:{hydroDetail.price}원</li>
              <li>기타정보:{hydroDetail.description}</li>
            </ul>
          </div>
        </div>
        <div className="detail-bottom">
          <ul>
            <li>상품정보</li>
            <li>사용후기</li>
            <li>상품문의</li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}

export default ProdHydroDetail
