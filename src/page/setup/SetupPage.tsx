"use client";

import CardButton from "@/components/setup/CardButton";
import AppButton from "@/components/ui/AppButton";
import { Box, Typography } from "@mui/material";
import React from "react";

const SetupPage = () => {
  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <Box className="TextContainer">
        <Typography fontSize={24} fontWeight={700} gutterBottom>
          방법 선택
        </Typography>
        <Typography fontSize={12} fontWeight={500} color="#888888">
          모바일 청첩장을 만드실 방법을 선택해주세요.
        </Typography>
      </Box>
      <Box
        className="ButtonContainer"
        my={2}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <CardButton
          title="생성형 AI로 만들기"
          subTitle="chatGPT 기반 청첩장 생성 서비스"
          description="프롬프트를 직접 입력해서 쉽고, 빠르고, 간편하게 만들어보세요"
          imageUrl="/images/setup/ai.png"
          onClick={() => {}}
          recommended
        />
        <CardButton
          title="템플릿 직접 꾸미기"
          subTitle="A to Z 나만의 청첩장 만들기"
          description="템플릿을 직접 배치하여 나만의 모바일 청첩장을 만들어보세요"
          imageUrl="/images/setup/template.png"
          onClick={() => {}}
        />
      </Box>
    </Box>
  );
};

export default SetupPage;
