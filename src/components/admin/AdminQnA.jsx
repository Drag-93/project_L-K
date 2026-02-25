import React, { useEffect, useMemo, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import AdminQnAModal from "./AdminQnAModal";
import axios from "axios";

const AdminQnA = () => {
  const [qnaList, setQnaList] = useState([]);
  const qnaUrl = API_JSON_SERVER_URL;

  const [adminAddModal, setAdminAddModal] = useState(false);
  const [modalId, setModalId] = useState(null);
  const [selectedId, setSelectedId] = useState([]);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [stateFilter, setStateFilter] = useState("ALL");
  const [sortType, setSortType] = useState("Latest");

  const openListFn = async () => {
    const res = await axios.get(`${qnaUrl}/qna`);

    const listWithNumber = res.data
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((item, index, arr) => ({
        ...item,
        number: arr.length - index,
      }));
    setQnaList(listWithNumber);
  };
  useEffect(() => {
    openListFn();
  }, [qnaList]);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return qnaList.filter((m) => {
      if (stateFilter !== "ALL" && m.state !== stateFilter) return false;
      if (!q) return true;

      const searchTarget = [m.state, m.no, m.title, m.date, m.admin, m.question]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchTarget.includes(q);
    });
  }, [searchText, qnaList, stateFilter]);

  const pageSize = 10;
  const btnRange = 10;
  const totalPost = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalPost / pageSize));

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

  const toggleSelect = (id) => {
    const key = String(id);
    setSelectedId((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key],
    );
  };

  const visibleId = pagedList.map((el) => String(el.id));
  const allSelect =
    visibleId.length > 0 && visibleId.every((id) => selectedId.includes(id));
  const onSelectAllFn = () => {
    setSelectedId(allSelect ? [] : visibleId);
  };

  useEffect(() => {
    setSelectedId([]);
  }, [page, searchText]);

  useEffect(() => {
    setPage(1);
  }, [searchText, stateFilter]);

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

  const onDeleteSelectedFn = async () => {
    if (selectedId.length === 0) return alert("삭제할 목록을 선택해 주세요");
    if (!window.confirm("정말 삭제 하시겠습니까?")) return;
    const idsToDelete = [...selectedId];

    try {
      await Promise.all(
        idsToDelete.map((id) => axios.delete(`${qnaUrl}/qna/${id}`)),
      );
      setQnaList((prev) =>
        prev.filter((n) => !idsToDelete.includes(String(n.id))),
      );
      setSelectedId([]);
      alert("삭제 되었습니다");
      await openListFn();
    } catch (err) {
      alert(err);
    }
  };

  const onCancelFn = async () => {
    if (selectedId.length === 0) return alert("취소할 목록을 선택해 주세요");
    if (!window.confirm("정말 취소 하시겠습니까?")) return;
    const idsToCancel = [...selectedId];
    try {
      await Promise.all(
        idsToCancel.map((id) =>
          axios.patch(`${qnaUrl}/qna/${id}`, {
            admin: "",
            answer: "",
            state: "답변대기",
          }),
        ),
      );
      setQnaList((prev) =>
        prev.map((n) =>
          idsToCancel.includes(String(n.id))
            ? { ...n, admin: "", answer: "", state: "답변대기" }
            : n,
        ),
      );

      setSelectedId([]);
      alert("취소 되었습니다");
      await openListFn();
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
        <AdminQnAModal
          setAdminAddModal={setAdminAddModal}
          qnaId={modalId}
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
                <option value="Highest">조회수 (높은순)</option>
                <option value="Lowest">조회순 (낮은순)</option>
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
                  <option value="답변대기">답변대기</option>
                  <option value="답변완료">답변완료</option>
                </select>
              </div>
            </li>
            <li>
              <div className="admin-button">
                {/* <button onClick={() => onSelectAllFn()}>
              {allSelect ? "선택해제" : "전체선택"}
            </button> */}
                <button onClick={() => onCancelFn()}>답변취소</button>
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
                <th>답변상태</th>
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
                    <td title={el.title}>
                      {el.title && el.title.length > 10
                        ? `${el.title.slice(0, 10)}...`
                        : el.title}
                    </td>
                    <td>
                      {el.question && el.question.length > 15
                        ? `${el.question.slice(0, 15)}...`
                        : el.question}
                    </td>
                    <td>{el.viewrate}</td>
                    <td>
                      <span
                        className={`qnaState ${el.state === "답변완료" ? "done" : "wait"}`}
                      >
                        {el.state}
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

export default AdminQnA;
