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
import MapPage from "@/page/map/mapPage";
import NotificationPage from "@/page/notification/NotificationPage";
import { WeddingDataProvider } from "./WeddingDataProvider";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import WeddingCardLoader from "@/components/loading/WeddingCardLoader";

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
  console.log(weddinginfo, "wi");

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

  // 로딩 중일 때 로더 표시
  if (isLoading) {
    return <WeddingCardLoader groomName={groomName} brideName={brideName} />;
  }

  return (
    <Box
      sx={{
        width: "100%",
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
          width: "100%",
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
        <Box>Made by ♥ The Wedding Lab</Box>
        <Box sx={{ mt: 1, fontSize: "12px" }}>wedding.com/card/{domain}</Box>
      </Box>
    </Box>
  );
};

export default WeddingCardView;
