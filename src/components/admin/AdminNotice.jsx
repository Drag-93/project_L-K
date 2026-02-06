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
  // const [categoryFilter, setCategoryFilter] = useState("ALL");

  const pageSize = 10;
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

  //페이징관련
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length, pageSize]);

  const pagedList = useMemo(() => {
    const firstPage = (page - 1) * pageSize;
    return filtered.slice(firstPage, firstPage + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  //검색어가 바뀌면 1페이지로
  useEffect(() => {
    setPage(1);
  }, [searchText]);

  //목록 불러오기
  const noticeListFn = async () => {
    try {
      const res = await axios.get(`${noticeUrl}/notice`);
      setNoticeList(res.data);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    noticeListFn();
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
      await noticeListFn();
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
          onSuccess={noticeListFn}
        />
      )}
      <div className="adminNotice">
        <div className="adminNotice-con">
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
              {/* <li>
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
              </li> */}
            </ul>
          </div>
          <table>
            <thead>
              <tr>
                <th>선택</th>
                <th>글번호</th>
                <th>작성일</th>
                <th>제목</th>
                <th>내용</th>
                <th>조회수</th>
                <th>상세내용</th>
              </tr>
            </thead>
            <tbody>
              {pagedList.map((el) => {
                return (
                  <tr
                    key={el.id}
                    onClick={() => toggleSelect(el.id)}
                    className={
                      selectedId.includes(String(el.id)) ? "selected" : ""
                    }
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedId.includes(String(el.id))}
                        onChange={() => toggleSelect(el.id)}
                      />
                    </td>
                    <td>{el.no}</td>
                    <td>{el.date}</td>
                    <td>{el.title}</td>
                    <td>
                      {el.description && el.description.length > 10
                        ? `${el.description.slice(0, 10)}...`
                        : el.description}
                    </td>
                    <td>{el.viewrate}</td>

                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        adminModalFn(el.id);
                      }}
                    >
                      수정하기
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="adminNoticeFooter">
            <div className="adminNoticePaging">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                이전
              </button>
              <span>
                {page}/{totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                다음
              </button>
            </div>
            <ul>
              <li>
                <button onClick={() => onSelectAllFn()}>
                  {allVisibleSelected ? "선택해제" : "전체선택"}
                </button>
                <button onClick={() => adminModalFn(null)}>작성</button>
                <button onClick={() => onDeleteSelectedFn()}>삭제</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNotice;
