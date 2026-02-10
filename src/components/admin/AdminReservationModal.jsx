import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";

const AdminReservationModal = ({ id, onClose }) => {
  const url = API_JSON_SERVER_URL;
  const [detail, setDetail] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!id) return;
        const res = await axios.get(`${url}/reserveOrders/${id}`);
        setDetail(res.data);
      } catch (err) {
        alert("상세 정보를 불러오는데 실패했습니다.");
      }
    };
    fetchDetail();
  }, [id, url]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(`${url}/reservation`);
        setItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, [url]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...detail.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setDetail({ ...detail, items: updatedItems });
  };

  const reserveUpdateFn = async () => {
    try {
      await axios.put(`${url}/reserveOrders/${id}`, detail);
      alert("예약 수정 성공");
      onClose();
    } catch (err) {
      alert("예약 수정 실패: " + err);
    }
  };

  const reserveCancelFn = async () => {
    if (!window.confirm("예약을 취소하시겠습니까?")) return;
    try {
      await axios.delete(`${url}/reserveOrders/${id}`, { data: detail });
      alert("예약을 취소하였습니다.");
      onClose();
    } catch (err) {
      console.error(err);
      alert("예약 취소 실패: " + err);
    }
  };

  if (!detail) {
    return <div className="modal">로딩 중...</div>;
  }

  return (
    <div className="reservemodal">
      <div className="reservemodal-con">
        <h1>예약 상세내역</h1>
        <span onClick={onClose} style={{ cursor: "pointer" }}>X</span>

        <ul>
          <li>
            <label>고객명</label>
            <input type="text" readOnly value={detail.customer?.userName || ""} />
          </li>
          <li>
            <label>전화번호</label>
            <input type="text" readOnly value={detail.customer?.phonenum || ""} />
          </li>
          <li>
            <label>요청사항</label>
            <input type="text" readOnly value={detail.customer?.request || ""} />
          </li>

          <hr />
          <h3>신청한 진료 목록</h3>

          {detail.items?.map((item, index) => (
            <div key={index} className="item-group">
              <li>
                <label>진료명 ({index + 1})</label>
                <select
                  value={item.name}
                  onChange={(e) => handleItemChange(index, "name", e.target.value)}
                >
                  <option value="">진료 선택</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </li>
              <li>
                <label>날짜</label>
                <select
                  value={item.date}
                  onChange={(e) => handleItemChange(index, "date", e.target.value)}
                >
                  <option value={item.date}></option>
                  </select>
              </li>
              <li>
                <label>지점</label>
                <select
                  value={item.setshop}
                  onChange={(e) => handleItemChange(index, "setshop", e.target.value)}
                >
                  <option value="">지점 선택</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.setshop}>
                      {item.setshop}
                    </option>
                  ))}
                </select>
              </li>
              <li>
                <label>시간</label>
                <select
                  value={item.settime}
                  onChange={(e) => handleItemChange(index, "settime", e.target.value)}
                >
                  <option value="">시간 선택</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.settime}>
                      {item.settime}
                    </option>
                  ))}
                </select>
              </li>
            </div>
          ))}
        </ul>

        <div className="btn-group">
          <button onClick={reserveUpdateFn}>수정</button>
          <button onClick={reserveCancelFn}>예약 취소</button>
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default AdminReservationModal;