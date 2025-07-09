import {
  Box,
  TextField,
  TextFieldProps,
  Typography,
  styled,
} from "@mui/material";
import { forwardRef } from "react";

export type AppTextFieldProps = TextFieldProps & {
  success?: boolean;
  labelText?: string;
  labelTextStyle?: React.CSSProperties;
};

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "success",
})<AppTextFieldProps>(({ theme, success }) => ({
  ...(success && {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.palette.success.main,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.success.dark,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.success.dark,
      },
    },
    "& label.Mui-focused": {
      color: theme.palette.success.dark,
    },
  }),
  "& .MuiInputBase-input.Mui-disabled": {
    backgroundColor: "#f0f0f0",
    borderRadius: "12px",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
  },
}));

const AppTextField = forwardRef<HTMLInputElement, AppTextFieldProps>(
  (props, ref) => {
    const { labelText, labelTextStyle, ...rest } = props;

    return (
      <Box>
        {labelText && (
          <Typography
            sx={{
              marginBottom: "6px",
              fontSize: "15px",
              fontWeight: 500,
              color: "#333",
              ...labelTextStyle,
            }}
          >
            {labelText}
          </Typography>
        )}
        <StyledTextField inputRef={ref} {...rest} />
      </Box>
    );
  }
);

AppTextField.displayName = "AppTextField";

export default AppTextField;
