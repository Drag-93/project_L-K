import React, { useEffect, useRef, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  loadKakaoMap,
  createKakaoMap,
  createMarker,
  moveMap,
} from "../../utils/kakaoMapUtil";

const Shop = () => {
  const mapRef = useRef(null); // kakao map instance
  const markerRef = useRef(null); // kakao marker instance
  const { id } = useParams();

  console.log(id);
  const [selectedShop, setSelectedShop] = useState({
    name: "",
    address: "",
    time: "",
    lat: "",
    lng: "",
    directions: "",
    phonenum: "",
  });

  const url = API_JSON_SERVER_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}/shop/${id}`);
        if (res.data) {
          setSelectedShop(res.data);
        }
      } catch (err) {
        console.error("데이터를 불러오는데 실패했습니다:", err);
      }
    };
    fetchData();
  }, [id, url]);

  // 지도 생성/이동 (util사용)
  useEffect(() => {
    const initOrMoveMap = async () => {
      const lat = Number(selectedShop?.lat);
      const lng = Number(selectedShop?.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      await loadKakaoMap();

      const container = document.getElementById("map");
      if (!container) return;

      // 최초 생성
      if (!mapRef.current) {
        mapRef.current = createKakaoMap(container, lat, lng);
        markerRef.current = createMarker(mapRef.current, lat, lng);
        mapRef.current.relayout();

        //  레이아웃 확정 후 중심/마커 다시 세팅
        setTimeout(() => {
          mapRef.current.relayout();
          moveMap(mapRef.current, lat, lng);

          const kakao = window.kakao;
          markerRef.current?.setPosition(new kakao.maps.LatLng(lat, lng));
        }, 0);

        return;
      }
      // 이후 이동
      moveMap(mapRef.current, lat, lng);
      const kakao = window.kakao;
      markerRef.current?.setPosition(new kakao.maps.LatLng(lat, lng));
    };

    initOrMoveMap();
  }, [selectedShop?.lat, selectedShop?.lng]);

  return (
    <div className="shop">
      <div className="shop-con">
        <div
          id="map"
          style={{
            width: "100%",
            maxWidth: "500px",
            height: "400px",
            backgroundColor: "#eee",
            borderRadius: "20px",
          }}
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
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {selectedShop.time}
                  </div>
                </li>

                <li>
                  <div>연락처</div>
                  <div>{selectedShop.phonenum}</div>
                </li>

                <li>
                  <div>오시는 길</div>
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {selectedShop.directions}
                  </div>
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
