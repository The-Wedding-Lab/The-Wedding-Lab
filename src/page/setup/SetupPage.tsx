"use client";

import CardButton from "@/components/setup/CardButton";
import AppButton from "@/components/ui/AppButton";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import Step1_WeddingInfo from "@/components/setup/steps/Step1_WeddingInfo";
import Step2_AIPrompt from "@/components/setup/steps/Step2_AIPrompt";
import Step3_EditTemplate from "@/components/setup/steps/Step3_EditTemplate";
import Step4_Preview from "@/components/setup/steps/Step4_Preview";
import Step5_Domain from "@/components/setup/steps/Step5_Domain";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import AppProgressBar from "@/components/ui/AppProgressBar";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollToPlugin);

const SetupPage = () => {
  const { step, setupData } = useWeddingDataStore();
  const { setTypeAndStart, nextStep, prevStep, setSetupData } =
    useWeddingDataStore((state) => state.actions);

  const shouldScrollRef = useRef(false);
  const stepContainerRef = useRef<HTMLDivElement>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const TOTAL_STEPS = setupData.type === "ai" ? 5 : 4;
  const progressValue = step >= 0 ? ((step + 1) / TOTAL_STEPS) * 100 : 0;

  // GSAP 스크롤 애니메이션
  const executeScrollToTop = () => {
    gsap.to(window, {
      duration: 0.8,
      scrollTo: { y: 0, autoKill: true },
      ease: "power2.inOut",
    });
  };

  // 초기 렌더링 시 페이드인
  useEffect(() => {
    if (stepContainerRef.current && step >= 0) {
      gsap.set(stepContainerRef.current, { opacity: 1, y: 0 });
    }
  }, []);

  // 스크롤 먼저 실행 후 애니메이션
  useLayoutEffect(() => {
    if (stepContainerRef.current && step >= 0) {
      // 기존 애니메이션 중지
      gsap.killTweensOf(stepContainerRef.current);

      // 스크롤이 필요한 경우 먼저 실행
      if (shouldScrollRef.current) {
        executeScrollToTop();
        shouldScrollRef.current = false;
      }

      // 스크롤 완료 후 페이드인 애니메이션 실행
      gsap.fromTo(
        stepContainerRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.1, // 스크롤 시작 후 약간의 딜레이
        }
      );
    }
  }, [step]);

  const scrollToTop = () => {
    shouldScrollRef.current = true;
  };

  // 초기화 확인 다이얼로그 핸들러
  const handlePrevClick = () => {
    if (step === 0) {
      setResetDialogOpen(true);
    } else {
      scrollToTop();
      prevStep();
    }
  };

  const handleResetConfirm = () => {
    setResetDialogOpen(false);
    scrollToTop();
    prevStep();
  };

  const handleResetCancel = () => {
    setResetDialogOpen(false);
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

      <Box
        ref={stepContainerRef}
        sx={{
          flex: 1,
          minHeight: "70vh",
          opacity: 0, // GSAP 애니메이션을 위한 초기 상태
        }}
      >
        {renderStepContent()}
      </Box>

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
          onClick={handlePrevClick}
        >
          {step === 0 ? "처음으로" : "이전"}
        </AppButton>
        <AppButton
          variant="contained"
          color="highlight"
          fullWidth
          disabled={
            (step === 0 && !setupData.step1Valid) ||
            (step === 4 && !setupData.step5Valid)
          }
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

      {/* 초기화 확인 다이얼로그 */}
      <Dialog open={resetDialogOpen} onClose={handleResetCancel}>
        <DialogTitle>입력 정보 초기화</DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{ fontSize: 16, fontWeight: 500, color: "#777" }}
          >
            입력한 모든 정보가 초기화됩니다.
            <br />
            정말로 처음으로 돌아가시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <AppButton
            onClick={handleResetCancel}
            variant="outlined"
            color="natural"
          >
            취소
          </AppButton>
          <AppButton
            onClick={handleResetConfirm}
            variant="contained"
            color="highlight"
          >
            확인
          </AppButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SetupPage;
