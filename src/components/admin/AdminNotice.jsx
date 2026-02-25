import React, { useEffect, useMemo, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import AdminNoticeModal from "./AdminNoticeModal";
const AdminNotice = () => {
  const [noticeList, setNoticeList] = useState([]);
  const noticeUrl = API_JSON_SERVER_URL;

  const [adminAddModal, setAdminAddModal] = useState(false);
  const [modalId, setModalId] = useState(null);
  const [selectedId, setSelectedId] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState("Latest");
  // const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return noticeList;

    // if (categoryFilter !== "ALL" && m.category !== categoryFilter) return false;

    return noticeList.filter((m) => {
      const searchTarget = [m.no, m.title, m.date, m.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchTarget.includes(q);
    });
  }, [noticeList, searchText]);

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

  const sortedList = useMemo(() => {
    return [...pagedList].sort((a, b) => {
      if (sortType === "Latest") return new Date(b.date) - new Date(a.date);
      if (sortType === "Earliest") return new Date(a.date) - new Date(b.date);
      if (sortType === "Highest") return b.viewrate - a.viewrate;
      if (sortType === "Lowest") return a.viewrate - b.viewrate;
      return 0;
    });
  }, [sortType, pagedList]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  //검색어가 바뀌면 1페이지로
  useEffect(() => {
    setPage(1);
  }, [searchText]);

  //한국 날짜 표시
  const getKoreaDate = (date) => {
    const today = new Date(date);
    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  };

  //목록 불러오기
  const openListFn = async () => {
    try {
      const res = await axios.get(`${noticeUrl}/notice`);
      const listWithNumber = res.data
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((item, index, arr) => ({
          ...item,
          number: arr.length - index,
        }));
      setNoticeList(listWithNumber);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    openListFn();
  }, []);

  //보이지 않는 선택 제거
  useEffect(() => {
    const visibleId = new Set(filtered.map((n) => String(n.id)));
    setSelectedId((prev) => prev.filter((id) => visibleId.has(String(id))));
  }, [filtered]);

  //모달 열기
  const adminModalFn = (id) => {
    setModalId(id);
    setAdminAddModal(true);
  };

  //체크박스 토글
  const toggleSelect = (id) => {
    const key = String(id);
    setSelectedId((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  };

  //전체선택,해제
  const onSelectAllFn = () => {
    const visibleId = filtered.map((n) => String(n.id));

    const allSelect =
      visibleId.length > 0 && visibleId.every((id) => selectedId.includes(id));

    setSelectedId(allSelect ? [] : visibleId);
  };

  const onDeleteSelectedFn = async () => {
    if (selectedId.length === 0) return alert("삭제할 글을 선택하세요");
    if (!window.confirm("삭제 하시겠습니까?")) return;
    const idsToDelete = [...selectedId];
    try {
      await Promise.all(
        idsToDelete.map((id) => axios.delete(`${noticeUrl}/notice/${id}`)),
      );
      setNoticeList((prev) =>
        prev.filter((n) => !idsToDelete.includes(String(n.id))),
      );
      await openListFn();
      setSelectedId([]);
      alert("삭제 되었습니다.");
    } catch (err) {
      alert(err);
    }
  };

  const allVisibleSelected =
    filtered.length > 0 &&
    filtered.every((n) => selectedId.includes(String(n.id)));

  return (
    <>
      {adminAddModal && (
        <AdminNoticeModal
          setAdminAddModal={setAdminAddModal}
          noticeId={modalId}
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
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                >
                  <option value="">조회수</option>
                  <option value="Highest">조회수 (높은순)</option>
                  <option value="Lowest">조회순 (낮은순)</option>
                </select>
              </div>
              <div className="admin-button">
                {/* <button onClick={() => onSelectAllFn()}>
              {allVisibleSelected ? "선택해제" : "전체선택"}
              </button> */}
                <button onClick={() => adminModalFn(null)}>작성</button>
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
                  <input type="checkbox" onChange={onSelectAllFn} />
                </th>
                <th>글번호</th>
                <th>작성일</th>
                <th>제목</th>
                <th>내용</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {sortedList.map((el) => {
                return (
                  <tr
                    key={el.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      adminModalFn(el.id);
                    }}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedId.includes(String(el.id))}
                        onChange={() => toggleSelect(el.id)}
                      />
                    </td>
                    <td>{el.number}</td>
                    <td>{getKoreaDate(el.date)}</td>
                    <td>{el.title}</td>
                    <td title={el.description}>
                      {el.description && el.description.length > 10
                        ? `${el.description.slice(0, 10)}...`
                        : el.description}
                    </td>
                    <td>{el.viewrate}</td>
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

export default AdminNotice;
