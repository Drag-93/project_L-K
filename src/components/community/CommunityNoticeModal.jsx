import React, { useEffect, useState } from 'react'

const CommunityNoticeModal = ({setIsBool, data}) => {
  const closeFn = () => setIsBool(false);

  if (!data) return null;

  return (
    <div className="notice-modal" onClick={closeFn}>
      <div className="notice-modal-con" onClick={(e) => e.stopPropagation()}>
        <h1>공지사항 상세</h1>
        <ul>
          <li>제목 : {data.title}</li>
          <li>작성일 : {data.date}</li>
          <li>{data.description}</li>
        </ul>
        <span className='close' onClick={closeFn}>&times;</span>
      </div>
    </div>
  );
}


export default CommunityNoticeModal
