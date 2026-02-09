import React, { useEffect, useMemo, useRef, useState } from "react";

//gpt가 만들어준 모달
//주소입력 -> 자동 좌표로 변환
/**
 * AdminIsMapModal
 * - 주소 검색(Geocoder.addressSearch) -> 좌표/마커 이동
 * - 지도 클릭 -> 좌표/마커 이동 + 역지오코딩(coord2Address)로 주소 채움
 * - 선택 완료 -> onPick({ address, lat, lng }) 호출
 *
 * ⚠️ Geocoder 쓰려면 libraries=services 필요!
 */
const KAKAO_APP_KEY = "616c83d358b56fc7a54d64894331e300"; // ✅ 필요하면 env로 분리

const loadKakaoSdk = () => {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps?.Map && window.kakao?.maps?.services) {
      resolve(window.kakao);
      return;
    }

    const existing = document.getElementById("kakao-map-sdk");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.kakao), {
        once: true,
      });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-sdk";
    script.async = true;
    // ✅ services 라이브러리 포함(지오코더)
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;

    script.onload = () => resolve(window.kakao);
    script.onerror = reject;

    document.head.appendChild(script);
  });
};

export default function AdminIsMapModal({
  initialAddress = "",
  initialLat = "",
  initialLng = "",
  onClose,
  onPick,
}) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const clickListenerRef = useRef(null);

  const [addressInput, setAddressInput] = useState(initialAddress ?? "");
  const [picked, setPicked] = useState(() => ({
    address: initialAddress ?? "",
    lat: initialLat ?? "",
    lng: initialLng ?? "",
  }));

  const hasPicked = useMemo(() => {
    const lat = Number(picked.lat);
    const lng = Number(picked.lng);
    return Number.isFinite(lat) && Number.isFinite(lng);
  }, [picked.lat, picked.lng]);

  // 모달 열리면 SDK 로드 + 지도 생성
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const kakao = await loadKakaoSdk();
        if (cancelled) return;

        kakao.maps.load(() => {
          if (cancelled) return;
          if (!mapDivRef.current) return;

          const initLat = Number(initialLat) || 37.5665; // 기본: 서울시청
          const initLng = Number(initialLng) || 126.978;
          const center = new kakao.maps.LatLng(initLat, initLng);

          mapRef.current = new kakao.maps.Map(mapDivRef.current, {
            center,
            level: 3,
          });

          markerRef.current = new kakao.maps.Marker({ position: center });
          markerRef.current.setMap(mapRef.current);

          geocoderRef.current = new kakao.maps.services.Geocoder();

          // 지도 클릭 -> 좌표 갱신 + 주소 역지오코딩
          clickListenerRef.current = kakao.maps.event.addListener(
            mapRef.current,
            "click",
            (mouseEvent) => {
              const latLng = mouseEvent.latLng;
              const lat = latLng.getLat();
              const lng = latLng.getLng();

              markerRef.current.setPosition(latLng);
              mapRef.current.panTo(latLng);

              // 역지오코딩: 좌표 -> 주소
              geocoderRef.current.coord2Address(lng, lat, (result, status) => {
                if (status === kakao.maps.services.Status.OK && result?.[0]) {
                  const addr =
                    result[0].road_address?.address_name ||
                    result[0].address?.address_name ||
                    "";

                  setPicked({
                    address: addr,
                    lat: String(lat),
                    lng: String(lng),
                  });
                  // 입력창도 같이 갱신해 주면 UX 좋음
                  setAddressInput(addr);
                } else {
                  setPicked((prev) => ({
                    ...prev,
                    lat: String(lat),
                    lng: String(lng),
                  }));
                }
              });
            },
          );

          // 모달 표시 직후 리사이즈 트리거(깨짐 방지)
          kakao.maps.event.trigger(mapRef.current, "resize");
        });
      } catch (e) {
        console.error(e);
        alert("카카오 지도 SDK 로딩 실패");
      }
    };

    init();

    return () => {
      cancelled = true;

      // 클릭 리스너 제거(메모리 누수 방지)
      try {
        const kakao = window.kakao;
        if (kakao?.maps?.event && mapRef.current && clickListenerRef.current) {
          kakao.maps.event.removeListener(
            mapRef.current,
            "click",
            clickListenerRef.current,
          );
        }
      } catch {}
    };
  }, [initialLat, initialLng]);

  // 주소로 검색 버튼
  const searchByAddress = () => {
    const kakao = window.kakao;
    const geocoder = geocoderRef.current;
    if (!kakao?.maps?.services || !geocoder) return;

    const q = addressInput.trim();
    if (!q) return alert("주소를 입력해 주세요.");

    geocoder.addressSearch(q, (result, status) => {
      if (status !== kakao.maps.services.Status.OK || !result?.[0]) {
        alert("주소를 찾지 못했습니다. (오타/상세주소 확인)");
        return;
      }

      const lat = Number(result[0].y);
      const lng = Number(result[0].x);
      const latLng = new kakao.maps.LatLng(lat, lng);

      mapRef.current.setCenter(latLng);
      markerRef.current.setPosition(latLng);

      // 검색어 그대로 address에 넣기(원하면 result[0].address_name 등으로 교체 가능)
      setPicked({
        address: q,
        lat: String(lat),
        lng: String(lng),
      });
    });
  };

  const onSubmitPick = () => {
    if (!hasPicked)
      return alert("지도에서 위치를 선택하거나 주소로 검색해 주세요.");
    onPick?.({
      address: picked.address || addressInput || "",
      lat: Number(picked.lat),
      lng: Number(picked.lng),
    });
  };

  return (
    <div className="AdminIsMapModal" style={backdropStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <strong>지도에서 위치 선택</strong>
          <button type="button" onClick={onClose} style={xBtnStyle}>
            ✕
          </button>
        </div>

        <div style={toolbarStyle}>
          <input
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="주소 입력 후 검색"
            style={inputStyle}
          />
          <button type="button" onClick={searchByAddress} style={btnStyle}>
            주소로 찾기
          </button>
        </div>

        <div
          ref={mapDivRef}
          style={{
            width: "100%",
            height: 320,
            borderRadius: 12,
            background: "#eee",
          }}
        />

        <div style={infoStyle}>
          <div>
            <div style={labelStyle}>선택 주소</div>
            <div style={valueStyle}>{picked.address || "(미선택)"}</div>
          </div>
          {/* <div style={{ display: "flex", gap: 12 }}>
            <div>
              <div style={labelStyle}>위도(lat)</div>
              <div style={valueStyle}>{picked.lat || "-"}</div>
            </div>
            <div>
              <div style={labelStyle}>경도(lng)</div>
              <div style={valueStyle}>{picked.lng || "-"}</div>
            </div>
          </div> */}
        </div>

        <div style={footerStyle}>
          <button type="button" onClick={onClose} style={btnGhostStyle}>
            취소
          </button>
          <button type="button" onClick={onSubmitPick} style={btnPrimaryStyle}>
            선택 완료
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- inline styles (CSS로 빼도 됨) --- */
const backdropStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle = {
  width: "min(900px, 92vw)",
  background: "#fff",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 10,
};

const xBtnStyle = {
  border: "none",
  background: "transparent",
  fontSize: 18,
  cursor: "pointer",
};

const toolbarStyle = {
  display: "flex",
  gap: 8,
  marginBottom: 10,
};

const inputStyle = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
};

const btnStyle = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "#f7f7f7",
  cursor: "pointer",
};

const infoStyle = {
  marginTop: 12,
  padding: 12,
  borderRadius: 12,
  background: "#fafafa",
  border: "1px solid #eee",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 12,
};

const labelStyle = { fontSize: 12, color: "#666", marginBottom: 4 };
const valueStyle = { fontSize: 14, color: "#111", wordBreak: "break-word" };

const footerStyle = {
  marginTop: 12,
  display: "flex",
  justifyContent: "flex-end",
  gap: 8,
};

const btnGhostStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
};

const btnPrimaryStyle = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #111",
  background: "#111",
  color: "#fff",
  cursor: "pointer",
};
