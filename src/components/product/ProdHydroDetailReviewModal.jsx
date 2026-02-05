import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const ProdHydroDetailReviewModal = ({setReviewAddModal}) => {

  const closeFn=()=>{
    setReviewAddModal(false)
  }
  
  const state=useSelector(state=>state)
  console.log("전체스토어 구조", state)
  const reviewer=useSelector(state=>state.input.user.userName)

  const [score, setScore]=useState(5)
  const scoreChangeFn=(e)=>{
    setScore(Number(e.target.value));
  }

  const [text, setText]=useState("")
  const textChangeFn=(e)=>{
    setText(e.target.value);
  }

  const [file, setFile]=useState(null)
  const [preview, setPreview]=useState("")
  const fileChangeFn=(e)=>{
    const selectedFile=e.target.files[0];
    if(selectedFile){
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }

  return (
    <div className="review-modal">
      <div className="review-modal-con">
        <h1>후기 작성하기</h1>
        <span className='close' onClick={closeFn}>X</span>
        <div className="reviewer">
          작성자: {reviewer}
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
          <li>
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
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ProdHydroDetailReviewModal