import React, { useEffect, useMemo, useRef, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import AdminShopModal from "./AdminShopModal";
import { useNavigate } from "react-router-dom";
import {
  createKakaoMap,
  createMarker,
  loadKakaoMap,
} from "../../utils/kakaoMapUtil";

const AdminShop = () => {
  const [shopList, setShopList] = useState([]);
  const shopUrl = API_JSON_SERVER_URL;
  const [searchText, setSearchText] = useState("");
  const [adminAddModal, setAdminAddModal] = useState(false);
  const [modalId, setModalId] = useState(null);
  const [selectedId, setSelectedId] = useState([]);

  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return shopList;

    return shopList.filter((m) => {
      const searchTarget = [m.name, m.phonenum, m.address]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchTarget.includes(q);
    });
  }, [shopList, searchText]);

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

  const pagedList = useMemo(() => {
    return filtered.slice(startPost, endPost);
  }, [filtered, startPost, endPost]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [searchText]);

  const openListFn = async () => {
    try {
      const res = await axios.get(`${shopUrl}/shop`);
      setShopList(res.data);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    openListFn();
  }, []);

  //예약현황(개수)

  const [reserveList, setReserveList] = useState([]);

  const openReservListFn = async () => {
    const res = await axios.get(`${shopUrl}/reserveOrders`);
    setReserveList(res.data);
  };
  useEffect(() => {
    openReservListFn();
  }, []);

  const shopCount = useMemo(() => {
    if (!reserveList) return;
    return reserveList
      ?.flatMap((order) => order.items ?? [])
      .filter(Boolean)
      .reduce((acc, it) => {
        acc[it.shop] = (acc[it.shop] || 0) + 1;
        return acc;
      }, {});
  }, [reserveList]);

  const toggleSelect = (id) => {
    const key = String(id);
    setSelectedId((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  };

  const onSelectAllFn = () => {
    const visibleId = pagedList.map((el) => String(el.id));

    const allSelect =
      visibleId.length > 0 && visibleId.every((id) => selectedId.includes(id));

    setSelectedId(allSelect ? [] : visibleId);
  };

  useEffect(() => {
    setSelectedId([]);
  }, [page, searchText]);

  const allVisibleSelected =
    filtered.length > 0 &&
    filtered.every((n) => selectedId.includes(String(n.id)));

  const onDeleteSelectedFn = async () => {
    if (selectedId.length === 0) return alert("삭제할 목록을 선택해 주세요");
    if (
      !window.confirm(
        `선택한 ${selectedId.length}개의 항목을 삭제 하시겠습니까?`,
      )
    )
      return;

    const idsToDelete = [...selectedId];

    try {
      await Promise.all(
        idsToDelete.map((id) => axios.delete(`${shopUrl}/shop/${id}`)),
      );
      setShopList((prev) =>
        prev.filter((n) => !idsToDelete.includes(String(n.id))),
      );
      setSelectedId([]);
      alert("삭제 되었습니다.");
    } catch (err) {
      alert(err);
    }
  };

  const adminModalFn = (id) => {
    setModalId(id);
    setAdminAddModal(true);
  };

  return (
    <>
      {adminAddModal && (
        <AdminShopModal
          setAdminAddModal={setAdminAddModal}
          shopId={modalId}
          onSuccess={openListFn}
        />
      )}
      <div className="admin">
        <div className="admin-title">
          <div className="admin-toolbar">
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="검색어 입력"
            />
          </div>

          <ul>
            <li>
              <div className="admin-button">
                {/* <button onClick={onSelectAllFn}>
              {selectedId.length !== pagedList.length ? "전체선택" : "선택해제"}
            </button> */}
                <button onClick={() => adminModalFn(null)}>추가</button>
                <button onClick={() => onDeleteSelectedFn()}>삭제</button>
              </div>
            </li>
          </ul>
        </div>
        <div className="admin-con">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={onSelectAllFn}
                    checked={allVisibleSelected}
                  />
                </th>
                <th>지점명</th>
                <th>연락처</th>
                <th>주소</th>
                <th>예약현황</th>
              </tr>
            </thead>
            <tbody>
              {pagedList.map((el) => {
                return (
                  <tr key={el.id} onClick={() => adminModalFn(el.id)}>
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedId.includes(String(el.id))}
                        onChange={() => toggleSelect(el.id)}
                      />
                    </td>
                    <td>{el.name}</td>
                    <td>{el.phonenum}</td>
                    <td title={el.address}>
                      {el.address && el.address.length > 15
                        ? `${el.address.slice(0, 15)}...`
                        : el.address}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <ul>
                        <li
                          onClick={() =>
                            navigate(`/admin/resorder?name=${el.name}`)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {shopCount[el.name] > 0
                            ? `${shopCount[el.name]}건`
                            : "0건"}
                        </li>
                        <li>
                          <button
                            onClick={() =>
                              navigate(`/admin/resorder?name=${el.name}`)
                            }
                          >
                            이동하기
                          </button>
                        </li>
                      </ul>
                    </td>
                  </tr>
                );
              })}
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
      </div>
    </>
  );
};

export default AdminShop;
