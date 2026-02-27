import React, { useEffect, useMemo, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CommunityQnA = () => {
  const [qnaList, setQnaList] = useState([]);
  const qnaUrl = API_JSON_SERVER_URL;
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const user = useSelector((state) => state.input.user);
  const [sortType, setSortType] = useState("Latest");
  const [stateFilter, setStateFilter] = useState("ALL");
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림 상태

  // 검색툴바의 활성화 상태 관리
  const [isSearchActive, setIsSearchActive] = useState(false);
  const filterOptions = [
    { value: "ALL", label: "전체" },
    { value: "답변완료", label: "답변완료" },
    { value: "답변대기", label: "답변대기" },
  ];
  const currentStateFilter = filterOptions.find(
    (opt) => opt.value === stateFilter,
  )?.label;

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return qnaList.filter((m) => {
      if (stateFilter !== "ALL" && m.state !== stateFilter) return false;
      if (!q) return true;

      const searchTarget = [m.no, m.title, m.date, m.writer]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchTarget.includes(q);
    });
  }, [qnaList, searchText, stateFilter]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length, pageSize]);

  const pagedList = useMemo(() => {
    const firtPage = (page - 1) * pageSize;
    return filtered.slice(firtPage, firtPage + pageSize);
  }, [filtered, page, pageSize]);

  const sortedList = useMemo(() => {
    return [...pagedList].sort((a, b) => {
      if (sortType === "Latest") return new Date(b.date) - new Date(a.date);
      if (sortType === "Earliest") return new Date(a.date) - new Date(b.date);

      return 0;
    });
  }, [sortType, pagedList]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [searchText]);

  const qnaListFn = async () => {
    try {
      const res = await axios.get(`${qnaUrl}/qna`);
      setQnaList(res.data);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    qnaListFn();
  }, []);

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

  const MyQnaList = useMemo(() => {
    if (!user) return [];
    return qnaList.filter((qna) => qna.writerEmail === user.userEmail);
  }, [qnaList, user]);

  return (
    <div className="inner2">
      <div className="community_wrap">
        <div className="aside_wrap">
          <ul>
            <li>
              <NavLink to={`/community/notice`}>공지사항</NavLink>
            </li>
            <li>
              <NavLink to={`/community/faq`}>자주묻는질문</NavLink>
            </li>
            <li>
              <NavLink to={`/community/qna`}>Q&A</NavLink>
            </li>
          </ul>
        </div>
        <h3 className="community_title">Q&A</h3>
        <div className="list_search_wrap">
          <span className="list_search_length">
            게시물 <b>{qnaList.length}</b>개
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
            <div className="custom-select-container">
              <div
                className={`select-selected ${isOpen ? "select-arrow-active" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
              >
                {currentStateFilter}
                <img src="/images/icon_filter_w.svg" />
              </div>
              {isOpen && (
                <ul className="select-items">
                  {filterOptions.map((opt) => (
                    <li
                      key={opt.value}
                      className={
                        stateFilter === opt.value ? "same-as-selected" : ""
                      }
                      onClick={() => {
                        setStateFilter(opt.value);
                        setIsOpen(false);
                      }}
                    >
                      {opt.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="custom-select-container qna_btn">
              <div
                className="select-selected"
                onClick={() => navigate("write")}
              >
                글쓰기
              </div>
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
                <td>작성자</td>
                <td>답변상태</td>
                <td>조회수</td>
              </tr>
            </thead>
            <tbody>
              {sortedList.map((el) => {
                return (
                  <tr key={el.id} onClick={() => navigate(`${el.id}`)}>
                    <td onClick={(e) => e.stopPropagation()}>{el.no}</td>
                    <td>{el.title}</td>
                    <td>{getKoreaDate(el.date)}</td>
                    <td>{el.writer}</td>
                    <td
                      className={`qnaStateBadge ${el.state === "답변완료" ? "done" : "wait"}`}
                    >
                      {el.state}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>{el.viewrate}</td>
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
  );
};

export default CommunityQnA;
