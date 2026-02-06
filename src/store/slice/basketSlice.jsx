import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  basketItems: [], // 장바구니에 담긴 예약 목록
};

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    // 장바구니에 추가
    addBasket: (state, action) => {
      // 중복 체크 (동일한 날짜와 시간의 예약이 있는지 확인)
      const isDuplicate = state.basketItems.some(
        item => item.id === action.payload.id && 
                item.date === action.payload.date && 
                item.time === action.payload.time
      );

      if (isDuplicate) {
        alert("이미 동일한 예약이 장바구니에 있습니다.");
      } else {
        state.basketItems.push(action.payload);
        alert("장바구니에 담겼습니다.");
      }
    },
    // 장바구니에서 특정 아이템 삭제
    removeBasket: (state, action) => {
      // payload로 유니크한 값(index 또는 조합 키)을 받아 필터링
      state.basketItems = state.basketItems.filter((item) => item.id !== action.payload);
    },
    // 장바구니 비우기 (결제 완료 후 등)
    clearBasket: (state) => {
      state.basketItems = [];
    }
  }
});

export const { addBasket, removeBasket, clearBasket } = basketSlice.actions;
export default basketSlice.reducer;