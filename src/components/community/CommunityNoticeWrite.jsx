import React from 'react'
import { API_JSON_SERVER_URL } from '../../api/commonApi'

const CommunityNoticeWrite = () => {
    const url=API_JSON_SERVER_URL

    const uploadFn=()=>{

    }
  
  return (
    <div className="notice-write">
      <div className="notice-write-con">제목 : 
        <input type="text" name='title' id='title'/>
      </div>
      <div className="notice-write-con">내용 : 
        <textarea type="text" name='container' id='container'/>
      </div>
      <button type="button" onClick={uploadFn}>등록</button>
      <button type="button" onClick={onLoginFn}>취소</button>

    </div>
  )
}

export default CommunityNoticeWrite