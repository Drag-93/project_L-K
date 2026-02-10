import { createSlice } from '@reduxjs/toolkit'
import React from 'react'

const initStateData = {
  isState:false,
  isUser:null
}

const saveAuth = localStorage.getItem("auth")
const initialState = saveAuth ? JSON.parse(saveAuth) : initStateData

const authSlice = createSlice({
  name : "auth",
  initialState,
  reducers: {
    loginF : (state, action) => {
      state.isState = true
      state.isUser = action.payload
      localStorage.setItem("auth",JSON.stringify(state))
    },
    logoutF: (state) => {
      state.isState = false
      state.isUser = null
      localStorage.removeItem("auth")
    }
  }
})


export const{loginF, logoutF}=authSlice.actions;
export default authSlice.reducer