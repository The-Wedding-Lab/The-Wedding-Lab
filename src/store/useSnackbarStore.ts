import { AlertColor } from "@mui/material";
import { create } from "zustand";
import { enqueueSnackbar } from "notistack";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
  hideSnackbar: () => void;
  showStackSnackbar: (
    message: string,
    options?: { variant?: AlertColor },
    anchorOrigin?: {
      vertical: "top" | "bottom";
      horizontal: "center" | "left" | "right";
    }
  ) => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: "",
  severity: "info",
  hideSnackbar: () => set({ open: false }),
  showStackSnackbar: (
    message,
    options = {},
    anchorOrigin = { vertical: "top", horizontal: "center" }
  ) => {
    enqueueSnackbar(message, {
      variant: options.variant || "info",
      anchorOrigin: anchorOrigin,
      autoHideDuration: 2000,
    });
  },
}));
