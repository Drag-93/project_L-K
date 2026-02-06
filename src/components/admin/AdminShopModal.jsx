import React, { useEffect, useRef, useState } from "react";
import { API_JSON_SERVER_URL } from "../../api/commonApi";
import axios from "axios";
import AdminIsMapModal from "./AdminIsMapModal";

const AdminShopModal = ({ setAdminAddModal, shopId, onSuccess }) => {
  const [detail, setDetail] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const shopUrl = API_JSON_SERVER_URL;

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
  }, [shopId, shopUrl]);

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

  // ✅ 지도/마커/컨테이너 ref
  const mapElRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // ✅ 지도 최초 1회 생성 (detail 로딩되고 DOM 준비된 후)
  useEffect(() => {
    if (!detail) return;
    if (!mapElRef.current) return;
    if (!window.kakao?.maps) return; // SDK 로딩 안 된 경우 방어

    // 좌표 없으면(신규등록) 기본 좌표
    const lat = Number(detail.lat) || 37.5665;
    const lng = Number(detail.lng) || 126.978;

    // 이미 만든 지도면 재생성 X
    if (mapRef.current) return;

    const center = new window.kakao.maps.LatLng(lat, lng);
    const map = new window.kakao.maps.Map(mapElRef.current, {
      center,
      level: 3,
    });

    const marker = new window.kakao.maps.Marker({ position: center });
    marker.setMap(map);

    mapRef.current = map;
    markerRef.current = marker;
  }, [detail]);

  // ✅ lat/lng 바뀔 때마다 지도 중심/마커 갱신
  useEffect(() => {
    if (!detail) return;
    if (!mapRef.current || !markerRef.current) return;

    const lat = Number(detail.lat);
    const lng = Number(detail.lng);

    // 입력이 아직 숫자가 아니면(빈값/문자) 갱신하지 않음
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const pos = new window.kakao.maps.LatLng(lat, lng);
    mapRef.current.setCenter(pos);
    markerRef.current.setPosition(pos);
  }, [detail?.lat, detail?.lng]);

  // ✅ 지도 모달에서 좌표/주소 받아서 detail에 주입
  const handlePickLocation = ({ address, lat, lng }) => {
    setDetail((prev) => ({
      ...prev,
      address,
      lat: String(lat),
      lng: String(lng),
    }));
    setIsMapModalOpen(false);
  };
  if (!detail) {
    return (
      <div className="adminShopModal">
        <div className="adminShopModal-con">
          <span className="close" onClick={closeFn}>
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
      <div className="adminShopModal">
        <div className="adminShopModal-con">
          <span className="close" onClick={closeFn}>
            X
          </span>
          <div className="title">
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
              <input
                type="text"
                name="address"
                id="address"
                value={detail.address}
                onChange={onChangeFn}
              />
              <button onClick={() => setIsMapModalOpen(true)}>주소입력</button>
            </li>
            <li>
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
            </li>
            <li>
              <label htmlFor="subway">지도</label>
              <div
                ref={mapElRef}
                style={{
                  width: 300,
                  height: 260,
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              />
            </li>

            <li>
              <label htmlFor="subway">지하철?오시는길</label>
              <input
                type="text"
                name="subway"
                id="subway"
                value={detail.subway}
                onChange={onChangeFn}
              />
            </li>

            <li>
              {shopId != null ? (
                <>
                  <button onClick={onUpdateFn} disabled={isSaving}>
                    수정
                  </button>
                  <button onClick={onDeleteFn} disabled={isSaving}>
                    삭제
                  </button>
                </>
              ) : (
                <button onClick={onPostFn} disabled={isSaving}>
                  추가하기
                </button>
              )}
              <button onClick={closeFn} disabled={isSaving}>
                닫기
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default AdminShopModal;
