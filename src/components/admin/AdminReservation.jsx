import React, { useEffect, useMemo, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import AdminReservationModal from "./AdminReservationModal";
import { useLocation } from "react-router-dom";


const ControlMenu = ({value, onChange, optionList})=>{
  return(
    <select className="ControlMenu" value={value} onChange={(e)=> onChange(e.target.value)}>
  {optionList.map((it) => (
        <option key={it.value} value={it.value}>{it.name}</option>
      ))}
    </select>
  );
};


const AdminReservation = () => {
  const [reservationList, setReservationList] = useState([]);
  const reservationUrl = API_JSON_SERVER_URL;
  const [reservationAddModal, setReservationAddModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [page, setPage] = useState(1);


  const [sortType, setSortType] = useState("latest")

  const sortOptionList=[
    {value:"latest", name:"최신순"},
    {value:"oldest", name:"과거순"},
    {value:"expensive", name:"가격높은순"},
    {value:"cheapest", name:"가격낮은순"}
  ]



  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get("name");

  // 1. 데이터 불러오기
  const getReservationList = async () => {
    try {
      const res = await axios.get(`${reservationUrl}/reservation`);
      setReservationList(res.data);
    } catch (err) {
      alert("데이터를 가져오는데 실패했습니다: " + err);
    }
  };

  useEffect(() => {
    getReservationList();
  }, []);

  useEffect(() => {
    if (name) setSearchText(name);
  }, [name]);

  // 2. 필터링 로직 (useMemo로 최적화)
  const filtered = useMemo(() => {
    let list = reservationList.filter((m) => {
      const q = searchText.trim().toLowerCase();
      // 카테고리 필터 적용
      if (categoryFilter !== "ALL" && m.category !== categoryFilter) return false;
      if (!q) return true;

      // 검색어 타겟 설정
      const searchTarget = [m.category, m.name, m.price, m.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchTarget.includes(q);
    });

    const compare = (a, b) => {
      if (sortType === "latest") return parseInt(b.id) - parseInt(a.id); // ID가 클수록 최신이라고 가정
      if (sortType === "oldest") return parseInt(a.id) - parseInt(b.id);
      if (sortType === "expensive") return b.price - a.price;
      if (sortType === "cheapest") return a.price - b.price;
    };

    return [...list].sort(compare);
  }, [reservationList, searchText, categoryFilter, sortType]);


  // 3. 페이지네이션 계산
  const pageSize = 10;
  const btnRange = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentSet = Math.ceil(page / btnRange);
  const startPage = (currentSet - 1) * btnRange + 1;
  const endPage = Math.min(startPage + btnRange - 1, totalPages);

  const pagedList = useMemo(() => {
    const startPost = (page - 1) * pageSize;
    return filtered.slice(startPost, startPost + pageSize);
  }, [filtered, page]);

  // 검색 시 1페이지로 리셋
  useEffect(() => {
    setPage(1);
  }, [searchText, categoryFilter]);

  const ReservationModalFn = (id) => {
    setSelectedId(id);
    setReservationAddModal(true);
  };

    const onDeleteFn = async (e) => {
    if (!window.confirm("정말 삭제 하시겠습니까?")) 
      return;
    try {
          await axios.delete(`${reservationUrl}/reservation/${reservationId}`);
          alert("삭제 되었습니다");
          closeFn(); // 삭제 후 닫기
        } catch (err) {
          alert("삭제 중 에러가 발생했습니다.");
        }
      };

  return (
    <>
      {reservationAddModal && (
        <AdminReservationModal
          setReservationAddModal={setReservationAddModal}
          reservationId={selectedId}
          onSuccess={getReservationList} // 수정 성공 시 리스트 갱신용
        />
      )}
      <div className="adminReservation">
        <div className="adminReservation-con">
          <div className="title">
            <ul>
              <li>
                <div className="toolbar">
                  <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="상품명, 카테고리 검색"
                  />
                </div>
              </li>
              <li>
                <div className="arraySelector">
                  <select value={sortType} onChange={(e)=>{setSortType(e.target.value)}}>
                    <option value="latest">등록순(최신순)</option>
                    <option value="oldest">등록순(과거순)</option>
                    <option value="expensive">가격순(높은순)</option>
                    <option value="cheapest">가격순(낮은순)</option>
                  </select>
                </div>
              </li>
              <li>
                <div className="categorySelector">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="ALL">전체</option>
                    <option value="lifting">울쎄라</option>
                    <option value="faceline">인모드</option>
                    <option value="regen">쥬베룩</option>
                    <option value="immune">글루타치온(백옥주사)</option>
                  </select>
                </div>
              </li>
            </ul>
          </div>

          <table>
            <thead>
              <tr>
                <th>이미지</th>
                <th>상품명</th>
                <th>가격</th>
                <th>상세설명</th>
                <th>병원명</th>
                <th>예약시간</th>
                <th>카테고리</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {pagedList.map((el) => (
                <tr key={el.id}>
                  <td>
                    <img src={`/images/${el.category}/${el.img}`} alt={el.name} style={{width:'50px'}} />
                  </td>
                  <td>{el.name}</td>
                  <td>{el.price.toLocaleString()}원</td>
                  <td className="description">
                    {el.description?.length > 15 ? `${el.description.slice(0, 15)}...` : el.description}
                  </td>
                  <td>
                    {/* 자동 줄바꿈 배지 컨테이너 */}
                    <div className="array-wrapper">
                      {el.setshop?.map((shop, idx) => (
                        <span key={idx} className="badge shop-badge">{shop}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="array-wrapper">
                      {el.settime?.map((time, idx) => (
                        <span key={idx} className="badge time-badge">{time}</span>
                      ))}
                    </div>
                  </td>
                  <td>{el.category}</td>
                  <td
                    onClick={() => {ReservationModalFn(el.id)}}>보기
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 UI */}
          <div className="adminReservationPaging">
            <button onClick={() => setPage(1)} disabled={page === 1}>&lt;&lt;</button>
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
              const pNum = startPage + i;
              return (
                <button
                  key={pNum}
                  className={page === pNum ? "active" : ""}
                  onClick={() => setPage(pNum)}
                >
                  {pNum}
                </button>
              );
            })}
            <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>&gt;&gt;</button>
          </div>
          <div className="footer">
            <ul>
              <li>
                <button onClick={() => ReservationModalFn(null)}>추가</button>
                <button onClick={() => onDeleteFn()}>삭제</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminReservation;