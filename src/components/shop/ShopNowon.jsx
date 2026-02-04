import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";

const ShopNowon = () => {
    const mapRef = useRef(null)
    const markerRef = useRef(null)
    const items={
      id:'',
      name:'',
      latlng:'',
      address:'',
      subway:'',
      bus1:'',
      bus2:'',
      bus3:'',
      bus4:'',
      bus5:'',
      bus6:'',
    }
    

    
    const url=API_JSON_SERVER_URL
    
    const navigate=useNavigate();
    const [selectedShop, setSelectedShop] = useState(items)

    useEffect(()=>{
    const fetchData=async (e)=>{
      try{
        const res=await axios.get(`${url}/shop`)
        console.log(res)
        setSelectedShop(res.data[0])
      }catch(err){
        alert(err)
      }
    }
    fetchData();
  },[])
    

      useEffect(() => {
        const onLoadKakaoMap = () => {
          window.kakao.maps.load(() => {
            const container = document.getElementById('map');
            const initialLoc=locations['shop.id']
            const options = {
              center: new window.kakao.maps.LatLng(initialLoc.lat, initialLoc.lng),
              level: 2,
            }
            const map = new window.kakao.maps.Map(container, options)
            const marker = new window.kakao.maps.Marker({
              position: map.getCenter(),
            })
    
            marker.setMap(map)
            mapRef.current = map
            markerRef.current = marker
          });
        };
      
  

    if (window.kakao && window.kakao.maps && window.kakao.maps.Map) {
      onLoadKakaoMap()
    }else{
      const script = document.createElement('script')
      script.async = true
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=616c83d358b56fc7a54d64894331e300&autoload=false`
      document.head.appendChild(script)
      script.onload = onLoadKakaoMap
    }
      }, []);

      if (mapRef.current && markerRef.current) {
      const { kakao } = window;
      const moveLatLon = new window.kakao.maps.LatLng(selectedShop.lat,selectedShop.lng)
      mapRef.current.panTo(moveLatLon)
      markerRef.current.setPosition(moveLatLon)
    }else{
      console.error("지도 객체가 아직 생성되지 않았습니다.")
    }

    return(
      <div className="nowon">
        <div className="nowon-con">
          <div className="left">
            <ul>
              <li style={{ cursor: 'pointer' }} onClick={() => navigate(`${selectedShop.name}`)}>노원</li>
              <li>신촌</li>
              <li>강남</li>
              <li>방학</li>
            </ul>
          </div>
            <div id="map" style={{width: '500px', height: '400px', backgroundColor: '#fff', borderRadius: '20px'}}></div>
      <div className="maps-bottom">
        <div className="maps-bottom-con">
          <table>
            <thead>
              <tr>
                <th>
                  {selectedShop.name}점 오시는 방법
                  </th>
                  </tr>
                  </thead>
            <tbody>
              <tr>
                <th>주소</th>
                <td>{selectedShop.address}</td>
                </tr>
                <tr>
                <th>지하철</th>
                <td>{selectedShop.subway}</td>
                </tr>
                <tr>
                <th>버스</th>
                <td>{selectedShop.bus1}</td>
                <td>{selectedShop.bus2}</td>
                <td>{selectedShop.bus3}</td>
                <td>{selectedShop.bus4}</td>
                <td>{selectedShop.bus5}</td>
                <td>{selectedShop.bus6}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

        </div>
      </div>
    )
    }
  ;

export default ShopNowon;
