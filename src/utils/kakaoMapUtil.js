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
// kakaoMapUtil.js
// - 지도 생성 1회(createKakaoMap)
// - 마커 생성(createMarker)
// - 이동(moveMap)
// - 반응형/모달/스크롤바 대응(attachAutoRelayout)

export function createKakaoMap(containerEl, lat, lng, level = 3) {
  const { kakao } = window;
  if (!kakao?.maps) throw new Error("Kakao maps SDK not loaded");
  if (!containerEl) throw new Error("Map container element not found");

  const center = new kakao.maps.LatLng(lat, lng);

  const map = new kakao.maps.Map(containerEl, {
    center,
    level,
  });

  return map;
}

export function createMarker(map, lat, lng) {
  const { kakao } = window;
  if (!kakao?.maps) throw new Error("Kakao maps SDK not loaded");
  if (!map) throw new Error("Map instance not found");

  const marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(lat, lng),
  });

  marker.setMap(map);
  return marker;
}

export function moveMap(map, lat, lng, level) {
  const { kakao } = window;
  if (!kakao?.maps) throw new Error("Kakao maps SDK not loaded");
  if (!map) return;

  const pos = new kakao.maps.LatLng(lat, lng);
  map.setCenter(pos);
  if (typeof level === "number") map.setLevel(level);
}

export function setMarkerPosition(marker, lat, lng) {
  const { kakao } = window;
  if (!kakao?.maps) throw new Error("Kakao maps SDK not loaded");
  if (!marker) return;

  marker.setPosition(new kakao.maps.LatLng(lat, lng));
}

/**
 * 컨테이너 사이즈가 바뀌는 모든 상황(반응형, 모달, 스크롤바 등)에서 타일 깨짐 방지.
 * - map.relayout()를 rAF로 디바운스
 * - 필요시 center/marker를 같이 재고정
 *
 * @param {kakao.maps.Map} map
 * @param {HTMLElement} containerEl (보통 map div)
 * @param {() => ({lat:number, lng:number} | null)} [getCenter]
 * @param {kakao.maps.Marker|null} [marker]
 * @returns {() => void} cleanup
 */
export function attachAutoRelayout(map, containerEl, getCenter, marker = null) {
  if (!map || !containerEl) return () => {};

  let raf = 0;

  const relayout = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      map.relayout();

      if (typeof getCenter === "function") {
        const c = getCenter();
        if (c && Number.isFinite(c.lat) && Number.isFinite(c.lng)) {
          const pos = new window.kakao.maps.LatLng(c.lat, c.lng);
          map.setCenter(pos);
          if (marker) marker.setPosition(pos);
        }
      }
    });
  };

  // 최초 2프레임 보강(모달 레이아웃 확정 타이밍)
  requestAnimationFrame(() => {
    relayout();
    requestAnimationFrame(relayout);
  });

  const ro = new ResizeObserver(relayout);
  ro.observe(containerEl);
  if (containerEl.parentElement) ro.observe(containerEl.parentElement);

  window.addEventListener("resize", relayout);

  return () => {
    ro.disconnect();
    window.removeEventListener("resize", relayout);
    cancelAnimationFrame(raf);
  };
}
