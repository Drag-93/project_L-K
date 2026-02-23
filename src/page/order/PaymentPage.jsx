import React from 'react'
import Payment from '../../components/order/Payment'
import { NavLink } from 'react-router-dom'

const PaymentPage = () => {

  const handleNavClick = () => {
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
      <Payment/>
    </div>
  )
}

export default PaymentPage