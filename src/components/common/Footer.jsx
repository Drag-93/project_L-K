import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-con">
          <div className="footer-top">
          <ul>
            <li>상호:L&K클리닉 | 대표자명 : 홍길동</li>
            <li>사업자등록번호 : 000-00-00000 | 통산판매업신고번호 : 제0000-서울노원-0000호</li>
            <li>연락처 : 02-000-0000 | 팩스 : 000-0000-0000</li>
            <li>주소 : 서울 노원구 상계로3길 21, 화일빌딩/ 3층, 6층</li>
            </ul>
            </div>
            <div className="footer-bottom">
              <ul>
            <li><NavLink to={"/info"}>회사소개</NavLink></li>
            <li><NavLink to={"/shop"}>지점소개</NavLink></li>
            <li><NavLink to={"/community/faq"}>자주 묻는 질문</NavLink></li>
            <li><NavLink to={"/community/qna"}>Q&A</NavLink></li>
          </ul>
          </div>
          <div className="footer-last">
            <li>이용약관</li>
            <li>개인정보처리방침</li>
            <li>© 2026 L&K Clinic. All bottoms reserved.</li>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
