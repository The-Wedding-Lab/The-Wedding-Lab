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
  CircularProgress,
} from "@mui/material";
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import Step1_WeddingInfo from "@/components/setup/steps/Step1_WeddingInfo";
import Step2_AIPrompt from "@/components/setup/steps/Step2_AIPrompt";
import Step3_EditTemplate from "@/components/setup/steps/Step3_EditTemplate";
import Step4_Preview from "@/components/setup/steps/Step4_Preview";
import Step5_Domain from "@/components/setup/steps/Step5_Domain";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import AppProgressBar from "@/components/ui/AppProgressBar";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import axios from "axios";
import WeddingCardLoader from "@/components/loading/WeddingCardLoader";
import { GlobalLoading } from "@/components/loading/GlobalLoading";

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollToPlugin);

const SetupPage = () => {
  const { step, setupData, domainCheck, actions, isLoading } =
    useWeddingDataStore();
  const { setTypeAndStart, nextStep, prevStep, setSetupData } =
    useWeddingDataStore((state) => state.actions);
  const { showStackSnackbar } = useSnackbarStore();
  const { user } = useUserStore();
  const shouldScrollRef = useRef(false);
  const stepContainerRef = useRef<HTMLDivElement>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const TOTAL_STEPS = setupData.type === "ai" ? 5 : 4;
  const progressValue = step >= 0 ? ((step + 1) / TOTAL_STEPS) * 100 : 0;

  // GSAP 스크롤 애니메이션
  const executeScrollToTop = () => {
    // 기존 스크롤 애니메이션 모두 중지
    gsap.killTweensOf(window);
    gsap.killTweensOf(document.documentElement);
    gsap.killTweensOf(document.body);

    // 모바일 환경 감지
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;

    if (isMobile) {
      // 모바일: 간단하고 부드러운 스크롤
      gsap.to(window, {
        duration: 0.5,
        scrollTo: { y: 0 },
        ease: "power1.out",
        overwrite: true,
      });
    } else {
      // 데스크톱: 더 부드러운 이징
      gsap.to(window, {
        duration: 0.7,
        scrollTo: { y: 0 },
        ease: "power1.inOut",
        overwrite: true,
      });
    }
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

        // 스크롤 중에는 컨텐츠를 숨김
        gsap.set(stepContainerRef.current, { opacity: 0, y: 20 });

        // 스크롤 완료 후 페이드인
        gsap.to(stepContainerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power1.out",
          delay: 0.3, // 스크롤 완료를 기다림
        });
      } else {
        // 스크롤 없이 바로 페이드인
        gsap.fromTo(
          stepContainerRef.current,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power1.out",
          }
        );
      }
    }
  }, [step]);

  const scrollToTop = () => {
    shouldScrollRef.current = true;
  };

  // 초기화 확인 다이얼로그 핸들러
  const handlePrevClick = () => {
    actions.setDomainCheck(false);
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

  const handleCreate = async () => {
    // 도메인 검증 확인
    if (!setupData.weddingInfo?.domain) {
      showStackSnackbar("먼저 도메인 중복 확인을 해주세요.", {
        variant: "info",
      });
      return;
    }

    setIsCreating(true);
    setLoading(true);

    try {
      const response = await axios.post("/api/wedding", {
        domain: setupData.weddingInfo.domain,
        userId: user?.id,
        weddingInfo: setupData.weddingInfo,
      });

      const result = response.data;

      if (response.status === 201 && result.success) {
        showStackSnackbar("모바일 청첩장이 성공적으로 생성되었습니다!", {
          variant: "success",
        });
        router.push(`/result/${result.domain}`);
      } else {
        showStackSnackbar(result.error || "저장 중 오류가 발생했습니다.", {
          variant: "error",
        });
      }
    } catch (error: any) {
      console.error("웨딩 데이터 저장 오류:", error);
      showStackSnackbar(
        error.response?.data?.error || "네트워크 오류가 발생했습니다.",
        { variant: "error" }
      );
    } finally {
      setIsCreating(false);
      setLoading(false);
    }
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
            subTitle="AI 기반 청첩장 생성 서비스"
            description={`프롬프트를 직접 입력해서\n빠르고, 간편하게 만들어보세요!`}
            imageUrl="/ai.webp"
            onClick={() => setTypeAndStart("ai")}
            recommended
          />
          <CardButton
            title="템플릿 직접 꾸미기"
            subTitle="A to Z 나만의 청첩장 만들기"
            description={`AI 도움 없이 하나부터 열 까지\n원하는 대로 직접 만들고 싶어요!`}
            imageUrl="/template.avif"
            onClick={() => setTypeAndStart("template")}
          />
        </Box>
      </Box>
    );
  }

  // 각 단계별 화면
  return (
    <>
      {(isCreating || loading) && <GlobalLoading />}
      <Box
        sx={{
          p:
            setupData.type === "ai" && step === 3
              ? 0
              : setupData.type === "template" && step === 2
              ? 0
              : 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          mb={2}
          p={
            setupData.type === "ai" && step === 3
              ? 3
              : setupData.type === "template" && step === 2
              ? 3
              : 0
          }
          pb={0}
        >
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
          p={
            setupData.type === "ai" && step === 3
              ? 3
              : setupData.type === "template" && step === 2
              ? 3
              : 0
          }
        >
          <AppButton
            variant="outlined"
            color="natural"
            fullWidth
            onClick={handlePrevClick}
            loading={isLoading}
          >
            {step === 0 ? "처음으로" : "이전"}
          </AppButton>
          <AppButton
            variant="contained"
            color="highlight"
            fullWidth
            disabled={
              (step === 0 && !setupData.step1Valid) ||
              (step === 4 && !setupData.step5Valid) ||
              isCreating ||
              (setupData.type === "ai" && step === 4 && !domainCheck) ||
              (setupData.type === "template" && step === 3 && !domainCheck)
            }
            loading={isLoading}
            onClick={() => {
              if (step === TOTAL_STEPS - 1) {
                handleCreate();
              } else {
                scrollToTop();
                nextStep();
              }
            }}
          >
            {step === TOTAL_STEPS - 1
              ? isCreating
                ? "생성 중..."
                : "생성하기"
              : "다음"}
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
    </>
  );
};

export default SetupPage;
