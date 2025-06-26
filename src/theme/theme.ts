import { createTheme } from "@mui/material/styles";

// 커스텀 색상 팔레트 정의
declare module "@mui/material/styles" {
  interface Palette {
    highlight: Palette["primary"];
    natural: Palette["primary"];
    dark: Palette["primary"];
  }

  interface PaletteOptions {
    highlight?: PaletteOptions["primary"];
    natural?: PaletteOptions["primary"];
    dark?: PaletteOptions["primary"];
  }
}

// 버튼 variant 확장
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    highlight: true;
    natural: true;
    dark: true;
  }
}

// 슬라이더 color 확장
declare module "@mui/material/Slider" {
  interface SliderPropsColorOverrides {
    highlight: true;
    natural: true;
    dark: true;
  }
}

// LinearProgress color 확장
declare module "@mui/material/LinearProgress" {
  interface LinearProgressPropsColorOverrides {
    highlight: true;
    natural: true;
    dark: true;
  }
}

// 칩(Chip) color 확장
declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    highlight: true;
    natural: true;
    dark: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#dc004e",
      light: "#ff5983",
      dark: "#9a0036",
      contrastText: "#ffffff",
    },
    // 커스텀 하이라이트 색상
    highlight: {
      main: "#0065F8",
      light: "#00CAFF",
      dark: "#4300FF",
      contrastText: "#ffffff",
    },
    // 커스텀 네츄럴 색상
    natural: {
      main: "#D4D6DD",
      light: "#E8E9F1",
      dark: "#C5C6CC",
      contrastText: "#000000",
    },
    dark: {
      main: "#2F3036",
      light: "#494A50",
      dark: "#1F2024",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
});

export default theme;
