import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminReservationModal = ({
  setReservationAddModal,
  reservationId,
  onSuccess,
}) => {
  const [allShops, setAllShops] = useState([]);
  const [detail, setDetail] = useState(null);
  const [allTimes, setAllTimes] = useState([""])

  const reservationUrl = API_JSON_SERVER_URL;
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const formatTime = (value) => {
  let numbers = value.replace(/[^0-9]/g, "").slice(0, 4);

  if (numbers.length === 4) {
    const hours = numbers.slice(0, 2);
    const minutes = numbers.slice(2, 4);

    if (parseInt(hours) < 24 && parseInt(minutes) < 60) {
      return `${hours}:${minutes}`;
    }else{
      alert("00:00에서 24:00 범위로 입력해 주세요")
      return ""
    }
  }
    return numbers;
  };

  const addReserveTime = () => {
    setAllTimes((prev) => [...prev, ""]);
  };

  const removeReserveTime = (index) => {
    if (allTimes.length === 1) return;
    const updated = allTimes.filter((_, i) => i !== index);
    setAllTimes(updated);
  };

  const handleReserveTimeChange = (index, value) => {
    const formatted=formatTime(value)
    setAllTimes((prev) => prev.map((item, i) => (i === index ? formatted : item)));
  };

  const onShopChange = (shopName) => {
    setDetail((prev) => {
      const currentShops = prev.setshop || [];
      return currentShops.includes(shopName)
        ? { ...prev, setshop: currentShops.filter((s) => s !== shopName) }
        : { ...prev, setshop: [...currentShops, shopName] };
    });
  };
  // const onTimeChange = (shopTime) => {
  //   setDetail((prev) => {
  //     const currentTimes = prev.settime || [];
  //     return currentTimes.includes(shopTime)
  //       ? { ...prev, settime: currentTimes.filter((s) => s !== shopTime) }
  //       : { ...prev, settime: [...currentTimes, shopTime] };
  //   });
  // };

  const handleTimeBlur = (index) => {
    setAllTimes((prev) => {
    const currentValue = prev[index];
    
    if (currentValue !== "" && prev.some((t, i) => i !== index && t === currentValue)) {
      alert("이미 등록된 시간입니다.");
      
      const resetTimes = [...prev];
      resetTimes[index] = ""; 
      return resetTimes;
    }

      const sortedTimes = [...prev].sort((a, b) => {
        if (a === "") return 1;
        if (b === "") return -1;
        return a.localeCompare(b);
      });
      return sortedTimes;
    });
 };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const allRes = await axios.get(`${reservationUrl}/shop`);
        const allData = allRes.data;

        const extractedShops = [
          ...new Set(allData.flatMap((item) => item.name || [])),
        ].sort();

        setAllShops(extractedShops);

        if (reservationId) {
          const res = await axios.get(
            `${reservationUrl}/reservation/${reservationId}`,
          );
          setDetail(res.data);
            if (res.data.settime?.length > 0) {
            setAllTimes(res.data.settime);
          } else {
            setAllTimes([""]);
          }
        } else {
          setDetail({
            name: "",
            category: "lifting",
            price: "",
            img: "",
            description: "",
            descImg: "",
            setshop: [],
            settime: [],
            regDate: new Date().toISOString(),
            timespan: "",
          });
        }
      } catch (err) {
        console.error("데이터 로딩 중 에러:", err);
      }
    };
    fetchData();
  }, [reservationUrl]);

  // const onChangeFn = (e) => {
  //   const { name, value } = e.target;
  //   const newValue = name === "price" ? Number(value) : value;
  //   setDetail({ ...detail, [name]: newValue });
  // };
  const onChangeFn = (e) => {
    const { name, value } = e.target;
    if (name !== "price") {
      setDetail({ ...detail, [name]: value });
    }
  };
  const onChangeNumFn = (e) => {
    const { name, value } = e.target;
    if (name !== "price") return;
    if (isNaN(value)) {
      alert("숫자만 입력해주세요");
      return;
    }
    {
      setDetail({ ...detail, [name]: value });
    }
  };
  const onChangImgFn = (e) => {
    const imgFile = e.target.files?.[0];
    if (!imgFile) return;
    setDetail((prev) => ({ ...prev, img: imgFile.name }));
    e.target.value = "";
  };
  const onChangeDescImgFn = (e) => {
    const descImgFile = e.target.files?.[0];
    if (!descImgFile) return;
    setDetail((prev) => ({ ...prev, descImg: descImgFile.name }));
    e.target.value = "";
  };

  const onUpdateFn = async () => {
    try {
      const res = await axios.put(
        `${reservationUrl}/reservation/${reservationId}`,
        detail,
      );
      alert("수정 되었습니다");
      if (onSuccess) {
        onSuccess();
      }
      closeFn();
    } catch (err) {
      alert(err);
    }
  };

  const onDeleteFn = async (e) => {
    if (!window.confirm("정말 삭제 하시겠습니까?")) return;
    try {
      await axios.delete(`${reservationUrl}/reservation/${reservationId}`);
      alert("삭제 되었습니다");
      if (onSuccess) {
        onSuccess();
      }
      closeFn();
    } catch (err) {
      alert(err);
    }
  };

  const onPostFn = async () => {
    try {
    const newDetail = { ...detail, settime: allTimes };      
    await axios.post(`${reservationUrl}/reservation`, newDetail);
      alert("추가 되었습니다.");
      if (onSuccess) {
        onSuccess();
      }
      closeFn();
    } catch (err) {
      alert("데이터 저장 중 오류가 발생했습니다: " + err);
    }
  };

  useEffect(() => {
    if (!detail) return;
    setImgError(false);
  }, [detail?.category, detail?.img]);

  const closeFn = () => {
    setReservationAddModal(false);
  };

  if (!detail) {
    return (
      <div className="adminModal" onClick={closeFn}>
        <div
          className="adminModal-con"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="adminModal-close" onClick={closeFn}>
            X
          </span>
          <div className="loading">
            <h1>...Loading</h1>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="adminModal" onClick={closeFn}>
      <div
        className="adminModal-con"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="adminModal-title">
          {detail.id ? detail.name : "예약 상품 등록"}
        </div>
        <span className="adminModal-close" onClick={closeFn}>
          X
        </span>

        <ul>
          <li className="adminModal-reserv-selector">
            <label htmlFor="category">카테고리</label>
            <select
              name="category"
              id="category"
              value={detail.category}
              onChange={onChangeFn}
            >
              <option value="lifting">울쎄라</option>
              <option value="faceline">인모드</option>
              <option value="regen">쥬베룩</option>
              <option value="immune">글루타치온(백옥주사)</option>
            </select>
          </li>
          <li>
            <label htmlFor="name">상품명</label>
            <input
              name="name"
              id="name"
              value={detail.name}
              onChange={onChangeFn}
            ></input>
          </li>
          <li>
            <label htmlFor="price">가격</label>
            <span>
              <input
                type="text"
                name="price"
                reservationId="price"
                value={detail.price}
                onChange={onChangeNumFn}
                placeholder="금액만 입력하세요(예: 20000)"
              />
            </span>
          </li>
          <li>
            <label>예약 지점 선택</label>
            <div className="adminModal-reserv-checkbox-group">
              {allShops.map((shop) => (
                <label
                  key={shop.name || shop}
                  className="adminModal-reserv-checkbox-item"
                >
                  <input
                    type="checkbox"
                    checked={detail.setshop?.includes(shop)}
                    onChange={() => onShopChange(shop)}
                  />
                  <span>{shop}점</span>
                </label>
              ))}
            </div>
          </li>
          <li>
            <label>예약 시간 선택</label>
            {/* {detail.id ? (
              <div className="adminModal-reserv-checkbox-group">
                {allTimes.map((time) => (
                  <label key={time} className="adminModal-reserv-checkbox-item">
                    <input
                      type="checkbox"
                      checked={detail.settime?.includes(time)}
                      onChange={() => onTimeChange(time)}
                    />
                    <span>{time}</span>
                  </label>
                ))}
              </div>
              ) : (
               <> */}
                 {allTimes.map((time, index) => ( 
                   <div 
                     className="timeinput"
                     key={index}
                     style={{ position: "relative", display: "inline-block" }}
                   >
                     <input
                       type="text"
                       value={time}
                       placeholder="예: 13:00"
                       onChange={(e) => handleReserveTimeChange(index, e.target.value)}
                       onBlur={()=>handleTimeBlur(index)}
                     />
                     <button
                       type="button"
                       onClick={() => removeReserveTime(index)}
                       style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                      }}
                     >
                       x
                     </button>
                   </div>
                 ))}
                 <div className="addtime">
                <button
                  type="button"
                  onClick={addReserveTime}
                  style={{ marginTop: "5px" }}
                >
                  +
                </button>
                </div>
              {/* </>
            )} */}
          </li>
          <li className="adminModal-img">
            <label htmlFor="img">상품이미지</label>
            <div className="adminModal-fileRow">
              <input
                type="text"
                name="img"
                id="img"
                placeholder="특수문자(%#?&=+;)를 제외한 파일명(예: hydro1.jpg) "
                value={detail.img}
                onChange={onChangeFn}
                className="adminModal-fileName"
                readOnly
              />
              <label className="adminModal-fileBtn" htmlFor="imgFile">
                파일 선택
              </label>
              <input
                id="imgFile"
                type="file"
                accept="image/*"
                onChange={onChangImgFn}
                className="adminModal-hidden"
              />
            </div>
            {imgError ? (
              <textarea className="errorBox">
                이미지가 올바르지 않습니다. 카테고리/파일명을 확인해주세요.
              </textarea>
            ) : (
              <img
                src={`/images/${detail.category}/${detail.img}`}
                alt={detail.img}
                onError={() => setImgError(true)}
              />
            )}
          </li>
          <li>
            <label htmlFor="description">상품 설명</label>
            <textarea
              type="text"
              name="description"
              reservationId="description"
              value={detail.description}
              onChange={onChangeFn}
              className="adminModal-textarea"
            />
          </li>
          <li>
            <label htmlFor="descImg">상세정보 이미지</label>
            <div className="adminModal-fileRow">
              <input
                type="text"
                name="descImg"
                id="descImg"
                placeholder="특수문자(%#?&=+;)를 제외한 파일명(예: hydro1_desc.jpg)"
                value={detail.descImg}
                onChange={onChangeDescImgFn}
                readOnly
              />
              <label className="adminModal-fileBtn" htmlFor="descImgFile">
                파일 선택
              </label>
              <input
                id="descImgFile"
                type="file"
                accept="image/*"
                onChange={onChangImgFn}
                className="adminModal-hidden"
              />
            </div>
          </li>

          <li>
            <label htmlFor="timespan">시술시간</label>
            <div className="adminModal-reserv-timespan-suffix">
              <input
                type="text"
                name="timespan"
                reservationId="timespan"
                value={detail.timespan}
                onChange={onChangeFn}
                placeholder="숫자만 입력하세요(예: 2)"
                className="adminModal-reserv-timespan-sffixInput"
              />
              <span className="adminModal-reserv-timespan-suffixText">
                시간 소요예정
              </span>
            </div>
          </li>
        </ul>
        <div className="adminModal-footer">
          <div className="adminModal-footer-con">
            <li>
              {reservationId ? (
                <>
                  <button onClick={onUpdateFn} className="editBtn">
                    상품수정
                  </button>
                  <button onClick={onDeleteFn} className="deleteBtn">
                    상품삭제
                  </button>
                </>
              ) : (
                <button onClick={onPostFn} className="editBtn">
                  상품추가
                </button>
              )}
              <button onClick={closeFn}>닫기</button>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReservationModal;
