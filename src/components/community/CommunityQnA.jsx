import React, { useEffect, useMemo, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CommunityQnA = () => {
  const [qnaList, setQnaList] = useState([]);
  const qnaUrl = API_JSON_SERVER_URL;
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const user = useSelector((state) => state.input.user);
  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return qnaList;

    return qnaList.filter((m) => {
      const searchTarget = [m.no, m.title, m.date, m.writer]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchTarget.includes(q);
    });
  }, [qnaList, searchText]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length, pageSize]);

  const pagedList = useMemo(() => {
    const firtPage = (page - 1) * pageSize;
    return filtered.slice(firtPage, firtPage + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [searchText]);

  const qnaListFn = async () => {
    try {
      const res = await axios.get(`${qnaUrl}/qna`);
      setQnaList(res.data);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    qnaListFn();
  }, []);

  const MyQnaList = useMemo(() => {
    if (!user) return [];
    return qnaList.filter((qna) => qna.writerEmail === user.userEmail);
  }, [qnaList, user]);

  return (
    <div className="QnA">
      <div className="QnA-con">
        <div className="title">
          <ul>
            <li>
              <h1>QnA</h1>
            </li>
            <div className="toolbar">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="검색어 입력"
              />
            </div>
          </ul>
        </div>
        <table>
          <thead>
            <tr>
              <td>글번호</td>
              <td>제목</td>
              <td>작성일</td>
              <td>작성자</td>
              <td>답변상태</td>
              <td>조회수</td>
            </tr>
          </thead>
          <tbody>
            {pagedList.map((el) => {
              return (
                <tr key={el.id} onClick={() => navigate(`${el.id}`)}>
                  <td onClick={(e) => e.stopPropagation()}>{el.no}</td>
                  <td>{el.title}</td>
                  <td>{el.date}</td>
                  <td>{el.writer}</td>
                  <td
                    className={`qnaStateBadge ${el.state === "답변완료" ? "done" : "wait"}`}
                  >
                    {el.state}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>{el.viewrate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="QnAFooter">
          <div className="QnAFooter-con">
            <div className="QnAPaging">
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

            <button onClick={() => navigate(`write`)}>글쓰기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityQnA;
