import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  basketItems: JSON.parse(localStorage.getItem('basket')) || [],
};

const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    // 장바구니에 추가
    addBasket: (state, action) => {
      // 1. 장바구니에서 동일한 조건의 아이템 인덱스 찾기
      // (ID가 같고, 날짜와 시간이 모두 일치하는 경우)
      const index = state.basketItems.findIndex(
        item => item.id === action.payload.id && 
                item.date === action.payload.date && 
                item.time === action.payload.time
      );
    
      if (index !== -1) {
        // 2. 이미 존재한다면 수량(count)만 증가
        // payload에 count가 있으면 그만큼 더하고, 없으면 1을 더함
        const addCount = action.payload.count ? Number(action.payload.count) : 1;
        state.basketItems[index].count = Number(state.basketItems[index].count || 0) + addCount;
        
        alert("장바구니에 담긴 상품의 수량이 증가되었습니다.");
      } else {
        // 3. 존재하지 않는다면 새로 추가
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
    },
    updateCount: (state, action) => {
      const { id, count } = action.payload;
      // 1. 수정할 아이템 찾기
      const item = state.basketItems.find(item => item.id === id);
      
      if (item) {
        // 2. 수량 업데이트
        item.count = count;
        // 3. (선택사항) 해당 아이템의 총 합계 금액도 업데이트
        item.totalPrice = Number(item.price) * count;
      }
    }
  }
});

export const { addBasket, removeBasket, clearBasket, updateCount } = basketSlice.actions;
export default basketSlice.reducer;