import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import AdminReservationModal from "./AdminReservationModal";
import { useLocation } from "react-router-dom";
const AdminReservation = () => {
  const [reservationList, setReservationList] = useState([]);
  const reservationUrl = API_JSON_SERVER_URL;
  const [adminAddModal, setAdminAddModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get("name");

  useEffect(() => {
    if (name) {
      setSearchText(name);
    }
  }, [name]);

  const filtered = reservationList.filter((m) => {
    const q = searchText.trim().toLowerCase();
    if (categoryFilter !== "ALL" && m.category !== categoryFilter) return false;

    if (!q) return true;

    const searchTarget = [m.category, m.name, m.price, m.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return searchTarget.includes(q);
  });
  useEffect(() => {
    const reservationListFn = async (e) => {
      try {
        const res = await axios.get(`${reservationUrl}/reservation`);
        setReservationList(res.data);
      } catch (err) {
        alert(err);
      }
    };
    reservationListFn();
  }, [reservationUrl]);

  const adminModalFn = (id) => {
    setSelectedId(id);
    setAdminAddModal(true);
  };

  return (
    <>
      {adminAddModal && (
        <AdminReservationModal
          setAdminAddModal={setAdminAddModal}
          reservationId={selectedId}
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
                    placeholder="검색어 입력"
                  />
                </div>
              </li>
              <li>
                <div className="categorySelector">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="ALL">전체</option>
                    <option value="hydro">보습</option>
                    <option value="antiage">항산화</option>
                    <option value="trouble">트러블케어</option>
                    <option value="uv">자외선차단</option>
                    <option value="white">미백</option>
                  </select>
                </div>
              </li>
            </ul>
          </div>
          <table>
            <thead>
              <tr>
                <th>상품명</th>
                <th>가격</th>
                <th>이미지링크</th>
                <th>예시이미지</th>
                <th>상세설명</th>
                <th>카테고리</th>
                <th>상세보기</th>
              </tr>
            </thead>
            <tbody>
              {filtered &&
                filtered.map((el) => {
                  return (
                    <tr key={el.id}>
                      <td>{el.name}</td>
                      <td>{el.price}</td>
                      <td>{el.img}</td>
                      <td>
                        <img src={`/images/${el.img}`} alt={el.name} />
                      </td>
                      <td>
                        {el.description && el.description.length > 10
                          ? `${el.description.slice(0, 10)}...`
                          : el.description}
                      </td>
                      <td>{el.category}</td>
                      <td
                        onClick={() => {
                          adminModalFn(el.id);
                        }}
                      >
                        보기
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminReservation;
