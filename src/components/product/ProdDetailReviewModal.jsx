import React, { useState } from 'react'
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import { useEffect } from 'react'
import axios from 'axios'

const ProdDetailReviewModal = ({setReviewAddModal, user, productId}) => {

  const closeFn=()=>{
    setReviewAddModal(false)
  }
  
  // const state=useSelector(state=>state)
  // console.log("전체스토어 구조", state)
  const url=API_JSON_SERVER_URL
  const [product, setProduct]=useState([])
  useEffect(()=>{
    const productFn=async () =>{
      try{
        const res=await axios.get(`${url}/product/${productId}`);
        console.log(res.data);
        setProduct(res.data);
      }catch(err){
        console.log('상품데이터 로딩 실패');
      }
    }
    productFn();
  },[productId])

  const [score, setScore]=useState(5)
  const scoreChangeFn=(e)=>{
    setScore(Number(e.target.value));
  }

  const [text, setText]=useState("")
  const textChangeFn=(e)=>{
    setText(e.target.value);
  }
  
  //후기 사진 파일 업로드 기능 구현 X
  // const [file, setFile]=useState("")
  // const [preview, setPreview]=useState("")
  // const fileChangeFn=(e)=>{
  //   const selectedFile=e.target.files[0];
  //   if(selectedFile){
  //     setFile(selectedFile);
  //     setPreview(URL.createObjectURL(selectedFile));
  //   }
  // }

  
  //후기 등록시에는 userEmail도 같이, product는 id로 저장
  const submitFn= async () =>{
    if(text.length===0){
      alert('내용을 작성해 주세요');
      return;
    }
    try{
      const res=await axios.post(`${url}/productReview`,{
        category: product.category,
        productId: productId,
        userEmail: user.userEmail,
        userName: user.userName,
        date: getKoreaDate(),
        score: score,
        viewrate: 0,
        description: text
        // img: file ? file.name : ""
      })
      alert('후기를 등록했습니다');
      closeFn();
    }catch(err){
      console.log('후기 등록 실패');
    }
  }
  
  //작성시간 기록하기
  const getKoreaDate = () => {
    const today = new Date();
    return (
      new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })
    )
  }

  return (
    <div className="review-modal">
      <div className="review-modal-con">
        <h1>후기 작성하기</h1>
        <span className='close' onClick={closeFn}>X</span>
        <div className="reviewer">
          <p>작성자: {user.userName}</p>
          <p>상품명: {product.name}</p>
        </div>
        <ul>
          <li className='score-selector'>
            <label htmlFor="score">평점:</label>
            {[1,2,3,4,5].map((num)=>(
            <span key={num}>
              <input type="radio" name="score" id="score"
              value={num}
              checked={score === num}
              onChange={scoreChangeFn} />
              {num}점
            </span>
            ))}
          </li>
          <li>
            <label htmlFor="textarea">상세후기:</label>
            <textarea name="review-text" id="review-text"
            value={text}
            onChange={textChangeFn} 
            placeholder='제품에 대한 솔직한 후기를 남겨주세요!'
            maxLength="500" />
            <p>{text.length}/500자</p>
          </li>
          {/* 파일업로드 기능은 구현 X */}
          {/* <li>
            <label htmlFor="review-img">후기사진:</label>
            <input type="file" name="review-img" id="review-img"
            accept="image/*"
            onChange={fileChangeFn} />
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="미리보기" style={{width: '100px', height: '100px'}}/>
                <button onClick={() => {setFile(null); setPreview("");}}>삭제</button>
              </div>
            )}
          </li> */}
        </ul>
        <button onClick={submitFn}>후기등록</button>
      </div>
    </div>
  )
}

export default ProdDetailReviewModal