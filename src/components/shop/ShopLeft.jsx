import React, { useEffect, useState } from 'react'
import { API_JSON_SERVER_URL } from '../../api/commonApi'
import { useNavigate } from 'react-router-dom'
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
  <div className="Shop-left">
    <div className="Shop-left-con">
          {shop.map(el=>{
            return(
              <ul key={el.id}>
                <li onClick={()=>navigate(`/shop/${el.id}`)}>
                  {el.name}
                  </li>
              </ul>
            )
          })}
    </div>
  </div>
  </>
  )
}

export default ShopLeft