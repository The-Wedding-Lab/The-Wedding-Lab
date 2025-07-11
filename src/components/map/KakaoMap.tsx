import { useEffect, useRef } from "react";

// window 객체에 kakao 속성 타입 선언 (카카오 지도 API 사용을 위해 필요)
declare global {
  interface Window {
    kakao: any;
  }
  // kakao.maps 타입 선언
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

// 카카오 자바스크립트 키
const KAKAO_MAP_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

// position props 타입 추가
interface KakaoMapProps {
  position?: { lat: number; lng: number };
  addressName?: string; // 주소 이름 추가
}

export default function KakaoMap({ position, addressName }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<unknown>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const infoWindowRef = useRef<unknown>(null);

  useEffect(() => {
    // 지도를 초기화하는 함수
    const initializeMap = () => {
      if (!mapRef.current) return;

      const { kakao } = window;

      kakao.maps.load(() => {
        const center = new kakao.maps.LatLng(
          position?.lat ?? 37.5665,
          position?.lng ?? 126.978
        );
        // 지도 생성
        const map = new kakao.maps.Map(mapRef.current, {
          center,
          level: 3,
        });

        mapInstanceRef.current = map;

        // 마커 생성
        const marker = new kakao.maps.Marker({
          map,
          position: center,
        });
        markerRef.current = marker;

        if (addressName) {
          const infoWindow = new kakao.maps.InfoWindow({
            content: `<div style="padding:5px 10px;font-size:14px;color:#000;">${addressName}</div>`,
            position: center,
          });
          infoWindow.open(map, marker);
          infoWindowRef.current = infoWindow;
        }
      });
    };

    if (typeof window !== "undefined" && window.kakao && window.kakao.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-script";
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        initializeMap();
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

      if (infoWindowRef.current) {
        (
          infoWindowRef.current as { setPosition: (latlng: unknown) => void }
        ).setPosition(newPos);
      } else if (addressName) {
        const infoWindow = new window.kakao.maps.InfoWindow({
          content: `<div style="padding:5px 10px;font-size:14px;color:#000;">${addressName}</div>`,
          position: newPos,
        });
        infoWindow.open(
          mapInstanceRef.current as any,
          markerRef.current as any
        );
        infoWindowRef.current = infoWindow;
      }
    }
  }, [position, addressName]);

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
