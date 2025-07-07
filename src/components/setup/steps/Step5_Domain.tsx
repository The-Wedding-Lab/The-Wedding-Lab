import AppButton from "@/components/ui/AppButton";
import AppTextField from "@/components/ui/AppTextField";
import {
  Check,
  CheckBoxRounded,
  CheckCircle,
  CheckRounded,
} from "@mui/icons-material";
import { Box, IconButton, InputAdornment, Typography } from "@mui/material";
import React, { useState } from "react";

interface StepProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const Step5_Domain = ({ data, setData }: StepProps) => {
  const [myDomain, setMyDomain] = useState("");
  const [myDomainError, setMyDomainError] = useState(""); // 에러 메세지
  const [isDomainChecked, setIsDomainChecked] = useState(false); // 중복 체크 여부
  return (
    <Box>
      <Typography fontSize={24} fontWeight={700} gutterBottom>
        모바일 청첩장 생성
      </Typography>

      <Box mt={4}>
        <Typography
          sx={{
            marginBottom: "6px",
            fontSize: "15px",
            fontWeight: 500,
            color: "#333",
          }}
        >
          사용할 도메인
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          <AppTextField
            fullWidth
            value={myDomain}
            error={!!myDomainError}
            helperText={myDomainError}
            sx={{
              ...(isDomainChecked &&
                !myDomainError && {
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "primary.main",
                      borderWidth: "2px",
                    },
                  },
                }),
            }}
            onChange={(e) => {
              const value = e.target.value;
              const validChars = /^[가-힣a-zA-Z0-9]*$/;
              if (!validChars.test(value)) {
                setMyDomainError("한글, 영어, 숫자만 입력 가능합니다.");
              } else if (value.length > 10) {
                setMyDomainError("10자 이하로 입력해주세요.");
              } else {
                setMyDomainError("");
                setMyDomain(value);
                setIsDomainChecked(false);
              }
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <CheckCircle
                      color={isDomainChecked ? "primary" : "disabled"}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
          <AppButton
            variant="outlined"
            sx={{
              height: "56px",
            }}
            onClick={() => {
              setIsDomainChecked(true);
              setMyDomainError("");
            }}
          >
            확인
          </AppButton>
        </Box>
        <Typography fontSize={14} color="#b1b1b1" pl={1}>
          https://wedding.com/{myDomain}
        </Typography>
      </Box>
    </Box>
  );
};

export default Step5_Domain;
