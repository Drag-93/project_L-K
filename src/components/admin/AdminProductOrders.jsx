import React, { useEffect, useMemo, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import AdminProductOrdersModal from "./AdminProductOrdersModal";

const AdminProductOrders = () => {
  const [prodList, setProdList] = useState([]);
  const prodUrl = API_JSON_SERVER_URL;
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState([]);
  const [adminAddModal, setAdminAddModal] = useState(false);
  const [modalId, setModalId] = useState(null);
  const [stateFilter, setStateFilter] = useState("ALL");
  const [sortType, setSortType] = useState("Latest");

  const openListFn = async () => {
    const res = await axios.get(`${prodUrl}/productOrders`);
    setProdList(res.data);
  };
  useEffect(() => {
    openListFn();
  }, [prodUrl]);

  const allState = (m) => {
    const items = m?.items ?? [];
    if (items.length === 0) return "배송준비중";
    const allDone = items.every((it) => (it.state ?? "").includes("완료"));
    return allDone ? "배송완료" : "배송준비중";
  };

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return prodList.filter((m) => {
      // if (stateFilter !== "ALL" && m.items.state !== stateFilter) return false;
      if (stateFilter !== "ALL" && allState(m) !== stateFilter) return false;
      if (!q) return true;

      const itemText = (m.items ?? [])
        .map((item) =>
          [item.name, item.category, item.state]
            .filter(Boolean)
            .join(" ")
            .toLowerCase(),
        )
        .join(" ");

      const customerText = [
        m.customer?.userName,
        m.customer?.userEmail,
        m.customer?.address,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return `${customerText} ${itemText}`.includes(q);
    });
  }, [prodList, searchText, stateFilter]);

  const pageSize = 10;
  const btnRange = 10;
  const totalPost = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalPost / pageSize));

  const lastPage = totalPages;
  const totalSet = Math.ceil(totalPages / btnRange);
  const currentSet = Math.ceil(page / btnRange);

  const startPage = (currentSet - 1) * btnRange + 1;
  const endPage = startPage + btnRange - 1;

  const startPost = (page - 1) * pageSize;
  const endPost = startPost + pageSize;

  const pagedList = useMemo(() => {
    return filtered.slice(startPost, endPost);
  }, [filtered, startPost, endPost]);

  const sortedList = useMemo(() => {
    return [...pagedList].sort((a, b) => {
      if (sortType === "Latest")
        return new Date(b.productDate) - new Date(a.productDate);
      if (sortType === "Earliest")
        return new Date(a.productDate) - new Date(b.productDate);
      return 0;
    });
  }, [sortType, pagedList]);
  // console.log("sortType", sortType);

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
  const allVisibleSelected =
    pagedList.length > 0 &&
    pagedList.every((n) => selectedId.includes(String(n.id)));

  const adminModalFn = (id) => {
    setModalId(id);
    setAdminAddModal(true);
  };

  const onDeleteSelectedFn = async () => {
    if (selectedId.length === 0) {
      alert("삭제할 목록을 선택해 주세요");
      return;
    }
    if (
      !window.confirm(
        `선택한 ${selectedId.length}개의 결제 항목을 삭제 하시겠습니까?`,
      )
    )
      return;
    const idsToDelete = [...selectedId];
    try {
      await Promise.all(
        idsToDelete.map((id) => axios.delete(`${prodUrl}/productOrders/${id}`)),
      );
      setProdList((prev) =>
        prev.filter((n) => !idsToDelete.includes(String(n.id))),
      );
      setSelectedId([]);
      alert("삭제 되었습니다.");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      {adminAddModal && (
        <AdminProductOrdersModal
          prodId={modalId}
          setAdminAddModal={setAdminAddModal}
          onSuccess={openListFn}
        />
      )}
      <div className="admin">
        <div className="admin-title">
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
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="Latest">등록순 (최신순)</option>
                <option value="Earliest">등록순 (과거순)</option>
              </select>
            </div>
          </div>

          <ul>
            <li>
              <div className="admin-selector">
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                >
                  <option value="ALL">전체</option>
                  <option value="배송준비중">배송준비중</option>
                  <option value="배송완료">배송완료</option>
                </select>
              </div>
            </li>
            <li>
              <div className="admin-button">
                {/* <button onClick={onSelectAllFn}>
                  {selectedId.length !== pagedList.length
                    ? "전체선택"
                    : "선택해제"}
                </button> */}
                {/* <button onClick={() => adminModalFn(null)}>추가</button> */}
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
                <th>주문자</th>
                <th>주문 품목</th>
                <th>주문일</th>
                <th>총 수량</th>
                <th>총 금액</th>
                {/* <th>요청사항</th> */}
                <th>배송 상태</th>
              </tr>
            </thead>
            <tbody>
              {sortedList.map((el) => {
                const itemNames = el.items?.flatMap((m) => m.name).join(",");
                const itemQty = el.items?.reduce((sum, m) => sum + m.count, 0);
                const allDone = el.items?.every((it) =>
                  (it.state ?? "").includes("완료"),
                );
                return (
                  <tr key={el.id} onClick={() => adminModalFn(el.id)}>
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedId.includes(String(el.id))}
                        onChange={() => toggleSelect(el.id)}
                      />
                    </td>
                    <td>{el.customer.userName}</td>
                    <td title={itemNames}>
                      {itemNames && itemNames.length > 10
                        ? `${itemNames.slice(0, 10)}...`
                        : itemNames}
                    </td>
                    <td title={el.productDate}>
                      {el.productDate.length > 23
                        ? el.productDate.slice(0, 10)
                        : el.productDate.slice(0, 9)}
                    </td>
                    <td>{itemQty}</td>
                    <td>{el.totalAmount.toLocaleString()}원</td>
                    {/* <td title={el.customer.request}>
                      {el.customer.request && el.customer.request.length > 10
                        ? `${el.customer.request.slice(0, 10)}...`
                        : el.customer.request}
                    </td> */}
                    <td>
                      <span
                        className={`orderState ${allDone ? "done" : "wait"}`}
                      >
                        {allDone ? "배송완료" : "배송준비중"}
                      </span>
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

export default AdminProductOrders;
