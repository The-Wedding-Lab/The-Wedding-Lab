import { Box } from "@mui/material";
import { CircularProgress } from "@mui/material";
import React from "react";

export const GlobalLoading = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
      }}
    >
      <CircularProgress size={50} />
    </Box>
  );
};
