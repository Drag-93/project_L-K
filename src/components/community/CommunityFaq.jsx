import axios from 'axios'
import React, { useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import { useSelector } from 'react-redux';

const CommunityFaq = () => {
  const [faqList, setFaqList] = useState([])
  const url = API_JSON_SERVER_URL
  const [openId, setOpenId] = useState(null)
  const [titleCategoryFilter, setTitleCategoryFilter] = useState("titlecategoryall");
  const [categoryFilter, setCategoryFilter] = useState("categoryall");
  const categoryName = {
    reserveall : "예약",
    productall: "상품",
    categoryall : "전체",
    lifting : "울쎄라",
    faceline : "인모드",
    regen : "쥬베룩",
    immune : "글루타치온",
    trouble : "트러블케어",
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

  // --- 필터 자동 초기화 로직 추가 ---
useEffect(() => {
  // 상위 카테고리가 '전체'면 하위도 '전체'로
  if (titleCategoryFilter === "titlecategoryall") {
    setCategoryFilter("categoryall");
  } 
  // 상위가 '상품'으로 바뀌면 하위를 '상품 전체'로
  else if (titleCategoryFilter === "product") {
    setCategoryFilter("productall");
  } 
  // 상위가 '예약'으로 바뀌면 하위를 '예약 전체'로
  else if (titleCategoryFilter === "reserve") {
    setCategoryFilter("reserveall");
  }
  
  // 필터가 바뀌면 페이지를 다시 1페이지로 보냅니다.
  setPage(1);
}, [titleCategoryFilter]);

// 하위 필터만 바뀔 때도 1페이지로 이동 (선택 사항)
useEffect(() => {
  setPage(1);
}, [categoryFilter]);


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

      const matchesTitleCategory =
      titleCategoryFilter === "titlecategoryall" ||
      m.titlecategory === titleCategoryFilter;

      const matchesCategory =
      categoryFilter === "categoryall" || 
      categoryFilter === "productall" || 
      categoryFilter === "reserveall" || 
      m.category === categoryFilter;
    return matchesSearch && matchesTitleCategory && matchesCategory;
  });
}, [faqList, searchText, titleCategoryFilter, categoryFilter]);


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
    <div className="faq">
      <div className="faq-con">
        <div className="aside_wrap">
          <ul>
            <li><NavLink to={`/community/notice`}>공지사항</NavLink></li>
            <li><NavLink to={`/community/faq`}>자주묻는질문</NavLink></li>
            <li><NavLink to={`/community/qna`}>Q&A</NavLink></li>
          </ul>
        </div>         
        <h1>자주 묻는 질문</h1>
        <div className="faqtop">
        <div className="toolbar">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="검색어 입력"
          />
        </div>
        <div className="filter-box">
          <select
            value={titleCategoryFilter}
            onChange={(e) => setTitleCategoryFilter(e.target.value)}
          >
            <option value="titlecategoryall">전체</option>
            <option value="product">상품</option>
            <option value="reserve">예약</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {titleCategoryFilter === "titlecategoryall" && (
            <option value="categoryall">전체</option>)}
            {titleCategoryFilter === "product" && (
              <>
                <option value="productall">전체</option>
                <option value="hydro">보습</option>
                <option value="trouble">트러블케어</option>
                <option value="white">미백</option>
                <option value="antiage">안티에이징</option>
                <option value="uv">UV</option>
              </>
            )}

            {titleCategoryFilter === "reserve" && (
              <>
                <option value="reserveall">전체</option>
                <option value="lifting">울쎄라</option>
                <option value="faceline">인모드</option>
                <option value="regen">쥬베룩</option>
                <option value="immune">글루타치온</option>
              </>
            )}
          </select>
        </div>        
        </div>
        <table>
          <thead>
            <tr>
              <td>글번호</td>
              <td>카테고리</td>
              <td>제목</td>
            </tr>
          </thead>
          <tbody>
            {pagedList && pagedList.map((el) => {
              return (
                <React.Fragment key={el.id}>
                  <tr>
                    <td>{el.number}</td>
                    <td>{categoryName[el.category] || el.category}</td>
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
                      {isadmin && (
                    <div className="admin-control">
                      <button onClick={()=>navigate(`/community/faq/write/${el.id}`)}>수정</button>
                      <button onClick={faqDeleteFn}>삭제</button>
                      </div>
                    )}
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
          {isadmin && (
            <button on onClick={()=>navigate("/community/faq/write")}>등록</button>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityFaq