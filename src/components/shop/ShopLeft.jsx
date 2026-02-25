import React, { useEffect, useState } from 'react'
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'


const ShopLeft = () => {
  const [shop, setShop]=useState([])
  const url=API_JSON_SERVER_URL
  const navigate=useNavigate()

  useEffect(()=>{
    const setShopFn = async(e)=>{
      try{
        const res = await axios.get(`${url}/shop`)
        // console.log(res)
        setShop(res.data)
      }catch(err){
        alert(err)
      }
    }
    setShopFn()
  },[])

  return (
  <>
    <ul>
      {shop.map(el=>{
        return(
          <li key={el.id}>
            <NavLink to={`/shop/${el.id}`}>{el.name}</NavLink>
          </li>
        )
      })}
    </ul>
  </>
  )
}

export default ShopLeft