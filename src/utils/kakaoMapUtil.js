/* ============================================================
📌 Kakao Map Util 사용 가이드
===============================================================
1️⃣ 사전 준비
---------------------------------------------------------------
.env 파일에 카카오 JavaScript 키 추가

REACT_APP_KAKAO_KEY=카카오_자바스크립트키

2️⃣ 기본 사용 흐름 (React 기준)
---------------------------------------------------------------
1. loadKakaoMap()으로 SDK 로드
2. createKakaoMap()으로 지도 생성
3. createMarker()로 마커 생성
4. moveMap()으로 지도 중심 이동
5. addressToCoord()로 주소 → 좌표 변환

3️⃣ 기본 지도 생성 예시
---------------------------------------------------------------

const mapRef = useRef(null);
const mapInstance = useRef(null);
const markerRef = useRef(null);

useEffect(() => {
  const initMap = async () => {
    await loadKakaoMap();

    mapInstance.current = createKakaoMap(
      mapRef.current,
      37.5665,
      126.9780
    );

    markerRef.current = createMarker(
      mapInstance.current,
      37.5665,
      126.9780
    );
  };

  initMap();
}, []);

JSX:
<div ref={mapRef} style={{ width: 300, height: 260 }} />

4️⃣ 지도 중심 이동
---------------------------------------------------------------

moveMap(mapInstance.current, lat, lng);

5️⃣ 마커 위치 변경
---------------------------------------------------------------

markerRef.current.setPosition(
  new window.kakao.maps.LatLng(lat, lng)
);

6️⃣ 주소 → 좌표 변환
---------------------------------------------------------------

const { lat, lng } = await addressToCoord("서울 강남구");

moveMap(mapInstance.current, lat, lng);
markerRef.current.setPosition(
  new window.kakao.maps.LatLng(lat, lng)
);

7️⃣ 권장 사용 패턴
---------------------------------------------------------------
- 지도는 최초 1회만 생성
- 마커는 ref로 관리 (여러 개 생성 방지)
- lat/lng 변경 시 moveMap + marker 위치 변경

---------------------------------------------------------------
ex)
  //컴포넌트 상단에 선언
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  //                 //
  //목록 open 함수 선언 //
  //                 //

  
  //   좌표/주소 선택 시 반영
  const handlePickLocation = ({ address, lat, lng }) => {
    setDetail((prev) => ({
      ...prev,
      address: address ?? prev.address,
      lat,
      lng,
    }));
    setIsMapModalOpen(false);
  };

  // 지도 최초 생성: SDK 로드 후 map 생성 + marker 생성
  useEffect(() => {
    if (!detail) return;
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return; // 이미 생성됐으면 스킵

    const initMap = async () => {
      await loadKakaoMap();

      const lat = Number(detail.lat) || 37.5665;
      const lng = Number(detail.lng) || 126.9780;

      mapInstanceRef.current = createKakaoMap(mapRef.current, lat, lng);
      markerRef.current = createMarker(mapInstanceRef.current, lat, lng);
    };

    initMap();
  }, [detail]);

===============================================================
*/

export const loadKakaoMap = () => {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      resolve(window.kakao);
      return;
    }

    const key = process.env.a708ee8cac332feda75a293b3b44d4c8;
    if (!key) {
      reject(new Error("REACT_APP_KAKAO_KEY가 .env에 없습니다."));
      return;
    }

    // ✅ 중복 로드 방지
    const existing = document.querySelector('script[data-kakao-sdk="true"]');
    if (existing) {
      existing.addEventListener("load", () =>
        window.kakao.maps.load(() => resolve(window.kakao)),
      );
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.dataset.kakaoSdk = "true";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => window.kakao.maps.load(() => resolve(window.kakao));
    script.onerror = reject;

    document.head.appendChild(script);
  });
};

export const createKakaoMap = (container, lat, lng) => {
  const kakao = window.kakao;
  const nLat = Number(lat);
  const nLng = Number(lng);

  const options = {
    center: new kakao.maps.LatLng(nLat, nLng),
    level: 3,
  };

  return new kakao.maps.Map(container, options);
};

export const createMarker = (map, lat, lng) => {
  const kakao = window.kakao;
  const nLat = Number(lat);
  const nLng = Number(lng);

  return new kakao.maps.Marker({
    position: new kakao.maps.LatLng(nLat, nLng),
    map,
  });
};

export const moveMap = (map, lat, lng) => {
  const kakao = window.kakao;
  const nLat = Number(lat);
  const nLng = Number(lng);

  map.setCenter(new kakao.maps.LatLng(nLat, nLng));
};

export const addressToCoord = (address) => {
  return new Promise((resolve, reject) => {
    const kakao = window.kakao;
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result?.[0]) {
        resolve({
          lat: Number(result[0].y),
          lng: Number(result[0].x),
        });
      } else {
        reject(new Error("주소 변환 실패"));
      }
    });
  });
};
