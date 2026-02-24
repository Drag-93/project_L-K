import React, { useEffect, useRef, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import AdminIsMapModal from "./AdminIsMapModal";
import {
  createKakaoMap,
  createMarker,
  loadKakaoMap,
  moveMap,
} from "../../utils/kakaoMapUtil";

const AdminShopModal = ({ setAdminAddModal, shopId, onSuccess }) => {
  const [detail, setDetail] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const shopUrl = API_JSON_SERVER_URL;

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const openDetail = async () => {
    try {
      if (shopId == null) {
        setDetail({
          name: "",
          phonenum: "",
          address: "",
          lat: "",
          lng: "",
          subway: "",
        });
        return;
      }
      const res = await axios.get(`${shopUrl}/shop/${shopId}`);
      setDetail(res.data);
    } catch (err) {
      alert(err);
    }
  };
  useEffect(() => {
    openDetail();
  }, [shopId]);

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

    const initMap = async () => {
      await loadKakaoMap();

      const lat = Number(detail.lat) || 37.5665;
      const lng = Number(detail.lng) || 126.978;

      // 기존 map 제거
      mapInstanceRef.current = null;
      markerRef.current = null;

      const map = createKakaoMap(mapRef.current, lat, lng);
      const marker = createMarker(map, lat, lng);

      mapInstanceRef.current = map;
      markerRef.current = marker;

      setTimeout(() => {
        map.relayout();
      }, 200);
    };

    initMap();
  }, [detail]);

  //lat/lng 바뀌면 지도 중심 + 마커 위치 이동
  useEffect(() => {
    if (!detail) return;
    if (!mapInstanceRef.current) return;

    const lat = Number(detail.lat);
    const lng = Number(detail.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    // util moveMap 있으면 사용
    moveMap(mapInstanceRef.current, lat, lng);

    // 마커 업데이트
    const kakao = window.kakao;
    const pos = new kakao.maps.LatLng(lat, lng);
    if (markerRef.current) markerRef.current.setPosition(pos);
  }, [detail?.lat, detail?.lng]);

  const onChangeFn = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => ({ ...prev, [name]: value }));
  };

  const closeFn = () => {
    setAdminAddModal(false);
  };

  const onPostFn = async () => {
    if (!window.confirm("추가 하시겠습니까")) return;
    if (isSaving) return;
    try {
      setIsSaving(true);
      const newShop = {
        ...detail,
      };

      await axios.post(`${shopUrl}/shop`, newShop);

      alert("추가 되었습니다");
      onSuccess?.();
      closeFn();
    } catch (err) {
      alert(err);
    } finally {
      setIsSaving(false);
    }
  };

  const onUpdateFn = async () => {
    if (!window.confirm("수정 하시겠습니까")) return;
    if (isSaving) return;
    try {
      setIsSaving(true);
      const res = await axios.put(`${shopUrl}/shop/${shopId}`, detail);
      setDetail(res.data);
      alert("수정 되었습니다.");
      onSuccess?.();
      closeFn();
    } catch (err) {
      alert(err);
    } finally {
      setIsSaving(false);
    }
  };

  const onDeleteFn = async () => {
    if (!window.confirm("정말 삭제 하시겠습니까")) return;
    if (isSaving) return;
    try {
      setIsSaving(true);
      await axios.delete(`${shopUrl}/shop/${shopId}`);
      alert("삭제 되었습니다.");
      onSuccess?.();
      closeFn();
    } catch (err) {
      alert(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!detail) {
    return (
      <div className="adminModal" onClick={closeFn}>
        <div
          className="adminModal-con"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="adminModal-close" onClick={closeFn}>
            X
          </span>
          <div className="loading">
            <h1>...Loading</h1>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* 주소 -> 좌표 변환 모달 오픈 */}
      {isMapModalOpen && (
        <AdminIsMapModal
          initialAddress={detail.address}
          initialLat={detail.lat}
          initialLng={detail.lng}
          onClose={() => setIsMapModalOpen(false)}
          onPick={handlePickLocation}
        />
      )}
      <div className="adminModal" onClick={closeFn}>
        <div
          className="adminModal-con"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="adminModal-close" onClick={closeFn}>
            X
          </span>
          <div className="adminModal-title">
            {shopId != null ? detail.name : "새 지점 등록"}
          </div>
          <ul>
            <li>
              <label htmlFor="name">지점명</label>
              <input
                type="text"
                name="name"
                id="name"
                value={detail.name}
                onChange={onChangeFn}
              />
            </li>
            <li>
              <label htmlFor="phonenum">연락처</label>
              <input
                type="text"
                name="phonenum"
                id="phonenum"
                value={detail.phonenum}
                onChange={onChangeFn}
              />
            </li>
            <li>
              <label htmlFor="address">주소</label>
              {/* <div className="admin-shopModal-address"> */}
              <input
                type="text"
                name="address"
                id="address"
                value={detail.address}
                onChange={onChangeFn}
              />
              {/* <button
                  className="addressBtn"
                  onClick={() => setIsMapModalOpen(true)}
                >
                  주소입력
                </button>
              </div> */}
            </li>
            {/* <li>
              <label htmlFor="lat">위도</label>
              <input
                name="lat"
                id="lat"
                value={detail.lat}
                onChange={onChangeFn}
              />
            </li>
            <li>
              <label htmlFor="lng">경도</label>
              <input
                name="lng"
                id="lng"
                value={detail.lng}
                onChange={onChangeFn}
              />
            </li> */}
            <li className="adminModal-map">
              <label htmlFor="subway">지도</label>
              <div
                className="adminModal-kakaomap"
                ref={mapRef}
                style={{
                  width: "100%",
                  height: 320,
                  borderRadius: 12,
                  background: "#eee",
                }}
              />
            </li>

            <li>
              <label htmlFor="subway">오시는길</label>
              <textarea
                name="subway"
                id="subway"
                value={detail.subway}
                onChange={onChangeFn}
              />
            </li>
          </ul>

          <div className="adminModal-footer">
            <div className="adminModal-footer-con">
              {shopId != null ? (
                <>
                  <button
                    onClick={onUpdateFn}
                    disabled={isSaving}
                    className="editBtn"
                  >
                    수정
                  </button>
                  <button
                    onClick={onDeleteFn}
                    disabled={isSaving}
                    className="deleteBtn"
                  >
                    삭제
                  </button>
                </>
              ) : (
                <button
                  onClick={onPostFn}
                  disabled={isSaving}
                  className="editBtn"
                >
                  추가하기
                </button>
              )}
              <button onClick={closeFn} disabled={isSaving}>
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminShopModal;
