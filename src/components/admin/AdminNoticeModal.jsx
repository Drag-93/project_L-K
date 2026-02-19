import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminNoticeModal = ({ setAdminAddModal, noticeId, onSuccess }) => {
  const [detail, setDetail] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const noticeUrl = API_JSON_SERVER_URL;
  const navigate = useNavigate();

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

  useEffect(() => {
    const openDetail = async () => {
      try {
        if (noticeId == null) {
          setDetail({
            title: "",
            description: "",
          });
          return;
        }
        const res = await axios.get(`${noticeUrl}/notice/${noticeId}`);
        setDetail(res.data);
      } catch (err) {
        alert(err);
      }
    };
    openDetail();
  }, [noticeId, noticeUrl]);

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => ({ ...(prev ?? {}), [name]: value }));
  };
  const closeFn = () => {
    setAdminAddModal(false);
  };

  const onUpdateFn = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      const res = await axios.put(`${noticeUrl}/notice/${noticeId}`, detail);
      alert("수정 되었습니다");
      setDetail(res.data);
      onSuccess?.();
      closeFn();
    } catch (err) {
      alert(err);
    } finally {
      setIsSaving(false);
    }
  };

  const onPostFn = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);

      const res = await axios.get(`${noticeUrl}/notice`);
      const maxNo =
        res.data.length > 0 ? Math.max(...res.data.map((item) => item.no)) : 0;

      const newNotice = {
        ...detail,
        no: maxNo + 1,
        date: getKoreaDate(),
        viewrate: 0, // 조회수 초기값
      };
      await axios.post(`${noticeUrl}/notice`, newNotice);

      alert("작성 되었습니다");
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
      await axios.delete(`${noticeUrl}/notice/${noticeId}`);
      alert("삭제 되었습니다");
      onSuccess?.();
      closeFn();
    } catch (err) {
      alert(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!detail) {
    return (
      <div className="adminModal">
        <div className="adminModal-con">
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
    <div className="adminModal">
      <div className="adminModal-con">
        <span className="adminModal-close" onClick={closeFn}>
          X
        </span>
        <div className="adminModal-title">
          {noticeId != null ? detail.title : "공지 등록"}
        </div>

        <ul>
          <li>
            <label htmlFor="title">제목</label>
            <input
              type="text"
              name="title"
              id="title"
              value={detail.title}
              onChange={onChangeFn}
            />
          </li>
          <li className="adminModal-description-row">
            <label htmlFor="description">내용</label>
            <textarea
              name="description"
              id="description"
              value={detail.description || ""}
              onChange={onChangeFn}
              className="description-textarea"
            />
          </li>
        </ul>
      </div>
      <div className="adminModal-footer">
        <div className="adminModal-footer-con">
          {noticeId != null ? (
            <>
              <button onClick={onUpdateFn} disabled={isSaving}>
                수정
              </button>
              <button onClick={onDeleteFn} disabled={isSaving}>
                삭제
              </button>
            </>
          ) : (
            <button onClick={onPostFn} disabled={isSaving}>
              글쓰기
            </button>
          )}
          <button onClick={closeFn} disabled={isSaving}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNoticeModal;
