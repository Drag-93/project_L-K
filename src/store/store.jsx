import { configureStore } from "@reduxjs/toolkit";
import React from "react";
import inputSlice from "./slice/inputSlice";
import countSlice from "./slice/countSlice";
import basketSlice from "./slice/basketSlice";


const store = configureStore({
  reducer: {
    counter: countSlice,  
    input : inputSlice,
    basket : basketSlice
    
    // 최소 하나의 reducer 필요
  },
});

export default store;
