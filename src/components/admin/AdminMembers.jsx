import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import AdminMembersModal from "./AdminMembersModal";
const AdminMembers = () => {
  const [memberList, setMemberList] = useState([]);
  const memberUrl = API_JSON_SERVER_URL;
  const [adminAddModal, setAdminAddModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filtered = memberList.filter((m) => {
    const q = searchText.trim().toLowerCase();
    // 권한 필터가 'ALL'이 아니고, 회원의 role이 선택한 role과 다르면 목록에서 제외
    if (roleFilter !== "ALL" && m.role !== roleFilter) return false;

    if (!q) return true;

    const searchTarget = [
      m.id,
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
  useEffect(() => {
    const memberListFn = async (e) => {
      try {
        const res = await axios.get(`${memberUrl}/members`);
        setMemberList(res.data);
      } catch (err) {
        alert(err);
      }
    };
    memberListFn();
  }, [memberUrl]);

  const adminModalFn = (id) => {
    setSelectedId(id);
    setAdminAddModal(true);
  };

  return (
    <>
      {adminAddModal && (
        <AdminMembersModal
          setAdminAddModal={setAdminAddModal}
          memberId={selectedId}
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
              {filtered &&
                filtered.map((el) => {
                  return (
                    <tr key={el.id}>
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

export default AdminMembers;
