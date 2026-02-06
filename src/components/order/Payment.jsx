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

const Payment = () => {

  const [paymentInfo,setPaymentInfo]=useState(paymentInfoForm)
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


  const paymentChangeFn=(e)=>{
    const {name,value}=e.target
    setPaymentInfo({...paymentInfo,[name]:value});
  }

  const paymentFn=async()=>{
    if (!paymentInfo.userName || !paymentInfo.phonenum || !paymentInfo.address) {
      alert("배송 정보를 모두 입력해주세요.");
      return;
    }

    if (basketItems.length === 0) return;
    if (!window.confirm("결제를 진행하시겠습니까?")) return;

    // 2. 장바구니 아이템 중 "time" 값이 있는 것만 필터링
    const reserveItems = basketItems.filter(item => item.time && item.time.trim() !== "");

    // 3. time 값이 있는 아이템의 총 가격
    const reservePrice= reserveItems.reduce((acc, cur) => acc + Number(cur.price), 0);

    try {
      if (reserveItems.length > 0) {
        const reserveData = {
          reserveDate: new Date().toLocaleString(),
          customer: paymentInfo,
          items: reserveItems,
          totalAmount: reservePrice,
        };
        await axios.post(`${API_JSON_SERVER_URL}/reserveOrders`, reserveData);
      }



      // 3. 장바구니 서버 데이터 비우기
      const deleteRequests = basketItems.map(item => 
        axios.delete(`${API_JSON_SERVER_URL}/cart/${item.id}`)
      );
      await Promise.all(deleteRequests);

      // 4. Redux 스토어 비우기 및 이동
      dispatch(clearBasket());
      alert("결제가 완료되었습니다!");
      navigate('/'); // 메인으로 이동

    } catch (err) {
      console.error("결제 처리 오류:", err);
      alert("결제 중 오류가 발생했습니다.");
    }
    
  }



  const totalPrice = basketItems.reduce((acc, cur) => acc + Number(cur.price), 0);

  return (
    <>
      <div className="payment-page">
      <div className="payment-container">
        <h2 className="page-title">주문 / 결제</h2>
        
        <div className="payment-flex">
          {/* 왼쪽: 입력 폼 */}
          <div className="payment-left">
            <section className="form-section">
              <h3 className="section-title">배송 정보</h3>
              <div className="input-group">
                <label>아이디</label>
                <input type="email" name="userEmail" value={paymentInfo.userEmail} readOnly/>
              </div>
              <div className="input-group">
                <label>받는 분</label>
                <input type="text" name="userName" placeholder="이름을 입력하세요" value={paymentInfo.userName} onChange={paymentChangeFn} />
              </div>
              <div className="input-group">
                <label>연락처</label>
                <input type="text" name="phonenum" placeholder="010-0000-0000" value={paymentInfo.phonenum} onChange={paymentChangeFn} />
              </div>
              <div className="input-group">
                <label>주소</label>
                <input type="text" name="address" placeholder="상세 주소를 입력하세요" value={paymentInfo.address} onChange={paymentChangeFn}/>
              </div>
              <div className="input-group">
                <label>배송 요청사항</label>
                <textarea name="request" rows="3" placeholder="안전한 배송 부탁드립니다." value={paymentInfo.request} onChange={paymentChangeFn}></textarea>
              </div>
            </section>
          </div>

          {/* 오른쪽: 주문 요약 및 결제 버튼 */}
          <div className="payment-right">
            <div className="summary-card">
              <h3 className="section-title">최종 결제 금액</h3>
              <div className="summary-row">
                <span>주문 상품</span>
                <span>{basketItems.length}개</span>
              </div>
              <div className="summary-row">
                <span>상품 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="summary-row total">
                <span>총 결제금액</span>
                <span className="total-price">{totalPrice.toLocaleString()}원</span>
              </div>
              <button className="pay-submit-btn" onClick={paymentFn}>
                {totalPrice.toLocaleString()}원 결제하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    </>
  )
}

export default Payment