import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import axios from 'axios'

const ProdList = () => {

  const url=API_JSON_SERVER_URL;
  const [list, setList]=useState([]);
  const {category}=useParams();

  useEffect(()=>{
    const listFn=async () => {
      try{
        const res=await axios.get(`${url}/product?category=${category}`);
        console.log(res);
        setList(res.data);
      }catch(err){
        console.log('로딩 실패');
      }
    }
    listFn();
  },[category])

  return (
    <div className='prod-list'>
      <div className="prod-list-con">
        <div className="category">
          <li><Link to={`/product/list/hydro`}>보습</Link></li>
          <li><Link to={`/product/list/trouble`}>트러블케어</Link></li>
          <li><Link to={`/product/list/white`}>미백</Link></li>
          <li><Link to={`/product/list/antiage`}>안티에이징</Link></li>
          <li><Link to={`/product/list/uv`}>UV</Link></li>
        </div>
        <div className="list-con">
          <ul>
            {/* 카테고리별 상품 보여주기 */}
            {list && list.map((el,idx)=>{
              return (
                <li key={el.id}>
                  <Link to={`/product/detail/${el.category}/${el.id}`}>
                  <div className="top">
                    <img src={`/images/${el.category}/${el.img}`} alt={el.img} />
                  </div>
                  <div className="bottom">
                    <span>상품명: {el.name}</span>
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
  )

}

export default ProdList