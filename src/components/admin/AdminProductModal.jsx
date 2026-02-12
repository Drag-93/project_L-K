import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminProductModal = ({ setAdminAddModal, productId }) => {
  const [detail, setDetail] = useState(null);
  const productUrl = API_JSON_SERVER_URL;
  const navigate = useNavigate();
  useEffect(() => {
    const openDetail = async () => {
      try {
        if (!productId) return;
        const res = await axios.get(`${productUrl}/product/${productId}`);
        setDetail(res.data);
      } catch (err) {
        alert(err);
      }
    };
    openDetail();
  }, [productId, productUrl]);

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'price' ? Number(value) : value;  //가격은 숫자로 저장
    setDetail({ ...detail, [name]: newValue });
  };
  const onUpdateFn = async (e) => {
    try {
      const res = await axios.put(`${productUrl}/product/${productId}`, detail);
      alert("수정 되었습니다");
      setDetail(res.data);
      navigate("/admin/product");
    } catch (err) {
      alert(err);
    }
  };

  const onDeleteFn = async (e) => {
    if (!window.confirm("정말 삭제 하시겠습니까?")) {
      return;
    } else {
      try {
        const res = await axios.delete(`${productUrl}/product/${productId}`);
        alert("삭제 되었습니다");
        closeFn();
        navigate("/admin/product");
      } catch (err) {
        alert(err);
      }
    }
  };
  const closeFn = (e) => {
    setAdminAddModal(false);
  };
  if (!detail) {      //데이터 없을 경우 오류 방지
    return (
      <div className="adminProductModal">
        <div className="adminProductModal-con">
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
    <div className="adminProductModal">
      <div className="adminProductModal-con">
        <span className="close" onClick={closeFn}>
          X
        </span>
        <div className="title">{detail.name}</div>
        <ul>
          <li>
            <label htmlFor="name">제품명</label>
            <input
              type="text"
              name="name"
              id="name"
              value={detail.name}
              onChange={onChangeFn}
            />
          </li>
          <li>
            <label htmlFor="price">가격</label>
            <input
              type="text"
              name="price"
              id="price"
              value={detail.price}
              onChange={onChangeFn}
            />
          <li>
            <label htmlFor="img">상품이미지 링크</label>
            <input
              type="text"
              name="img"
              id="img"
              value={detail.img}
              onChange={onChangeFn}
            />
          </li>
          </li>
          <li>
            <img src={`/images/${detail.category}/${detail.img}`} alt={detail.img} />
          </li>
          <li>
            <label htmlFor="category">카테고리</label>
            <select
              name="category"
              id="category"
              defaultValue={detail.category}
              onChange={onChangeFn}
            >
              <option value="hydro">보습</option>
              <option value="trouble">트러블케어</option>
              <option value="white">미백</option>
              <option value="antiage">안티에이징</option>
              <option value="uv">UV</option>
            </select>
          </li>
          <li className="description-row">
            <label htmlFor="description">상품설명</label>
            <textarea
              name="description"
              id="description"
              value={detail.description || ""}
              onChange={onChangeFn}
              className="description-textarea"
            />
          </li>
          <li>
            <label htmlFor="detail-desc">상세정보 이미지 링크</label>
            <input
              type="text"
              name="desc-img"
              id="desc-img"
              value={detail.descImg}
              onChange={onChangeFn}
            />
          </li>
          <li>
            <button onClick={onUpdateFn}>상품수정</button>
            <button onClick={onDeleteFn}>상품삭제</button>
            <button onClick={closeFn}>닫기</button>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default AdminProductModal;
