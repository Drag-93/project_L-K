import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from 'react-router-dom'



const Main = () => {


  return (
    <>
      <div className="section sec1">
        <img src="/images/main_banner_01.png" className="banner"/>
        <div className="main_nav">
          <ul>
            <li>
              <Link to={`product/list/hydro`}>
                <div className="main_nav_img">
                  <img src="/images/main_icon_01.png" alt="" />
                </div>
                <p>보습</p>
              </Link>
            </li>
            <li>
              <Link to={`product/list/trouble`}>
                <div className="main_nav_img">
                  <img src="/images/main_icon_02.png" alt="" />
                </div>
                <p>트러블</p>
              </Link>
            </li>
            <li>
              <Link to={`product/list/white`}>
                <div className="main_nav_img">
                  <img src="/images/main_icon_03.png" alt="" />
                </div>
                <p>미백</p>
              </Link>
            </li>
            <li>
              <Link to={`product/list/antiage`}>
                <div className="main_nav_img">
                  <img src="/images/main_icon_04.png" alt="" />
                </div>
                <p>안티에이징</p>
              </Link>
            </li>
            <li>
              <Link to={`product/list/uv`}>
                <div className="main_nav_img">
                  <img src="/images/main_icon_05.png" alt="" />
                </div>
                <p>UV</p>
              </Link>
            </li>
            <li>
              <Link to={`reservation/list/lifting`}>
                <div className="main_nav_img">
                  <img src="/images/main_icon_06.png" alt="" />
                </div>
                <p>리프팅</p>
              </Link>
            </li>
            <li>
              <Link to={`reservation/list/faceline`}>
                <div className="main_nav_img">
                  <img src="/images/main_icon_07.png" alt="" />
                </div>
                <p>페이스라인</p>
              </Link>
            </li>
            <li>
              <Link to={`reservation/list/regen`}>
                <div className="main_nav_img">
                  <img src="/images/main_icon_08.png" alt="" />
                </div>
                <p>피부재생</p>
              </Link>
            </li>
            <li>
              <Link to={`reservation/list/immune`}>
                <div className="main_nav_img">
                  <img src="/images/main_icon_09.png" alt="" />
                </div>
                <p>면역증강</p>
              </Link>
            </li>
            <li>
              <Link to={`shop`}>
                <div className="main_nav_img">
                  <img src="/images/main_icon_10.png" alt="" />
                </div>
                <p>지점소개</p>
              </Link>
            </li>
            <li>
              <Link to={`community/notice`}>
                <div className="main_nav_img">
                  <img src="/images/main_icon_11.png" alt="" />
                </div>
                <p>공지사항</p>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="section sec2">
        <div className="main_inner">
          <div className="main_sec_title">
            <div className="main_sec_title_cat">
              <strong>PRODUCT</strong>
            </div>
            <h2>
              내일의 당신을 완성하는
              <b>오늘의 선택</b>
            </h2>
            <p>단순한 관리를 넘어, 당신의 <span>본연의 아름다움</span>이 깨어나는 순간을 <span>경험</span>해 보세요</p>
          </div>
          <div className="main_sec2_con">
            <Link to={`product`} className="main_view_btn">View More</Link>
            <div className="main_sec2_wrap">
              <div className="main_sec2_wrap_img">
                <div className="sec2_img sec2_img1"></div>
                <div className="sec2_img sec2_img2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="section sec3">
        <div className="main_inner">
          <div className="main_sec_title">
            <div className="main_sec_title_cat">
              <strong>RESERVATION</strong>
            </div>
            <h2>
              일상의 공백을 채우는
              <b>프리미엄 케어</b>
            </h2>
            <p>많은 분이 직접 경험하고 증명한,가장 <span>프라이빗한 공간</span>에서 누리는 <span>전문가의 손길</span></p>
          </div>
        </div>
        <div className="main_sec2_con">
            <Link to={`reservation`} className="main_view_btn">View More</Link>
            <div className="main_sec3_wrap">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                preload="metadata" 
                src="/images/bv_video.mp4"
              >
              </video>
            </div>
          </div>
      </div>
    </>
  )
};

export default Main