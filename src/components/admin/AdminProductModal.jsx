import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";

const AdminProductModal = ({ setAdminAddModal, productId, onSuccess }) => {
  const [detail, setDetail] = useState(null);
  const productUrl = API_JSON_SERVER_URL;

  useEffect(() => {
    const openDetail = async () => {
      try {
        if (!productId) {
          setDetail({
            name: "",
            category: "",
            price: "",
            img: "",
            description: "",
            descImg: "",
            regDate: new Date().toISOString(),
          });
          return;
        }
        const res = await axios.get(`${productUrl}/product/${productId}`);
        setDetail(res.data);
      } catch (err) {
        alert(err);
      }
    };
    openDetail();
  }, [productId, productUrl]);

  const onPostFn = async (e) => {
    if (
      !detail.name?.trim() ||
      !detail.category?.trim() ||
      detail.price === undefined ||
      detail.price === null ||
      detail.price === ""
    ) {
      alert("제품명, 카테고리, 가격은 필수입력 사항입니다");
      return;
    }
    try {
      const res = await axios.post(`${productUrl}/product`, detail);
      console.log(res.data);
      alert("추가 되었습니다");
      closeFn();
      onSuccess();
    } catch (err) {
      console.log("상품 추가 실패");
    }
  };

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    const newValue = name === "price" ? Number(value) : value; //가격은 숫자로 저장
    setDetail({ ...detail, [name]: newValue });
  };

  const onUpdateFn = async (e) => {
    try {
      const res = await axios.put(`${productUrl}/product/${productId}`, detail);
      alert("수정 되었습니다");
      setDetail(res.data);
      closeFn();
      onSuccess();
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
        onSuccess();
      } catch (err) {
        alert(err);
      }
    }
  };

  const closeFn = (e) => {
    setAdminAddModal(false);
  };

  if (!detail) {
    //데이터 없을 경우 오류 방지
    return (
      <div className="adminModal" onClick={closeFn}>
        <div
          className="adminModal-con"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
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
        <div className="adminModal-title">{detail.name}</div>
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
              placeholder="금액만 입력하세요(예: 20000)"
              value={detail.price}
              onChange={onChangeFn}
            />
          </li>
          <li>
            <label htmlFor="img">상품이미지</label>
            <input
              type="text"
              name="img"
              id="img"
              placeholder="특수문자(%#?&=+;)를 제외한 파일명(예: hydro1.jpg) "
              value={detail.img}
              onChange={onChangeFn}
            />
            <img
              src={`/images/${detail.category}/${detail.img}`}
              alt={detail.img}
            />
          </li>
          <li>
            <label htmlFor="category">카테고리</label>
            <select
              name="category"
              id="category"
              value={detail.category || "---선택---"}
              onChange={onChangeFn}
            >
              <option value="">---선택---</option>
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
            <label htmlFor="descImg">상세정보 이미지</label>
            <input
              type="text"
              name="descImg"
              id="descImg"
              placeholder="특수문자(%#?&=+;)를 제외한 파일명(예: hydro1_desc.jpg)"
              value={detail.descImg}
              onChange={onChangeFn}
            />
          </li>
        </ul>
        <div className="adminModal-footer">
          <div className="adminModal-footer-con">
            <li>
              {productId ? (
                <>
                  <button onClick={onUpdateFn}>상품수정</button>
                  <button onClick={onDeleteFn}>상품삭제</button>
                </>
              ) : (
                <button onClick={onPostFn}>상품추가</button>
              )}
              <button onClick={closeFn}>닫기</button>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminProductModal;
