"use client";

import { Button, SxProps, Theme } from "@mui/material";

interface AppButtonProps {
  variant?: "contained" | "outlined" | "text";
  color?: "primary" | "secondary" | "highlight" | "natural" | "dark";
  fontSize?: string;
  borderRadius?: string;
  minHeight?: string;
  children: React.ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

export default function AppButton({
  variant = "contained",
  color = "primary",
  fontSize = "12px",
  borderRadius = "12px",
  minHeight = "48px",
  children,
  fullWidth = false,
  onClick,
  sx,
}: AppButtonProps) {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      fullWidth={fullWidth}
      sx={[
        (theme) => ({
          fontSize: fontSize,
          borderRadius: borderRadius,
          minHeight: minHeight,
          padding: "0 32px",
          "&:hover": {
            backgroundColor:
              variant === "contained"
                ? theme.palette[color]?.main
                : "transparent",
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Button>
  );
}
