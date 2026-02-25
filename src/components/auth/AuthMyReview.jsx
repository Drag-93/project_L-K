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

const AuthMyReview = () => {
  const dispatch = useDispatch();

  const state = useSelector((state) => state);
  const isState = useSelector((state) => state.input.isState);

  const param = useParams();
  console.log(param);

  const navigate = useNavigate();

  const url = API_JSON_SERVER_URL;

  const [myReviewList, setMyReviewList] = useState([]);

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

  const currentSortLabel = sortOptions.find(opt => opt.value === sortType)?.label;
  
  //검색, 정렬 기능
  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    let searchList = [...myReviewList];
    
    //검색
    if (q) {
      searchList = searchList.filter((m) => {
        const searchTarget = [m.productName, m.reservName, m.date]
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
  }, [myReviewList, searchText, sortType]);


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

  const fetchAllReviews = async () => {
    try {

      const [resProd, resReserv] = await axios.all([
        axios.get(`${url}/productReview?userEmail=${myData.userEmail}`),
        axios.get(`${url}/reservReview?userEmail=${myData.userEmail}`)
      ]);
  
      const combined = [
        ...resProd.data.map(item => ({ ...item, reviewType: 'product' })),
        ...resReserv.data.map(item => ({ ...item, reviewType: 'reservation' }))
      ];
  
      setMyReviewList(combined);
      console.log("통합 리뷰 데이터:", combined);
    } catch (err) {
      console.error("리뷰 로딩 실패:", err);
    }
  };
  
  useEffect(() => {
    if (!myData?.userEmail) return;
    fetchAllReviews();
  }, [myData?.userEmail]);


  return (
    <>
      <div className="inner3">
        <div className="auth_wrap">
          <div className="auth_aside_wrap">
            <ul>
              <li><NavLink to={`/auth/mypage/${state.input.user?.id}`}>내정보</NavLink></li>
              <li><NavLink to={`/auth/mypayment/${state.input.user?.id}`}>결재내역</NavLink></li>
              <li><NavLink to={`/auth/myqna/${state.input.user?.id}`}>내 Q&A</NavLink></li>
              <li><NavLink to={`/auth/myreview/${state.input.user?.id}`}>내 리뷰</NavLink></li>
            </ul>
          </div>
          <div className="auth_list_wrap">
            <h2>내 리뷰</h2>
            <div className="list_search_wrap">
              <span className="list_search_length">게시물 <b>{myReviewList.length}</b>개</span>
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
            <div className="notice_list review_list">
            {myReviewList.length > 0 ? (
              <table> 
                <thead>
                  <tr>
                    <td>종류</td>
                    <td>상품/진료명</td>
                    <td>작성일</td>
                    <td>추천수</td>
                  </tr>
                </thead>
                <tbody>
                  {myReviewList.length > 0 && pagedList.map((el)=>{
                    return (
                    <tr
                      key={el.id}
                      onClick={(e)=> {
                      e.stopPropagation();
                      const targetPath = el.reviewType === 'product' 
                        ? `/product/detail/${el.category}/${el.productId}` 
                        : `/reservation/detail/${el.category}/${el.reservId}`;
                        navigate(targetPath, { state: { scrollTo: 'review' } });}
                      }
                    >
                      <td>
                        {el.reviewType === 'reservation' ? '진료' : '상품'}
                      </td>
                      <td>
                        {el.reviewType === 'product' ? el.productName : el.reservName}
                      </td>
                      <td>{new Date(el.date).toLocaleDateString()}</td>
                      <td>{el.like}</td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>                                
              ) : (
              <div className="no_data_wrap">
                <div className="no_data_img"></div>
                <span className="no_data_text">등록된 상품이 없습니다</span>
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
      </div>
    </>
  );
};

export default AuthMyReview;
