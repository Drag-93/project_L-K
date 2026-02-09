import React, { useEffect, useRef, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import { useParams } from "react-router-dom";

const Shop = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const {id}=useParams()
  
  const [selectedShop, setSelectedShop] = useState({
    name: '',
    address: '',
    time:'',
    lat: '',
    lng: '',
    directions : ''
  });
  const url=API_JSON_SERVER_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_JSON_SERVER_URL}/shop`);
        if (res.data) {
          setSelectedShop(res.data[id]);
        }
      } catch (err) {
        console.error("데이터를 불러오는데 실패했습니다:", err);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if(!selectedShop) return;

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(selectedShop.lat, selectedShop.lng),
          level: 1,
        };
        
        const map = new window.kakao.maps.Map(container, options);
        const marker = new window.kakao.maps.Marker({
          position: map.getCenter(),
        });

        marker.setMap(map);
        mapRef.current = map;
        markerRef.current = marker;
        map.relayout()
      });
    };

    if (window.kakao && window.kakao.maps && window.kakao.maps.Map) {
      onLoadKakaoMap();
    } else {
      const script = document.createElement('script');
      script.async = true;
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=616c83d358b56fc7a54d64894331e300&autoload=false`;
      document.head.appendChild(script);
      script.onload = onLoadKakaoMap;
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && markerRef.current && selectedShop.lat) {
      const { kakao } = window;
      const moveLatLon = new kakao.maps.LatLng(selectedShop.lat, selectedShop.lng);
      
      mapRef.current.panTo(moveLatLon);
      markerRef.current.setPosition(moveLatLon);
    }
  }, [selectedShop]);

  return (
    <div className="shop">
      <div className="shop-con">
        <div 
          id="map" 
          style={{ widdiv: '100%', maxWiddiv: '500px', height: '400px', backgroundColor: '#eee', borderRadius: '20px' }}
        ></div>
        
        <div className="maps-bottom">
          <div className="maps-bottom-con">
            <div>
              <div className="maps">
                <li className="maps-top">
                  <div colSpan="2">{selectedShop.name}점 오시는 방법</div>
                </li>
              </div>
              <div>
                <li>
                  <div>주소</div>
                  <div>{selectedShop.address}</div>
                </li>
                <li>
                  <div>진료시간</div>
                  <div style={{ whiteSpace: "pre-wrap" }}>{selectedShop.time}</div>
                </li>
                <li>
                  <div>연락처</div>
                  <div>{selectedShop.phonenum}</div>
                </li>
                <li>
                  <div>오시는 길</div>
                  <div style={{ whiteSpace: "pre-wrap" }}>{selectedShop.directions}</div>
                </li>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;