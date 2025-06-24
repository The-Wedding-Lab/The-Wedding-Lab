import { InputAdornment, SxProps, TextField } from "@mui/material";

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sx?: SxProps;
}

export default function AppTextField({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  success,
  error,
  helperText,
  fullWidth,
  startIcon,
  endIcon,
  sx,
}: InputProps) {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      sx={{
        ...sx,
        ...(success && {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1adb00",
          },
        }),
      }}
      slotProps={{
        input: {
          sx: {
            borderRadius: "12px",
            ...(disabled && {
              backgroundColor: "#f0f0f0",
            }),
          },
          startAdornment: startIcon && (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ),
          endAdornment: endIcon && (
            <InputAdornment position="end">{endIcon}</InputAdornment>
          ),
        },
      }}
    />
  );
}
