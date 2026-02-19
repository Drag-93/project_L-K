import React, { useEffect, useMemo, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";

const AdminProductOrdersModal = ({ prodId, setAdminAddModal, onSuccess }) => {
  const [detail, setDetail] = useState(null);
  const prodUrl = API_JSON_SERVER_URL;
  // const [customer, setCustomer] = useState({});
  // const [items, setItems] = useState([]);

  const openDetail = async () => {
    try {
      if (prodId == null) {
        setDetail({
          productDate: "",
          customer: {
            userEmail: "",
            userName: "",
            phonenum: "",
            address: "",
            request: "",
          },
          items: [],
          totalAmount: 0,
        });
        return;
      }
      const res = await axios.get(`${prodUrl}/productOrders/${prodId}`);
      setDetail(res.data);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    openDetail();
  }, [prodId, prodUrl]);

  const customer = detail ? detail.customer : {};
  const items = detail ? detail.items : [];

  const onChangeFn = (id, value) => {
    setDetail((prev) => ({
      ...prev,
      // customer: { ...prev.customer, [name]: value },
      items: prev.items.map((it) =>
        it.id === id ? { ...it, state: value } : it,
      ),
    }));
  };

  const onDeleteFn = async () => {
    if (!window.confirm("정말 삭제 하시겠습니까?")) return;
    try {
      await axios.delete(`${prodUrl}/productOrders/${prodId}`);
      alert("삭제 되었습니다");
      onSuccess?.();
      closeFn();
    } catch (err) {
      alert(err);
    }
  };

  const onUpdateFn = async () => {
    if (!window.confirm("수정 하시겠습니까?")) return;
    try {
      await axios.patch(`${prodUrl}/productOrders/${prodId}`, {
        items: detail.items,
      });
      alert("수정 되었습니다.");
      onSuccess?.();
    } catch (err) {
      alert(err);
    }
  };

  const allState = useMemo(() => {
    if (items.length === 0) return;
    const allDone = items.every((m) => (m.state ?? "").includes("완료"));
    return allDone ? "배송완료" : "배송준비중";
  }, [items]);

  const setAllItemsState = (value) => {
    setDetail((prev) => ({
      ...prev,
      items: (prev.items ?? []).map((it) => ({ ...it, state: value })),
    }));
  };

  const closeFn = () => {
    setAdminAddModal(false);
  };

  if (!detail) {
    return (
      <div className="adminModal">
        <div className="adminModal-con">
          <span className="close" onClick={closeFn}>
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
          <ul>
            <li>
              <h1>주문 상세내역</h1>
            </li>
          </ul>
        </div>

        <ul>
          <li>
            <label htmlFor="userName">주문자명</label>
            <input
              type="text"
              name="userName"
              id="userName"
              value={customer.userName}
              readOnly
            />
          </li>
          <li>
            <label htmlFor="productDate">주문시각</label>
            <input
              type="text"
              name="productDate"
              id="productDate"
              value={detail.productDate}
              readOnly
            />
          </li>
          <li>
            <label htmlFor="phonenum">연락처</label>
            <input
              type="text"
              name="phonenum"
              id="phonenum"
              value={customer.phonenum}
              readOnly
            />
          </li>

          <li>
            <label htmlFor="address">주소</label>
            <input
              type="text"
              name="address"
              id="address"
              value={customer.address}
              readOnly
            />
          </li>
          <li>
            <label htmlFor="request">요청사항</label>
            <textarea
              type="text"
              name="request"
              id="request"
              value={customer.request}
              rows={2}
              readOnly
            />
          </li>
          <li>
            <table>
              <thead>
                <tr>
                  <th>카테고리</th>
                  <th>상품명</th>
                  <th>수량</th>
                  <th>가격</th>
                  <th>배송현황</th>
                </tr>
              </thead>
              <tbody>
                {items.map((m) => {
                  return (
                    <tr key={m.id}>
                      <td>{m.category}</td>
                      <td>{m.name}</td>
                      <td>{m.count}</td>
                      <td>{m.totalPrice.toLocaleString()}원</td>
                      <td>
                        <select
                          name="state"
                          value={m.state}
                          onChange={(e) => onChangeFn(m.id, e.target.value)}
                        >
                          <option value="배송준비중">배송준비중</option>
                          <option value="배송완료">배송완료</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </li>
          <li>
            <label htmlFor="totalAmount">총 금액</label>
            <span>
              <input
                name="totalAmount"
                id="totalAmount"
                value={detail.totalAmount.toLocaleString()}
                readOnly
              />
              원
            </span>
          </li>
          <li>
            <label>전체 배송현황</label>
            <select
              value={allState ?? "배송준비중"}
              onChange={(e) => setAllItemsState(e.target.value)}
            >
              <option value="배송준비중">배송준비중</option>
              <option value="배송완료">배송완료</option>
            </select>
          </li>
        </ul>
      </div>
      <div className="adminModal-footer">
        <div className="adminModal-footer-con">
          <button onClick={() => onUpdateFn()}>수정</button>
          <button onClick={() => onDeleteFn()}>삭제</button>
          <button onClick={() => closeFn()}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default AdminProductOrdersModal;
