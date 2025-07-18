"use client"; // Next.js App Router일 경우 필요

import { Box, Typography, Avatar, Divider } from "@mui/material";

const DEFAULT_IMAGE = "/ending-img.jpg";

export default function WeddingInvite() {
  const message = `서로에게 가장 편안한 사람이 되어\n함께 살아가기로 했습니다.\n새롭게 시작하는\n저희 두 사람의 앞날을\n함께 축복해주시면\n더없이 감사하겠습니다.`;

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily: "Nanum Myeongjo, serif",
        padding: "32px 0",
        boxSizing: "border-box",
      }}
    >
      {/* 내용 */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 770,
          margin: "0 auto",
          background: "rgba(255,255,255,0.95)",
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
          신랑 신부 결혼합니다.
        </Typography>
        {/* 사진 */}
        <Avatar
          variant="rounded"
          src={DEFAULT_IMAGE}
          alt="결혼 사진"
          sx={{
            width: "100%",
            height: 200,
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
          {message}
        </Typography>
      </Box>
    </Box>
  );
}
