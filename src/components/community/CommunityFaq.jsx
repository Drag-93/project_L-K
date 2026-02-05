import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_JSON_SERVER_URL } from "../../api/commonApi";

const CommunityFaq = () => {
  const [faqList, setFaqList] = useState([])
  const url = API_JSON_SERVER_URL
  const [openId, setOpenId] = useState(null)

  const navigate = useNavigate();

  useEffect(() => {
    const faqListFn = async () => {
      try {
        const res = await axios.get(`${url}/faq`)
        setFaqList(res.data)
      } catch (err) {
        alert("FAQ 목록을 불러오지 못했습니다.")
      }
    }
    faqListFn();
  }, [url])

  const handleToggleClick = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="faq">
      <div className="faq-con">
        <h1>자주 묻는 질문</h1>
        <table>
          <thead>
            <tr>
              <td>글번호</td>
              <td>제목</td>
            </tr>
          </thead>
          <tbody>
            {faqList.map((el) => {
              return (
                <React.Fragment key={el.id}>
                  <tr>
                    <td>{el.no}</td>
                    <td style={{ cursor: 'pointer'}} onClick={() => handleToggleClick(el.id)}>
                      <span style={{ fontWeight: openId === el.id ? 'bold' : 'normal' }}>
                        <strong>Q.</strong>{el.title}
                      </span>
                    </td>
                  </tr>

                  {openId === el.id && (
                    <tr className="faq-detail">
                      <td colSpan="3" style={{ backgroundColor: '#f9f9f9', padding: '20px' }}>
                        <div className="box">
                          <p style={{whiteSpace:'pre-line'}}><strong>A.</strong>{el.description || '내용이 없습니다.'}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CommunityFaq