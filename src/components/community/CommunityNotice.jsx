import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import CommunityNoticeModal from './CommunityNoticeModal';

const CommunityNotice = () => {
  const [noticeList, setNoticeList]=useState([])
  const url=API_JSON_SERVER_URL
  const [selectedNotice, setSelectedNotice] = useState(null)
  // const [isBool, setIsBool]=useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    const noticeListFn = async (e) => {
      try {
        const res = await axios.get(`${url}/notice`);
        console.log(res);
        setNoticeList(res.data);
      } catch (err) {
        alert(err);
      }
    };
    noticeListFn();
  },[url])

//   const handleTitleClick = async(notice) => {
//     setSelectedNotice(notice);
  
//   try{
//     const updatedViewrate = Number(notice.viewrate || 0)+1

//     await axios.patch(`${url}/notice/${notice.id}`,{
//       viewrate: updatedViewrate
//     })
//     setNoticeList(prevList => 
//         prevList.map(item => 
//           item.id === notice.id ? { ...item, viewrate: updatedViewrate } : item
//         )
//       );
//   setSelectedNotice(prev=>({...prev, viewrate:updatedViewrate}))
// }catch(err){
//   console.err
// }handleTitleClick()
// }



  return (
    <>
    {/* {isBool && <CommunityNoticeModal setIsBool={setIsBool} data={selectedNotice}/>} */}
    <div className="notice">
      <div className="notice-con">
        <h1>공지사항</h1>
        <table>
        <thead>
          <tr>
            <td>글번호</td>
            <td>제목</td>
            <td>작성일</td>
            <td>조회수</td>
          </tr>
        </thead>
        <tbody>
           {noticeList.map(el => {
            return(
          <tr key={el.id}>
            <td>{el.no}</td>
            <td style={{ cursor: 'pointer' }} onClick={()=>navigate(`${el.id}`)}>
                  {el.title}</td>
            <td>{el.date}</td>
            <td>{el.viewrate}</td>
          </tr>
            )
           })}
        </tbody>
        </table>
      </div>
    </div>
     </>
  )
}


export default CommunityNotice
