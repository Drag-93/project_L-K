import { createSlice } from '@reduxjs/toolkit'
import React from 'react'

const initialState={
  userEmail:'',
  userPw:'',
  user:null,
  isState:"true"
}

const inputSlice = createSlice({
  name : 'input',
  initialState:initialState,
  reducers:{
    input:(state,action)=>{
      console.log(action.payload)
      state.userEmail=action.payload
    },
    loginF:(state, action)=>{
      console.log(action.payload)
      state.user=action.payload
      state.isState=false
    },
    logoutF:(state, action)=>{
      state.user=null
      state.isState=true
    }
  }
})

export const{input, loginF, logoutF}=inputSlice.actions;
export default inputSlice.reducer;