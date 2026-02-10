import React, { useEffect, useMemo, useState } from 'react';
import { API_JSON_SERVER_URL } from '../../api/commonApi';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AdminReserveOrdersModal from './AdminReserveOrdersModal';

const AdminReserveOrders = () => {
  const url = API_JSON_SERVER_URL;
  const { id } = useParams();
  const [reserveOrderList, setReserveOrderList] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  //검색 변수
  const [selectedId, setSelectedId] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
      const q = searchText.trim().toLowerCase();
      // 권한 필터가 'ALL'이 아니고, 회원의 role이 선택한 role과 다르면 목록에서 제외
  
      return reserveOrderList.filter((m) => {
        if (roleFilter !== "ALL" && m.role !== roleFilter) return false;
  
        if (!q) return true;
  
        const searchTarget = [
          m.customer?.userName,
          m.customer?.userEmail,
          m.customer?.phonenum,
          ...(m.items?.map(item => item.date) || []),
          ...(m.items?.map(item => item.time) || []),
          ...(m.items?.map(item => item.shop) || []),
          ...(m.items?.map(item => item.name) || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return searchTarget.includes(q);
      });
    }, [reserveOrderList, searchText, roleFilter]);
  
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
    }, [searchText]);


    useEffect(() => {
        const visibleId = new Set(filtered.map((n) => String(n.id)));
        setSelectedId((prev) => prev.filter((id) => visibleId.has(String(id))));
      }, [filtered]);

    const toggleSelect = (id) => {
      const key = String(id);
      setSelectedId((prev) =>
        prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
      );
    };

    const onSelectAllFn = () => {
      const visibleId = filtered.map((n) => String(n.id));
  
      const allSelect =
        visibleId.length > 0 && visibleId.every((id) => selectedId.includes(id));
  
      setSelectedId(allSelect ? [] : visibleId);
    };

    const onDeleteSelectedFn = async () => {
    if (selectedId.length === 0) return alert("삭제할 항목을 선택하세요");
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    const idsToDelete = [...selectedId];
    try {
      // 모든 삭제 요청 완료 대기
      await Promise.all(
        idsToDelete.map((id) => axios.delete(`${url}/reserveOrders/${id}`))
      );

      // 로컬 상태 즉시 반영 및 서버 데이터 재요청
      setReserveOrderList((prev) =>
        prev.filter((n) => !idsToDelete.includes(String(n.id)))
      );
      
      setSelectedId([]); // 선택 초기화
      alert("삭제 되었습니다.");
      // fetchReserveOrders(); // 필요한 경우 서버와 완전 동기화
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

    const allVisibleSelected =
    filtered.length > 0 &&
    filtered.every((n) => selectedId.includes(String(n.id)));






  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="reserveorderlist">
        <div className="reserveorderlist-con">
        <div className="title">
            <ul>
              <li>
                <div className="toolbar">
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="검색어 입력"
                  />
                </div>
              </li>
              <li>
                <div className="roleSelector">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="ALL">전체</option>
                    <option value="ROLE_MEMBER">일반회원</option>
                    <option value="ROLE_ADMIN">관리자</option>
                  </select>
                </div>
              </li>
            </ul>
          </div>

          <table>
            <thead>
              <tr>
              <th>선택</th>
                <th>병원명</th>
                <th>진료명</th>
                <th>고객명</th>
                <th>전화번호</th>
                <th>예약시간</th>
                <th>상세보기</th>
              </tr>
            </thead>
            <tbody>
              {pagedList.map((el) => {
                const items = el.items?.[0];
                return (
                  <tr key={el.id} onClick={() => toggleSelect(el.id)}
                  className={
                    selectedId.includes(String(el.id)) ? "selected" : ""
                  }>
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedId.includes(String(el.id))}
                        onChange={() => toggleSelect(el.id)}
                      />
                    </td>
                    <td>{items?.shop}</td>
                    <td>{items?.name}</td>
                    <td>{el.customer?.userName}</td>
                    <td>{el.customer?.phonenum}</td>
                    <td>{items?.date} / {items?.time}</td>
                    <td 
                      onClick={(e) => {e.stopPropagation(); handleOpenModal(el)}} 
                      style={{ cursor: 'pointer', color: 'blue' }}
                    >
                      보기
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="adminMembersFooter">
            <div className="adminMembersPaging">
              <button onClick={() => setPage(1)} disabled={page === 1}>
                ◀◀
              </button>
              <button
                onClick={() => setPage(startPage - 1)}
                disabled={currentSet === 1}
              >
                ◀
              </button>
              <button onClick={() => setPage(page - 1)} disabled={page === 1}>
                이전
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
                다음
              </button>
              <button
                onClick={() => {
                  setPage(endPage + 1);
                }}
                disabled={currentSet === totalSet}
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
            <ul>
              <li>
                <button onClick={() => onSelectAllFn()}>
                  {allVisibleSelected ? "전체해제" : "전체선택"}
                </button>
                <button onClick={() => onDeleteSelectedFn()}>삭제</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <AdminReserveOrdersModal 
          id={selectedOrder.id} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};

export default AdminReserveOrders;