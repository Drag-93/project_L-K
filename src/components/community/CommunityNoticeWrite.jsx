import React from 'react'
import { API_JSON_SERVER_URL } from '../../api/commonApi'

const CommunityNoticeWrite = () => {
    const url=API_JSON_SERVER_URL
  
  return (
    <div className="notice-write">
      <div className="notice-write-con">
        <input type="text" name='title' id='title'/>
      </div>
    </div>
  )
}

export default CommunityNoticeWrite