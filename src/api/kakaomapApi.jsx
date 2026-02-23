const KAKAO_APP_KEY = "616c83d358b56fc7a54d64894331e300";
const SDK_ATTR = "data-kakao-sdk";

let loadingPromise = null;

export function loadKakaoMap() {
  // 이미 완전 로드된 경우
  if (window.kakao?.maps && typeof window.kakao.maps.load === "function") {
    return Promise.resolve(window.kakao);
  }

  // 로딩 중이면 같은 Promise 공유
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[${SDK_ATTR}="true"]`);

    const onReady = () => {
      try {
        window.kakao.maps.load(() => resolve(window.kakao));
      } catch (e) {
        reject(e);
      }
    };

    if (existing) {
      if (window.kakao?.maps) return onReady();
      existing.addEventListener("load", onReady, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.setAttribute(SDK_ATTR, "true");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services&disableHD=true`;
    script.onload = onReady;
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return loadingPromise;
}
