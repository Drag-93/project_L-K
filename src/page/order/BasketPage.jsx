import React from 'react'
import Basket from '../../components/order/Basket'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux';

const BasketPage = () => {

    const basketItems = useSelector((state) => state.basket.basketItems);
    const isBasketEmpty = basketItems.length === 0;

    const handleNavClick = (e, path) => {
      // 3. 장바구니가 비어있는데 결제나 결제완료로 가려고 하면 막기
      if (isBasketEmpty && path !== '/order/basket') {
        e.preventDefault(); // 링크 이동 방지
        alert("장바구니에 담긴 상품이 없습니다.");
        return;
      }
  
      // 조건 통과 시 스크롤 최상단 이동
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

  return (
    <div className="inner2">
      <div className="order_aside">
        <ul>
          <li><NavLink to={`/order/basket`} onClick={handleNavClick} className="order_aside_list"><span><b></b></span>1. 장바구니</NavLink></li>
          <li><NavLink to={`/order/payment`} onClick={handleNavClick} className="order_aside_list"><span><b></b></span>2. 결제하기</NavLink></li>
          <li><NavLink to={`/order/paymentList`} onClick={(e)=>e.preventDefault()} className="order_aside_list"><span><b></b></span>3. 결제완료</NavLink></li>
        </ul>
      </div>
      <Basket/>
    </div>
  )
}

export default BasketPage