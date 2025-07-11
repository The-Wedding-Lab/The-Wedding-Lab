"use client";

import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import { useState } from "react";
import AppTextField from "../../components/ui/AppTextField";
import AppButton from "../../components/ui/AppButton";

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 24px;
`;

// ssr: false 옵션으로 서버사이드 렌더링 시 KakaoMap이 렌더링되지 않도록 설정
const KakaoMap = dynamic(() => import("../../components/map/KakaoMap"), {
  ssr: false,
});

export default function MapPage() {
  const [address, setAddress] = useState("");
  const [searchedAddress, setSearchedAddress] = useState("");
  const [position, setPosition] = useState<
    { lat: number; lng: number } | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!address) return;
    setLoading(true);
    // 카카오 geocoder 사용
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result: any, status: string) => {
      setLoading(false);
      if (status === window.kakao.maps.services.Status.OK) {
        const { y, x, address_name } = result[0];
        setPosition({ lat: parseFloat(y), lng: parseFloat(x) });
        setSearchedAddress(address_name);
      } else {
        setSearchedAddress("주소를 찾을 수 없습니다.");
      }
    });
  };

  const getDirectionLink = () => {
    if (!position || !searchedAddress) return "#";
    const { lat, lng } = position;
    return `https://map.kakao.com/link/to/${encodeURIComponent(
      searchedAddress
    )},${lat},${lng}`;
  };

  return (
    <main>
      <section>
        <Title>오시는 길</Title>

        <KakaoMap position={position} addressName={searchedAddress} />

        {searchedAddress && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginTop: 16,
              fontSize: 16,
              fontWeight: 500,
              color: "#333",
            }}
          >
            <span>주소 : </span>
            <span>{searchedAddress}</span>
          </div>
        )}

        {position && searchedAddress && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 16,
              fontSize: 16,
              fontWeight: 500,
              color: "#333",
            }}
          >
            <span>오는 방법 :</span>
            <a
              href={getDirectionLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <AppButton
                variant="outlined"
                color="primary"
                style={{ padding: "6px 12px", fontSize: 14 }}
              >
                카카오맵으로 길찾기
              </AppButton>
            </a>
          </div>
        )}
      </section>
    </main>
  );
}
