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
        alert(err)
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
                    <Link to={`detail/${el.id}`}>
                    <div className="top">
                      <img src={`/images/${el.img}`} alt={el.img} />
                    </div>
                    <div className="bottom">
                    <span>{el.name}</span>
                    <span>{el.price}원</span>
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
