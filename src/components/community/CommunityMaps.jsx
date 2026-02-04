import React, { useEffect, useRef, useState } from 'react';

const CommunityMaps = () => {
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  const [selectedCity, setSelectedCity] = useState('노원');

  const locations = {
    노원: { lat: 37.6572049, lng: 127.0623355, 
    주소 : "서울 노원구 상계로3길 21, 화일빌딩/ 3층, 6층",
    지하철 : "4호선 / 노원역 9번 출구",
    지선 : "1142, 1154, 1129, 1138",
    일반 : "1-8, 12-5, 72-1",
    마을 : "노원02, 노원08",
    간선 : "102, N13(심야), N61(심야)"},
    신촌: { lat: 37.5547061, lng: 126.9374781, 
    주소 : "서울 마포구 신촌로 104/ 4층, 5층",
    지하철 : "2호선/신촌역 6번 출구 약 41m",
    간선 : "270, 271, 273, 602, 603, 707, 721, N26(심야), N62(심야)",
    광역 : "1000, 1100, 1101, 1200, 1300, 1301, 1302, 1601, M6117, M6628(출퇴근)",
    일반 : "82",
    직행 : "이음1(심야)"},
    강남: { lat: 37.4966645, lng: 127.0629804, 
    주소 : "서울 강남구 테헤란로5길 24, 장연빌딩/ 4~6층",
    지하철 : "2호선/강남역 11번, 12번 출구 약 200m",
    간선 : "140, 144, 145, 360, 400, 402, 420, 421, ,440, 441, 452, 470, 542, 741, N13 (심야), N37 (심야), 643",
    광역 : "9404, 9408",
    직행 : "1100, 1550, 1570, 3030, 3100, 3600, 8001, 9202, 9400, G7426, 9800, P9201 (출근)",
    공항 : "6009",
    지선 : " 3412, 3422, 4312, 8541 (맞춤버스)(공휴일제외)",
    마을 : "서초03"},
    종로: { lat: 37.5697291, lng: 126.9897183, 
    주소 : "서울 종로구 수표로 96 국일관 2층",
    지하철 : "1호선/종로3가역 15번 출구",
    간선 : "101, 103, 140, 143, 150, 160, 201, 260, 262, 270, 271, 273, 370, 720, 721",
    지선 : "7212",
    순환: "04",
    직행 : "9301"},
  }

  useEffect(() => {
    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const initialLoc=locations['노원']
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

  const handleLocationChange = (e) => {
    const locationKey = e.target.value;
    const target = locations[locationKey];
    setSelectedCity(locationKey);

    if (mapRef.current && markerRef.current) {
      const { kakao } = window;
      const moveLatLon = new window.kakao.maps.LatLng(target.lat, target.lng)
      mapRef.current.panTo(moveLatLon)
      markerRef.current.setPosition(moveLatLon)
    }else{
      console.error("지도 객체가 아직 생성되지 않았습니다.")
    }
    }
  ;

  return (
    <div className="maps">
      <div className="maps-con">
        <select name="map1" id="mapname" onChange={handleLocationChange} value={selectedCity}>
          <option value="노원">노원점</option>
          <option value="신촌">신촌점</option>
          <option value="강남">강남점</option>
          <option value="종로">종로점</option>
        </select>
<div id="map" style={{width: '500px', height: '400px', backgroundColor: '#fff', borderRadius: '20px'}}></div>

      <div className="maps-bottom">
        <div className="maps-bottom-con">
          <table>
            <thead>
              <tr>
                <td>
                  {selectedCity}점 오시는 방법
                  </td>
                  </tr>
                  </thead>
            <tbody>
              <tr>
                <th>주소</th>
                <td>{locations[selectedCity].주소}</td>
                </tr>
                <tr>
                <th>지하철</th>
                <td>{locations[selectedCity].지하철}</td>
                </tr>
                <tr>
                <th>버스</th>
                <td>{locations[selectedCity].간선}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default CommunityMaps;