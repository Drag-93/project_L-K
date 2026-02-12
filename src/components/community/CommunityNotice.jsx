import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_JSON_SERVER_URL } from "../../api/commonApi";

const CommunityNotice = () => {
  const [noticeList, setNoticeList]=useState([])
  const url=API_JSON_SERVER_URL

  //검색변수
  const [searchText, setSearchText] = useState("");

  //페이징변수
  const pageSize = 8;
  const [page, setPage] = useState(1);

  //정렬기능변수
  const [sortType, setSortType] = useState("dateN"); 


  //검색, 정렬 기능
  const filtered = useMemo(() => {
      const q = searchText.trim().toLowerCase();

      let searchList = [...noticeList];

      //검색
      if (q) {
        searchList = searchList.filter((m) => {
          const searchTarget = [m.title, m.date].filter(Boolean).join(" ").toLowerCase();
          return searchTarget.includes(q);
        });
      }

      //정렬
      return searchList.sort((a, b) => {
        const timeA = a.date ? new Date(a.date).getTime() : 0;
        const timeB = b.date ? new Date(b.date).getTime() : 0;
        const viewA = Number(a.viewrate || 0);
        const viewB = Number(b.viewrate || 0);
  
        switch (sortType) {
          case "dateN": return timeB - timeA; // 최신순 (날짜 큰 순)
          case "dateP": return timeA - timeB; // 오래된순
          case "viewN": return viewB - viewA; // 조회수 높은순
          case "viewP": return viewA - viewB; // 조회수 낮은순
          default: return 0;
        }
      });

    }, [noticeList, searchText, sortType]);

  //페이징

  const totalPages = useMemo(() => {
      return Math.max(1, Math.ceil(filtered.length / pageSize));
    }, [filtered.length, pageSize]);

    const pagedList = useMemo(() => {
      const firstPage = (page - 1) * pageSize;
      return filtered.slice(firstPage, firstPage + pageSize);
    }, [filtered, page, pageSize]);

    useEffect(() => {
      if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    useEffect(() => {
      setPage(1);
    }, [searchText]);




  const navigate = useNavigate();

  useEffect(() => {
    const noticeListFn = async (e) => {
      try {
        const res = await axios.get(`${url}/notice`);
        console.log(res);
        setNoticeList(res.data);
      } catch (err) {
        alert(err);
      }
    };
    noticeListFn();
  },[url])

  const handleTitleClick = async(notice) => {  
  try{
    const updatedViewrate = Number(notice.viewrate || 0)+1

    await axios.patch(`${url}/notice/${notice.id}`,{
      viewrate: updatedViewrate
    })
    navigate(`${notice.id}`)
}catch(err){
    navigate(`${notice.id}`)
}
  }

  return (
    <>
    <div className="notice">
      <div className="notice-con">
        <h1>공지사항</h1>
        <div className="toolbar">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="검색어 입력"
          />
        </div>
        <div className="roleSelector">
          <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="dateN">최신순</option>
            <option value="dateP">오래된순</option>
            <option value="viewN">조회수순</option>
            <option value="viewP">적은조회수순</option>
          </select>
        </div>
        <table>
        <thead>
          <tr>
            <td>글번호</td>
            <td>제목</td>
            <td>작성일</td>
            <td>조회수</td>
          </tr>
        </thead>
        <tbody>
           {pagedList && pagedList.map(el => {
            return(
          <tr key={el.id}>
            <td>{el.no}</td>
            <td style={{ cursor: 'pointer' }} onClick={()=>handleTitleClick(el)}>
                  {el.title}</td>
            <td>{el.date}</td>
            <td>{el.viewrate||0}</td>
          </tr>
            )
           })}
        </tbody>
        </table>
        <div className="QnAFooter">
          <div className="QnAFooter-con">
            <div className="QnAPaging">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                이전
              </button>
              <span>
                {page}/{totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                다음
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
     </>
  )
}


export default CommunityNotice
