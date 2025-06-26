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
    <Box
      sx={{
        border: "1px solid transparent",
        borderRadius: "16px",
        overflow: "hidden",
        height: "40vh",
        width: "60vw",
        mx: "auto",
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          width: "100%",
          height: "40%",
          backgroundColor: "#ddeaff",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {recommended && (
          <Box
            sx={{
              position: "relative",
              float: "right",
              top: 10,
              right: 10,
              fontSize: "10px",
              fontWeight: "bold",
              backgroundColor: "#006FFD",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "20px",
              width: "fit-content",
            }}
          >
            추천
          </Box>
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "60%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          backgroundColor: "#f0f4ff",
          p: 2,
        }}
      >
        <Typography fontSize={16} fontWeight={700}>
          {title}
        </Typography>
        <Typography fontSize={12} fontWeight={500} color="#888888">
          {subTitle}
        </Typography>
        <Typography fontSize={14} fontWeight={500} mt={2}>
          {description}
        </Typography>
        <Button
          variant="outlined"
          color="highlight"
          fullWidth
          sx={{
            mt: 2,
            border: "2px solid #006FFD",
            borderRadius: "12px",
            height: "40px",
            fontWeight: "bold",
          }}
        >
          시작하기
        </Button>
      </Box>
    </Box>
  );
};

export default CardButton;
