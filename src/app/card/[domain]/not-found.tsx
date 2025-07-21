import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100svh",
        textAlign: "center",
        px: 3,
        backgroundColor: "#f8f9fa",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: "4rem",
            fontWeight: "bold",
            color: "#6c757d",
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#495057",
            mb: 2,
          }}
        >
          청첩장을 찾을 수 없습니다
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1rem",
            color: "#6c757d",
            maxWidth: "400px",
            lineHeight: 1.6,
          }}
        >
          요청하신 청첩장이 존재하지 않거나 삭제되었을 수 있습니다.
          <br />
          도메인을 다시 확인해 주세요.
        </Typography>
      </Box>

      <Box sx={{ mt: 6, opacity: 0.6 }}>
        <Typography variant="body2" color="text.secondary">
          The Wedding Lab
        </Typography>
      </Box>
    </Box>
  );
}
