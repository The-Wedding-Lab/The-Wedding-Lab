import { useEffect, useRef } from "react";

// window 객체에 kakao 속성 타입 선언 (카카오 지도 API 사용을 위해 필요)
declare global {
  interface Window {
    kakao: any;
  }
}

// 카카오 자바스크립트 키 (본인 키로 교체)
const KAKAO_MAP_API_KEY = "9017f102cb8d3203b30c201150ad9";

export default function KakaoMap() {
  // 지도를 렌더링할 div 참조
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 지도를 초기화하는 함수
    const initializeMap = () => {
      // window.kakao와 window.kakao.maps가 모두 준비된 경우에만 실행
      if (window.kakao && window.kakao.maps && mapRef.current) {
        // 지도 생성 (중심좌표: 서울시청, 레벨: 3)
        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 3,
        });
        // 마커 생성 (위치: 서울시청)
        new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(37.5665, 126.978),
        });
      }
    };

    // 이미 스크립트가 로드되어 있고, kakao.maps가 준비된 경우 바로 지도 초기화
    if (window.kakao && window.kakao.maps) {
      initializeMap();
      return;
    }

    // 카카오 지도 API 스크립트 동적 추가
    const script = document.createElement("script");
    script.id = "kakao-map-script";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`;
    script.async = true;
    // 스크립트가 로드되면 kakao.maps.load로 지도 초기화
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(initializeMap);
      }
    };
    document.head.appendChild(script);

    // cleanup: 컴포넌트 언마운트 시 스크립트 제거 (필요시 주석 해제)
    // return () => {
    //   const script = document.getElementById("kakao-map-script");
    //   if (script) script.remove();
    // };
  }, []);

  // 지도가 렌더링될 div 반환
  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    />
  );
}
