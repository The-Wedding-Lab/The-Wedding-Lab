"use client";

import CardButton from "@/components/setup/CardButton";
import AppButton from "@/components/ui/AppButton";
import { Box, Typography } from "@mui/material";
import React from "react";
import Step1_WeddingInfo from "@/components/setup/steps/Step1_WeddingInfo";
import Step2_AIPrompt from "@/components/setup/steps/Step2_AIPrompt";
import Step3_EditTemplate from "@/components/setup/steps/Step3_EditTemplate";
import Step4_Preview from "@/components/setup/steps/Step4_Preview";
import Step5_Domain from "@/components/setup/steps/Step5_Domain";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import AppProgressBar from "@/components/ui/AppProgressBar";
import { animateScroll as scroll } from "react-scroll";

const SetupPage = () => {
  const { step, setupData } = useWeddingDataStore();
  const { setTypeAndStart, nextStep, prevStep, setSetupData } =
    useWeddingDataStore((state) => state.actions);

  const TOTAL_STEPS = setupData.type === "ai" ? 5 : 4;
  const progressValue = step >= 0 ? ((step + 1) / TOTAL_STEPS) * 100 : 0;

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 0,
      delay: 0,
      smooth: "linear",
    });
  };

  // 현재 step에 맞는 컴포넌트를 렌더링하는 함수
  const renderStepContent = () => {
    // AI 플로우
    if (setupData.type === "ai") {
      switch (step) {
        case 0:
          return <Step1_WeddingInfo />;
        case 1:
          return <Step2_AIPrompt data={setupData} setData={setSetupData} />;
        case 2:
          return <Step3_EditTemplate data={setupData} setData={setSetupData} />;
        case 3:
          return <Step4_Preview data={setupData} setData={setSetupData} />;
        case 4:
          return <Step5_Domain data={setupData} setData={setSetupData} />;
        default:
          return null;
      }
    }
    // 템플릿 플로우
    else if (setupData.type === "template") {
      switch (step) {
        case 0:
          return <Step1_WeddingInfo />;
        case 1:
          return <Step3_EditTemplate data={setupData} setData={setSetupData} />;
        case 2:
          return <Step4_Preview data={setupData} setData={setSetupData} />;
        case 3:
          return <Step5_Domain data={setupData} setData={setSetupData} />;
        default:
          return null;
      }
    }
    return null;
  };

  // 시작 화면 (방법 선택)
  if (step === -1) {
    return (
      <Box sx={{ p: 3 }}>
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
          gap={4}
        >
          <CardButton
            title="생성형 AI로 만들기"
            subTitle="chatGPT 기반 청첩장 생성 서비스"
            description="프롬프트를 직접 입력해서 쉽고, 빠르고, 간편하게 만들어보세요"
            imageUrl="/images/setup/ai.png"
            onClick={() => setTypeAndStart("ai")}
            recommended
          />
          <CardButton
            title="템플릿 직접 꾸미기"
            subTitle="A to Z 나만의 청첩장 만들기"
            description="템플릿을 직접 배치하여 나만의 모바일 청첩장을 만들어보세요"
            imageUrl="/images/setup/template.png"
            onClick={() => setTypeAndStart("template")}
          />
        </Box>
      </Box>
    );
  }

  // 각 단계별 화면
  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <AppProgressBar value={progressValue} />
      </Box>

      <Box sx={{ flex: 1, minHeight: "70vh" }}>{renderStepContent()}</Box>

      <Box
        className="NavigationContainer"
        display="flex"
        gap={2}
        mt={3}
        sx={{ position: "sticky", bottom: 24 }}
      >
        <AppButton
          variant="outlined"
          color="natural"
          fullWidth
          onClick={() => {
            scrollToTop();
            prevStep();
          }}
        >
          {step === 0 ? "처음으로" : "이전"}
        </AppButton>
        <AppButton
          variant="contained"
          color="highlight"
          fullWidth
          disabled={step === 0 && !setupData.step1Valid}
          onClick={() => {
            if (step === TOTAL_STEPS - 1) {
              console.log("생성하기");
            } else {
              scrollToTop();
              nextStep();
            }
          }}
        >
          {step === TOTAL_STEPS - 1 ? "생성하기" : "다음"}
        </AppButton>
      </Box>
    </Box>
  );
};

export default SetupPage;
