import { Box, Button, Card, Typography } from "@mui/material";
import React from "react";

const CardButton = ({
  title,
  subTitle,
  description,
  imageUrl,
  onClick,
  recommended,
}: {
  title: string;
  subTitle: string;
  description: string;
  imageUrl: string;
  onClick: () => void;
  recommended?: boolean;
}) => {
  return (
    <Card
      sx={{
        position: "relative",
        borderRadius: "20px",
        overflow: "hidden",
        height: "350px",
        width: "100%",
        maxWidth: "280px",
        mx: "auto",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        transformStyle: "preserve-3d",
        boxShadow: "0 8px 32px rgba(0, 111, 253, 0.15)",
        background: "linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)",
        border: "1px solid rgba(0, 111, 253, 0.1)",
        "&:hover": {
          transform:
            "perspective(1000px) rotateX(-5deg) rotateY(5deg) translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0, 111, 253, 0.25)",
        },
        "&:active": {
          transform:
            "perspective(1000px) rotateX(-2deg) rotateY(2deg) translateY(-4px)",
          transition: "all 0.1s ease",
        },
        // 모바일 터치 최적화
        "@media (hover: none)": {
          "&:hover": {
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
            boxShadow: "0 8px 32px rgba(0, 111, 253, 0.15)",
          },
          "&:active": {
            transform:
              "perspective(1000px) rotateX(-3deg) rotateY(3deg) translateY(-6px)",
            boxShadow: "0 15px 35px rgba(0, 111, 253, 0.2)",
          },
        },
      }}
      onClick={onClick}
    >
      {/* 추천 배지 */}
      {recommended && (
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
            fontSize: "11px",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #006FFD 0%, #0056CC 100%)",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "20px",
            boxShadow: "0 4px 12px rgba(0, 111, 253, 0.3)",
            transform: "translateZ(20px)",
          }}
        >
          추천
        </Box>
      )}

      {/* 이미지 영역 */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "150px",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          transform: "translateZ(10px)",
          // "&::before": {
          //   content: '""',
          //   position: "absolute",
          //   top: 0,
          //   left: 0,
          //   right: 0,
          //   bottom: 0,
          //   background:
          //     "linear-gradient(180deg, transparent 0%, rgba(0, 111, 253, 0.05) 100%)",
          // },
        }}
      />

      {/* 글라스모피즘 구분선 */}
      <Box
        sx={{
          position: "absolute",
          top: "45%",
          left: "10%",
          right: "10%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0, 111, 253, 0.3) 50%, transparent 100%)",
          transform: "translateZ(15px)",
        }}
      />

      {/* 콘텐츠 영역 */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "55%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "20px",
          background:
            "linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 251, 255, 0.9) 100%)",
          backdropFilter: "blur(10px)",
          transform: "translateZ(5px)",
        }}
      >
        {/* 텍스트 영역 */}
        <Box sx={{ flex: 1 }}>
          <Typography
            fontSize={18}
            fontWeight={700}
            sx={{
              color: "#1a1a1a",
              mb: 1,
              lineHeight: 1.3,
            }}
          >
            {title}
          </Typography>
          <Typography
            fontSize={13}
            fontWeight={500}
            sx={{
              color: "#666",
              mb: 2,
              opacity: 0.8,
            }}
          >
            {subTitle}
          </Typography>
          <Typography
            fontSize={14}
            fontWeight={400}
            sx={{
              color: "#444",
              lineHeight: 1.4,
              whiteSpace: "pre-line",
            }}
          >
            {description}
          </Typography>
        </Box>

        {/* 3D 버튼 */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            height: "48px",
            borderRadius: "14px",
            fontWeight: "bold",
            fontSize: "15px",
            background: "linear-gradient(135deg, #006FFD 0%, #0056CC 100%)",
            boxShadow: "0 6px 20px rgba(0, 111, 253, 0.3)",
            transform: "translateZ(20px)",
            transition: "all 0.2s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #0056CC 0%, #004399 100%)",
              boxShadow: "0 8px 25px rgba(0, 111, 253, 0.4)",
              transform: "translateZ(25px)",
            },
            "&:active": {
              transform: "translateZ(15px)",
              boxShadow: "0 4px 15px rgba(0, 111, 253, 0.3)",
            },
            // 모바일 터치 최적화
            "@media (hover: none)": {
              "&:hover": {
                background: "linear-gradient(135deg, #006FFD 0%, #0056CC 100%)",
                transform: "translateZ(20px)",
              },
              "&:active": {
                background: "linear-gradient(135deg, #0056CC 0%, #004399 100%)",
                transform: "translateZ(25px)",
                boxShadow: "0 8px 25px rgba(0, 111, 253, 0.4)",
              },
            },
          }}
        >
          시작하기
        </Button>
      </Box>

      {/* 3D 효과를 위한 추가 그림자 레이어 */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(0, 111, 253, 0.05) 100%)",
          pointerEvents: "none",
          transform: "translateZ(30px)",
        }}
      />
    </Card>
  );
};

export default CardButton;
