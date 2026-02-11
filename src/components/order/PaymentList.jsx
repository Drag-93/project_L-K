import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_JSON_SERVER_URL } from '../../api/commonApi';
import { useNavigate } from 'react-router-dom';

const PaymentList = () => {
  const [productOrders, setProductOrders] = useState([]);
  const [reserveOrders, setReserveOrders] = useState([]);

  const navigate=useNavigate()

  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state) => state.input.user);
  const state = useSelector((state) => state);
  const isState = useSelector((state) => state.input.isState);


  useEffect(() => {
      if (isState === true) {
        alert(`로그인 후 이용하세요`);
        navigate(`/auth/login`);
      }
    }, [state]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [prodRes, resRes] = await Promise.all([
          axios.get(`${API_JSON_SERVER_URL}/productOrders`),
          axios.get(`${API_JSON_SERVER_URL}/reserveOrders`)
        ]);

        const myProdOrders = prodRes.data.filter(order => order.customer.userEmail === userInfo?.userEmail);
        const myResOrders = resRes.data.filter(order => order.customer.userEmail === userInfo?.userEmail);

        setProductOrders(myProdOrders.reverse());
        setReserveOrders(myResOrders.reverse());
        setLoading(false);
      } catch (err) {
        console.error("주문 내역 로드 실패:", err);
        setLoading(false);
      }
    };

    if (userInfo?.userEmail) fetchOrders();
  }, [userInfo]);

  if (loading) return <div className="loading">내역을 불러오는 중...</div>;

  return (
    <div className="order-list-container">
      <h2 className="order-title">나의 주문/예약 내역</h2>

      {/* 일반 상품 주문 섹션 */}
      <section className="order-section">
        <h3 className="section-title">📦 주문 상품 ({productOrders.length})</h3>
        {productOrders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span className="order-date">{order.productDate}</span>
              <span className="order-id">주문번호: {order.id}</span>
            </div>
            <div className="item-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="item-row">
                  {/* 이미지 경로: /images/카테고리/파일명 */}
                  <img 
                    src={`/images/${item.category}/${item.img}`} 
                    alt={item.name} 
                    className="item-img" 
                  />
                  <div className="item-info">
                    <p className="item-cat">[{item.category}]</p>
                    <p className="item-name">{item.name}</p>
                    <p className="item-price">{item.count}개 / {(item.price * item.count).toLocaleString()}원</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <span className="total-label">총 결제금액</span>
              <span className="total-amt">{order.totalAmount.toLocaleString()}원</span>
            </div>
          </div>
        ))}
      </section>

      {/* 예약 서비스 섹션 */}
      <section className="order-section">
        <h3 className="section-title">📅 예약 내역 ({reserveOrders.length})</h3>
        {reserveOrders.map((order) => (
          <div key={order.id} className="order-card reserve">
            <div className="order-header">
              <span className="order-date">{order.reserveDate}</span>
              <span className="order-id">예약번호: {order.id}</span>
            </div>
            <div className="item-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="item-row">
                  <img 
                    src={`/images/${item.category}/${item.img}`} 
                    alt={item.name} 
                    className="item-img" 
                  />
                  <div className="item-info">
                    <p className="item-cat">[{item.category}]</p>
                    <p className="item-name">
                      {item.name}
                      <span className={item.state === '예약완료' ? 'ok' : ''}>
                        {item.state}
                      </span>
                    </p>
                    <p className="item-time">예약일시: {item.date} {item.time}</p>
                    
                  </div>
                </div>
              ))}
            </div>
            <div className="order-footer">
              <span className="total-label">총 예약금액</span>
              <span className="total-amt">{order.totalAmount.toLocaleString()}원</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default PaymentList;