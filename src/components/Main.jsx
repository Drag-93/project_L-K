import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from 'react-router-dom'


import ReactFullpage from '@fullpage/react-fullpage';



// const Main = () => (
//   <ReactFullpage
//     scrollingSpeed={1000}
//     navigation // 우측 점 내비게이션 활성화
//     render={({ state, fullpageApi }) => {
//       return (
//         <ReactFullpage.Wrapper>
//           <div className="section sec1">
//             <div className="main_wrap">
//               <h1>
//                 <span className="reveal_text line1">진단에서 치료까지</span>
//                 <span className="reveal_text line2">피부과 전문의가 직접 치료합니다</span>
//               </h1>
//             </div>
//           </div>
//           <div className="section sec2">
//             <h1>지점 소개</h1>
//           </div>
//           <div className="section sec3">
//             <h1>예약 안내</h1>
//           </div>
//         </ReactFullpage.Wrapper>
//       );
//     }}
//   />
// );

const Main = () => (
  <ReactFullpage
    licenseKey={'OPEN-SOURCE-GPLV3-LICENSE'} // 여기에 라이선스 키 추가
    scrollingSpeed={1000}
    navigation
    render={({ state, fullpageApi }) => {
      return (
        <ReactFullpage.Wrapper>
          <div className="section sec1">
            <div className="main_wrap">
              <h1>
                <span className="reveal_text line1">진단에서 치료까지</span>
                <span className="reveal_text line2">피부과 전문의가 직접 치료합니다</span>
                <button><NavLink to={"/info/introduction"}>GO</NavLink></button>
              </h1>
            </div>
          </div>
          <div className="section sec2">
            <div className="productlink">
            <ul>
              <li><a href="/product/list"><img src="/public/images/sec2/sec2 1.png" alt="sec2 1" /></a></li>
              <li><a href="/product/list/hydro"><img src="/public/images/sec2/sec2 2.png" alt="sec2 2" /></a></li>
              <li><a href="/product/list/trouble"><img src="/public/images/sec2/sec2 3.png" alt="sec2 3" /></a></li>
              <li><a href="/product/list/white"><img src="/public/images/sec2/sec2 4.png" alt="sec2 4" /></a></li>
              <li><a href="/product/list/antiage"><img src="/public/images/sec2/sec2 5.png" alt="sec2 5" /></a></li>
              <li><a href="/product/list/uv"><img src="/public/images/sec2/sec2 6.png" alt="sec2 6" /></a></li>
              {/* <li><NavLink to = {"/product/list"}>전체 상품 보기</NavLink></li>
              <li><NavLink to = {"/product/list/hydro"}>보습</NavLink></li>
              <li><NavLink to = {"/product/list/trouble"}>트러블케어</NavLink></li>
              <li><NavLink to = {"/product/list/white"}>미백</NavLink></li>
              <li><NavLink to = {"/product/list/antiage"}>안티에이징</NavLink></li>
              <li><NavLink to = {"/product/list/uv"}>UV</NavLink></li> */}
            </ul>
            </div>
          </div>
          <div className="section sec3">
            <div className="reservationlink">
              <ul>
              <li><a href="/reservation/list"><img src="/public/images/sec3/sec3 1.png" alt="sec1" /></a></li>
              <li><a href="/reservation/list/lifting"><img src="/public/images/sec3/sec3 2.png" alt="sec3 2" /></a></li>
              <li><a href="/reservation/list/faceline"><img src="/public/images/sec3/sec3 3.png" alt="sec3 3" /></a></li>
              <li><a href="/reservation/list/regen"><img src="/public/images/sec3/sec3 4.png" alt="sec3 4" /></a></li>
              <li><a href="/reservation/list/immune"><img src="/public/images/sec3/sec3 5.png" alt="sec3 5" /></a></li>
                {/* <h3>진료예약</h3>
                <li><NavLink to = {"/reservation/list"}>전체</NavLink></li>
                <li><NavLink to = {"/reservation/list/lifting"}>리프팅</NavLink></li>
                <li><NavLink to = {"/reservation/list/faceline"}>페이스라인</NavLink></li>
                <li><NavLink to = {"/reservation/list/regen"}>피부재생</NavLink></li>
                <li><NavLink to = {"/reservation/list/immune"}>면역력</NavLink></li> */}
              </ul>
            </div>
          </div>
          <div className="section sec4">
            <div className="sec4-con">
              <div className="shoplist">
              <ul>
              <h2>지점소개</h2>
                {/* <img src="/public/images/sec4/map.png" alt="map" /> */}
                <li><NavLink to="shop/0">노원점</NavLink></li>
                <li><NavLink to="shop/1">신촌점</NavLink></li>
                <li><NavLink to="shop/2">강남점</NavLink></li>
                <li><NavLink to="shop/3">종로점</NavLink></li>
              </ul>
            </div>
              <div className="notice">
              <h3>공지사항</h3>
              <li><a href="/community/notice"><img src="/public/images/sec4/notice.png" alt="notice" /></a></li>
                {/* <h3><NavLink to = "community/notice"></NavLink></h3> */}
              </div>
              <div className="faq">
              <h4>자주 묻는 질문</h4>
              <li><a href="/community/faq"><img src="/public/images/sec4/faq.png" alt="faq" /></a></li>
                {/* <h4><NavLink to = "community/faq"></NavLink></h4> */}
              </div>
              <div className="qna">
              <h5>Q&A</h5>
              <li><a href="/community/qna"><img src="/public/images/sec4/qna.png" alt="qna" /></a></li>
                {/* <h5><NavLink to = "community/qna"></NavLink></h5> */}
              </div>
            </div>
            </div>
        </ReactFullpage.Wrapper>
      );
    }}
  />
);
export default Main