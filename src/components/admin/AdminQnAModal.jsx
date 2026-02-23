import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminQnAModal = ({ setAdminAddModal, qnaId }) => {
  const [detail, setDetail] = useState(null);
  const qnaUrl = API_JSON_SERVER_URL;
  const [edit, setEdit] = useState({ title: "", question: "", answer: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [editAnswer, setEditAnswer] = useState({ answer: "" });
  const user = useSelector((state) => state.input.user);
  useEffect(() => {
    const openDetail = async () => {
      try {
        const res = await axios.get(`${qnaUrl}/qna/${qnaId}`);
        setDetail(res.data);
      } catch (err) {
        alert(err);
      }
    };
    openDetail();
  }, [qnaId, qnaUrl]);

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setEdit((prev) => ({ ...prev, [name]: value }));
  };
  const closeFn = () => {
    if (isAnswering) {
      setIsAnswering(false);
    }
    setAdminAddModal(false);
  };

  const onEditFn = () => {
    if (!window.confirm("수정 하시겠습니까")) return;
    setEdit({
      title: detail.title,
      question: detail.question,
      answer: detail.answer,
    });

    setIsEditing(true);
  };

  const onUpdateFn = async () => {
    if (isSaving) return;
    if (!window.confirm("저장 하시겠습니까")) return;
    try {
      setIsSaving(true);
      await axios.patch(`${qnaUrl}/qna/${qnaId}`, {
        title: edit.title,
        question: edit.question,
        answer: edit.answer,
      });
      setDetail((prev) => ({
        ...prev,
        title: edit.title,
        question: edit.question,
        answer: edit.answer,
      }));
      alert("수정 되었습니다");
      setIsEditing(false);
      onSuccess?.();
      closeFn();
    } catch (err) {
      alert(err);
    } finally {
      setIsSaving(false);
    }
  };

  const onDeleteFn = async () => {
    if (!window.confirm("정말 삭제 하시겠습니까")) return;
    if (isSaving) return;

    try {
      setIsSaving(true);
      await axios.delete(`${qnaUrl}/qna/${qnaId}`);
      alert("삭제 되었습니다");
      onSuccess?.();
      closeFn();
    } catch (err) {
      alert(err);
    } finally {
      setIsSaving(false);
    }
  };

  const onSaveAnswerFn = async () => {
    if (isSaving) return;
    if (!editAnswer.answer.trim()) {
      alert("답변내용을 입력해 주세요");
      return;
    }
    try {
      setIsSaving(true);
      await axios.patch(`${qnaUrl}/qna/${qnaId}`, {
        admin: user.userName,
        answer: editAnswer.answer,
        state: "답변완료",
      });
      setDetail((prev) => ({
        ...prev,
        admin: user.userName,
        answer: editAnswer.answer,
        state: "답변완료",
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
    setEditAnswer({
      answer: detail.answer ?? "",
    });

    setIsAnswering(true);
  };
  const onAnswerChangeFn = (e) => {
    const { name, value } = e.target;
    setEditAnswer((prev) => ({ ...prev, [name]: value }));
  };

  //창 열면 바로 답변상태
  useEffect(() => {
    if (!detail) return;
    if (!detail.answer) return setIsAnswering(true);
  });

  if (!detail) {
    return (
      <div className="adminModal" onClick={closeFn}>
        <div
          className="adminModal-con"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="adminModal-close" onClick={closeFn}>
            X
          </span>
          <div className="loading">
            <h1>...Loading</h1>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="adminModal" onClick={closeFn}>
      <div
        className="adminModal-con"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span className="adminModal-close" onClick={closeFn}>
          X
        </span>
        <div className="adminModal-title">
          {isEditing ? "수정하기" : detail.title}
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
              rows={4}
              readOnly={!isEditing}
            />
          </li>
        </ul>
        <div className="adminModal-footer">
          <div className="adminModal-footer-con">
            {!isEditing ? (
              <>
                {/* <button onClick={onEditFn}>수정하기</button> */}
                <button onClick={onDeleteFn} className="deleteBtn">
                  삭제하기
                </button>
              </>
            ) : (
              <>
                <button onClick={onUpdateFn} className="editBtn">
                  저장하기
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="deleteBtn"
                >
                  취소하기
                </button>
              </>
            )}
          </div>
        </div>

        <div className="adminModal-answer-con">
          <ul>
            {/* <li>
            <label htmlFor="admin">답변자</label>
            <input
              type="text"
              name="admin"
              id="admin"
              value={detail?.state === "답변대기" ? "" : detail.admin}
              readOnly
            />
          </li> */}
            <li>
              <label htmlFor="answer">답변내용</label>
              <textarea
                name="answer"
                id="answer"
                value={isAnswering ? editAnswer.answer : (detail.answer ?? "")}
                placeholder={detail.answer ? "" : "답변 내용 작성."}
                onChange={onAnswerChangeFn}
                rows={4}
                readOnly={!isAnswering}
              />
            </li>
            {/* <li>
            {!isAnswering && (
              <button onClick={onEditAnswerFn}>
                {!detail.answer ? "답변하기" : "답변수정하기"}
              </button>
            )}
            {isAnswering && (
              <>
                <button onClick={onSaveAnswerFn}>답변저장하기</button>
                <button
                  onClick={() => {
                    setIsAnswering(false);
                  }}
                >
                  취소하기
                </button>
              </>
              )}
              <button onClick={() => closeFn()}>닫기</button>
              </li> */}
          </ul>
          <div className="adminModal-footer">
            <div className="adminModal-footer-con">
              {detail.answer && !isAnswering ? (
                <button onClick={onEditAnswerFn} className="editBtn">
                  {" "}
                  답변수정하기
                </button>
              ) : (
                <button onClick={onSaveAnswerFn} className="editBtn">
                  답변저장하기
                </button>
              )}
              {isAnswering ? (
                <button
                  className="deleteBtn"
                  onClick={() => {
                    setIsAnswering(false);
                  }}
                >
                  취소하기
                </button>
              ) : null}
              <button onClick={() => closeFn()}>닫기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQnAModal;
