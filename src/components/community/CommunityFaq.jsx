import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_JSON_SERVER_URL } from "../../api/commonApi";

const CommunityFaq = () => {
  const [faqList, setFaqList] = useState([])
  const url = API_JSON_SERVER_URL
  const [openId, setOpenId] = useState(null)

  //검색변수
  const [searchText, setSearchText] = useState("");

  //페이징변수
  const pageSize = 8;
  const [page, setPage] = useState(1);

  //검색
  const filtered = useMemo(() => {
      const q = searchText.trim().toLowerCase();
      if (!q) return faqList;
  
      return faqList.filter((m) => {
        const searchTarget = [m.title]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
  
        return searchTarget.includes(q);
      });
    }, [faqList, searchText]);

  //페이징
  const totalPages = useMemo(() => {
      return Math.max(1, Math.ceil(filtered.length / pageSize));
    }, [filtered.length, pageSize]);

    const pagedList = useMemo(() => {
      const firstPage = (page - 1) * pageSize;
      return filtered.slice(firstPage, firstPage + pageSize);
    }, [filtered, page, pageSize]);

    useEffect(() => {
      if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    useEffect(() => {
      setPage(1);
    }, [searchText]);

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
        <div className="toolbar">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="검색어 입력"
          />
        </div>
        <table>
          <thead>
            <tr>
              <td>글번호</td>
              <td>제목</td>
            </tr>
          </thead>
          <tbody>
            {pagedList && pagedList.map((el) => {
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
        <div className="QnAFooter">
          <div className="QnAFooter-con">
            <div className="QnAPaging">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                이전
              </button>
              <span>
                {page}/{totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                다음
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityFaq