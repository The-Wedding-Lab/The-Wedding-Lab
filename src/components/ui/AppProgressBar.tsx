import { Slider, SliderProps } from "@mui/material";

export interface AppProgressBarProps extends Omit<SliderProps, "color"> {
  color?: "primary" | "secondary" | "highlight" | "natural" | "dark";
}

export default function AppProgressBar({
  color = "primary",
  sx,
  ...rest
}: AppProgressBarProps) {
  const finalSx = [
    {
      cursor: "inherit",
      "& .MuiSlider-thumb": {
        display: "none",
      },
    },

    ...(Array.isArray(sx) ? sx : [sx]),
  ];

  return <Slider color={color} sx={finalSx} {...rest} />;
}
