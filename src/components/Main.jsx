import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from 'react-router-dom'


import ReactFullpage from '@fullpage/react-fullpage';



const Main = () => {
  return (
    <>
      <div className="section sec1">
        <img src="/images/main_banner_ex.avif" className="banner"/>
        <div className="main_wrap">
        </div>
      </div>
      <div className="section sec2">
        <h1>지점 소개</h1>
      </div>
      <div className="section sec3">
        <h1>예약 안내</h1>
      </div>
    </>
  )
};

export default Main