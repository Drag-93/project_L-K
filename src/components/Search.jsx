import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { API_JSON_SERVER_URL } from "../api/commonApi";

const Search = () => {
  const [combinedList, setCombinedList] = useState([]);
  const url = API_JSON_SERVER_URL;

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
  
  // URL의 쿼리 스트링에서 검색어 가져오기 (?search=키워드)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // reservation과 product 데이터를 동시에 호출
        const [resReservation, resProduct] = await axios.all([
          axios.get(`${url}/reservation`),
          axios.get(`${url}/product`)
        ]);

        // 두 데이터를 하나의 배열로 합침 (구분을 위해 type 속성 추가 가능)
        const combined = [
          ...resReservation.data.map(item => ({ ...item, type: 'reservation' })),
          ...resProduct.data.map(item => ({ ...item, type: 'product' }))
        ];
        
        setCombinedList(combined);
      } catch (err) {
        console.error("데이터 로딩 실패", err);
      }
    };
    fetchAllData();
  }, [url]);

  // 검색어와 일치하는 항목 필터링
  const searchResults = useMemo(() => {
    if (!keyword) return [];

    let searchList = [...combinedList];

    searchList = searchList.sort((a, b) => {
      const timeA = a.date ? new Date(a.date).getTime() : 0;
      const timeB = b.date ? new Date(b.date).getTime() : 0;
      const viewA = Number(a.price || 0);
      const viewB = Number(b.price || 0);

      switch (sortType) {
        case "dateN": return timeB - timeA;
        case "dateP": return timeA - timeB;
        case "priceN": return viewB - viewA;
        case "priceP": return viewA - viewB;
        default: return 0;
      }
    });

    return searchList.filter(item => 
      item.name.toLowerCase().includes(keyword)
    );
  }, [combinedList, keyword, sortType]);

  //페이징
  
  const totalPages = useMemo(() => {
      return Math.max(1, Math.ceil(searchResults.length / pageSize));
    }, [searchResults.length, pageSize]);

    const pagedList = useMemo(() => {
      const firstPage = (page - 1) * pageSize;
      return searchResults.slice(firstPage, firstPage + pageSize);
    }, [searchResults, page, pageSize]);

    useEffect(() => {
      if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    useEffect(() => {
      setPage(1);
    }, [sortType]);

  return (
    <div className="inner">
      <div className="sell_list_wrap">
        <div className="list_search_wrap">
            <span className="list_search_length"><b>'{keyword}'</b>에 대한 검색 결과<b>{searchResults.length}</b>개</span>
            <div className="list_search_box">
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
          {pagedList.length > 0 ? (
          <ul>
            {pagedList && pagedList.map((el) => (
              <li key={`${el.type}-${el.id}`}>
                {/* 타입에 따라 다른 상세 페이지 경로 설정 */}
                <Link to={el.type === 'reservation' 
                  ? `/reservation/detail/${el.category}/${el.id}` 
                  : `/product/detail/${el.category}/${el.id}`}>
                  
                  <div className="top">
                      {el.type === 'reservation'&& el.timespan &&(
                        <div className="time">
                          {el.timespan}시간
                        </div>
                      )}
                      <span className={`badge ${el.type === 'reservation' ? "res" : "pro"}`}>{el.type === 'reservation' ? '진료' : '상품'}</span>
                      <img src={el.img ? `/images/${el.category}/${el.img}` : `/images/all_none.png`} alt={el.name} onError={(e) => {e.target.src = "/images/all_none.png";}}/>
                  </div>
                  
                  <div className="bottom">
                    <span className="name">{el.name}</span>
                    <span className="price">{el.price.toLocaleString()}원</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="no_data_wrap">
            <div className="no_data_img"></div>
            <span className="no_data_text">검색결과가 없습니다</span>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Search;