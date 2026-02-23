import React from 'react'
import PaymentList from '../../components/order/PaymentList'
import { NavLink } from 'react-router-dom'

const PaymentListPage = () => {

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
          <li><NavLink to={`/order/payment`} onClick={(e)=>e.preventDefault()} className="order_aside_list"><span><b></b></span>2. 결제하기</NavLink></li>
          <li><NavLink to={`/order/paymentList`} onClick={handleNavClick} className="order_aside_list"><span><b></b></span>3. 결제완료</NavLink></li>
        </ul>
      </div>
      <PaymentList/>
    </div>
  )
}

export default PaymentListPage