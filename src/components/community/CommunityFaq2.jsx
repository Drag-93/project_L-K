import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import CommunityFaqModal from './CommunityFaqModal';

const CommunityFaq = () => {
  const [faqList, setFaqList]=useState([])
  const url=API_JSON_SERVER_URL
  const [selectedFaq, setSelectedFaq] = useState(null)
  const [isBool, setIsBool]=useState(false)


  const navigate=useNavigate();

    useEffect(()=>{
    const faqListFn=async ()=>{
      try{
        const res=await axios.get(`${url}/faq`)
        console.log(res)
        setFaqList(res.data)
      }catch(err){
        alert(err)
      }
    }
    faqListFn();
  },[url])

  const handleFaqClick=(faq)=>{
    setSelectedFaq(faq)
    setIsBool(true)
  }


  return (
    <>
    {isBool && <CommunityFaqModal setIsBool={setIsBool} data={selectedFaq}/>}
    <div className="faq">
      <div className="faq-con">
        <h1>자주 묻는 질문</h1>
        <table>
        <thead>
          <tr>
            <td>글번호</td>
            <td>제목</td>
            <td>작성일</td>
          </tr>
        </thead>
        <tbody>
           {faqList.map(el => {
            return(
          <tr key={el.id}>
            <td>{el.no}</td>
            <td style={{ cursor: 'pointer' }} onClick={()=>handleFaqClick(el)}>
                  {el.title}</td>
            <td>{el.date}</td>
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


export default CommunityFaq