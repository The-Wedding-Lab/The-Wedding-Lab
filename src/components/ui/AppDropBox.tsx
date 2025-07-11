import {
  Box,
  FormControl,
  Select,
  SelectProps,
  Typography,
  styled,
  MenuItem,
  TextField,
} from "@mui/material";
import { forwardRef, useState, useEffect } from "react";

export type AppDropBoxOption = {
  value: string | number;
  label: string;
};

export type AppDropBoxProps = Omit<SelectProps, "value" | "onChange"> & {
  success?: boolean;
  labelText?: string;
  labelTextStyle?: React.CSSProperties;
  options: AppDropBoxOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  allowCustomInput?: boolean;
  customInputPlaceholder?: string;
};

const StyledFormControl = styled(FormControl, {
  shouldForwardProp: (prop) => prop !== "success",
})<{ success?: boolean }>(({ theme, success }) => ({
  width: "100%",
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
    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.success.dark,
    },
  }),
  "& .MuiSelect-select.Mui-disabled": {
    backgroundColor: "#f0f0f0",
    borderRadius: "12px",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
  },
}));

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "success",
})<{ success?: boolean }>(({ theme, success }) => ({
  marginTop: "8px",
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

const CUSTOM_INPUT_VALUE = "__CUSTOM_INPUT__";

const AppDropBox = forwardRef<HTMLInputElement, AppDropBoxProps>(
  (props, ref) => {
    const {
      labelText,
      labelTextStyle,
      options,
      value,
      onChange,
      placeholder,
      success,
      allowCustomInput = false,
      customInputPlaceholder = "직접 입력해주세요",
      ...rest
    } = props;

    // value가 options에 있는지 확인
    const isCustomValue =
      value && !options.some((option) => option.value === value);
    const [showCustomInput, setShowCustomInput] = useState(isCustomValue);
    const [customInputValue, setCustomInputValue] = useState(
      isCustomValue ? String(value || "") : ""
    );

    // value가 변경될 때 상태 업데이트
    useEffect(() => {
      const isCustom =
        value && !options.some((option) => option.value === value);
      setShowCustomInput(isCustom);
      setCustomInputValue(isCustom ? String(value || "") : "");
    }, [value, options]);

    const handleSelectChange = (event: any) => {
      const selectedValue = event.target.value;

      if (selectedValue === CUSTOM_INPUT_VALUE) {
        setShowCustomInput(true);
        setCustomInputValue("");
        // 직접입력 모드로 전환 시에는 onChange를 호출하지 않음
      } else {
        setShowCustomInput(false);
        setCustomInputValue("");
        if (onChange) {
          onChange(selectedValue);
        }
      }
    };

    const handleCustomInputChange = (event: any) => {
      const inputValue = event.target.value;
      setCustomInputValue(inputValue);
      if (onChange) {
        onChange(inputValue);
      }
    };

    // 드롭다운에 표시할 값 결정
    const selectValue = showCustomInput ? CUSTOM_INPUT_VALUE : value || "";

    const allOptions = allowCustomInput
      ? [...options, { value: CUSTOM_INPUT_VALUE, label: "직접입력" }]
      : options;

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
        <StyledFormControl success={success}>
          <Select
            ref={ref}
            value={selectValue}
            onChange={handleSelectChange}
            displayEmpty
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 250,
                },
              },
            }}
            {...rest}
          >
            {placeholder && (
              <MenuItem value="" disabled>
                <Typography sx={{ color: "#777" }}>{placeholder}</Typography>
              </MenuItem>
            )}
            {allOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>

        {showCustomInput && (
          <StyledTextField
            success={success}
            fullWidth
            placeholder={customInputPlaceholder}
            value={customInputValue}
            onChange={handleCustomInputChange}
            variant="outlined"
          />
        )}
      </Box>
    );
  }
);

AppDropBox.displayName = "AppDropBox";

export default AppDropBox;
