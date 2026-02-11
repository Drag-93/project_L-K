import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";

const AdminProductOrdersModal = ({ prodId, setAdminAddModal, onSuccess }) => {
  const [detail, setDetail] = useState(null);
  const [edit, setEdit] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const prodUrl = API_JSON_SERVER_URL;
  // const [customer, setCustomer] = useState({});
  // const [items, setItems] = useState([]);

  const openDetail = async () => {
    try {
      if (prodId == null) {
        setDetail({
          productDate: "",
          customer: "",
          items: [],
          totalAmount: 0,
        });
        return;
      }
      const res = await axios.get(`${prodUrl}/productOrders/${prodId}`);
      setDetail(res.data);
      setEdit(res.data);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    openDetail();
  }, [prodId, prodUrl]);

  // console.log(detail);
  // console.log(detail?.customer);
  // console.log(detail?.items);

  const customer = detail ? detail.customer : {};
  const items = detail ? detail.items : [];

  console.log(customer);
  console.log(items);

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => ({ ...prev, [name]: value }));
  };

  const closeFn = () => {
    setAdminAddModal(false);
  };

  if (!detail) {
    return (
      <div className="adminProductOrdersModal">
        <div className="adminProductOrdersModal-con">
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
    <div className="adminProductOrdersModal">
      <div className="adminProductOrdersModal-con">
        <span className="close" onClick={closeFn}>
          X
        </span>
        <div className="title">
          <ul>
            <li>
              <h1>주문 상세내역</h1>
            </li>
          </ul>
        </div>

        <ul>
          <li>
            <label htmlFor="userName">주문자</label>
            <input
              type="text"
              name="userName"
              id="userName"
              value={customer.userName}
              readOnly
            />
          </li>
          <li>
            <label htmlFor="productDate">주문일자</label>
            <input
              type="text"
              name="productDate"
              id="productDate"
              value={detail.productDate}
            />
          </li>
          <li>
            <label htmlFor="phonenum">연락처</label>
            <input
              type="text"
              name="phonenum"
              id="phonenum"
              value={customer.phonenum}
            />
          </li>

          <li>
            <label htmlFor="address">주소</label>
            <input
              type="text"
              name="address"
              id="address"
              value={customer.address}
            />
          </li>
          <li>
            <label htmlFor="request">요청사항</label>
            <input
              type="text"
              name="request"
              id="request"
              value={customer.request}
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
                </tr>
              </thead>
              <tbody>
                {items.map((m) => {
                  return (
                    <tr key={m.id}>
                      <td>{m.category}</td>
                      <td>{m.name}</td>
                      <td>{m.count}</td>
                      <td>{m.totalPrice}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminProductOrdersModal;
