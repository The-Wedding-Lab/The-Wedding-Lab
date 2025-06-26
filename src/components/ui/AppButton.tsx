"use client";

import { Button, ButtonProps, styled } from "@mui/material";

export interface AppButtonProps extends Omit<ButtonProps, "color"> {
  color?: "primary" | "secondary" | "highlight" | "natural" | "dark";
}

const StyledButton = styled(Button)<AppButtonProps>(
  ({ theme, variant, color = "primary" }) => ({
    fontSize: "12px",
    borderRadius: "12px",
    minHeight: "48px",
    padding: "0 32px",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor:
        variant === "contained"
          ? theme.palette[
              color as
                | "primary"
                | "secondary"
                | "highlight"
                | "natural"
                | "dark"
            ]?.main
          : "transparent",
    },
  })
);

export default function AppButton(props: AppButtonProps) {
  return <StyledButton {...props} />;
}
