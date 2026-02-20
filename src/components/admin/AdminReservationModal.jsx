import React, { useEffect, useState } from 'react'
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminReservationModal = ({setReservationAddModal, reservationId}) => {
  const allShops = ["노원", "신촌", "종로", "강남"]
  const allTimes = ["10:00", "11:00", "14:00", "15:00"]
  const [detail, setDetail] = useState({
    name: "",
    price: 0,
    img: "",
    category: "lifting",
    description : "",
    setshop: [],
    settime: []
  })  

  const reservationUrl=API_JSON_SERVER_URL
  const navigate=useNavigate()

  const onShopChange = (shopName) => {
    setDetail((prev) => {
      const currentShops = prev.setshop || [];
        return currentShops.includes(shopName)
                ? { ...prev, setshop: currentShops.filter(s => s !== shopName) }
                : { ...prev, setshop: [...currentShops, shopName] };
            });
          };
  const onTimeChange = (shopTime) => {
    setDetail((prev) => {
      const currentTimes = prev.settime || [];
        return currentTimes.includes(shopTime)
                ? { ...prev, settime: currentTimes.filter(s => s !== shopTime) }
                : { ...prev, settime: [...currentTimes, shopTime] };
            });
          };

  useEffect(() => {
    const openDetail = async () => {
      try {
        if (!reservationId) return;
        const res = await axios.get(`${reservationUrl}/reservation/${reservationId}`);
        setDetail(res.data);
      } catch (err) {
        alert(err);
      }
    };
    openDetail();
  }, [reservationId, reservationUrl]);

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'price' ? Number(value) : value; 
    setDetail({ ...detail, [name]: newValue });
  };

  const onUpdateFn = async () => {
    try {
      const res = await axios.put(`${reservationUrl}/reservation/${reservationId}`, detail);
      alert("수정 되었습니다");
      closeFn();
    } catch (err) {
      alert(err);
    }
  };

  const onDeleteFn = async (e) => {
    if (!window.confirm("정말 삭제 하시겠습니까?")) 
      return;
    try {
          await axios.delete(`${reservationUrl}/reservation/${reservationId}`);
          alert("삭제 되었습니다");
          closeFn(); // 삭제 후 닫기
        } catch (err) {
          alert("삭제 중 에러가 발생했습니다.");
        }
      };

  const onPostFn = async () => {
    try {
      await axios.post(`${reservationUrl}/reservation`, detail);
      alert("추가 되었습니다.");
      closeFn();
    } catch (err) {
      alert(err);
    }
  };


  const closeFn = () => {
    setReservationAddModal(false);
  };

  if (!detail) { 
    return (
      <div className="reservationModal">
        <div className="reservationModal-con">
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
return(
  <div className="reservationModal">
    <div className="reservationModal-con">
      <h1>예약 상품 등록</h1>
      <ul>
        <li>
            <label htmlFor="category">카테고리</label>
            <select
              name="category"
              id="category"
              value={detail.category}
              onChange={onChangeFn}
            >
              <option value="lifting">울쎄라</option>
              <option value="faceline">인모드</option>
              <option value="regen">쥬베룩</option>
              <option value="immune">글루타치온(백옥주사)</option>
            </select>
        </li>
        <li>
            <label htmlFor="price">가격</label>
            <input
              type="text"
              name="price"
              reservationId="price"
              value={detail.price}
              onChange={onChangeFn}
            />
        </li>
        <li>
            <label>예약 지점 선택</label>
              <div className="checkbox-group">
                {allShops.map((shop) => (
                  <label key={shop} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={detail.setshop?.includes(shop)}
                      onChange={() => onShopChange(shop)}
                    />
                    <span>{shop}점</span>
              </label>
          ))}
        </div> 
        </li>       
        <li>
            <label>예약 시간 선택</label>
              <div className="checkbox-group">
                {allTimes.map((time) => (
                  <label key={time} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={detail.settime?.includes(time)}
                      onChange={() => onTimeChange(time)}
                    />
                    <span>{time}</span>
              </label>
          ))}
        </div> 
        </li>       
        <li>
            <label htmlFor="descImg">상품이미지 링크</label>
            <input
              type="text"
              name="descImg"
              id="descImg"
              value={detail.descImg}
              onChange={onChangeFn}
              />
        </li>
        <li>
            <label htmlFor="name">상세설명</label>
            <input
              type="text"
              name="description"
              reservationId="description"
              value={detail.description}
              onChange={onChangeFn}
            />
        </li>
        <li>
          <button onClick={onUpdateFn}>수정</button>
          <button onClick={onDeleteFn}>삭제</button>
          <button onClick={closeFn}>목록</button>
        </li>
      </ul>
    </div>
  </div>
)
}

export default AdminReservationModal