import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import axios from 'axios'

const CommunityFaqWrite = () => {

  const navigate=useNavigate()
  const faqUrl=API_JSON_SERVER_URL
  const [detail, setDetail] = useState(
    {
      no : "",
      titlecategory : "",
      category : "",
      title : "",
      description : ""
    }
  )

const onChangeFn = (e) => {
  const { name, value } = e.target;

  if (name === "titlecategory") {
    setDetail({
      ...detail,
      titlecategory: value,
      category: "",   // 초기화
    });
  } else {
    setDetail({ ...detail, [name]: value });
  }
};

  const onPostFn = async () => {
    try {
      const res = await axios.post(
        `${faqUrl}/faq`,
        detail,
      );
      alert("등록 되었습니다");
      navigate(-1)
    } catch (err) {
      alert(err);
    }
  };
  return (
    <div className="faqwrite">
      <div className="write-con">
        <ul>
          <li>
            <label htmlFor="titlecategory">카테고리</label>
            <select 
            name="titlecategory" 
            id="titlecategory"
            value={detail.titlecategory}
            onChange={onChangeFn}>
              <option value="">---선택---</option>
              <option value="product">상품</option>
              <option value="reserve">예약</option>
            </select>
          </li>
          <li>
            <label htmlFor="category">세부카테고리</label>
            {detail.titlecategory === "product"?(
            <select 
            name="category" 
            id="category"
            value={detail.category}
            onChange={onChangeFn}
            >
              <option value="">---선택---</option>
              <option value="hydro">보습</option>
              <option value="trouble">트러블케어</option>
              <option value="white">미백</option>
              <option value="antiage">안티에이징</option>
              <option value="uv">UV</option>
            </select>)
            :detail.titlecategory === "reserve"?(
            <select
            name='category'
            id='category'
            value={detail.category}
            onChange={onChangeFn}
            >
              <option value="">---선택---</option>
              <option value="lifting">울쎄라</option>
              <option value="faceline">인모드</option>
              <option value="regen">쥬베룩</option>
              <option value="immune">글루타치온(백옥주사)</option>
            </select>
            ) :null}
          </li>
          <li>
        <label htmlFor="faqtitle">질문</label>
        <input 
        type="text"
        name='title'
        id='title'
        value={detail.title}
        onChange={onChangeFn}
        />
          </li>
          <li>
            <label htmlFor="faqdescription">답변</label>
            <textarea
            name="description" 
            id="description" 
            value={detail.description}
            onChange={onChangeFn}
            />
          </li>
        </ul>
      </div>
      <button onClick={onPostFn}>등록</button>
      <button onClick={()=>{navigate(-1)}}>취소</button>
    </div>
  )
}

export default CommunityFaqWrite