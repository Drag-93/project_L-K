import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { API_JSON_SERVER_URL } from '../../api/commonApi';
import { useNavigate } from 'react-router-dom';
import { clearBasket } from '../../store/slice/basketSlice';

const paymentInfoForm={
  userEmail: '',
  userName: '',
  phonenum: '',
  address: '',
  request:'안전한 배송 부탁드립니다.'
}

const paymentProInfoForm={
  userEmail: '',
  userName: '',
  phonenum: '',
  request:'안전한 시술 부탁드립니다.'
}

const Payment = () => {

  const [paymentInfo,setPaymentInfo]=useState(paymentInfoForm)
  const [paymentProInfo,setPaymentProInfo]=useState(paymentProInfoForm)
  const navigate=useNavigate()

  const userInfo = useSelector((state) => state.input.user);
  const state = useSelector((state) => state);
  const isState = useSelector((state) => state.input.isState);
  const basketItems = useSelector((state) => state.basket.basketItems);
  const dispatch = useDispatch();


  useEffect(() => {
      if (isState === true) {
        alert(`로그인 후 이용하세요`);
        navigate(`/auth/login`);
      }
    }, [state]);


  useEffect(() => {
    if (userInfo) {
      setPaymentInfo({
        ...paymentInfoForm,
        userEmail: userInfo.userEmail || '',
        userName: userInfo.userName || '',
        phonenum: userInfo.phonenum || '',
        address: userInfo.address || '',
      });
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      setPaymentProInfo({
        ...paymentProInfoForm,
        userEmail: userInfo.userEmail || '',
        userName: userInfo.userName || '',
        phonenum: userInfo.phonenum || '',
        address: userInfo.address || '',
      });
    }
  }, [userInfo]);


  const paymentChangeFn=(e)=>{
    const {name,value}=e.target
    setPaymentInfo({...paymentInfo,[name]:value});
  }

  const paymentProChangeFn=(e)=>{
    const {name,value}=e.target
    setPaymentProInfo({...paymentProInfo,[name]:value});
  }


   // 2. 장바구니 아이템 중 "time" 값이 있는 것만 필터링
   const reserveItems = basketItems.filter(item => item.time && item.time.trim() !== "");
   const productItems = basketItems.filter(item => item.count && Number(item.count) > 0);

   const productTotalCount = productItems.reduce((acc, cur) => acc + Number(cur.count), 0);

   // 3. time 값이 있는 아이템의 총 가격
   const reservePrice= reserveItems.reduce((acc, cur) => acc + Number(cur.price), 0);
   const productPrice = productItems.reduce((acc, cur) => acc + (Number(cur.price) * Number(cur.count)), 0);



   const totalPrice = reservePrice + productPrice;



  const paymentFn=async()=>{
    if (reserveItems.length > 0) {
      if (!paymentProInfo.userName || !paymentProInfo.phonenum) {
        alert("예약 정보를 모두 입력해주세요.");
        return;
      }
    }

    if (productItems.length > 0) {
      if (!paymentInfo.userName || !paymentInfo.phonenum || !paymentInfo.address) {
        alert("배송 정보를 모두 입력해주세요.");
        return;
      }
    }

    if (basketItems.length === 0) return;
    if (!window.confirm("결제를 진행하시겠습니까?")) return;


    try {
      if (reserveItems.length > 0) {
        const reserveData = {
          reserveDate: new Date().toLocaleString(),
          customer: paymentProInfo,
          items: reserveItems,
          totalAmount: reservePrice,
        };
        await axios.post(`${API_JSON_SERVER_URL}/reserveOrders`, reserveData);
      }

      if (productItems.length > 0) {
        const productData = {
          productDate: new Date().toLocaleString(),
          customer: paymentInfo,
          items: productItems,
          totalAmount: productPrice,
        };
        await axios.post(`${API_JSON_SERVER_URL}/productOrders`, productData);
      }



      // 3. 장바구니 서버 데이터 비우기
      const deleteRequests = basketItems.map(item => 
        axios.delete(`${API_JSON_SERVER_URL}/cart/${item.id}`)
      );
      await Promise.all(deleteRequests);

      // 4. Redux 스토어 비우기 및 이동
      dispatch(clearBasket());
      alert("결제가 완료되었습니다!");
      navigate('/order/PaymentList'); // 메인으로 이동

    } catch (err) {
      console.error("결제 처리 오류:", err);
      alert("결제 중 오류가 발생했습니다.");
    }
    
  }


  return (
    <>
      <div className="payment-wrapper">
    <div className="payment-container">
      <h2 className="payment-title">주문 / 결제</h2>
      
      <div className="payment-content">
        {/* 왼쪽: 입력 폼 */}
        <div className="payment-left">
        {reserveItems.length > 0 && (
          <section className="info-section">
            <h3 className="section-subtitle">예약 정보</h3>
            <div className="form-row">
              <div className="form-group">
                <label>예약인</label>
                <input type="text" name="userName" placeholder="이름" value={paymentProInfo.userName} onChange={paymentProChangeFn} />
              </div>
              <div className="form-group">
                <label>연락처</label>
                <input type="text" name="phonenum" placeholder="010-0000-0000" value={paymentProInfo.phonenum} onChange={paymentProChangeFn} />
              </div>
              </div>
              <div className="form-row">

              <div className="form-group">
                <label>진료 요청사항</label>
                <textarea name="request" rows="3" placeholder="예: 안전한 시술 부탁드립니다." value={paymentProInfo.request} onChange={paymentProChangeFn}></textarea>
              </div>              
              </div>
           
          </section>
        )}

        {productItems.length > 0 && (
          
          <section className="info-section">
            <h3 className="section-subtitle">배송 정보</h3>
            <div className="form-row">
              <div className="form-group">
                <label>수령인</label>
                <input type="text" name="userName" placeholder="이름" value={paymentInfo.userName} onChange={paymentChangeFn} />
              </div>
              <div className="form-group">
                <label>연락처</label>
                <input type="text" name="phonenum" placeholder="010-0000-0000" value={paymentInfo.phonenum} onChange={paymentChangeFn} />
              </div>
            </div>
            <div className="form-group">
              <label>주소</label>
              <input type="text" name="address" placeholder="배송지 주소를 입력하세요" value={paymentInfo.address} onChange={paymentChangeFn}/>
            </div>
            <div className="form-group">
              <label>배송 요청사항</label>
              <textarea name="request" rows="3" placeholder="예: 문 앞에 놓아주세요." value={paymentInfo.request} onChange={paymentChangeFn}></textarea>
            </div>
          </section>
        
        )}
        </div>
        
        

        {/* 오른쪽: 요약 카드 */}
        <div className="payment-right">
          <div className="sticky-summary">
            <div className="summary-card">
              <h3 className="section-subtitle">결제 요약</h3>
              
              <div className="summary-details">
                {productItems.length > 0 && (
                  <div className="summary-item">
                    <div className="item-label">
                      <span>일반 상품</span>
                      <span className="count-badge">{productTotalCount}개</span>
                    </div>
                    <span className="price-val">{productPrice.toLocaleString()}원</span>
                  </div>
                )}

                {reserveItems.length > 0 && (
                  <div className="summary-item">
                    <div className="item-label">
                      <span>예약 상품</span>
                      <span className="count-badge">{reserveItems.length}건</span>
                    </div>
                    <span className="price-val">{reservePrice.toLocaleString()}원</span>
                  </div>
                )}
              </div>

              <div className="total-divider"></div>
              
              <div className="summary-total">
                <span>최종 결제 금액</span>
                <span className="total-price-text">{totalPrice.toLocaleString()}원</span>
              </div>

              <button className="btn-pay-submit" onClick={paymentFn}>
                {totalPrice.toLocaleString()}원 결제하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

    </>
  )
}

export default Payment