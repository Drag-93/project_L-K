import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import Calendar from "react-calendar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addBasket } from "../../store/slice/basketSlice";
import ReservDetailDesc from "./ReservDetailDesc";
import ReservDetailReview from "./ReservDetailReview";

const reserveData = {
  category: "",
  name: "",
  price: 0,
  img: "",
  date: "",
  time: "",
  shop: "",
  setshop: [],
  settime: [],
};

const categoryMap = {
  lifting: "리프팅",
  faceline: "페이스라인",
  regen: "피부재생",
  immune: "면역증강",
};

const ReservDetail = () => {
  const isState = useSelector((state) => state.input.isState);
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [reserve, setReserve] = useState(reserveData);
  const url = API_JSON_SERVER_URL;

  const navigate = useNavigate();
  const location = useLocation();
  const [menuTab, setMenuTab] = useState("detaildesc");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${url}/reservation/${id}`);
        const resData = await res.json();
        setReserve(resData);
      } catch (err) {
        console.log("로딩 실패");
      }
    };
    fetchDetail();
  }, []);

  // 예약 완료된 시간들을 저장할 상태 추가
  const [bookedTimes, setBookedTimes] = useState([]);

  // [핵심 추가] 날짜나 지점, 진료명이 변경될 때마다 예약된 시간을 체크
  useEffect(() => {
    const fetchBookedTimes = async () => {
      // 날짜와 지점이 모두 선택되었을 때만 실행
      if (!reserve.date || !reserve.shop) return;

      try {
        // 1. 이미 결제 완료된 예약 내역 가져오기
        const orderRes = await axios.get(`${url}/reserveOrders`);
        const bookedInOrders = orderRes.data.flatMap((order) =>
          order.items
            .filter(
              (item) =>
                item.date === reserve.date &&
                item.shop === reserve.shop &&
                item.name === reserve.name,
            )
            .map((item) => item.time),
        );

        // 2. 다른 사람이 장바구니에 담아둔 시간 가져오기 (실시간 중복 방지)
        const cartRes = await axios.get(
          `${url}/cart?date=${reserve.date}&shop=${reserve.shop}&name=${reserve.name}`,
        );
        const bookedInCart = cartRes.data.map((item) => item.time);

        // 3. 두 리스트를 합쳐서 예약 불가능한 시간 설정
        setBookedTimes([...new Set([...bookedInOrders, ...bookedInCart])]);
      } catch (err) {
        console.error("예약 현황 로드 실패", err);
      }
    };

    fetchBookedTimes();
  }, [reserve.date, reserve.shop, reserve.name, url]);

  const availableShops = reserve.setshop;

  const handleShopSelect = (selectedShop) => {
    setReserve((prev) => ({ ...prev, shop: selectedShop }));
    console.log(reserve);
  };

  //캘린더
  //날짜 계산
  const minDate = new Date(); // 현재 날짜
  minDate.setDate(minDate.getDate() + 1); // 내일 날짜
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3); // 3개월 후

  //날짜 선택 value 값
  const [dateValue, setDateValue] = useState(minDate);
  const availableTimes = reserve.settime;

  //주말만 가져오기
  const isWeekend = (date) => {
    const day = date.getDay();
    return day == 6 || day == 0; // 6:토,0:일
  };

  // tileDisabled 속성을 사용하여 주말 날짜를 비활성화
  const tileDisabled = ({ date }) => {
    //주말 날짜를 비활성화
    return isWeekend(date);
  };

  // 날짜 변경 핸들러
  const handleDateChange = (newDate) => {
    setDateValue(newDate);
    const formattedDate = newDate.toLocaleDateString("sv-SE"); // YYYY-MM-DD 형식
    setReserve((prev) => ({ ...prev, date: formattedDate, time: "" })); // 날짜 변경 시 시간 초기화
  };

  // 시간 선택 핸들러
  const handleTimeSelect = async (selectedTime) => {
    if (!reserve.shop) {
      alert("진료받으실 지점을 먼저 선택해주세요.");
      return;
    }

    if (!reserve.date) {
      alert("날짜를 먼저 선택해주세요.");
      return;
    }

    try {
      // 서버에서 해당 날짜와 시간에 이미 예약이 있는지 확인
      const res = await axios.get(
        `${url}/cart?date=${reserve.date}&time=${selectedTime}&shop=${reserve.shop}&name=${reserve.name}`,
      );

      // 2. 이미 결제 완료된 예약 내역(reserveOrders) 중복 체크
      const orderRes = await axios.get(`${url}/reserveOrders`);
      const allOrders = orderRes.data;

      const isAlreadyBooked = allOrders.some((order) =>
        order.items.some(
          (item) =>
            item.name === reserve.name && // 진료명 비교 추가
            item.date === reserve.date && // 날짜 비교
            item.time === selectedTime && // 시간 비교
            item.shop === reserve.shop,
        ),
      );

      if (res.data.length > 0) {
        alert("장바구니에 담긴 시간대입니다.");
        return;
      }

      if (isAlreadyBooked) {
        alert("이미 예약된 시간대입니다. 다른 시간을 선택해주세요.");
        return;
      }

      // 예약 가능할 경우 상태 업데이트
      setReserve((prev) => ({ ...prev, time: selectedTime }));
    } catch (err) {
      console.error("중복 체크 실패", err);
    }
  };

  const onPaymentFn = async () => {
    if (!reserve.shop || !reserve.date || !reserve.time) {
      alert("지점, 예약 날짜와 시간을 모두 선택해주세요.");
      return;
    }

    if (
      !window.confirm(
        `${reserve.shop}점에서 ${reserve.date} ${reserve.time}에 예약하시겠습니까?`,
      )
    )
      return;

    // if (isState) {
    //   alert('로그인해주세요.');
    //   return;
    // }
    const { id, ...item } = reserve;

    const payload = {
      ...item,
      itemId: id
    };

    try {
      const res = await axios.post(`${url}/cart`, payload);

      if (res.status === 201) {
        dispatch(addBasket(res.data));

        if (
          window.confirm("장바구니에 담겼습니다. 장바구니로 이동하시겠습니까?")
        ) {
          navigate("/order/basket");
          // navigate 임포트 필요
        } else {
          handleTimeSelect(null);
        }
      }
    } catch (err) {
      alert("통신 오류가 발생했습니다.");
    }
  };

  //마이페이지에서 후기로 링크
  useEffect(() => {
    if (location.state?.scrollTo === "review") {
      setMenuTab("review");
      document.getElementById("review")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.state]);

  return (
    <>
      <div className="reserv-detail">
        <div className="reserv-detail-con">
          <h1>
            <Link to={`/reservation/list`}>진료예약 </Link>
            &gt;
            <Link to={`/reservation/list/${reserve.category}`}>
              {" "}
              {categoryMap[reserve.category] || reserve.category}
            </Link>
          </h1>
          <div className="detail-top">
            <div className="detail-top-left">
              <img
                src={
                  reserve?.img
                    ? `/images/${reserve.category}/${reserve.img}`
                    : `/images/all_none.png`
                }
                alt={reserve.img}
                onError={(e) => (e.currentTarget.src = `/images/all_none.png`)}
              />
            </div>
            <div className="detail-top-right">
              <ul>
                <li>{reserve.name}</li>
                <li>
                  최대 <p className="main-txt">{reserve.timespan}시간</p> 소요
                </li>
                <li>
                  1회{" "}
                  <p className="main-txt">{Number(reserve.price).toLocaleString()}원</p>
                  <p className="price-vat">VAT 포함</p>
                </li>
                <li>{reserve.description}</li>
                {/* 1. 지점 선택 (항상 표시) */}
                <li>
                  <p>지점 선택</p>
                  <div className="shop-btns">
                    {availableShops.map((s) => (
                      <button
                        key={s}
                        className={`shop-btn ${reserve.shop === s ? "active" : ""}`}
                        onClick={() => handleShopSelect(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </li>

                {/* 2. 날짜 선택 (지점을 선택해야 나타남) */}
                {reserve.shop ? (
                  <li className="fade-in">
                    <p>날짜 선택</p>
                    <Calendar
                      onChange={handleDateChange}
                      value={dateValue}
                      showNeighboringMonth={false}
                      next2Label={null}
                      prev2Label={null}
                      minDetail="year"
                      minDate={minDate}
                      maxDate={maxDate}
                      tileDisabled={tileDisabled}
                    />
                  </li>
                ) : (
                  <li className="guide-text">
                    병원을 선택하시면 예약 가능한 날짜가 표시됩니다.
                  </li>
                )}

                {/* 3. 시간 선택 (날짜를 선택해야 나타남) */}
                {reserve.shop && reserve.date ? (
                  <li className="time-selection fade-in">
                    <p>예약 시간 선택</p>
                    <div className="time-btns">
                      {availableTimes.map((t) => {
                        const isBooked = bookedTimes.includes(t);
                        return (
                          <button
                            key={t}
                            className={`time-btn ${reserve.time === t ? "active" : ""} ${isBooked ? "disabled" : ""}`}
                            onClick={() => !isBooked && handleTimeSelect(t)}
                            disabled={isBooked}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </li>
                ) : (
                  reserve.shop && (
                    <li className="guide-text">
                      날짜를 선택하시면 예약 가능한 시간이 표시됩니다.
                    </li>
                  )
                )}

                {/* 4. 최종 선택 정보 및 버튼 (시간까지 선택해야 나타남) */}
                {reserve.time && (
                  <li className="final-selection fade-in">
                    <div className="selection-summary">
                      <p>
                        선택한 날짜 : <span>{reserve.date}</span>
                      </p>
                      <p>
                        선택한 시간 : <span>{reserve.time}</span>
                      </p>
                    </div>
                    <button className="payment-btn" onClick={onPaymentFn}>
                      장바구니에 담기
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="detail-bottom">
            <ul>
              <li
                className={`bottom-menu ${menuTab === "detaildesc" ? "active" : ""}`}
                onClick={() => {
                  setMenuTab("detaildesc");
                }}
              >
                상세정보
              </li>
              <li
                className={`bottom-menu ${menuTab === "review" ? "active" : ""}`}
                onClick={() => {
                  setMenuTab("review");
                }}
              >
                후기
              </li>
            </ul>
            <div className="bottom-content">
              {menuTab === "detaildesc" ? (
                <ReservDetailDesc />
              ) : (
                <ReservDetailReview />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservDetail;
