import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const CommunityQnAWrite = () => {
  const [isSaving, setIsSaving] = useState(false);
  const qnaUrl = API_JSON_SERVER_URL;
  const navigate = useNavigate();
  const [write, setWrite] = useState({
    title: "",
    question: "",
  });

  const getKoreaDate = () => {
    const today = new Date();
    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  };

  const user = useSelector((state) => state.input.user);

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setWrite((prev) => ({ ...prev, [name]: value }));
  };
  console.log(user);
  const onPostFn = async () => {
    if (isSaving) return;

    if (!write.title.trim() || !write.question.trim()) {
      alert("제목/질문내용을 입력해 주세요");
      return;
    }
    try {
      setIsSaving(true);

      const res = await axios.get(`${qnaUrl}/qna`);
      const maxNo =
        res.data.length > 0 ? Math.max(...res.data.map((item) => item.no)) : 0;

      const newQna = {
        ...write,
        no: maxNo + 1,
        date: Date(),
        writer: user?.userName,
        writerEmail: user?.userEmail,
        viewrate: 0,
        admin: "",
        answer: "",
        state: "답변대기",
      };
      await axios.post(`${qnaUrl}/qna`, newQna);
      alert("작성 되었습니다");
      navigate("/community/qna");
    } catch (err) {
      alert(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="QnAWrite inner2">
      <div className="QnAWrite-con">
        <div className="title">
          <h1>문의 작성하기</h1>
          <ul>
            <li>
              <label htmlFor="title">제목</label>
              <input
                type="text"
                name="title"
                id="title"
                value={write.title}
                onChange={onChangeFn}
                placeholder="제목을 입력해 주세요"
              />
            </li>
            <li>
              <label htmlFor="writer">작성자</label>
              <input
                type="text"
                name="writer"
                id="writer"
                value={user?.userName ?? ""}
                readOnly
              />
            </li>
            <li>
              <label htmlFor="date">작성일</label>
              <span>{getKoreaDate(write.date)}</span>
            </li>
            <li>
              <label htmlFor="question">질문내용</label>
              <textarea
                name="question"
                id="question"
                value={write.question}
                onChange={onChangeFn}
                placeholder="질문하실 내용을 입력해 주세요"
                rows={6}
              />
            </li>
          </ul>
          <div className="QnAWriteFooter">
            <div className="QnAWriteFooter-con">
              <button onClick={onPostFn}>작성완료</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityQnAWrite;
