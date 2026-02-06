import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { logoutF } from "../../store/slice/inputSlice";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [pageClass, setPageClass] = useState("");

  const param = useParams();

  const state = useSelector((state) => state);
  const isState = useSelector((state) => state.input.isState);
  console.log(state);
  console.log(state.input.isState);
  console.log(isState);

  const dispatch = useDispatch();
  const loginFn = (e) => {
    e.preventDefault();

    alert("로그아웃 실행!");
    dispatch(logoutF());
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true); // 다른 페이지에선 active 해제
      setPageClass("");
      return;
    } else {
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

    window.addEventListener("scroll", handleScroll);

    // 언마운트 시 이벤트 리스너 제거 (메모리 누수 방지)
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const basketItems = useSelector(state => state.basket.basketItems);

  return (
    <>
      <div
        className={`header_wrap ${pageClass} ${isHovered ? "on" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <header className={`header ${isScrolled || isHovered ? "active" : ""}`}>
          <div className="header_box">
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
                  <Link to={"/community"}>커뮤니티</Link>
                </li>
              </ul>
            </nav>
            <div className="header_auth">
            
              {isState ? (
                <>
                  <Link to={"/order"} className="header_auth_btn header_basket_btn">
                      <img src="/public/images/icon_basket.svg" />
                      {basketItems.length > 0 && (
                        <span className="basket-count">{basketItems.length}</span>
                      )}
                  </Link>
                  <Link to={"/auth"} className="header_auth_btn">
                    <img src="/public/images/icon_user_w.svg" />
                    <span>로그인</span>
                  </Link>
                </>
              ) : (
                <>
                  {state.input.user.role === "ROLE_ADMIN" ? (
                    <>
                      <Link onClick={loginFn} className="header_auth_btn">
                        <span>로그아웃</span>
                      </Link>
                      <Link to={`/admin`} className="header_auth_btn">
                        <span>관리자</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to={"/order"} className="header_auth_btn header_basket_btn">
                        <img src="/public/images/icon_basket.svg" />
                        {basketItems.length > 0 && (
                        <span className="basket-count">{basketItems.length}</span>
                      )}
                      </Link>
                      <Link onClick={loginFn} className="header_auth_btn">
                        <span>로그아웃</span>
                      </Link>
                      <Link
                        to={`/auth/Mypage/${state.input.user.id}`}
                        className="header_auth_btn">
                        <img src="/public/images/icon_user_w.svg" />
                        <span>MYPAGE</span>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </header>
        <div className="header_depth">
          <ul>
            <li>
              <Link to={`/info/introduction`}>소개</Link>
              <Link to={`/info/history`}>연혁</Link>
            </li>
            <li>
              <Link to={`/product/hydro`}>보습제품</Link>
              <Link to={`/product/trouble`}>트러블</Link>
              <Link to={`/product/white`}>화이트</Link>
              <Link to={`/product/antiage`}>안티에이징</Link>
              <Link to={`/product/uv`}>UV</Link>
            </li>
            <li>
              <Link to={`/reservation/lifting`}>리프팅</Link>
              <Link to={`/reservation/faceline`}>페이스라인</Link>
              <Link to={`/reservation/regen`}>재생</Link>
              <Link to={`/reservation/immune`}>면역력</Link>
            </li>
            <li>
              <Link to={`/shop/nowon`}>노원점</Link>
              <Link to={`/shop/sinchon`}>신촌점</Link>
              <Link to={`/shop/gangnam`}>강남점</Link>
              <Link to={`/shop/jongro`}>종로점</Link>
            </li>
            <li>
              <Link to={`/community/notice`}>공지사항</Link>
              <Link to={`/community/faq`}>자주 묻는 질문</Link>
              <Link to={`/community/qna`}>Q&A</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;
