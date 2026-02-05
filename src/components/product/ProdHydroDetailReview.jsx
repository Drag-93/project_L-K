import React, { useEffect, useState } from 'react'
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProdHydroDetailReviewModal from './ProdHydroDetailReviewModal'

const initUserReview={
  id:"",
  category:"",
  product:"",
  user:"",
  date:"",
  score:0,
  viewrate:0,
  description:"",
  img:""
}

const ProdHydroDetailReview = () => {

  const {id}=useParams();
  const [userReview, setUserReview]=useState(initUserReview)
  const url=API_JSON_SERVER_URL

  //사용자후기 불러오기
  useEffect(()=>{
    const reviewFn=async () =>{
      try{
        const res=await fetch(`${url}/review/${id}`);
        const resData=await res.json();
        console.log(resData);
        setUserReview(resData);
      }catch(err){
        console.log('사용자후기 로딩 실패');
      }
    }
    reviewFn();
  },[])


  const state=useSelector(state=>state)
  console.log("리덕스 전체 스토어:", state);
  const isState=useSelector(state=>state.input.isState)
  const userId=useSelector(state=>state.input.userName)

  const [reviewAddModal, setReviewAddModal]=useState(false)

return (
  <>
    <div className="detail-review">
      <div className="detail-review-con">
        {/* 리뷰 현황 요약 보이기 */}
        <div className="current-status">
          <div className='totalscore'>
            <li className='avrscore'>0.0점</li>    {/* 전체 리뷰 점수 평균(계산 필요) */}
            <li className='totalno'>00명</li>      {/* 전체 리뷰 작성 갯수(계산 필요) */}
          </div>
          <div className='majorreviews'>
            <li>베스트 후기1</li>                  {/* viewrate 1, 2위 후기 선정 필요 */}
            <li>베스트 후기2</li>                 
          </div>          
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
            <ProdHydroDetailReviewModal
              setReviewAddModal={setReviewAddModal}
              reviewId={userId}
              onSuccess={()=>{alert('후기가 등록되었습니다')}} />
          )}
          <ul>
            <li>작성자: {userReview.user}</li>
            <li>작성일자: {userReview.date}</li>
            <li>점수: {userReview.score}점</li>
            <li>내용: {userReview.description}</li>
            <img src={`/images/${userReview.img}`} alt={userReview.img} />
          </ul>
        </div>
      </div>
    </div>
    </>
  )
}

export default ProdHydroDetailReview