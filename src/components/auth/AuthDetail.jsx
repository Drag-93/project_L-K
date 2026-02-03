import React from 'react'

const AuthDetail = () => {
  return (
   <div className="auth-detail">
      <div className="auth-detail-con">
        <h1>공지사항</h1>
        <table>
        <thead>
          <tr>
            <td>이름</td>
            <td>작성일</td>
            <td>조회수</td>
          </tr>
        </thead>
        <tbody>
           {memberList.map(el => {
            return(
          <tr key={el.id}>
            <td style={{ cursor: 'pointer' }} onClick={() => navigate(`${el.id}`)}>
                  {el.title}</td>
            <td>{el.date}</td>
          </tr>
            )
           })}
        </tbody>
        </table>
      </div>
    </div>
  )}
export default AuthDetail