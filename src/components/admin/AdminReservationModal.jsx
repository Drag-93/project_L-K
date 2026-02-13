import React, { useEffect, useState } from 'react'
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminReservationModal = ({setReservationAddModal, reservationId, onSuccess}) => {
  const [allShops, setAllShops] = useState([])
  const [allTimes, setAllTimes] = useState([])
  const [detail, setDetail] = useState(null)  

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
    const fetchData = async () => {
      try {
        const allRes = await axios.get(`${reservationUrl}/reservation`);
        const allData = allRes.data;

        const extractedShops = [...new Set(allData.flatMap(item => item.setshop || []))].sort();
        const extractedTimes = [...new Set(allData.flatMap(item => item.settime || []))].sort();

        setAllShops(extractedShops);
        setAllTimes(extractedTimes);

        if (reservationId) {
          const res = await axios.get(`${reservationUrl}/reservation/${reservationId}`);
          setDetail(res.data);
        } else {
          setDetail({
            name: "",
            category: "lifting",
            price: "",
            img: "",
            description: "",
            descImg: "",
            setshop: [],
            settime: [],
            regDate: new Date().toISOString(),
            timespan:""
          });
        }
      } catch (err) {
        console.error("데이터 로딩 중 에러:", err);
      }
    };
    fetchData();
  }, [reservationId, reservationUrl]);

  

const onChangeFn = (e) => {
    const { name, value } = e.target;
    
    // 카테고리와 상품명을 매핑하는 객체
    const categoryToName = {
      lifting: "울쎄라",
      faceline: "인모드",
      regen: "쥬베룩",
      immune: "글루타치온(백옥주사)",
    };

    if (name === "category") {
      // 카테고리가 바뀌면 해당 카테고리에 맞는 상품명도 함께 업데이트
      setDetail({
        ...detail,
        category: value,
        name: categoryToName[value] || "" // 매핑되는 이름으로 변경
      });
    } else {
      // 그 외 가격, 이미지 등 일반 입력 처리
      const newValue = name === 'price' ? Number(value) : value;
      setDetail({ ...detail, [name]: newValue });
    }
  };

  const onUpdateFn = async () => {
    try {
      const res = await axios.put(`${reservationUrl}/reservation/${reservationId}`, detail);
      alert("수정 되었습니다");
      if (onSuccess) {
      onSuccess(); 
      }
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
      if (onSuccess) {
      onSuccess(); 
      }
      closeFn();
    } catch (err) {
      alert(err);
    }
  };

const onPostFn = async () => {
  try {
    await axios.post(`${reservationUrl}/reservation`, detail);
    alert("추가 되었습니다.");
     if (onSuccess) {
      onSuccess(); 
    }
    closeFn();
  } catch (err) {
    alert("데이터 저장 중 오류가 발생했습니다: " + err);
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
            <label htmlFor="name">상품명</label>
            <select
              name="name"
              id="name"
              value={detail.name}
              onChange={onChangeFn}
              disabled
            >
              <option value="울쎄라">울쎄라</option>
              <option value="인모드">인모드</option>
              <option value="쥬베룩">쥬베룩</option>
              <option value="글루타치온(백옥주사)">글루타치온(백옥주사)</option>
            </select>
        </li>
        <li>
            <label htmlFor="price">가격</label>
            <span>
            <input
              type="text"
              name="price"
              reservationId="price"
              value={detail.price}
              onChange={onChangeFn}
            />원
            </span>
        </li>
        <li>
            <label>예약 지점 선택</label>
              <div className="checkbox-group">
                {allShops.map((shop) => (
                  <label key={shop.id || shop} className="checkbox-item">
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
                  <label key={time.id || time} className="checkbox-item">
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
            <label htmlFor="img">상품이미지</label>
            <input
              type="text"
              name="img"
              id="img"
              value={detail.img}
              onChange={onChangeFn}
              />
          <img src={`/images/${detail.category}/${detail.img}`} alt={detail.img} />
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
            <label htmlFor="name">시술시간</label>
            <span>
            <input
              type="text"
              name="timespan"
              reservationId="timespan"
              value={detail.timespan}
              onChange={onChangeFn}
            />시간 소요예정
            </span>
        </li>
        <li>
            {reservationId ? (
              <>
               <button onClick={onUpdateFn}>상품수정</button>
               <button onClick={onDeleteFn}>상품삭제</button>
              </>
            ):(
              <button onClick={onPostFn}>상품추가</button>
            )}
            <button onClick={closeFn}>닫기</button>
        </li>
      </ul>
    </div>
  </div>
)
}

export default AdminReservationModal