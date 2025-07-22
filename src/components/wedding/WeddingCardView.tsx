"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { InvitationEnding } from "@/components/ending/InvitationEnding";
import { ParentsInfo } from "@/components/family/ParentsInfo";
import GridGallery from "@/components/gallery/GridGallery";
import StackedGallery from "@/components/gallery/StackedGallery";
import SwipeGallery from "@/components/gallery/SwipeGallery";
import { InvitationCover } from "@/components/main/InvitationCover";
import AccountPage from "@/page/account/AccountPage";
import EndingPage from "@/page/ending/EndingPage";
import InvitationPage from "@/page/invitation/InvitationPage";
import MapPage, { Icon } from "@/page/map/mapPage";
import NotificationPage from "@/page/notification/NotificationPage";
import { WeddingDataProvider } from "./WeddingDataProvider";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import WeddingCardLoader from "@/components/loading/WeddingCardLoader";
import AppButton from "../ui/AppButton";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import ClientLayout from "@/app/ClientLayout";

interface WeddingCardViewProps {
  weddinginfo: any;
  domain: string;
  weddingId: string;
}

const WeddingCardView = ({
  weddinginfo,
  domain,
  weddingId,
}: WeddingCardViewProps) => {
  const [enabledPages, setEnabledPages] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const { actions } = useWeddingDataStore();
  const { showStackSnackbar } = useSnackbarStore();

  // weddinginfo를 스토어에 설정 (useEffect 사용)
  useEffect(() => {
    if (weddinginfo) {
      actions.setWeddingInfo({ ...weddinginfo });
    }
  }, [weddinginfo, actions]);

  useEffect(() => {
    const pages = weddinginfo?.pages;
    if (pages) {
      const allEnabledPages = Object.entries(pages)
        .filter(([key, value]: [string, any]) => value?.enabled === true)
        .sort(
          ([, a], [, b]) => ((a as any)?.order || 0) - ((b as any)?.order || 0)
        ) // order 순서대로 정렬
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as any);

      setEnabledPages(allEnabledPages);
    }
  }, [weddinginfo?.pages]);

  // 로딩 완료 처리
  useEffect(() => {
    if (weddinginfo && Object.keys(enabledPages).length > 0) {
      // 모든 데이터가 준비되면 2초 후에 로딩 완료
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [weddinginfo, enabledPages]);

  const gallery = weddinginfo?.pages?.gallery;
  const groomName = weddinginfo?.groom?.name || "신랑";
  const brideName = weddinginfo?.bride?.name || "신부";
  const weddingUrl = `${window.location.origin}/card/${domain}`;

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

  // 로딩 중일 때 로더 표시
  if (isLoading) {
    return <WeddingCardLoader groomName={groomName} brideName={brideName} />;
  }

  return (
    <ClientLayout>
      <Box
        sx={{
          width: "100dvw",
          minHeight: "100vh",
          backgroundColor: "#fff",
          opacity: 0,
          animation: "fadeIn 1s ease-in-out forwards",
          "@keyframes fadeIn": {
            "0%": {
              opacity: 0,
              transform: "translateY(20px)",
            },
            "100%": {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
        }}
      >
        {/* 웨딩 카드 컨텐츠 */}
        <Box
          sx={{
            width: "100dvw",
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {Object.keys(enabledPages).map((page, index) => (
            <Box
              key={`${page}-${index}`}
              sx={{
                width: "100dvw",
                opacity: 0,
                animation: `slideIn 0.8s ease-out forwards`,
                animationDelay: `${index * 0.2}s`,
                "@keyframes slideIn": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(30px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              {page === "coverDesign" && <InvitationCover />}
              {page === "calendar" && <NotificationPage />}
              {page === "introMessage" && <InvitationPage />}
              {page === "familyInfo" && <ParentsInfo />}
              {page === "gallery" && (
                <>
                  {gallery?.displayType === "stacked" && (
                    <StackedGallery images={gallery.images} />
                  )}
                  {gallery?.displayType === "scroll" && (
                    <SwipeGallery images={gallery.images} />
                  )}
                  {gallery?.displayType === "grid" && (
                    <GridGallery images={gallery.images} />
                  )}
                </>
              )}
              {page === "mapDirections" && <MapPage />}
              {page === "accountInfo" && <AccountPage />}
              {page === "endingMessage" && <InvitationEnding />}
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            px: 2,
            backgroundColor: "#f8f9fa",
            color: "#6c757d",
            fontSize: "14px",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <AppButton
              variant="contained"
              size="large"
              onClick={handleKakaoShare}
              startIcon={<Icon src="/kakao.png" alt="카카오톡" style={{}} />}
              disableRipple
              disableFocusRipple
              sx={{
                flex: 1,
                backgroundColor: "#f7d73e",
                color: "#333",
                fontSize: "14px",
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

          <Box>Made by ♥ 모청 :: 모두의 청첩장</Box>
          <Box sx={{ mt: 1, fontSize: "12px" }}>wedding.com/card/{domain}</Box>
        </Box>
      </Box>
    </ClientLayout>
  );
};

export default WeddingCardView;
