import React, { useEffect, useMemo, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import AdminMembersModal from "./AdminMembersModal";
const AdminMembers = () => {
  const [memberList, setMemberList] = useState([]);
  const memberUrl = API_JSON_SERVER_URL;
  const [adminAddModal, setAdminAddModal] = useState(false);
  const [modalId, setModalId] = useState(false);
  const [selectedId, setSelectedId] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const pageSize = 10;
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    // 권한 필터가 'ALL'이 아니고, 회원의 role이 선택한 role과 다르면 목록에서 제외
    if (roleFilter !== "ALL" && m.role !== roleFilter) return false;

    if (!q) return memberList;

    return memberList.filter((m) => {
      const searchTarget = [
        m.userName,
        m.userEmail,
        m.phonenum,
        m.address,
        m.remark,
        m.role,
        m.gender,
        m.age,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchTarget.includes(q);
    });
  }, [memberList, searchText]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length, pageSize]);

  const pagedList = useMemo(() => {
    const firtsPage = (page - 1) * pageSize;
    return filtered.slice(firtsPage, firtsPage + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [searchText]);

  const memberListFn = async () => {
    try {
      const res = await axios.get(`${memberUrl}/members`);
      setMemberList(res.data);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    memberListFn();
  }, []);

  useEffect(() => {
    const visibleId = new Set(filtered.map((n) => String(n.id)));
    setSelectedId((prev) => prev.filter((id) => visibleId.has(String(id))));
  }, [filtered]);

  const adminModalFn = (id) => {
    setModalId(id);
    setAdminAddModal(true);
  };

  const onSelectAllFn = () => {
    const visibleId = filtered.map((n) => String(n.id));

    const allSelect =
      visibleId.length > 0 && visibleId.every((id) => selectedId.includes(id));

    setSelectedId(allSelect ? [] : visibleId);
  };

  const onDeleteSelectedFn = async () => {
    if (selectedId.length === 0) return alert("삭제할 멤버를 선택하세요");
    if (!window.confirm("삭제 하시겠습니까?")) return;
    const idsToDelete = [...selectedId];
    try {
      await Promise.all(
        idsToDelete.map((id) => axios.delete(`${memberUrl}/members/${id}`)),
      );
      setNoticeList((prev) =>
        prev.filter((n) => !idsToDelete.includes(String(n.id))),
      );
      await memberListFn();
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
        <AdminMembersModal
          setAdminAddModal={setAdminAddModal}
          memberId={modalId}
        />
      )}
      <div className="adminMembers">
        <div className="adminMembers-con">
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
                <th>이름</th>
                <th>이메일</th>
                <th>연락처</th>
                <th>나이</th>
                <th>성별</th>
                <th>주소?지역</th>
                <th>특이사항</th>
                <th>권한</th>
                <th>상세보기</th>
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
                    <td>{el.userName}</td>
                    <td>{el.userEmail}</td>
                    <td>{el.phonenum}</td>
                    <td>{el.age}</td>
                    <td>{el.gender}</td>
                    <td>{el.address}</td>
                    <td>
                      {el.remark && el.remark.length > 10
                        ? `${el.remark.slice(0, 10)}...`
                        : el.remark}
                    </td>
                    <td>{el.role}</td>
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
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
          <div className="adminMembersFooter">
            <div className="adminMembersPaging">
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
                  {allVisibleSelected ? "전체해제" : "전체선택"}
                </button>
                <button onClick={() => adminModalFn(null)}>추가</button>
                <button onClick={() => onDeleteSelectedFn()}>삭제</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminMembers;
