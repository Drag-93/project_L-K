import React, { useEffect, useState } from 'react'
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import axios from 'axios'

const ProdDetailReviewModal = ({setReviewAddModal, user, productId, onSuccess}) => {

  const closeFn=()=>{
    setReviewAddModal(false)
  }
  
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
  const [text, setText]=useState("")

  const submitFn= async () =>{
    if(text.length===0){
      alert('내용을 작성해 주세요');
      return;
    }
    try{
      const res=await axios.post(`${url}/productReview`,{
        category: product.category,
        productId: productId,
        productName: product.name,
        userEmail: user.userEmail,
        userName: user.userName,
        date: new Date().toISOString(),
        score: score,
        like: 0,
        likedUsers: [],
        description: text
      })
      onSuccess();
      closeFn();
    }catch(err){
      console.log('후기 등록 실패');
    }
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
            <label htmlFor="score">점수:</label>
            <div className="star-rating">
              {[1,2,3,4,5].map((num)=>(
                <label key={num} className='star-label'>
                  <input type="radio" name="score" id="score"
                                    value={num}
                                    checked={score === num}
                         onChange={(e) => setScore(Number(e.target.value))}
                  />
                  <img src={num <= score
                  ? "/images/star_filled.svg"
                  : "/images/star_empty.svg"}
                  alt="star"
                  className="star-img"/>
                </label>
              ))}
            </div>
          </li>
          <li>
            <label htmlFor="textarea">상세후기:</label>
            <textarea name="review-text" id="review-text"
            value={text}
            onChange={(e) => setText(e.target.value)} 
            placeholder='제품에 대한 솔직한 후기를 남겨주세요!'
            maxLength="500" />
            <p>{text.length}/500자</p>
          </li>
        </ul>
        <button onClick={submitFn}>후기등록</button>
      </div>
    </div>
  )
}

export default ProdDetailReviewModal