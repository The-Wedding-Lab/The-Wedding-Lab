"use client";

import React, { useEffect, useRef } from "react";
import { Box, Typography, IconButton, Card, CardContent } from "@mui/material";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  Launch as LaunchIcon,
  Share as ShareIcon,
  Add as AddIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import AppButton from "@/components/ui/AppButton";
import { Icon } from "@/page/map/mapPage";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";

interface Step6_ResultProps {
  domain: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
}

const Step6_Result = ({
  domain,
  groomName,
  brideName,
  weddingDate,
}: Step6_ResultProps) => {
  const router = useRouter();
  const { actions } = useWeddingDataStore();
  const { showStackSnackbar } = useSnackbarStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const successIconRef = useRef<HTMLDivElement>(null);

  const weddingUrl = `${window.location.origin}/card/${domain}`;

  useEffect(() => {
    // 성공 아이콘 애니메이션
    if (successIconRef.current) {
      gsap.fromTo(
        successIconRef.current,
        { scale: 0, rotation: 0 },
        {
          scale: 1,
          rotation: 360,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.3,
        }
      );
    }

    // 카드 애니메이션
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          delay: 0.5,
        }
      );
    }
  }, []);

  // 새창으로 도메인 열기
  const handleViewWedding = () => {
    window.open(weddingUrl, "_blank", "noopener,noreferrer");
  };

  // 클립보드 복사
  const handleCopyUrl = async () => {
    try {
      // 최신 브라우저 clipboard API 시도
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(weddingUrl);
        showStackSnackbar("청첩장 링크가 복사되었습니다!", {
          variant: "success",
        });
        return;
      }

      // 폴백: 임시 input 요소를 사용한 복사 (모바일 호환)
      const textArea = document.createElement("input");
      textArea.value = weddingUrl;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);

      textArea.setAttribute("readonly", "");
      textArea.setAttribute("contenteditable", "true");

      // iOS Safari 호환성
      if (navigator.userAgent.match(/ipad|iPhone/i)) {
        textArea.contentEditable = "true";
        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        textArea.setSelectionRange(0, 999999);
      } else {
        textArea.select();
        textArea.setSelectionRange(0, 999999);
      }

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        showStackSnackbar("청첩장 링크가 복사되었습니다!", {
          variant: "success",
        });
      } else {
        throw new Error("복사 실패");
      }
    } catch (error) {
      console.error("복사 에러:", error);
      showStackSnackbar("링크 복사에 실패했습니다", { variant: "error" });
    }
  };

  // 카카오톡 공유
  const handleKakaoShare = () => {
    // 카카오 SDK 로드 확인
    if (typeof window !== "undefined" && (window as any).Kakao) {
      const kakao = (window as any).Kakao;

      if (!kakao.isInitialized()) {
        // 카카오톡 앱키 설정 (실제 앱키로 교체 필요)
        kakao.init(
          process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY || "YOUR_KAKAO_APP_KEY"
        );
      }

      kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `${groomName} ♥ ${brideName}`,
          description: `${groomName}와 ${brideName}의 특별한 날에 초대합니다.`,
          imageUrl: `http://1.234.44.179:3004/og.png`,
          link: {
            mobileWebUrl: weddingUrl,
            webUrl: weddingUrl,
          },
        },
        buttons: [
          {
            title: "청첩장 보기",
            link: {
              mobileWebUrl: weddingUrl,
              webUrl: weddingUrl,
            },
          },
        ],
      });
    } else {
      // 카카오 SDK가 없으면 링크 복사로 대체
      handleCopyUrl();
    }
  };

  // 네이티브 공유 (모바일 전용)
  const handleNativeShare = async () => {
    handleKakaoShare();
  };

  // 새로 만들기
  const handleCreateNew = () => {
    actions.reset();
    router.push("/setup");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #9aabff 0%, #3056ff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        py: 4,
      }}
    >
      {/* 성공 아이콘 */}
      <Box ref={successIconRef} sx={{ mb: 3 }}>
        <CheckIcon
          sx={{
            fontSize: 80,
            color: "#4fff54",
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        />
      </Box>

      {/* 성공 메시지 */}
      <Typography
        variant="h4"
        sx={{
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          mb: 2,
          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        축하합니다!
      </Typography>

      <Typography
        variant="h6"
        sx={{
          color: "rgba(255,255,255,0.9)",
          textAlign: "center",
          mb: 4,
          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        모바일 청첩장이
        <br />
        성공적으로 만들어졌습니다
      </Typography>

      {/* 도메인 카드 */}
      <Card
        ref={cardRef}
        sx={{
          width: "100%",
          maxWidth: 400,
          mb: 4,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <CardContent sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            청첩장 주소
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                width: "100%",
                color: "#667eea",
                fontWeight: "bold",
                wordBreak: "break-all",
                px: 2,
                py: 1,
                backgroundColor: "#ebebeb",
                borderRadius: 1,
                fontSize: "12px",
              }}
            >
              wedding.com/card/{domain}
            </Typography>
            <IconButton
              onClick={handleCopyUrl}
              sx={{
                backgroundColor: "#f8f9fa",
                "&:hover": { backgroundColor: "#e9ecef" },
                width: 48,
                height: 48,
                borderRadius: "12px",
              }}
            >
              <CopyIcon sx={{ color: "#666" }} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      {/* 액션 버튼들 */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* 들어가보기 버튼 */}
        <AppButton
          variant="contained"
          color="highlight"
          size="large"
          startIcon={<LaunchIcon />}
          onClick={handleViewWedding}
          sx={{
            backgroundColor: "#4CAF50",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          청첩장 들어가보기
        </AppButton>

        {/* 공유 버튼들 */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <AppButton
            variant="contained"
            size="large"
            onClick={handleNativeShare}
            startIcon={<Icon src="/kakao.png" alt="카카오톡" style={{}} />}
            sx={{
              flex: 1,
              backgroundColor: "#f7d73e",
              color: "#333",
              fontSize: "14px",
              fontWeight: "500",
              "&:hover": {
                backgroundColor: "#e6c520", // 호버 시에도 동일한 색상 유지
              },
              "&:active": {
                backgroundColor: "#e6c520", // 클릭 시에도 동일한 색상 유지
              },
              "&:focus": {
                backgroundColor: "#e6c520", // 포커스 시에도 동일한 색상 유지
              },
            }}
          >
            공유하기
          </AppButton>
        </Box>

        {/* 새로 만들기 버튼 */}
        <AppButton
          variant="contained"
          color="natural"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
          sx={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#333",
          }}
        >
          새 청첩장 만들기
        </AppButton>
      </Box>
    </Box>
  );
};

export default Step6_Result;
