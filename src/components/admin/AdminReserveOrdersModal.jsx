import React, { useEffect, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";

const categoryMap = {
  lifting: "리프팅",
  faceline: "페이스라인",
  regen: "피부재생",
  immune: "면역력"
};

const AdminReserveOrdersModal = ({item, onClose, onRefresh}) => {

  if (!item) return null;

  const { customer, name, price, shop, date, time, reserveUserDate, category, state, orderId} = item;
  
  const url = API_JSON_SERVER_URL;

  const korCategory = categoryMap[category] || category;

  const reserveOkFn = async()=>{

    try {
      // 1. 해당 주문 전체 데이터를 가져옴
      const response = await axios.get(`${url}/reserveOrders/${orderId}`);
      const originalOrder = response.data;

      // 2. items 배열 안에서 현재 모달의 아이템 id와 같은 것만 state를 "예약완료"로 변경
      const updatedItems = originalOrder.items.map((innerItem) => {
        if (String(innerItem.id) === String(item.id)) {
          return { ...innerItem, state: "예약완료" };
        }
        return innerItem;
      });

      // 3. 변경된 items 배열을 서버에 PATCH 요청
      await axios.patch(`${url}/reserveOrders/${orderId}`, {
        items: updatedItems
      });

      alert("예약이 확정되었습니다.");
      
      if (onRefresh) onRefresh(); // 부모 리스트 새로고침 (상태 반영)
      onClose(); // 모달 닫기
    } catch (err) {
      console.error("예약 확정 오류:", err);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  }
  
  const reserveCancelFn = async () => {

  if (!window.confirm("정말로 이 예약을 취소하시겠습니까?")) return;
  
  try {
    // 해당 주문의 전체 데이터를 먼저 조회
    const response = await axios.get(`${url}/reserveOrders/${orderId}`);
    const originalOrder = response.data;

    // 현재 모달에 띄워진 아이템(item.id)만 제외한 나머지 필터링
    const remainingItems = originalOrder.items.filter(
      (innerItem) => String(innerItem.id) !== String(item.id)
    );

    if (remainingItems.length > 0) {
      // 남은 아이템이 있다면 -> PATCH로 업데이트 (부분 취소)
      // 총액(totalAmount)도 갱신(혹시몰라서...)
      const newTotalAmount = remainingItems.reduce((sum, i) => sum + i.price, 0);
      
      await axios.patch(`${url}/reserveOrders/${orderId}`, {
        items: remainingItems,
        totalAmount: newTotalAmount
      });
      alert("해당 시술 예약이 취소되었습니다.");
    } else {
      // 남은 아이템이 없다면 -> DELETE로 주문 전체 삭제
      await axios.delete(`${url}/reserveOrders/${orderId}`);
    }

    if (onRefresh) onRefresh(); // 부모 리스트 새로고침
    onClose(); // 모달 닫기

  } catch (err) {
    alert("예약 취소 실패" + err);
}
  };

 return(
    <div className="reservemodal" onClick={onClose}>
      <div className="reservemodal-con" onClick={(e) => e.stopPropagation()}>
      <header className="modal-header">
          <h2>예약 상세 정보</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </header>

        <div className="modal-body">
          {/* 1. 고객 섹션 */}
          <div className="info-group info-group2">
            <b className="reg-state">{state}</b>
          <p className="reg-date">등록일: {reserveUserDate}</p>
          </div>
          <div className="info-group">
            <h3>고객 정보</h3>
            <ul>
              <li className="info-row">
                <span>아이디(이메일):</span> <strong>{customer?.userEmail}</strong>
              </li>
              <li className="info-row">
                <span>성함:</span> <strong>{customer?.userName}</strong>
              </li>
              <li className="info-row">
                <span>연락처:</span> <strong>{customer?.phonenum}</strong>
              </li>
            </ul>
          </div>

          {/* 2. 시술 섹션 */}
          <div className="info-group">
            <h3>시술 및 일정</h3>
            <ul>
            <li className="info-row">
                <span>카테고리:</span> <strong>{korCategory}</strong>
              </li>
              <li className="info-row">
                <span>시술명:</span> <strong>{name}</strong>
              </li>
              <li className="info-row">
                <span>지점:</span> <strong>{shop}</strong>
              </li>
              <li className="info-row">
                <span>예약일시:</span> <strong>{date} / {time}</strong>
              </li>
              <li className="info-row">
                <span>결제금액:</span> <strong>{price?.toLocaleString()}원</strong>
              </li>
            </ul>
          </div>

          {/* 3. 특이사항 (중요) */}
          <div className="info-group request-box">
            <h3>고객 요청사항</h3>
            <p>{customer?.request || "요청사항이 없습니다."}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={reserveCancelFn}>예약취소</button>
          {item.state === '예약완료' ? (<></>) : (<><button onClick={reserveOkFn}>예약확정</button> </>)}
          <button className="confirm-btn" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  )
};

export default AdminReserveOrdersModal;
