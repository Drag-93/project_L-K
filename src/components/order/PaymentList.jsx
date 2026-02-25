import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_JSON_SERVER_URL } from '../../api/commonApi';
import { useNavigate } from 'react-router-dom';

const categoryMap = {
  lifting: "리프팅",
  faceline: "페이스라인",
  regen: "피부재생",
  immune: "면역력",
  hydro: "보습제품",
  trouble: "트러블",
  white: "화이트",
  antiage: "안티에이징",
  uv: "UV"
};

const PaymentList = () => {
  const [productOrders, setProductOrders] = useState([]);
  const [reserveOrders, setReserveOrders] = useState([]);

  const [allOrders, setAllOrders] = useState([]); // 통합 데이터
  const [filter, setFilter] = useState('all');

  const navigate=useNavigate()

  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state) => state.input.user);
  const state = useSelector((state) => state);
  const isState = useSelector((state) => state.input.isState);

  


  useEffect(() => {
      if (isState === true) {
        alert(`로그인 후 이용하세요`);
        navigate(`/auth/login`);
      }
    }, [state]);

  // 1. 데이터 가져오기 및 통합
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [prodRes, resRes] = await Promise.all([
          axios.get(`${API_JSON_SERVER_URL}/productOrders`),
          axios.get(`${API_JSON_SERVER_URL}/reserveOrders`)
        ]);

        // 내 이메일에 해당하는 주문만 필터링 + 타입 속성 부여
        const myProds = prodRes.data
          .filter(order => order.customer.userEmail === userInfo?.userEmail)
          .map(order => ({ ...order, type: 'product', dateForSort: order.productDate }));
        
        const myReserves = resRes.data
          .filter(order => order.customer.userEmail === userInfo?.userEmail)
          .map(order => ({ ...order, type: 'reserve', dateForSort: order.reserveDate }));

        // 데이터 합치기 및 최신순 정렬
        const combined = [...myProds, ...myReserves].sort((a, b) => 
          new Date(b.dateForSort) - new Date(a.dateForSort)
        );

        setAllOrders(combined);
        setLoading(false);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setLoading(false);
      }
    };

    if (userInfo?.userEmail) fetchOrders();
  }, [userInfo]);


    // 검색툴바의 활성화 상태 관리
    const [isSearchActive, setIsSearchActive] = useState(false);
  
    //검색변수
    const [searchText, setSearchText] = useState("");

    //페이징변수
    const pageSize = 4;
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
  const filteredList = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    let searchList = [...allOrders];

    if (filter !== 'all') {
      searchList = searchList.filter(order => order.type === filter);
    }
    
    //검색
    if (q) {
      searchList = searchList.filter((order) => {
        const itemNames = order.items.map(i => i.name).join(" ");
        const searchTarget = `${itemNames} ${order.dateForSort}`.toLowerCase();
        return searchTarget.includes(q);
      });
    }

    //정렬
    return searchList.sort((a, b) => {
      const timeA = new Date(a.dateForSort).getTime();
      const timeB = new Date(b.dateForSort).getTime();
      const priceA = Number(a.totalAmount || 0);
      const priceB = Number(b.totalAmount || 0);

      switch (sortType) {
        case "dateN":
          return timeB - timeA;
        case "dateP":
          return timeA - timeB; 
        case "priceN":
          return priceB - priceA; 
        case "priceP":
          return priceA - priceB; 
        default:
          return 0;
      }
    });
  }, [allOrders, searchText, sortType, filter]);


    //페이징


    const totalPages = useMemo(() => {
      return Math.max(1, Math.ceil(filteredList.length / pageSize));
    }, [filteredList.length, pageSize]);

    const pagedList = useMemo(() => {
      const firstIndex = (page - 1) * pageSize;
      return filteredList.slice(firstIndex, firstIndex + pageSize);
    }, [filteredList, page, pageSize]);

    // 필터 변경 시 페이지를 1페이지로 리셋
    useEffect(() => {
      setPage(1);
    }, [filter, searchText]);


  if (loading) return <div className="loading">내역을 불러오는 중...</div>;

  return (
    <div className="order_wrap">
      <div className="paylist_tab">
        <ul className="tab_menu">
          <li className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>전체</li>
          <li className={filter === 'product' ? 'active' : ''} onClick={() => setFilter('product')}>상품주문</li>
          <li className={filter === 'reserve' ? 'active' : ''} onClick={() => setFilter('reserve')}>진료예약</li>
        </ul>
      </div>
      <div className="list_search_wrap">
        <span className="list_search_length">결제내역 <b>{filteredList.length}</b>건</span>
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
      {pagedList.length === 0 ? (
          <>
            <div className="empty_cart">
              <p>결재내역이 없습니다.</p>
            </div>
          </>
        ) : (
          <div className="paylist_wrap">
            {/* 일반 상품 주문 섹션 */}
            <div className="paylist">
              {pagedList.map((order) => (
                <div key={order.id} className="paylist_card product">
                  <div className="paylist_header">
                  {order.type === 'product' ? (
                            <span className="paylist_date">{order.productUserDate}</span>
                          ) : (
                            <span className="paylist_date">{order.reserveUserDate}</span>
                          )}
                  </div>
                  <div className="paylist_list">
                    {order.items.map((item, idx) => {
                      const korCategory = categoryMap[item.category] || item.category;
                      return(
                      <div key={idx} className="paylist_row">
                        {/* 이미지 경로: /images/카테고리/파일명 */}
                        <img 
                          src={`/images/${item.category}/${item.img}`} 
                          alt={item.name} 
                          className="paylist_img" 
                        />
                        <div className="paylist_info">
                          <p className="paylist_category">[{korCategory}]</p>
                          <p className="paylist_name">{item.name}</p>
                          {item.state && (
                            <small className={`paylist_state_badge ${item.state === '예약완료' || item.state === '배송완료' ? 'ok' : ''}`}>
                              {item.state}
                            </small>
                          )}
                          {order.type === 'product' ? (
                            <p className="paylist_price">
                              {item.count}개 / {(Number(item.price) * Number(item.count)).toLocaleString()}원
                            </p>
                          ) : (
                            <p className="paylist_price">
                              <span className="paylist_time_info">예약시간 : {item.date} / {item.time}</span>
                              {Number(item.price).toLocaleString()}원 
                            </p>
                          )}
                        </div>
                      </div>
                    )})}
                  </div>
                  <div className="paylist_footer">
                    <span className="paylist_total">총 결제금액</span>
                    <span className="paylist_total_price">{order.totalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              ))}
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
        )}
    </div>
  );
};

export default PaymentList;