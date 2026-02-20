import React, { useEffect, useMemo, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import AdminReservationModal from "./AdminReservationModal";
import { useLocation } from "react-router-dom";

const AdminReservation = () => {
  const [reservationList, setReservationList] = useState([]);
  const reservationUrl = API_JSON_SERVER_URL;
  const [reservationAddModal, setReservationAddModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [sortType, setSortType] = useState("latest");
  const [checkedItems, setCheckedItems] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get("name");
  

  // 1. 데이터 불러오기
  const getReservationList = async () => {
    try {
      const res = await axios.get(`${reservationUrl}/reservation`);
      setReservationList(res.data);
      setCheckedItems([]); // 목록 갱신 시 체크 해제
    } catch (err) {
      alert("데이터를 가져오는데 실패했습니다: " + err);
    }
  };

  useEffect(() => { getReservationList(); }, []);
  useEffect(() => { if (name) setSearchText(name); }, [name]);

  // 2. 필터링 및 정렬 로직
  const filtered = useMemo(() => {
    let list = reservationList.filter((m) => {
      const q = searchText.trim().toLowerCase();
      // 카테고리 필터: 카테고리명 혹은 지점명이 필터값과 일치하는지 확인
      if (categoryFilter !== "ALL") {
        const categoryMatch = m.category === categoryFilter;
        const shopMatch = m.setshop?.includes(categoryFilter);
        if (!categoryMatch && !shopMatch) return false;
      }
      if (!q) return true;

      const searchTarget = [m.category, m.name, m.price, m.description, m.setshop?.join(" ")]
        .filter(Boolean).join(" ").toLowerCase();
      return searchTarget.includes(q);
    });

    const compare = (a, b) => {
      if (sortType === "latest") return parseInt(b.id) - parseInt(a.id);
      if (sortType === "oldest") return parseInt(a.id) - parseInt(b.id);
      if (sortType === "expensive") return b.price - a.price;
      if (sortType === "cheapest") return a.price - b.price;
    };
    return [...list].sort(compare);
  }, [reservationList, searchText, categoryFilter, sortType]);

  // 3. 페이지네이션 계산
  const pageSize = 10; // 한 페이지에 보여줄 개수
  const btnRange = 10; // 하단에 보여줄 페이지 버튼 개수
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const totalSet = Math.ceil(totalPages / btnRange);
  const currentSet = Math.ceil(page / btnRange);
  const startPage = (currentSet - 1) * btnRange + 1;
  const endPage = Math.min(startPage + btnRange - 1, totalPages);

  const pagedList = useMemo(() => {
    const startPost = (page - 1) * pageSize;
    return filtered.slice(startPost, startPost + pageSize);
  }, [filtered, page]);

  // 4. 체크박스 핸들러
  const handleSingleCheck = (checked, id) => {
    if (checked) setCheckedItems(prev => [...prev, id]);
    else setCheckedItems(prev => prev.filter(el => el !== id));
  };

  const handleAllCheck = (checked) => {
    // 현재 페이지에 있는 항목들만 전체 선택/해제
    if (checked) setCheckedItems(pagedList.map(el => el.id));
    else setCheckedItems([]);
  };

  // 5. 삭제 로직
  const onDeleteFn = async () => {
    if (checkedItems.length === 0) return alert("삭제할 항목을 선택해주세요.");
    if (!window.confirm(`선택한 ${checkedItems.length}개의 항목을 삭제하시겠습니까?`)) return;

    try {
      await Promise.all(checkedItems.map(id => axios.delete(`${reservationUrl}/reservation/${id}`)));
      alert("삭제되었습니다.");
      getReservationList();
      setPage(1);
    } catch (err) { alert("삭제 실패: " + err); }
  };

  const ReservationModalFn = (id) => {
    setSelectedId(id);
    setReservationAddModal(true);
  };

  return (
    <>
      {reservationAddModal && (
        <AdminReservationModal
          setReservationAddModal={setReservationAddModal}
          reservationId={selectedId}
          onSuccess={getReservationList}
        />
      )}
      <div className="adminReservation">
        <div className="adminReservation-con">
          <div className="title">
            <ul>
              <li>
                <input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="검색어 입력" />
              </li>
              <li>
                <select value={sortType} onChange={(e)=>setSortType(e.target.value)}>
                  <option value="latest">최신순</option>
                  <option value="oldest">과거순</option>
                  <option value="expensive">가격높은순</option>
                  <option value="cheapest">가격낮은순</option>
                </select>
              </li>
              <li>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="ALL">전체 지점</option>
                  <option value="노원">노원</option>
                  <option value="신촌">신촌</option>
                  <option value="강남">강남</option>
                  <option value="종로">종로</option>
                </select>
              </li>
              <li>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="ALL">전체 카테고리</option>
                  <option value="lifting">울쎄라</option>
                  <option value="faceline">인모드</option>
                  <option value="regen">쥬베룩</option>
                  <option value="immune">백옥주사</option>
                </select>
              </li>           
              <li>     
              <button onClick={() => ReservationModalFn(null)}>추가</button>
                <button onClick={onDeleteFn}>삭제</button>
              </li>
            </ul>
          </div>

          <table>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" onChange={(e)=> handleAllCheck(e.target.checked)} 
                         checked={pagedList.length > 0 && checkedItems.length === pagedList.length} />
                </th>
                <th>이미지</th>
                <th>카테고리</th>
                <th>가격</th>
                <th>상세설명</th>
                <th>병원명</th>
              </tr>
            </thead>
            <tbody>
              {pagedList.map((el) => (
                <tr key={el.id}>
                  <td>
                    <input type="checkbox" onChange={(e)=>handleSingleCheck(e.target.checked, el.id)} 
                           checked={checkedItems.includes(el.id)} />
                  </td>
                  <td onClick={() => ReservationModalFn(el.id)} style={{ cursor: 'pointer' }}>
                    <img src={`/images/${el.category}/${el.img}`} alt={el.name} style={{width:'50px'}} />
                  </td>
                  <td onClick={() => ReservationModalFn(el.id)} style={{ cursor: 'pointer' }}>{el.name}</td>
                  <td onClick={() => ReservationModalFn(el.id)} style={{ cursor: 'pointer' }}>{el.price.toLocaleString()}원</td>
                  <td onClick={() => ReservationModalFn(el.id)} className="description" style={{ cursor: 'pointer' }}>
                    {el.description?.slice(0, 15)}...
                  </td>
                  <td onClick={() => ReservationModalFn(el.id)} style={{ cursor: 'pointer' }}>
                    <div className="array-wrapper">
                      {el.setshop?.map((shop, idx) => (<span key={idx} className="badge shop-badge">{shop}</span>))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 UI */}
          <div className="adminReservationFooter">
            <div className="adminReservationPaging">
              <button onClick={() => setPage(1)} disabled={page === 1} style={{ cursor: 'pointer' }}>◀◀</button>
              <button onClick={() => setPage(startPage - 1)} disabled={currentSet === 1} style={{ cursor: 'pointer' }}>◀</button>
              <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ cursor: 'pointer' }}>이전</button>
              
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                const pageNum = startPage + i;
                return (
                  <button key={pageNum} onClick={() => setPage(pageNum)} 
                          className={page === pageNum ? "active" : ""}>
                    {pageNum}
                  </button>
                );
              })}

              <button onClick={() => setPage(page + 1)} disabled={page === totalPages} style={{ cursor: 'pointer' }}>다음</button>
              <button onClick={() => setPage(endPage + 1)} disabled={currentSet === totalSet} style={{ cursor: 'pointer' }}>▶</button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} style={{ cursor: 'pointer' }}>▶▶</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminReservation;