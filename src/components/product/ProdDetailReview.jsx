import React, { useEffect, useState } from 'react'
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProdDetailReviewModal from './ProdDetailReviewModal'
import axios from 'axios'


const ProdDetailReview = () => {

  const {id}=useParams();
  const [userReview, setUserReview]=useState([])
  const url=API_JSON_SERVER_URL
  
  // const state=useSelector(state=>state)
  // console.log("리덕스 전체 스토어:", state);
  const isState=useSelector(state=>state.input.isState)
  const user=useSelector(state=>state.input.user)

  //사용자후기 불러오기
  const getReviewFn=async () =>{
    try{
      const res=await axios.get(`${url}/productReview?productId=${id}`);
      console.log(res.data);
      setUserReview(Array.isArray(res.data) ? res.data : [res.data]); //review가 하나 밖에 없을 때 map의 오류 방지
    }catch(err){
      console.log('사용자후기 로딩 실패');
    }
  }
  useEffect(()=>{ getReviewFn() },[id, url])  
  
  //후기 한줄만 보이기, 클릭시 전체내용 보이기
  const toggleReview=(reviewId)=>{
      setUserReview((prev)=>
        prev.map((el)=>
         el.id === reviewId ? {...el, isOpen : !el.isOpen} : el)
      )
  }
  //조회수(viewrate) 증가
  const viewrateFn= async (reviewId, currentViewrate) => {
    try{
      await axios.patch(`${url}/productReview/${reviewId}`, {
        viewrate: (currentViewrate ?? 0) + 1
      })    
      setUserReview((prev)=>
        prev.map((review)=> review.id === reviewId ? ({
          ...review, viewrate: (review.viewrate ?? 0) + 1
        }) : review)  
      )  
    }catch(err){
      console.log('조회수 업데이트 실패')
    }   
  }    

  const [reviewAddModal, setReviewAddModal]=useState(false)

  //전체 리뷰 평균점수 계산
  const averageScore = userReview.length > 0 ?
    (userReview.reduce((acc, cur) => acc + (Number(cur.score) || 0), 0)/userReview.length).toFixed(1)
    : 0.0;

  //내가 작성한 후기 수정하기
  const [editId, setEditId]=useState(null);
  const [score, setScore]=useState(userReview.score);
  const [text, setText]=useState(userReview.description);
  const updateFn= (el) => {
    setEditId(el.id);
    setScore(el.score);
    setText(el.description);
  };
  const handleUpdateFn= async () =>{
    if(text.length===0){
      alert('내용을 작성해 주세요');
      return;
    }
    try{
      const res=await axios.patch(`${url}/productReview/${editId}`,{
        score: score,
        description: text
      })
      alert('후기를 수정했습니다');
      setEditId(null);
      getReviewFn();  //수정 후 최신 후기 불러오기
    }catch(err){
      console.log('후기 수정 실패');
    }
  };

  //내가 작성한 후기 삭제하기
  const deleteFn= async() =>{
    if(!window.confirm('정말 삭제하시겠습니까?')){
      return;
    }
    try{
      const res=await axios.delete(`${url}/productReview/${el.id}`)
      alert('후기가 삭제되었습니다');
      getReviewFn();
    }catch(err){
      console.log('후기 삭제 실패')
    }
  };


return (
  <>
    <div className="detail-review">
      <div className="detail-review-con">
        {/* 리뷰 현황 요약 보이기 */}
        <div className="current-status">
          <div className='totalscore'>
            <p className='avrscore'>평균: {averageScore}점</p>
            <p className='totalno'>전체후기: {userReview.length}건</p>
          </div>
          {/* <div className='majorreviews'>
            <li>베스트 후기1</li>
            <li>베스트 후기2</li>                 
          </div>           */}
        </div>
        {/* 리뷰 내용 */}
        <div className="reviews">
          <h1>사용자 후기</h1>
          {!isState &&                     //로그인 된 경우에만 작성버튼 활성화
            <button 
             onClick={()=>{
               setReviewAddModal(true)}}
            >
              후기 작성하기 
              </button>}
          {reviewAddModal && (
            <ProdDetailReviewModal
              setReviewAddModal={setReviewAddModal}
              productId={id}
              user={user}
              onSuccess={()=>{
                alert('후기가 등록되었습니다');
                getReviewFn();
              }}
              />
          )}
          <ul>
            {userReview &&
             userReview.filter((el)=> el.userEmail === user?.userEmail).map((el)=>(
                <li key={el.id}>
                  <strong>[내가 작성한 후기]</strong>
                      {editId===el.id ? (
                        <>
                        <li className='score-selector'>
                        <label htmlFor="score">평점:</label>
                        {[1,2,3,4,5].map((num)=>(
                        <span key={num}>
                          <input type="radio" name="score" id="score"
                          value={num}
                          checked={score === num}
                          onChange={(e) => setScore(Number(e.target.value))} />
                          {num}점
                        </span>
                        ))}
                        </li>
                        <li>
                        <label htmlFor="textarea">상세후기:</label>
                        <textarea name="review-text" id="review-text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          maxLength="500" />
                        <p>{text.length}/500자</p>
                        </li>
                        <button onClick={()=>handleUpdateFn()}>수정 완료</button>
                        <button onClick={()=>setEditId(null)}>수정 취소</button>
                        </>
                      ) : (
                        <>
                        <p>작성일자: {new Date(el.date).toLocaleDateString()}</p>
                        <p>점수: {el.score}점</p>
                        <p>조회수: {el.viewrate}</p>
                        <p>내용: {el.description}</p>
                        <div className="edit-buttons">
                        <button onClick={()=> updateFn(el)}>수정하기</button>
                        <button onClick={()=> deleteFn(el.id)}>삭제하기</button>
                        </div>
                        </>
                      )
                      }
                </li>
              )
            )}
          </ul>
          <ul>
            {userReview && userReview.map((el,idx)=>{
              return (
                <li key={el.id} onClick={()=>{
                  if(!el.isOpen){                     //접힌 상태에서 클릭할 때만 조회수 증가(열었다 닫을 때 조회수 증가 방지)
                  viewrateFn(el.id, el.viewrate)}
                  toggleReview(el.id);
                  }} style={{cursor: 'pointer'}}>
                  <p>작성자: {el.userName}</p>
                  <p>작성일자: {new Date(el.date).toLocaleDateString()}</p>
                  <p>점수: {el.score}점</p>
                  <p>조회수: {el.viewrate}</p>
                  <p style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: el.isOpen ? 'normal' : 'nowrap'
                  }}
                  >내용: {el.description}</p>
                  <small style={{ color: 'gray' }}>
                    {el.isOpen ? '[접기]' : '...더보기'}
                  </small>
                </li>
              )
            })}
            {userReview.length === 0 && <p>등록된 후기가 없습니다.</p>}
          </ul>
        </div>
      </div>
    </div>
  </>
)
}

export default ProdDetailReview