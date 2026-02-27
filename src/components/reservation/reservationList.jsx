import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import axios from 'axios'

const ReservationList = () => {
  
  const url=API_JSON_SERVER_URL;
  const [list, setList]=useState([]);
  const {category}=useParams();

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
    { value: "priceN", label: "높은가격" },
    { value: "priceP", label: "낮은가격" },
  ];

  const currentSortLabel = sortOptions.find(opt => opt.value === sortType)?.label;

  //검색, 정렬 기능
  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    let searchList = [...list];

    //검색
    if (q) {
      searchList = searchList.filter((m) => {
        const searchTarget = [m.name].filter(Boolean).join(" ").toLowerCase();
        return searchTarget.includes(q);
      });
    }

    //정렬
    return searchList.sort((a, b) => {
      const timeA = a.regDate ? new Date(a.regDate).getTime() : 0;
      const timeB = b.regDate ? new Date(b.regDate).getTime() : 0;
      const viewA = Number(a.price || 0);
      const viewB = Number(b.price || 0);

      switch (sortType) {
        case "dateN": return timeB - timeA; // 최신순 (날짜 큰 순)
        case "dateP": return timeA - timeB; // 오래된순
        case "priceN": return viewB - viewA; // 조회수 높은순
        case "priceP": return viewA - viewB; // 조회수 낮은순
        default: return 0;
      }
    });

  }, [list, searchText, sortType]);

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



  useEffect(()=>{
    const listFn=async () => {
      try{
        let requestUrl = `${url}/reservation`;

        // 2. category 값이 존재할 때만 쿼리 스트링 추가
        if (category) {
          requestUrl += `?category=${category}`;
        }
        const res = await axios.get(requestUrl);
        console.log(res);
        setList(res.data);
      }catch(err){
        console.log('로딩 실패');
      }
    }
    listFn();
  },[category,url])
  
  return (
    <>
    <div className='inner'>
        <div className="sell_list_wrap">
          <img src={`/images/banner_${category || 'all'}.png`} className="sell_banner" />
          <div className="aside_wrap">
            <ul>
              <li><NavLink to={`/reservation/list`} end>전체</NavLink></li>
              <li><NavLink to={`/reservation/list/lifting`}>리프팅</NavLink></li>
              <li><NavLink to={`/reservation/list/faceline`}>페이스라인</NavLink></li>
              <li><NavLink to={`/reservation/list/regen`}>피부재생</NavLink></li>
              <li><NavLink to={`/reservation/list/immune`}>면역력</NavLink></li>
            </ul>
          </div>
          <div className="list_search_wrap">
            <span className="list_search_length">상품 <b>{list.length}</b>개</span>
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
          
          <div className="sell_list">
           {pagedList && pagedList.length > 0 ? (
              <ul>
                {pagedList.map((el) => (
                  <li key={el.id}>
                    <Link to={`/reservation/detail/${el.category}/${el.id}`}>
                      <div className="top">
                        <div className="time">
                          {el.timespan}시간
                        </div>
                        <img src={el.img ? `/images/${el.category}/${el.img}` : `/images/all_none.png`} alt={el.name} onError={(e) => {e.target.src = "/images/all_none.png";}}/>
                      </div>
                      <div className="bottom">
                        <span className="name">{el.name}</span>
                        <span className="price">{el.price.toLocaleString()}<small>원</small></span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
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
    </>

  )
};

export default ReservationList;
    
