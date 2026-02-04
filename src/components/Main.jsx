import { useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom'


import ReactFullpage from '@fullpage/react-fullpage';

const Main = () => (
  <ReactFullpage
    scrollingSpeed={1000}
    navigation // 우측 점 내비게이션 활성화
    render={({ state, fullpageApi }) => {
      return (
        <ReactFullpage.Wrapper>
          <div className="section sec1">
            <div className="main_wrap">
              <h1>
                <span className="reveal_text line1">진단에서 치료까지</span>
                <span className="reveal_text line2">피부과 전문의가 직접 치료합니다</span>
              </h1>
            </div>
          </div>
          <div className="section sec2">
            <h1>지점 소개</h1>
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