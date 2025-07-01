"use client";

import styled from "@emotion/styled";
import dynamic from "next/dynamic";

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
  return (
    <main>
      <section>
        <Title>오시는 길</Title>
        <KakaoMap />
      </section>
    </main>
  );
}
