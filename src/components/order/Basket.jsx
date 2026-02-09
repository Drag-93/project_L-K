import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearBasket, removeBasket, updateCount } from '../../store/slice/basketSlice';
import { API_JSON_SERVER_URL } from '../../api/commonApi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Basket = () => {
  const basketItems = useSelector((state) => state.basket.basketItems);
  const isState = useSelector((state) => state.input.isState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 총 가격 계산 로직 (item.price가 문자열일 경우를 대비해 Number로 변환)
  const totalPrice = basketItems.reduce((acc, cur) => {
    // count가 있으면 (일반상품) price * count, 없으면 (예약상품) 그냥 price
    const itemTotal = cur.count ? Number(cur.price) * Number(cur.count) : Number(cur.price);
    return acc + itemTotal;
  }, 0);

  // 삭제 핸들러
  const handleRemove = async (id) => {
    if (window.confirm('해당 예약을 삭제하시겠습니까?')) {
      try {
        const res = await axios.delete(`${API_JSON_SERVER_URL}/cart/${id}`);

        if (res.status === 200 || res.status === 204) {
          // 2. 서버 성공 시에만 리덕스 업데이트 (id 사용 권장)
          dispatch(removeBasket(id)); // 서버 삭제 성공 후 리덕스 삭제
        }
      } catch (err) {
        alert("삭제 실패");
      }
    }
  };

  // 장바구니 비우기 핸들러
  const deleteAllCart = async () => {
    if (basketItems.length === 0) return;
    if (!window.confirm("장바구니를 모두 비우시겠습니까?")) return;
  
    try {
      // 1. 모든 삭제 요청을 생성
      const deleteRequests = basketItems.map(item => 
        axios.delete(`${API_JSON_SERVER_URL}/cart/${item.id}`)
      );
  
      // 2. 모든 요청이 병렬로 처리되기를 기다림
      await Promise.all(deleteRequests);
  
      // 3. 서버 삭제 성공 시 Redux 스토어 비우기
      dispatch(clearBasket());
      alert("장바구니가 모두 비워졌습니다.");
    } catch (err) {
      console.error("삭제 중 오류 발생:", err);
      alert("일부 데이터를 삭제하지 못했습니다.");
    }
  };



  const handleCountChange = async (id, currentCount, price, type) => {
    let newCount = type === 'plus' ? currentCount + 1 : currentCount - 1;
  
    // 최소 수량 1개 제한
    if (newCount < 1) return;
  
    try {
      // 1. 서버 데이터 업데이트 (PATCH: 필요한 필드만 수정)
      const res = await axios.patch(`${API_JSON_SERVER_URL}/cart/${id}`, {
        count: newCount,
        totalPrice: price * newCount
      });
  
      if (res.status === 200) {
        dispatch(updateCount({ id: id, count: newCount }));
      }
    } catch (err) {
      console.error("수량 변경 실패:", err);
      alert("수량 변경 중 오류가 발생했습니다.");
    }
  };


  const paymentGoFn=()=>{
    if(isState){
      alert(`로그인해주세요`);
      navigate(`/auth/login`);
      return
    }
    navigate(`/order/Payment`)
  }

  // 2. 장바구니 아이템 중 "time" 값이 있는 것만 필터링
  const reserveItems = basketItems.filter(item => item.time && item.time.trim() !== "");

  // 2. 장바구니 아이템 중 "count" 값이 있는 것만 필터링
  const productItems = basketItems.filter(item => item.count && Number(item.count) > 0);


  return (
    <div className="cart-container">
      <h2 className="cart-title">장바구니</h2>
      
      {basketItems.length === 0 ? (
        <div className="empty-cart">
          <p>장바구니가 비어 있습니다.</p>
        </div>
      ) : (
        <div className="cart-content">
          <ul className="cart-list">
            {productItems.map((item, index) => (
              <li key={index} className="cart-item">
                <div className="item-img">
                  <img src={`/images/${item.img}`} alt={item.name} />
                </div>
                <div className="item-info">
                  <h3 className="item-name">{item.name}</h3>
                  
                  <div className="count-control">
                    <p className="item-time">개수:</p>
                    <button onClick={() => handleCountChange(item.id, item.count, item.price, 'minus')}>-</button>
                    <span className="count-num">{item.count}</span>
                    <button onClick={() => handleCountChange(item.id, item.count, item.price, 'plus')}>+</button>
                </div>
                  <span className="item-price">{Number(item.count*item.price).toLocaleString()}원</span>
                </div>
                <button className="delete-btn" onClick={() => handleRemove(item.id, index)}>
                  삭제
                </button>
              </li>
            ))}

              {reserveItems.map((item, index) => (
              <li key={index} className="cart-item">
                <div className="item-img">
                  <img src={`/images/${item.img}`} alt={item.name} />
                </div>
                <div className="item-info">
                  <h3 className="item-name">{item.name}<span>예약상품</span></h3>
                  <p className="item-date">날짜: {item.date}</p>
                  <p className="item-time">시간: {item.time}</p>
                  <span className="item-price">{Number(item.price).toLocaleString()}원</span>
                </div>
                <button className="delete-btn" onClick={() => handleRemove(item.id, index)}>
                  삭제
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div className="summary-row">
              <span>총 아이템 수</span>
              <span>{basketItems.length}개</span>
            </div>
            <div className="summary-row total">
              <span>최종 결제 금액</span>
              <span className="total-amount">{totalPrice.toLocaleString()}원</span>
            </div>
            <button className="order-btn" onClick={() => deleteAllCart()}>장바구니 비우기</button>
            <button className="order-btn" onClick={paymentGoFn}>결제하기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Basket;