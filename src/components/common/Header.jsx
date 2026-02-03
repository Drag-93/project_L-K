import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [pageClass, setPageClass] = useState("");

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsScrolled(true); // 다른 페이지에선 active 해제
      setPageClass("");
      return; 
    }else{
      setPageClass("header-main");
    }

    const handleScroll = () => {
      // 100px 이상 스크롤되면 true, 아니면 false
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // 언마운트 시 이벤트 리스너 제거 (메모리 누수 방지)
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <header className={`header ${isScrolled || isHovered ? 'active' : ''} ${pageClass} ${isHovered ? 'on' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      >
        <div className="header_wrap">
          <h1>
            <Link to={`/`}>logo</Link>
          </h1>
          <nav className="nav">
            <ul>
              <li>
                <Link to={`/info`}>회사소개</Link>
              </li>
              <li>
                <Link to={`/product`}>상품판매</Link>
              </li>
              <li>
                <Link to={`/reservation`}>진료예약</Link>
              </li>
              <li>
                <Link to={`/shop`}>지점소개</Link>
              </li>
              <li>
                <Link to={'/community'}>커뮤니티</Link>
              </li>
            </ul>
          </nav>
          <div className="header_auth">
              <Link to={'/auth'} className="header_auth_btn">
                <img src="/public/images/icon_user_w.svg"/>
                <span>로그인</span>
              </Link>
          </div>
        </div>
      </header>

    </>
  );
};

export default Header;
