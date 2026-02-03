import { createSlice } from '@reduxjs/toolkit'
import React from 'react'

const initialState={
  userEmail:'',
  userPw:'',
  user:null,
  isState:"false"
}

const inputSlice = createSlice({
  name : 'input',
  initialState:initialState,
  reducers:{
    input:(state,action)=>{
      console.log(action.payload)
      state.userEmail=action.payload
    },
    login:(state, action)=>{
      console.log(action.payload)
      state.user=action.payload
      state.isState=true
    },
    logout:(state, action)=>{
      state.user=null
      state.isState=false
    }
  }
})

export const{input, login, logout}=inputSlice.actions
export default inputSlice