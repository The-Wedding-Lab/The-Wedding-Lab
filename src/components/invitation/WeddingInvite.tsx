"use client"; // Next.js App Router일 경우 필요

import { Box, Typography, Avatar, Divider } from "@mui/material";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";

const DEFAULT_IMAGE = "https://picsum.photos/400/600?random=3";

export default function WeddingInvite() {
  const { setupData } = useWeddingDataStore();
  const introMessage = setupData.weddingInfo.pages.introMessage;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      {/* 내용 */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 770,
          margin: "0 auto",
          background: `linear-gradient(135deg, ${introMessage.backgroundColor} 0%, ${introMessage.backgroundColor2} 100%)`,
          padding: "40px 24px 32px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* 상단 인삿말 */}
        <Typography
          variant="h5"
          sx={{
            color: "#111",
            fontWeight: 700,
            mb: 3,
            letterSpacing: "0.05em",
          }}
        >
          {introMessage.title ? introMessage.title : "제목을 입력해주세요."}
        </Typography>
        {/* 사진 */}
        <Avatar
          variant="rounded"
          src={introMessage.image.url ? introMessage.image.url : DEFAULT_IMAGE}
          alt="결혼 사진"
          sx={{
            width: "100%",
            height: 400,
            mb: 3.5,
            border: "4px solid #fff",
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            objectFit: "cover",
          }}
        />
        {/* 본문 */}
        <Typography
          variant="body1"
          sx={{
            color: "#222",
            fontWeight: 500,
            fontSize: "1.15rem",
            lineHeight: 2.1,
            whiteSpace: "pre-line",
            mb: 4,
          }}
        >
          {introMessage.text ? introMessage.text : "내용을 입력해주세요."}
        </Typography>
      </Box>
    </Box>
  );
}
