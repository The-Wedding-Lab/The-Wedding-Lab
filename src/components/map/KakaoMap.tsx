import { useEffect, useRef } from "react";

// window 객체에 kakao 속성 타입 선언 (카카오 지도 API 사용을 위해 필요)
declare global {
  interface Window {
    kakao: any;
  }
  // kakao.maps 타입 선언 (간단 버전)
  interface KakaoMap {
    setCenter(latlng: KakaoLatLng): void;
  }
  interface KakaoMarker {
    setPosition(latlng: KakaoLatLng): void;
  }
  interface KakaoLatLng {
    // 실제로는 LatLng 객체이지만, 타입만 맞추기 위함
    // unknown으로 처리
    [key: string]: unknown;
  }
}

// 카카오 자바스크립트 키 (본인 키로 교체)
const KAKAO_MAP_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

// position props 타입 추가
interface KakaoMapProps {
  position?: { lat: number; lng: number };
}

export default function KakaoMap({ position }: KakaoMapProps) {
  // 지도를 렌더링할 div 참조
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<unknown>(null); // 카카오 타입이 전역에 없으므로 unknown 사용
  const mapInstanceRef = useRef<unknown>(null); // 카카오 타입이 전역에 없으므로 unknown 사용

  useEffect(() => {
    // 지도를 초기화하는 함수
    const initializeMap = () => {
      if (window.kakao && window.kakao.maps && mapRef.current) {
        const center = new window.kakao.maps.LatLng(
          position?.lat ?? 37.5665,
          position?.lng ?? 126.978
        );
        // 지도 생성
        const map = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: 3,
        });
        mapInstanceRef.current = map;
        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          map,
          position: center,
        });
        markerRef.current = marker;
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
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(initializeMap);
      }
    };
    document.head.appendChild(script);
  }, []);

  // position이 바뀔 때마다 지도와 마커 이동
  useEffect(() => {
    if (
      window.kakao &&
      window.kakao.maps &&
      mapInstanceRef.current &&
      markerRef.current &&
      position
    ) {
      const newPos = new window.kakao.maps.LatLng(position.lat, position.lng);
      (
        mapInstanceRef.current as { setCenter: (latlng: unknown) => void }
      ).setCenter(newPos);
      (
        markerRef.current as { setPosition: (latlng: unknown) => void }
      ).setPosition(newPos);
    }
  }, [position]);

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
