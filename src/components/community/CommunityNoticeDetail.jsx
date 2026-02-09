import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {API_JSON_SERVER_URL} from '../../api/commonApi'
import { useDispatch } from 'react-redux';

const CommunityNoticeDetail = () => {
  const {id}=useParams()
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const [noticeDetail, setNoticeDetail]=useState({})
  const url=API_JSON_SERVER_URL

  const noticeUpdateFn = async () => {
    navigate(`/community/notice/update/${id}`); 
  };

  const noticeDeleteFn=async(e)=>{
    if(window.confirm('삭제하시겠습니까?')){
    try{await axios.delete(`${API_JSON_SERVER_URL}/notice/${id}`)

     alert('공지삭제 성공')
     navigate(`/notice`)

    }catch(err){
      alert('삭제실패'+err)
    }
  }
}


    useEffect(()=>{
    const noticeDetailFn=async ()=>{
      try{
        const res=await axios.get(`${url}/notice/${id}`)
        setNoticeDetail(res.data)
      }catch(err){
        alert(err)
      }
    }
    noticeDetailFn();
  },[id, url])

  return(
    <div className="detail">
      <div className="detail-con">
        <ul>
            <li>{noticeDetail.title}</li>
            <li>{noticeDetail.date}</li>
            <li>{noticeDetail.description}</li>
            <button onClick={noticeUpdateFn}>수정</button>
            <button onClick={()=>navigate('/community/notice')}>목록</button>
            <button onClick={noticeDeleteFn}>삭제</button>
          </ul>
      </div>
    </div>
  )

}

export default CommunityNoticeDetail