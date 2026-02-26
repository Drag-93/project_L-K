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
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
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

  useEffect(() => {
    if (!selectedShop) return;

    const initMap = async () => {
      await loadKakaoMap();

      const lat = Number(selectedShop?.lat);
      const lng = Number(selectedShop?.lng);

      const map = createKakaoMap(mapRef.current, lat, lng);
      const marker = createMarker(map, lat, lng);

      mapInstanceRef.current = map;
      markerRef.current = marker;

      setTimeout(() => {
        map.relayout();
      }, 200);
    };
    initMap();
  }, [selectedShop]);

  // 지도 생성/이동 (util사용) -> 서버 열고 초기 랜더링 안됨
  // useEffect(() => {
  //   if (!selectedShop) return;

  //   const initOrMoveMap = async () => {
  //     const lat = Number(selectedShop?.lat);
  //     const lng = Number(selectedShop?.lng);
  //     if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

  //     await loadKakaoMap();

  //     const container = document.getElementById("map");
  //     if (!container) return;

  //     // 최초 생성
  //     if (!mapRef.current) {
  //       mapRef.current = createKakaoMap(container, lat, lng);
  //       markerRef.current = createMarker(mapRef.current, lat, lng);
  //       mapRef.current.relayout();

  //       //  레이아웃 확정 후 중심/마커 다시 세팅
  //       setTimeout(() => {
  //         mapRef.current.relayout();
  //         moveMap(mapRef.current, lat, lng);

  //         const kakao = window.kakao;
  //         markerRef.current?.setPosition(new kakao.maps.LatLng(lat, lng));
  //       }, 0);

  //       return;
  //     }
  //     // 이후 이동
  //     moveMap(mapRef.current, lat, lng);
  //     const kakao = window.kakao;
  //     markerRef.current?.setPosition(new kakao.maps.LatLng(lat, lng));
  //   };

  //   initOrMoveMap();
  // }, [selectedShop?.lat, selectedShop?.lng]);

  return (
    <div className="shop">
      <div className="shop-title">
        <h2>{selectedShop.name}점 오시는 방법</h2>
      </div>
      <div className="shop-con">
        <div
          className="shop-map"
          id="map"
          ref={mapRef}
          style={{
            width: "100%",
            backgroundColor: "#eee",
            borderRadius: "20px",
          }}
        ></div>
        <div className="shop-info">
          <ul>
            <li>
              <h3>진료시간</h3>
              <span style={{ whiteSpace: "pre-wrap" }}>
                {selectedShop.time}
              </span>
            </li>
            <li>
              <h3>연락처</h3>
              <span style={{ whiteSpace: "pre-wrap" }}>
                {selectedShop.phonenum}
              </span>
            </li>
            <li>
              <h3>주소</h3>
              <span style={{ whiteSpace: "pre-wrap" }}>
                {selectedShop.address}
              </span>
            </li>
            <li>
              <h3>오시는 길</h3>
              <span style={{ whiteSpace: "pre-wrap" }}>
                {selectedShop.directions}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Shop;
