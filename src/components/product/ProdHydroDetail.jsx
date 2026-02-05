import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

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

  const [count, setCount]=useState(1)

  useEffect(()=>{
    
    const fetchHydroDetail=async ()=>{
      try{
        const res=await fetch(`${url}/product/${id}`)
        const resData=await res.json();
        console.log(res);
        
        // category 확인 (보안 체크)
        if (resData.category === 'hydro') {
          setHydroDetail(resData);
        } else {
          console.error('카테고리가 일치하지 않습니다.');
        }
      }catch(err){
        console.log('로딩 실패')
      }
    }
    fetchHydroDetail();    
  },[])

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
  const onCartFn=()=>{
    if(!confirm('장바구니로 이동하시겠습니까?')) return;
    navigate(`shop/mypage`);      {/* 장바구니 페이지로 이동~ 장바구니 경로 지정 필요! */}
  }

  return (
    <>
    <div className="prodhydro-detail">
      <div className="prodhydro-detail-con">
        <h1>상품 상세페이지</h1>
        <div className="detail-top">
          <div className="left">
            <img src={`/images/${hydroDetail.img}`} alt={hydroDetail.name} />
          </div>
          <div className="right">
            <div className="right-top">
            <ul>
              <li><span>상품명:</span><span>{hydroDetail.name}</span></li>
              <li><span>상품가격:</span><span>{hydroDetail.price.toLocaleString()}원</span></li>
              <li><span>상품정보:</span><span>{hydroDetail.description}</span></li>
              <li className="deliveryfee">배송비: 3,000원(50,000원 이상 구매 시 무료)</li>
            </ul>
            </div>
            <div className="right-bottom">
              <ul>
                <li>  {/* 상품개수 선택하기 */}
                  <div className="select">
                  <span>{hydroDetail.name}</span>
                  <div className="counter-wrapper">
                    <span className="counter-display">{count}</span>
                    <div className="counter-buttons">
                    <button onClick={plusFn} className="counter-btn">▲</button>
                    <button onClick={minusFn} className="counter-btn">▼</button>
                    </div>
                  </div>
                  <span>{(hydroDetail.price*count).toLocaleString()}원</span>
                  </div>
                </li>
                <li>
                  <span>총 상품금액(수량):</span>
                  <span>{(hydroDetail.price*count).toLocaleString()}원({count}개)</span>
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
            <li>
              <Link to={`#`}>상세정보</Link>            {/* 상세정보 페이지 만들어서 연결 */}
            </li>
            <li>
              <Link to={`#`}>후기</Link>               {/* 후기 페이지 만들어서 연결 */}
            </li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
}

export default ProdHydroDetail
