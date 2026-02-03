import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import inputSlice from "./slice/inputSlice";
import countSlice from "./slice/countSlice";


const store = configureStore({
  reducer: {
    counter: countSlice.reducer,  
    input : inputSlice.reducer
    
    // 최소 하나의 reducer 필요
  },
});

export default store;
