import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {API_JSON_SERVER_URL} from '../../api/commonApi'

const CommunityNoticeDetail = () => {
  const [noticeDetail, setNoticeDetail]=useState([])
  const url=API_JSON_SERVER_URL


  const navigate=useNavigate();

    useEffect(()=>{
    const noticeDetailFn=async (e)=>{
      try{
        const res=await axios.get(`${url}/notice`)
        console.log(res)
        setNoticeDetail(res.data)
      }catch(err){
        alert(err)
      }
    }
    noticeDetailFn();
  },[])

  return(
    <div className="detail">
      <div className="detail-con">
        <h1>제목</h1>
        <ul>
          <li>이름</li>
          <li>작성일</li>
          <li>조회수</li>
          <li>내용</li>
          <button>수정</button>
          <button onClick={()=>navigate(-1)}>목록</button>
          <button>삭제</button>
        </ul>
      </div>
    </div>
  )

}

export default CommunityNoticeDetail