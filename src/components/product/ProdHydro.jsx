import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProdHydro = () => {

  const [hydroList, setHydroList]=useState(null)

  useEffect(()=>{
    const url=`http://localhost:3001`
    const hydroFn= async ()=>{
      try{
        const res=await fetch(`${url}/product?category=hydro`);
        const resData=await res.json();
        console.log(resData)
        setHydroList(resData)
      }catch(err){
        console.log('로딩 실패')
      }
    }
    hydroFn();
  },[])

  return (
    <>
    <div className="prodHydro">
      <div className="prodHydro-con">
        <div className="title">보습</div>
        <div className="hydroList">
          <div className="hydroList-con">
            <ul>              
              {/* 보습라인 상품 */}
              {hydroList && hydroList.map((el,idx)=>{
                return(
                  <li key={el.id}>
                    <Link to={`detail/${el.id}`}>  {/* 상품별 상세페이지 링크 */}
                    <div className="top">
                      <img src={`/images/${el.img}`} alt={el.img} />
                    </div>
                    <div className="bottom">
                    <span>상품명: {el.name}</span>
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

export default ProdHydro;
