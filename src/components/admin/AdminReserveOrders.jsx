import React, { useEffect, useMemo, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import AdminReserveOrdersModal from "./AdminReserveOrdersModal";

const AdminReserveOrders = () => {
  const url = API_JSON_SERVER_URL;
  const { id } = useParams();
  const [reserveOrderList, setReserveOrderList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  //검색 변수
  const [selectedId, setSelectedId] = useState([]);
  const [searchText, setSearchText] = useState("");

  //필터기능 변수
  const [filterShop, setFilterShop] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const [sortType, setSortType] = useState("reserveDateDesc"); //정렬기능변수

  const [page, setPage] = useState(1);

  //검색어 이동
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const name = searchParams.get("name");
    if (name) {
      setFilterShop(name);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    // 1. 평탄화
    const allItems = reserveOrderList.flatMap((order) =>
      order.items.map((item) => ({
        ...item,
        customer: order.customer,
        reserveDate: order.reserveDate,
        reserveUserDate: order.reserveUserDate,
        orderId: order.id,
        uniqueKey: `${order.id}-${item.id}`,
      })),
    );

    const q = searchText.trim().toLowerCase();

    // 2. 필터링 (순서: 전체 데이터 -> 조건 걸러내기)
    const filteredItems = allItems.filter((item) => {
      // 드롭다운 필터 조건
      const matchShop = filterShop === "all" || item.shop === filterShop;
      const matchCategory =
        filterCategory === "all" || item.category === filterCategory;
      const matchStatus = filterStatus === "all" || item.state === filterStatus;

      // 검색어 필터 조건
      const totalTime = `${item.date} / ${item.time}`;
      const searchTarget = [
        item.customer?.userName,
        item.customer?.phonenum,
        item.name,
        item.shop,
        item.date,
        item.time,
        totalTime,
        item.state,
        item.reserveUserDate,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchSearch = !q || searchTarget.includes(q);

      // 모든 조건이 일치해야 함 (AND 조건)
      return matchShop && matchCategory && matchStatus && matchSearch;
    });

    // 3. 정렬 (필터링된 결과만 정렬하여 성능 최적화)
    return filteredItems.sort((a, b) => {
      const parseReserveDate = (str) => (str ? new Date(str).getTime() : 0);
      const parseVisitDate = (d, t) =>
        d && t ? new Date(`${d}T${t}:00`).getTime() : 0;

      switch (sortType) {
        case "reserveDateAsc":
          return (
            parseReserveDate(a.reserveDate) - parseReserveDate(b.reserveDate)
          );
        case "reserveDateDesc":
          return (
            parseReserveDate(b.reserveDate) - parseReserveDate(a.reserveDate)
          );
        case "visitDateAsc":
          return (
            parseVisitDate(a.date, a.time) - parseVisitDate(b.date, b.time)
          );
        case "visitDateDesc":
          return (
            parseVisitDate(b.date, b.time) - parseVisitDate(a.date, a.time)
          );
        default:
          return 0;
      }
    });
  }, [
    reserveOrderList,
    searchText,
    sortType,
    filterShop,
    filterCategory,
    filterStatus,
  ]);

  const pageSize = 10;
  const totalPost = filtered.length;
  const btnRange = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const lastPage = Math.ceil(totalPost / pageSize);
  const totalSet = Math.ceil(totalPages / btnRange);
  const currentSet = Math.ceil(page / btnRange);

  const startPage = (currentSet - 1) * btnRange + 1;
  const endPage = startPage + btnRange - 1;

  const startPost = (page - 1) * pageSize;
  const endPost = startPost + pageSize;

  const fetchReserveOrders = async () => {
    try {
      const res = await axios.get(`${url}/reserveOrders`);
      setReserveOrderList(res.data);
    } catch (err) {
      console.error(err);
      alert("데이터를 불러오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchReserveOrders();
  }, [url]);

  const pagedList = useMemo(() => {
    return filtered.slice(startPost, endPost);
  }, [filtered, startPost, endPost]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [searchText, filterShop, filterCategory, filterStatus]);

  // [수정] 체크박스 선택을 위한 ID 목록 생성 시 uniqueKey 사용
  const allVisibleIds = useMemo(
    () => filtered.map((n) => String(n.uniqueKey)),
    [filtered],
  );

  useEffect(() => {
    // 필터링된 결과가 바뀔 때 선택된 ID들 중 더 이상 보이지 않는 ID 제거
    setSelectedId((prev) => prev.filter((id) => allVisibleIds.includes(id)));
  }, [allVisibleIds]);

  const toggleSelect = (uniqueKey) => {
    const key = String(uniqueKey);
    setSelectedId((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  };

  const onSelectAllFn = () => {
    const allSelect =
      allVisibleIds.length > 0 &&
      allVisibleIds.every((id) => selectedId.includes(id));

    setSelectedId(allSelect ? [] : allVisibleIds);
  };

  const onDeleteSelectedFn = async () => {
    if (selectedId.length === 0) return alert("삭제할 항목을 선택하세요");
    if (!window.confirm("선택한 진료 항목을 삭제하시겠습니까?")) return;

    // 1. 선택된 uniqueKey들을 주문 ID별로 그룹화
    // 결과 예시: { "baae": ["eac9", "bd85"], "8acf": ["177f"] }
    const deletionMap = selectedId.reduce((acc, key) => {
      const [orderId, itemId] = key.split("-");
      if (!acc[orderId]) acc[orderId] = [];
      acc[orderId].push(itemId);
      return acc;
    }, {});

    try {
      const orderIds = Object.keys(deletionMap);

      await Promise.all(
        orderIds.map(async (orderId) => {
          // 원본 주문 데이터 찾기
          const originalOrder = reserveOrderList.find(
            (ord) => String(ord.id) === orderId,
          );
          if (!originalOrder) return;

          // 삭제 대상이 아닌 아이템들만 추출
          const remainingItems = originalOrder.items.filter(
            (item) => !deletionMap[orderId].includes(String(item.id)),
          );

          if (remainingItems.length === 0) {
            // [케이스 1] 남은 아이템이 없으면 주문 전체 삭제
            await axios.delete(`${url}/reserveOrders/${orderId}`);
          } else {
            // [케이스 2] 남은 아이템이 있으면 아이템 배열과 총액(totalAmount) 업데이트
            const newTotalAmount = remainingItems.reduce(
              (sum, item) => sum + item.price,
              0,
            );
            await axios.patch(`${url}/reserveOrders/${orderId}`, {
              items: remainingItems,
              totalAmount: newTotalAmount,
            });
          }
        }),
      );

      alert("삭제되었습니다.");
      setSelectedId([]);
      fetchReserveOrders(); // 데이터 다시 불러오기 (서버와 상태 동기화)
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const allVisibleSelected =
    allVisibleIds.length > 0 &&
    allVisibleIds.every((id) => selectedId.includes(id));

  const handleOpenModal = (item) => {
    setSelectedOrder(item);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="admin">
        <div className="admin-title">
          <ul>
            <li>
              <div className="admin-toolbar">
                <div className="admin-toolbar-searchtext">
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="검색어 입력"
                  />
                </div>
                <div className="admin-toolbar-selector">
                  <select
                    value={filterShop}
                    onChange={(e) => setFilterShop(e.target.value)}
                  >
                    <option value="all">병원</option>
                    <option value="노원">노원</option>
                    <option value="신촌">신촌</option>
                    <option value="강남">강남</option>
                    <option value="종로">종로</option>
                  </select>
                </div>

                {/* 내용이 길어서 카테고리는 제외함 */}

                {/* <div className="roleSelector">
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="all">카테고리</option>
                    <option value="lifting">리프팅</option>
                    <option value="faceline">페이스라인</option>
                    <option value="regen">피부재생</option>
                    <option value="immune">면역력</option>
                  </select>
                </div>   */}

                <div className="admin-selector">
                  <div className="admin-selector-state">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">상태</option>
                      <option value="예약대기">예약대기</option>
                      <option value="예약완료">예약완료</option>
                    </select>
                  </div>
                  <div className="admin-selector-date">
                    <select
                      value={sortType}
                      onChange={(e) => setSortType(e.target.value)}
                    >
                      <option value="reserveDateDesc">등록순 (최신순)</option>
                      <option value="reserveDateAsc">등록순 (과거순)</option>
                      <option value="visitDateAsc">
                        예약시간순 (가까운일정)
                      </option>
                      <option value="visitDateDesc">예약시간순 (먼일정)</option>
                    </select>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="admin-button">
          <button onClick={() => onDeleteSelectedFn()}>삭제</button>
        </div>
      </div>
      <div className="admin-con">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={() => onSelectAllFn()}
                  checked={allVisibleSelected}
                />
              </th>
              <th>고객명</th>
              <th>전화번호</th>
              <th>병원명</th>
              <th>진료명</th>
              <th>예약시간</th>
              <th>등록시간</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {pagedList.map((item) => (
              <tr
                key={item.uniqueKey}
                onClick={() => handleOpenModal(item)}
                className={
                  selectedId.includes(String(item.uniqueKey)) ? "selected" : ""
                }
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedId.includes(String(item.uniqueKey))}
                    onChange={() => toggleSelect(item.uniqueKey)}
                  />
                </td>
                <td>{item.customer?.userName}</td>
                <td>{item.customer?.phonenum}</td>
                <td>{item.shop}</td>
                <td>{item.name}</td>
                <td>
                  {item.date} / {item.time}
                </td>
                <td>{item.reserveUserDate}</td>
                <td className="res_order_state">
                  <span className={item.state === "예약완료" ? "ok" : ""}>
                    {item.state}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="admin-footer">
        <div className="admin-paging">
          <button onClick={() => setPage(1)} disabled={page === 1}>
            ◀◀
          </button>
          <button onClick={() => setPage(page - 1)} disabled={page === 1}>
            ◀
          </button>

          {Array.from({ length: btnRange }, (_, i) => {
            const pageNum = startPage + i;
            if (pageNum > lastPage) return null;
            return (
              <button
                key={pageNum}
                onClick={() => {
                  setPage(pageNum);
                }}
                className={page === pageNum ? "active" : ""}
                disabled={page === pageNum}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => {
              setPage(page + 1);
            }}
            disabled={page === lastPage}
          >
            ▶
          </button>
          <button
            onClick={() => {
              setPage(lastPage);
            }}
            disabled={page === lastPage}
          >
            ▶▶
          </button>
        </div>
      </div>
      {isModalOpen && (
        <AdminReserveOrdersModal
          item={selectedOrder}
          onClose={() => setIsModalOpen(false)}
          onRefresh={fetchReserveOrders}
        />
      )}
    </>
  );
};

export default AdminReserveOrders;
