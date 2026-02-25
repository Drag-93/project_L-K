import React from "react";
import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer_wrap">
          <div className="footer_left">
            <Link to={`/`}>
              <img src="/public/images/logo_w.png" alt="logo" />
            </Link>
            <ul>
              <li>
                <span>상호명 : L&K클리닉</span>
                <span>대표자명 : 홍길동</span>
              </li>
              <li>
                <span>사업자등록번호 : 000-00-00000</span>
                <span>통산판매업신고번호 : 제0000-서울노원-0000호</span>
              </li>
              <li>
                <span>주소 : 서울 노원구 상계로3길 21 화일빌딩 3-6층</span>
              </li>
              <li>
                <span>© 2026 L&K Clinic. All bottoms reserved.</span>
              </li>
            </ul>
          </div>
          <div className="footer_right">
            <ul>
              <li>
                <span>고객센터</span>
                <span>1588-0000</span>
              </li>
              <li>
                <span>본사</span>
                <span>02-000-0000</span>
              </li>
              <li>
                <span>Fax</span>
                <span>000-0000-0000</span>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
