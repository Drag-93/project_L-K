import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import axios from 'axios'

const CommunityFaqWrite = () => {

  const navigate=useNavigate()
  const faqUrl=API_JSON_SERVER_URL
  const {id} = useParams()
  const [detail, setDetail] = useState(
    {
      no : "",
      date:Date(),
      titlecategory : "",
      category : "",
      title : "",
      description : ""
    }
  )


  const getKoreaDate = () => {
    const today = new Date();
    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  };
const onChangeFn = (e) => {
  const { name, value } = e.target;

    if (name === "titlecategory") {
        let defaultCategory = "";
        if (value === "titlecategoryall") defaultCategory = "categoryall";
        else if (value === "product") defaultCategory = "productall";
        else if (value === "reserve") defaultCategory = "reserveall";

        setDetail({
          ...detail,
          titlecategory: value,
          category: defaultCategory,
        });
      } else {
        setDetail({ ...detail, [name]: value });
      }
    };


const onPostFn = async () => {
  try {
    const res = await axios.get(`${faqUrl}/faq`);

  const lastNo =
  res.data.length > 0
    ? Math.max(...res.data.map((item) => Number(item.no)))
    : 0;

    const newFaq = {
      ...detail,
      no: lastNo + 1,
      date: getKoreaDate(),
    };

    await axios.post(`${faqUrl}/faq`, newFaq);

    alert("등록 되었습니다");
    navigate(-1);

  } catch (err) {
    alert("등록 실패: " + err);
  }
};
  
  const onUpdateFn = async () => {
    try {
      const res = await axios.put(
        `${faqUrl}/faq/${id}`, detail,
      );
      alert("수정 되었습니다");
      navigate(-1)
    } catch (err) {
      alert(err);
    }
  };

useEffect(() => {
  if (!id) return;

  const fetchData = async () => {
    try {
      const res = await axios.get(`${faqUrl}/faq/${id}`);
      setDetail(res.data);
    } catch (err) {
      console.error("데이터 로딩 중 에러:", err);
    }
  };

  fetchData();
}, [id, faqUrl]);



  return (
    <div className="faqwrite inner2">
      <div className="write-con">
        <div className="title">
        {id ? (
          <h1>자주 묻는 질문 수정</h1>):
          (<h2>자주 묻는 질문 등록</h2>)
        }
        </div>       
        <ul>
          <li>
            <label htmlFor="date">작성일</label>
            <span>{getKoreaDate()}</span>
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
      <div className='adminbutton'>
        {id  
           ? (<button onClick={onUpdateFn}>수정</button>)
           : (<button onClick={onPostFn}>등록</button>)
        }
         <button onClick={()=>{navigate(-1)}}>취소</button>
      </div>
     </div>
    </div>
  )
}

export default CommunityFaqWrite