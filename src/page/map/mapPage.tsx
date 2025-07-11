"use client";

import styled from "@emotion/styled";
import dynamic from "next/dynamic";
import { useState } from "react";
import AppTextField from "../../components/ui/AppTextField";
import AppButton from "../../components/ui/AppButton";
import { Box, Typography } from "@mui/material";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";

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
  const { setupData } = useWeddingDataStore();

  return (
    <main>
      <section>
        <Title>오시는 길</Title>
        <KakaoMap
          position={{
            lat: setupData.weddingInfo.location.lat,
            lng: setupData.weddingInfo.location.lng,
          }}
        />
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <AppButton variant="outlined" color="highlight" fullWidth>
            카카오맵
          </AppButton>
          <AppButton variant="outlined" color="highlight" fullWidth>
            네이버맵
          </AppButton>
          <AppButton variant="outlined" color="highlight" fullWidth>
            티맵
          </AppButton>
        </Box>
      </section>
    </main>
  );
}
