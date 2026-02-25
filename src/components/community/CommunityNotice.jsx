import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { API_JSON_SERVER_URL } from "../../api/commonApi";

const CommunityNotice = () => {
  const [noticeList, setNoticeList] = useState([]);
  const url = API_JSON_SERVER_URL;

  // 검색툴바의 활성화 상태 관리
  const [isSearchActive, setIsSearchActive] = useState(false);

  //검색변수
  const [searchText, setSearchText] = useState("");

  //페이징변수
  const pageSize = 8;
  const [page, setPage] = useState(1);

  //정렬기능변수
  const [sortType, setSortType] = useState("dateN");
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림 상태
      
  // 정렬 옵션 데이터 배열화
  const sortOptions = [
    { value: "dateN", label: "최신순" },
    { value: "dateP", label: "오래된순" },
    { value: "viewN", label: "조회수순" },
    { value: "viewP", label: "조회수역순" },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortType)?.label;

  //검색, 정렬 기능
  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    let searchList = [...noticeList];

    //검색
    if (q) {
      searchList = searchList.filter((m) => {
        const searchTarget = [m.title, m.date]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchTarget.includes(q);
      });
    }

    //정렬
    return searchList.sort((a, b) => {
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      const viewA = Number(a.viewrate || 0);
      const viewB = Number(b.viewrate || 0);

      switch (sortType) {
        case "dateN":
          return timeB - timeA; // 최신순 (날짜 큰 순)
        case "dateP":
          return timeA - timeB; // 오래된순
        case "viewN":
          return viewB - viewA; // 조회수 높은순
        case "viewP":
          return viewA - viewB; // 조회수 낮은순
        default:
          return 0;
      }
    });
  }, [noticeList, searchText, sortType]);

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

  //한국 날짜 표시
  const getKoreaDate = (date) => {
    const today = new Date(date);
    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  };

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
  }, [url]);

  const handleTitleClick = async (notice) => {
    try {
      const updatedViewrate = Number(notice.viewrate || 0) + 1;

      await axios.patch(`${url}/notice/${notice.id}`, {
        viewrate: updatedViewrate,
      });
      navigate(`${notice.id}`);
    } catch (err) {
      navigate(`${notice.id}`);
    }
  };

  return (
    <>
      <div className="inner2">
        <div className="community_wrap">
          <div className="aside_wrap">
            <ul>
              <li><NavLink to={`/community/notice`}>공지사항</NavLink></li>
              <li><NavLink to={`/community/faq`}>자주묻는질문</NavLink></li>
              <li><NavLink to={`/community/qna`}>Q&A</NavLink></li>
            </ul>
          </div>
          <h3 className="community_title">
            공지사항
          </h3>
          <div className="list_search_wrap">
            <span className="list_search_length">게시물 <b>{noticeList.length}</b>개</span>
            <div className="list_search_box">
              <div className={`toolbar ${isSearchActive ? "active" : ""}`} onClick={() => setIsSearchActive(true)}>
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="검색어 입력"
                />
                <span className="list_search_btn"onClick={(e) => {
                    e.stopPropagation();
                    setIsSearchActive(false);
                    setSearchText("");
                  }}>
                  <img src="/images/icon_close_w.svg" />
                </span>
              </div>
              <div className="custom-select-container">
                <div 
                  className={`select-selected ${isOpen ? "select-arrow-active" : ""}`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {currentSortLabel}
                  <img src="/images/icon_filter_w.svg" />
                </div>
                {isOpen && (
                  <ul className="select-items">
                    {sortOptions.map((opt) => (
                      <li 
                        key={opt.value}
                        className={sortType === opt.value ? "same-as-selected" : ""}
                        onClick={() => {
                          setSortType(opt.value);
                          setIsOpen(false);
                        }}
                      >
                        {opt.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="notice_list">
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
                {pagedList &&
                  pagedList.map((el) => {
                    return (
                      <tr key={el.id}>
                        <td>{el.no}</td>
                        <td
                          style={{ cursor: "pointer" }}
                          onClick={() => handleTitleClick(el)}
                        >
                          {el.title}
                        </td>
                        <td>{getKoreaDate(el.date)}</td>
                        <td>{el.viewrate || 0}</td>
                      </tr>
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <li
                  key={num}
                  onClick={() => setPage(num)}
                  className={page === num ? "active" : ""}
                >
                  {num}
                </li>
              ))}
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
    </>
  );
};

export default CommunityNotice;
