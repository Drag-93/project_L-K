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
              <h2>상품판매</h2>
              <li><NavLink to = {"/product/list"}>전체</NavLink></li>
              <li><NavLink to = {"/product/list/hydro"}>보습</NavLink></li>
              <li><NavLink to = {"/product/list/trouble"}>트러블케어</NavLink></li>
              <li><NavLink to = {"/product/list/white"}>미백</NavLink></li>
              <li><NavLink to = {"/product/list/antiage"}>안티에이징</NavLink></li>
              <li><NavLink to = {"/product/list/uv"}>UV</NavLink></li>
            </ul>
            </div>
          </div>
          <div className="section sec3">
            <h1>예약 안내</h1>
          </div>
        </ReactFullpage.Wrapper>
      );
    }}
  />
);
export default Main