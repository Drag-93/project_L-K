import { configureStore } from "@reduxjs/toolkit";
import React from "react";

const dummyReducer = (state = {}, action) => state;

const store = configureStore({
  reducer: {
    dummy: dummyReducer,  // 최소 하나의 reducer 필요
  },
});

export default store;
