import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import { useSelector } from 'react-redux';

const CommunityFaq = () => {
  const [faqList, setFaqList] = useState([])
  const url = API_JSON_SERVER_URL
  const [openId, setOpenId] = useState(null)
  const categoryName = {
    reserveall : "예약",
    productall: "상품",
    categoryall : "전체",
    lifting : "울쎄라",
    faceline : "인모드",
    regen : "쥬베룩",
    immune : "글루타치온",
    trouble : "트러블",
    white : "미백",
    hydro : "보습",
    antiage : "안티에이징",
    uv : "UV"
}

  const faqDeleteFn = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios.delete(`${url}/faq/${openId}`);
        alert("질문삭제 성공");
        setOpenId(null); 
        faqListFn();
      } catch (err) {
        alert("삭제실패: " + err);
      }
    }
  };


  // 검색툴바의 활성화 상태 관리
  const [isSearchActive, setIsSearchActive] = useState(false);

  //검색변수
  const [searchText, setSearchText] = useState("");

  //페이징변수
  const pageSize = 8;
  const [page, setPage] = useState(1);

  //검색
  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();

  return faqList.filter((m) => {
    const matchesSearch =
      !q || (m.title && m.title.toLowerCase().includes(q));

      return matchesSearch;
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

    const faqListFn = async () => {
      const res = await axios.get(`${url}/faq`)

  const listWithNumber = res.data
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .map((item, index, arr) => ({
    ...item,
     number: arr.length - index,
  }));
  setFaqList(listWithNumber);
  };
    useEffect(() => {
      faqListFn();
    }, []);
  

  const handleToggleClick = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const user = useSelector((state) => state.input.user);
  const isadmin = user?.role === "ROLE_ADMIN";

  return (
    <div className="inner2">
      <div className="community_wrap">
        <div className="aside_wrap">
          <ul>
            <li><NavLink to={`/community/notice`}>공지사항</NavLink></li>
            <li><NavLink to={`/community/faq`}>자주묻는질문</NavLink></li>
            <li><NavLink to={`/community/qna`}>Q&A</NavLink></li>
          </ul>
        </div>         
        <h3 className="community_title">자주묻는질문</h3>
        <div className="list_search_wrap">
          <span className="list_search_length">
            게시물 <b>{faqList.length}</b>개
          </span>
          <div className="list_search_box">
            <div
              className={`toolbar ${isSearchActive ? "active" : ""}`}
              onClick={() => setIsSearchActive(true)}
            >
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="검색어 입력"
              />
              <span
                className="list_search_btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSearchActive(false);
                  setSearchText("");
                }}
              >
                <img src="/images/icon_close_w.svg" />
              </span>
            </div>
            {isadmin &&(
              <div className="custom-select-container qna_btn">
                <div className="select-selected" onClick={()=>navigate("/community/faq/write")}>
                    글쓰기
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="notice_list">
          <table>
            <thead>
              <tr>
                <td>글번호</td>
                <td>제목</td>
                <td style={{display:`none`}}></td>
              </tr>
            </thead>
            <tbody>
              {pagedList && pagedList.map((el) => {
                return (
                  <React.Fragment key={el.id}>
                    <tr className={openId === el.id ? 'on' : '' }>
                      <td>{el.number}</td>
                      <td style={{ cursor: 'pointer'}} onClick={() => handleToggleClick(el.id)}>
                        <strong>Q.</strong>{el.title}
                      </td>
                      <td style={{display:`none`}}></td>
                    </tr>
                    {openId === el.id && (
                      <tr className="faq_detail">
                        <td></td>
                        <td>
                          <div className="faq_detail_box">
                            <p style={{whiteSpace:'pre-line'}}><strong>A.</strong>{el.description || '내용이 없습니다.'}</p>
                            {isadmin && (
                            <div className="faq_detail_control">
                              <button onClick={()=>navigate(`/community/faq/write/${el.id}`)}>수정</button>
                              <button onClick={faqDeleteFn}>삭제</button>
                            </div>
                            )}
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
        <div className="paging_wrap">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="paging_double first"
            >
              &lt;&lt; {/* 또는 '맨처음' */}
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="paging_one prev"
            >
              이전
            </button>
            <ul className="page_numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <li
                    key={num}
                    onClick={() => setPage(num)}
                    className={page === num ? "active" : ""}
                  >
                    {num}
                  </li>
                ),
              )}
            </ul>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="paging_one next"
            >
              다음
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="paging_double last"
            >
              &gt;&gt; {/* 또는 '맨끝' */}
            </button>
        </div>
      </div>
    </div>
  )
}

export default CommunityFaq