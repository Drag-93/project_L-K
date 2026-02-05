import React from 'react'
import { Link } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

const ShopLeft = () => {
  return (<>
  <div className="Shop-left">
    <div className="Shop-left-con">
      <ul>
        <li><NavLink to ="/Shop/nowon" className={({ isActive }) => (isActive ? 'active' : '')}>노원</NavLink></li>
        <li><NavLink to= "/Shop/sinchon" className={({ isActive }) => (isActive ? 'active' : '')}>신촌</NavLink></li>
        <li><NavLink to= "/Shop/gangnam" className={({ isActive }) => (isActive ? 'active' : '')}>강남</NavLink></li>
        <li><NavLink to= "/Shop/jongro" className={({ isActive }) => (isActive ? 'active' : '')}>종로</NavLink></li>
      </ul>
    </div>
  </div>
  </>)
}

export default ShopLeft