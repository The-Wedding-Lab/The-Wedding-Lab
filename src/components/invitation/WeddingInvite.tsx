"use client"; // Next.js App Router일 경우 필요

import { Box, Typography, Avatar, Divider } from "@mui/material";

const DEFAULT_IMAGE = "/ending-img.jpg";

export default function WeddingInvite() {
  // 실제 데이터가 있다면 props로 받아서 처리 가능
  const groom = "이철수";
  const bride = "김영희";
  const groomParents = "이아빠 · 홍엄마의 아들";
  const brideParents = "김아빠 · 최엄마의 딸";
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
        {/* 구분선 */}
        <Divider sx={{ width: "100%", my: 3, borderColor: "#e0e0e0" }} />
        {/* 이름 부분 */}
        <Box
          sx={{
            color: "#111",
            fontWeight: 700,
            fontSize: "1.35rem",
            textAlign: "center",
            letterSpacing: "0.04em",
            lineHeight: 1.8,
            mt: 1,
            mb: 1,
          }}
        >
          <Box sx={{ mb: 1.5 }}>
            <span
              style={{
                fontWeight: 400,
                color: "#666",
                fontSize: "1.05rem",
                letterSpacing: "0.01em",
              }}
            >
              {groomParents}
            </span>
            <span
              style={{
                marginLeft: 12,
                fontWeight: 700,
                color: "#111",
                fontSize: "1.35rem",
              }}
            >
              {groom}
            </span>
          </Box>
          <Box>
            <span
              style={{
                fontWeight: 400,
                color: "#666",
                fontSize: "1.05rem",
                letterSpacing: "0.01em",
              }}
            >
              {brideParents}
            </span>
            <span
              style={{
                marginLeft: 12,
                fontWeight: 700,
                color: "#111",
                fontSize: "1.35rem",
              }}
            >
              {bride}
            </span>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
