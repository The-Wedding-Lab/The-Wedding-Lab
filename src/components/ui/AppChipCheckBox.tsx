import { Chip, ChipProps } from "@mui/material";

export interface AppChipCheckBoxProps
  extends Omit<
    ChipProps,
    "color" | "variant" | "onClick" | "onDelete" | "onChange"
  > {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  color?: "primary" | "secondary" | "highlight" | "natural" | "dark";
}

export default function AppChipCheckBox({
  checked,
  onCheckedChange,
  color = "primary",
  sx,
  ...rest
}: AppChipCheckBoxProps) {
  return (
    <Chip
      {...rest}
      color={color}
      variant={checked ? "filled" : "outlined"}
      onClick={() => onCheckedChange(!checked)}
      sx={[
        {
          ...(!checked && {
            "&:hover": {
              backgroundColor: "transparent",
            },
          }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
