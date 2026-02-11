import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const CommunityQnADetail = () => {
  const [detail, setDetail] = useState(null);
  const qnaUrl = API_JSON_SERVER_URL;
  const [edit, setEdit] = useState({ title: "", question: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [editAnswer, setEditAnswer] = useState({ answer: "" });
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.input.user);
  useEffect(() => {
    const openDetail = async () => {
      try {
        if (id == null) {
          alert("잘못된 접근입니다");
          navigate(-1);
          return;
        }
        const res = await axios.get(`${qnaUrl}/qna/${id}`);
        const data = res.data;
        setDetail(data);
        await axios.patch(`${qnaUrl}/qna/${id}`, {
          viewrate: (data.viewrate ?? 0) + 1,
        });

        setDetail((prev) => ({
          ...prev,
          viewrate: (prev?.viewrate ?? 0) + 1,
        }));
      } catch (err) {
        alert(err);
      }
    };
    openDetail();
  }, [id, qnaUrl, navigate]);

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setEdit((prev) => ({ ...prev, [name]: value }));
  };

  const onEditFn = () => {
    if (!user) {
      alert("로그인이 필요합니다");
      navigate("/auth/login");
      return;
    }
    if (!window.confirm("수정 하시겠습니까")) return;
    if (user.userEmail !== detail.writerEmail && user.role !== "ROLE_ADMIN") {
      alert("작성자만 수정할 수 있습니다.");
      return;
    }
    setEdit({
      title: detail.title,
      question: detail.question,
    });

    setIsEditing(true);
  };

  const onUpdateFn = async () => {
    if (!user) {
      alert("로그인이 필요합니다");
      navigate("/auth/login");
      return;
    }
    if (isSaving) return;
    if (!window.confirm("저장 하시겠습니까")) return;
    if (user.userEmail !== detail.writerEmail && user.role !== "ROLE_ADMIN") {
      alert("작성자만 수정할 수 있습니다.");
      return;
    }
    if (!edit.title.trim() || !edit.question.trim()) {
      alert("제목/질문내용을 입력해 주세요");
      return;
    }
    try {
      setIsSaving(true);
      await axios.patch(`${qnaUrl}/qna/${id}`, {
        title: edit.title,
        question: edit.question,
      });
      setDetail((prev) => ({
        ...prev,
        title: edit.title,
        question: edit.question,
      }));
      alert("수정 되었습니다");
      setIsEditing(false);
      navigate(`/community/qna`);
    } catch (err) {
      alert(err);
    } finally {
      setIsSaving(false);
    }
  };

  const onDeleteFn = async () => {
    if (!user) {
      alert("로그인이 필요합니다");
      navigate("/auth/login");
      return;
    }
    if (!window.confirm("정말 삭제 하시겠습니까")) return;
    if (isSaving) return;
    if (user.userEmail !== detail.writerEmail && user.role !== "ROLE_ADMIN") {
      alert("작성자만 삭제할 수 있습니다.");
      return;
    }
    try {
      setIsSaving(true);
      await axios.delete(`${qnaUrl}/qna/${id}`);
      alert("삭제 되었습니다");
      navigate(`/community/qna`);
    } catch (err) {
      alert(err);
    } finally {
      setIsSaving(false);
    }
  };

  const onSaveAnswerFn = async () => {
    if (isSaving) return;
    if (user.role !== "ROLE_ADMIN") {
      alert("잘못된 접근입니다.");
      return;
    }
    if (!editAnswer.answer.trim()) {
      alert("답변내용을 입력해 주세요");
      return;
    }
    try {
      setIsSaving(true);
      await axios.patch(`${qnaUrl}/qna/${id}`, {
        admin: user.userName,
        answer: editAnswer.answer,
        state: "답변완료",
      });
      setDetail((prev) => ({
        ...prev,
        admin: user.userName,
        answer: editAnswer.answer,
      }));
      alert("수정 되었습니다");
      setIsAnswering(false);
    } catch (err) {
      alert(err);
    } finally {
      setIsSaving(false);
    }
  };
  const onEditAnswerFn = () => {
    if (user.role !== "ROLE_ADMIN") {
      alert("잘못된 접근입니다.");
      navigate(`/community/qna`);
      return;
    }
    setEditAnswer({
      answer: detail.answer,
    });

    setIsAnswering(true);
  };
  const onAnswerChangeFn = (e) => {
    const { name, value } = e.target;
    setEditAnswer((prev) => ({ ...prev, [name]: value }));
  };

  if (!detail) return <div>...Loading</div>;

  return (
    <div className="QnADetail">
      <div className="QnADetail-con">
        <div className="title">
          <ul>
            <li>
              <h1>{isEditing ? "수정하기" : detail.title}</h1>
            </li>
          </ul>
        </div>
        <ul>
          <li>
            <label htmlFor="title">제목</label>
            <input
              type="text"
              name="title"
              id="title"
              value={isEditing ? edit.title : detail.title}
              onChange={onChangeFn}
              readOnly={!isEditing}
            />
          </li>
          <li>
            <label htmlFor="writer">작성자</label>
            <input
              type="text"
              name="writer"
              id="writer"
              value={detail.writer}
              readOnly
            />
          </li>
          <li>
            <label htmlFor="date">작성일</label>
            <input
              type="date"
              name="date"
              id="date"
              value={detail.date}
              readOnly
            />
          </li>
          <li>
            <label htmlFor="question">질문내용</label>
            <textarea
              name="question"
              id="question"
              value={isEditing ? edit.question : detail.question}
              onChange={onChangeFn}
              rows={6}
              readOnly={!isEditing}
            />
          </li>
        </ul>
        <div className="QnADetailFooter">
          <div className="QnADetailFooter-con">
            {user?.userEmail === detail.writerEmail ||
            user.role === "ROLE_ADMIN" ? (
              <>
                {!isEditing ? (
                  <>
                    <button onClick={onEditFn}>수정하기</button>
                    <button onClick={onDeleteFn}>삭제하기</button>
                  </>
                ) : (
                  <>
                    <button onClick={onUpdateFn}>저장하기</button>
                    <button onClick={() => setIsEditing(false)}>
                      취소하기
                    </button>
                  </>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className="QnAAnswer-con">
        <ul>
          {user?.role === "ROLE_ADMIN" && (
            <li>
              {!isAnswering && (
                <button onClick={onEditAnswerFn}>
                  {!detail.answer ? "답변하기" : "답변수정하기"}
                </button>
              )}
              {isAnswering && (
                <>
                  <button onClick={onSaveAnswerFn}>답변저장하기</button>
                  <button onClick={() => setIsAnswering(false)}>
                    취소하기
                  </button>
                </>
              )}
            </li>
          )}
          <li>
            <label htmlFor="answer">답변내용</label>
            <textarea
              name="answer"
              id="answer"
              value={
                isAnswering
                  ? editAnswer.answer
                  : detail.answer || "관리자가 확인 중입니다."
              }
              onChange={onAnswerChangeFn}
              rows={6}
              readOnly={!isAnswering}
            />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CommunityQnADetail;
