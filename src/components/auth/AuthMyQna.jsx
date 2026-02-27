import React, { useEffect, useMemo, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const myDataFrom = {
  id: "",
  userId: "",
  userName: "",
  userEmail: "",
  userPw: "",
  phonenum: "",
  age: "",
  address: "",
  gender: "남",
  role: "ROLE_MEMBER",
  remark: "",
};

const AuthMyQna = () => {
  const dispatch = useDispatch();
  const url = API_JSON_SERVER_URL;
  const [myQnaList, setMyQnaList] = useState([]);
  const navigate = useNavigate();
  const state = useSelector((state) => state);
  const isState = useSelector((state) => state.input.isState);

  const param = useParams();
  console.log(param);

  const [myData, setMyData] = useState(myDataFrom);
  const myDataListFn = async (e) => {
    try {
      const res = await axios.get(`${url}/members?id=${param.id}`);
      setMyData(res.data[0]);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    myDataListFn();
  }, []);

  useEffect(() => {
    if (isState === true) {
      navigate(`/`);
    }
  }, [state]);

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
    { value: "dateP", label: "오래된순" }
  ];

  const currentSortLabel = sortOptions.find(
    (opt) => opt.value === sortType,
  )?.label;

  //검색, 정렬 기능
  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    let searchList = [...myQnaList];

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

      switch (sortType) {
        case "dateN":
          return timeB - timeA; // 최신순 (날짜 큰 순)
        case "dateP":
          return timeA - timeB; // 오래된순
        default:
          return 0;
      }
    });
  }, [myQnaList, searchText, sortType]);

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

  // myQna
  const myQnaListFn = async () => {
    try {
      const res = await axios.get(`${url}/qna?writerEmail=${myData.userEmail}`);
      setMyQnaList(res.data);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    if (!myData?.userEmail) return;
    myQnaListFn();
  }, [myData?.userEmail]);

  return (
    <>
      <div className="inner3">
        <div className="auth_wrap">
          <div className="auth_aside_wrap">
            <ul>
              <li>
                <NavLink to={`/auth/mypage/${state.input.user?.id}`}>
                  내정보
                </NavLink>
              </li>
              <li>
                <NavLink to={`/auth/mypayment/${state.input.user?.id}`}>
                  결재내역
                </NavLink>
              </li>
              <li>
                <NavLink to={`/auth/myqna/${state.input.user?.id}`}>
                  내 Q&A
                </NavLink>
              </li>
              <li>
                <NavLink to={`/auth/myreview/${state.input.user?.id}`}>
                  내 리뷰
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="auth_list_wrap">
            <h2>내 Q&A</h2>
            <div className="list_search_wrap">
              <span className="list_search_length">
                게시물 <b>{myQnaList.length}</b>개
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
                    {currentSortLabel}
                    <img src="/images/icon_filter_w.svg" />
                  </div>
                  {isOpen && (
                    <ul className="select-items">
                      {sortOptions.map((opt) => (
                        <li
                          key={opt.value}
                          className={
                            sortType === opt.value ? "same-as-selected" : ""
                          }
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
            <div className="notice_list qna_list">
              {myQnaList.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <td>답변상태</td>
                      <td>제목</td>
                      <td>작성일</td>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedList.map((el) => {
                      return (
                        <tr
                          key={el.id}
                          onClick={() => navigate(`/community/qna/${el.id}`)}
                        >
                          <td
                            onClick={(e) => e.stopPropagation()}
                            className={`qnaStateBadge ${el.state === "답변완료" ? "done" : "wait"}`}
                          >
                            {el.state}
                          </td>
                          <td>{el.title}</td>
                          <td onClick={(e) => e.stopPropagation()}>
                            {new Date(el.date).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="no_data_wrap">
                  <div className="no_data_img"></div>
                  <span className="no_data_text">등록된 게시글이 없습니다</span>
                </div>
              )}
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
      </div>
    </>
  );
};

export default AuthMyQna;
