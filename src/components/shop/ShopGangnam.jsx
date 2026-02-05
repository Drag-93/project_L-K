import React, { useEffect, useRef, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";

const ShopGangnam = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  
  const [selectedShop, setSelectedShop] = useState({
    name: '',
    address: '',
    subway: '',
    bus1: '', 
    bus2: '', 
    bus3: '', 
    bus4: '', 
    bus5: '', 
    bus6: '',
    lat: 37.4966645,
    lng: 127.0629804
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_JSON_SERVER_URL}/shop`);
        if (res.data && res.data.length > 0) {
          setSelectedShop(res.data[2]);
        }
      } catch (err) {
        console.error("데이터를 불러오는데 실패했습니다:", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(selectedShop.lat, selectedShop.lng),
          level: 2,
        };
        
        const map = new window.kakao.maps.Map(container, options);
        const marker = new window.kakao.maps.Marker({
          position: map.getCenter(),
        });

        marker.setMap(map);
        mapRef.current = map;
        markerRef.current = marker;
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
    <div className="Gangnam">
      <div className="Gangnam-con">
        <div 
          id="map" 
          style={{ width: '100%', maxWidth: '500px', height: '400px', backgroundColor: '#eee', borderRadius: '20px' }}
        ></div>
        
        <div className="maps-bottom">
          <div className="maps-bottom-con">
            <table>
              <thead>
                <tr>
                  <th colSpan="2">{selectedShop.name}점 오시는 방법</th>
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
                    <td style={{ wordBreak: 'break-all', maxWidth: '200px' }}>
                      {[selectedShop.bus1, selectedShop.bus2, selectedShop.bus3, selectedShop.bus4, selectedShop.bus5, selectedShop.bus6]
                        .filter(bus => bus) 
                        .map((bus, index) => (
                          <div key={index} style={{ marginBottom: '4px' }}>
                            {bus}
                          </div>
                        ))}
                    </td>
                    </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopGangnam;