import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import axios from 'axios'

const loginData={
  userEmail:"",
  userPw:"",
}

const AuthLogin = () => {
  const [login,setLogin] = useState(loginData)
  const navigate=useNavigate()

  const onChangeLoginFn = (e) => {
  const {name, value} = e.target
  setLogin({...login,[name]:value})
  }
  const URL=API_JSON_SERVER_URL

  const onLoginFn = async()=>{
    try {
      if (!login.userEmail|| !login.userPw ) {
        alert("이메일, 비밀번호는 필수입니다!")
        return;
      }
      const res = await axios.get(`${URL}/Members`);
      const loginUser = res.data.find(el => 
        el.userEmail === login.userEmail && el.userPw === login.userPw)
      if (!loginUser) {
        alert("이메일, 비밀번호가 틀렸습니다.");
        return;
      }
      alert("로그인 성공");
      navigate("/")
    } catch (err) {
      console.error(err);
      alert("로그인 실패! " + err);
    }
  };



  return(
  <div className="auth-login">
    <div className="auth-login-con">
      <ul>
          <li>이메일 : <input type="email" name='userEmail' placeholder='이메일을 입력해주세요' value={login.userEmail} onChange={onChangeLoginFn}/></li>
          <li>비밀번호 : <input type="pw" name='userPw' placeholder='비밀번호를 입력해주세요' value={login.userPw} onChange={onChangeLoginFn}/></li>
      <li>
        <button type="button" onClick={() => { navigate('/auth/join') }}>회원가입</button>
        <button type="button" onClick={onLoginFn}>로그인</button>
        <button type="button" onClick={() => { navigate('/') }}>메인화면</button>
      </li>
      </ul>
    </div>
  </div>
  )
}
export default AuthLogin