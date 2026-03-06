import React, { useEffect, useRef, useState } from "react";

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY;

export default function KakaoMap({
  center = { lat: 37.5665, lng: 126.978 },
  level = 3,
  width = "100%",
  height = "400px",
  markers = [],
  onClick,
  draggable = true,
  zoomable = true,
  className = "",
  style = {},
}) {
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const clickHandlerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // 1) SDK 로드 (한 번만)
  useEffect(() => {
    if (window.kakao?.maps) {
      setLoaded(true);
      return;
    }

    // 이미 스크립트가 꽂혀있으면 중복 삽입 방지
    const existing = document.querySelector('script[data-kakao-sdk="true"]');
    if (existing) {
      existing.addEventListener("load", () => {
        window.kakao.maps.load(() => setLoaded(true));
      });
      return;
    }

    const script = document.createElement("script");
    script.dataset.kakaoSdk = "true";
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
    script.onload = () => window.kakao.maps.load(() => setLoaded(true));
    document.head.appendChild(script);
  }, []);

  // 2) 지도 최초 1회 생성
  useEffect(() => {
    if (!loaded || !mapElRef.current) return;
    if (mapRef.current) return; // 이미 생성됨

    const { kakao } = window;

    const map = new kakao.maps.Map(mapElRef.current, {
      center: new kakao.maps.LatLng(center.lat, center.lng),
      level,
    });

    map.setDraggable(draggable);
    map.setZoomable(zoomable);

    mapRef.current = map;
  }, [loaded]); // 최초만

  // 3) 옵션/센터/레벨 업데이트 (지도 재생성 X)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const { kakao } = window;
    map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
  }, [center.lat, center.lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setLevel(level);
  }, [level]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setDraggable(draggable);
  }, [draggable]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setZoomable(zoomable);
  }, [zoomable]);

  // 4) 클릭 이벤트 (핸들러 참조를 저장해 제거 가능하게)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const { kakao } = window;

    // 이전 핸들러 제거
    if (clickHandlerRef.current) {
      kakao.maps.event.removeListener(map, "click", clickHandlerRef.current);
      clickHandlerRef.current = null;
    }

    if (!onClick) return;

    const handler = (e) => {
      onClick({ lat: e.latLng.getLat(), lng: e.latLng.getLng() });
    };

    kakao.maps.event.addListener(map, "click", handler);
    clickHandlerRef.current = handler;

    return () => {
      if (clickHandlerRef.current) {
        kakao.maps.event.removeListener(map, "click", clickHandlerRef.current);
        clickHandlerRef.current = null;
      }
    };
  }, [onClick]);

  // 5) 마커 렌더링 (기존 마커 제거 후 다시 그림)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const { kakao } = window;

    // 기존 마커 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    markers.forEach(({ lat, lng, title }) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        map,
      });
      markersRef.current.push(marker);

      if (title) {
        const infowindow = new kakao.maps.InfoWindow({
          content: `<div style="padding:4px 8px;font-size:13px;">${title}</div>`,
        });
        kakao.maps.event.addListener(marker, "click", () =>
          infowindow.open(map, marker),
        );
      }
    });
  }, [markers]);

  return (
    <div
      ref={mapElRef}
      className={className}
      style={{ width, height, ...style }}
    >
      {!loaded && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#888",
          }}
        >
          …Loading
        </div>
      )}
    </div>
  );
}
