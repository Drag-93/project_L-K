import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { logoutF } from "../../store/slice/inputSlice";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [pageClass, setPageClass] = useState("");

  // 검색기능변수
  const [keyword, setKeyword] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const param = useParams();

  const state = useSelector((state) => state);
  const isState = useSelector((state) => state.input.isState);
  const location = useLocation();
  // console.log(state);
  // console.log(state.input.isState);
  // console.log(isState);

  const dispatch = useDispatch();
  const loginFn = (e) => {
    e.preventDefault();

    alert("로그아웃 실행!");
    dispatch(logoutF());
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveIndex(null);
    setIsHovered(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

  const basketItems = useSelector((state) => state.basket.basketItems);

  // 검색기능로직
  const handleSearch = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    // 검색 페이지로 검색어를 포함해 이동
    setIsSearchOpen(false);
    navigate(`/search?search=${encodeURIComponent(keyword)}`);
    setKeyword(""); // 입력창 비우기
  };

  // 모바일 메뉴
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [activeIndex, setActiveIndex] = useState(null);
  const handleTitleClick = (e, index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <div className={`header_search ${isSearchOpen ? "active" : ""}`}>
        <form className="search-bar" onSubmit={handleSearch}>
          <div className="search_box">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색어를 입력하세요..."
            />
            <button type="submit"></button>
          </div>
          <span onClick={() => setIsSearchOpen(false)}></span>
        </form>
      </div>
      <div
        className={`header_wrap ${pageClass} ${isHovered ? "on" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <header
          className={`header ${isScrolled || isHovered || isMenuOpen ? "active" : ""}`}
        >
          <div className="header_box">
            <div className="header_left">
              <h1>
                <Link to={`/`}>logo</Link>
              </h1>
            </div>
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
                  <Link to={"/community"}>커뮤니티</Link>
                </li>
              </ul>
            </nav>
            <div className="header_auth">
              <span
                className="header_auth_btn header_search_btn"
                onClick={() => setIsSearchOpen(true)}
              >
                <img src="/public/images/icon_search_w.svg" />
              </span>
              {isState ? (
                <>
                  <Link
                    to={"/order"}
                    className="header_auth_btn header_basket_btn"
                  >
                    <img src="/public/images/icon_basket.svg" />
                    {basketItems.length > 0 && (
                      <span className="basket-count">{basketItems.length}</span>
                    )}
                  </Link>
                  <Link to={"/auth"} className="header_auth_btn">
                    <span>로그인</span>
                  </Link>
                </>
              ) : (
                <>
                  {state.input.user?.role === "ROLE_ADMIN" ? (
                    <>
                      <Link
                        to={`/admin`}
                        className="header_auth_btn header_basket_btn"
                      >
                        <img src="/public/images/icon_admin_w.svg" />
                      </Link>
                      <Link onClick={loginFn} className="header_auth_btn">
                        <span>로그아웃</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to={"/order"}
                        className="header_auth_btn header_basket_btn"
                      >
                        <img src="/public/images/icon_basket.svg" />
                        {basketItems.length > 0 && (
                          <span className="basket-count">
                            {basketItems.length}
                          </span>
                        )}
                      </Link>
                      <Link
                        to={`/auth/mypage/${state.input.user.id}`}
                        className="header_auth_btn header_basket_btn"
                      >
                        <img src="/public/images/icon_user_w.svg" />
                      </Link>
                      <Link onClick={loginFn} className="header_auth_btn">
                        <span>로그아웃</span>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="header_auth_m">
              <span
                className="header_auth_btn header_search_btn"
                onClick={() => setIsSearchOpen(true)}
              >
                <img src="/public/images/icon_search_w.svg" />
              </span>
              {(isState || state.input.user?.role === "ROLE_MEMBER") && (
                <Link
                  to={"/order"}
                  className="header_auth_btn header_basket_btn"
                >
                  <img src="/public/images/icon_basket.svg" />
                  {basketItems.length > 0 && (
                    <span className="basket-count">{basketItems.length}</span>
                  )}
                </Link>
              )}
              <span
                className="header_auth_btn header_basket_btn"
                onClick={toggleMenu}
              >
                <img src="/public/images/icon_menu_w.svg" alt="메뉴 열기" />
              </span>
            </div>
          </div>
        </header>
        <div className="header_depth">
          <ul>
            <li>
              <Link to={`/info/introduction`}>소개</Link>
              <Link to={`/info/history`}>연혁</Link>
              <Link to={`/shop`}>지점소개</Link>
            </li>
            <li>
              <Link to={`/product/list/hydro`}>보습</Link>
              <Link to={`/product/list/trouble`}>트러블</Link>
              <Link to={`/product/list/white`}>미백</Link>
              <Link to={`/product/list/antiage`}>안티에이징</Link>
              <Link to={`/product/list/uv`}>UV</Link>
            </li>
            <li>
              <Link to={`/reservation/list/lifting`}>리프팅</Link>
              <Link to={`/reservation/list/faceline`}>페이스라인</Link>
              <Link to={`/reservation/list/regen`}>피부재생</Link>
              <Link to={`/reservation/list/immune`}>면역증강</Link>
            </li>
            <li>
              <Link to={`/community/notice`}>공지사항</Link>
              <Link to={`/community/faq`}>자주 묻는 질문</Link>
              <Link to={`/community/qna`}>Q&A</Link>
            </li>
          </ul>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="menu_backdrop"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
      <div className={`header_hidden_wrap ${isMenuOpen ? "active" : ""}`}>
        <div className="header_m_btn">
          <button
            className="header_auth_btn header_basket_btn"
            onClick={() => setIsMenuOpen(false)}
          >
            <img src="/public/images/icon_close.svg" alt="메뉴 닫기" />
          </button>
        </div>
        <nav className="nav">
          <ul>
            <li>
              {isState ? null /* 2. 내부 조건부 렌더링 시 중괄호 {} 를 제거해야 합니다 */ : state
                  .input.user?.role === "ROLE_ADMIN" ? (
                <Link to="/admin" className="depth_m_title">
                  관리자페이지
                </Link>
              ) : (
                <Link
                  to={`/auth/mypage/${state.input.user.id}`}
                  className="depth_m_title"
                >
                  마이페이지
                </Link>
              )}
            </li>
            <li>
              <strong
                onClick={(e) => handleTitleClick(e, 0)}
                className={`depth_m_title ${activeIndex === 0 ? "active" : ""}`}
              >
                회사소개
              </strong>
              <div
                className={`header_depth_m ${activeIndex === 0 ? "on" : ""}`}
              >
                <Link to={`/info/introduction`}>소개</Link>
                <Link to={`/info/history`}>연혁</Link>
                <Link to={`/shop`}>지점소개</Link>
              </div>
            </li>
            <li>
              <strong
                onClick={(e) => handleTitleClick(e, 1)}
                className={`depth_m_title ${activeIndex === 1 ? "active" : ""}`}
              >
                상품판매
              </strong>
              <div
                className={`header_depth_m ${activeIndex === 1 ? "on" : ""}`}
              >
                <Link to={`/product`}>전체</Link>
                <Link to={`/product/list/hydro`}>보습</Link>
                <Link to={`/product/list/trouble`}>트러블</Link>
                <Link to={`/product/list/white`}>미백</Link>
                <Link to={`/product/list/antiage`}>안티에이징</Link>
                <Link to={`/product/list/uv`}>UV</Link>
              </div>
            </li>
            <li>
              <strong
                onClick={(e) => handleTitleClick(e, 2)}
                className={`depth_m_title ${activeIndex === 2 ? "active" : ""}`}
              >
                진료예약
              </strong>
              <div
                className={`header_depth_m ${activeIndex === 2 ? "on" : ""}`}
              >
                <Link to={`/reservation`}>전체</Link>
                <Link to={`/reservation/list/lifting`}>리프팅</Link>
                <Link to={`/reservation/list/faceline`}>페이스라인</Link>
                <Link to={`/reservation/list/regen`}>피부재생</Link>
                <Link to={`/reservation/list/immune`}>면역증강</Link>
              </div>
            </li>
            <li>
              <strong
                onClick={(e) => handleTitleClick(e, 3)}
                className={`depth_m_title ${activeIndex === 3 ? "active" : ""}`}
              >
                커뮤니티
              </strong>
              <div
                className={`header_depth_m ${activeIndex === 3 ? "on" : ""}`}
              >
                <Link to={`/community/notice`}>공지사항</Link>
                <Link to={`/community/faq`}>자주 묻는 질문</Link>
                <Link to={`/community/qna`}>Q&A</Link>
              </div>
            </li>
          </ul>
        </nav>

        {isState ? (
          <Link to={"/auth"} className="header_m_auth">
            로그인
          </Link>
        ) : (
          <Link onClick={loginFn} className="header_m_auth">
            로그아웃
          </Link>
        )}
      </div>
    </>
  );
};

export default Header;
