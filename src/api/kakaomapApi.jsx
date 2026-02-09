import React, { useEffect, useRef, useState } from 'react'

const KAKAO_APP_KEY = "dapi.kakao.com/v2/maps/sdk.js?appkey=616c83d358b56fc7a54d64894331e300&autoload=false";

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
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // SDK 로드
  useEffect(() => {
    if (window.kakao?.maps) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => setLoaded(true));
    };
    document.head.appendChild(script);
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!loaded || !mapRef.current) return;

    const { kakao } = window;
    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(center.lat, center.lng),
      level,
    });

    map.setDraggable(draggable);
    map.setZoomable(zoomable);

    if (onClick) {
      kakao.maps.event.addListener(map, "click", (e) => {
        onClick({ lat: e.latLng.getLat(), lng: e.latLng.getLng() });
      });
    }

    // 마커
    markers.forEach(({ lat, lng, title }) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        map,
      });
      if (title) {
        const infowindow = new kakao.maps.InfoWindow({ content: `<div style="padding:4px 8px;font-size:13px;">${title}</div>` });
        kakao.maps.event.addListener(marker, "click", () => infowindow.open(map, marker));
      }
    });

    mapInstanceRef.current = map;

    return () => {
      kakao.maps.event.removeListener(map, "click");
    };
  }, [loaded, center.lat, center.lng, level, markers, onClick, draggable, zoomable]);

  return (
    <div
      ref={mapRef}
      className={className}
      style={{ width, height, ...style }}
    >
      {!loaded && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#888" }}>지도 로딩 중…</div>}
    </div>
  );
}
export default kakaomapApi