import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import axios from 'axios'

const ReservationList = () => {
  
  const url=API_JSON_SERVER_URL;
  const [list, setList]=useState([]);
  const {category}=useParams();

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
    { value: "priceN", label: "높은가격순" },
    { value: "priceP", label: "낮은가격순" },
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
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
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
    <div className='prod-list'>
        <div className="prod-list-con">
          <div className="list_search_wrap">
            <div className="list_search_box">
              <div className="toolbar">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="검색어 입력"
              />
              </div>
              <div className="custom-select-container">
                <div 
                  className={`select-selected ${isOpen ? "select-arrow-active" : ""}`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {currentSortLabel}
                  <img src="/public/images/icon_filter_w.svg" />
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
          <div className="list-con">
            <ul>
              {/* 카테고리별 상품 보여주기 */}
              {pagedList && pagedList.map((el,idx)=>{
                return (
                  <li key={el.id}>
                    <Link to={`/reservation/detail/${el.category}/${el.id}`}>
                    <div className="top">
                      <img src={`/images/${el.category}/${el.img}`} alt={el.img} />
                    </div>
                    <div className="bottom">
                      <span>진료명: {el.name}</span>
                      <span>소요시간: {el.timespan}시간</span>
                      <span>가격: {el.price.toLocaleString()}원</span>
                    </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
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
    </>

  )
};

export default ReservationList;
    
