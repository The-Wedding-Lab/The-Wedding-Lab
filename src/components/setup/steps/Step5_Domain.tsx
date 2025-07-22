import AppButton from "@/components/ui/AppButton";
import AppTextField from "@/components/ui/AppTextField";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import {
  Check,
  CheckBoxRounded,
  CheckCircle,
  CheckRounded,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSnackbarStore } from "@/store/useSnackbarStore";

interface StepProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const Step5_Domain = ({ data, setData }: StepProps) => {
  const [myDomain, setMyDomain] = useState("");
  const [myDomainError, setMyDomainError] = useState(""); // 에러 메세지
  const [isDomainChecked, setIsDomainChecked] = useState(false); // 중복 체크 여부
  const [isCheckingDomain, setIsCheckingDomain] = useState(false); // 중복 확인 로딩
  const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지
  const { setupData, actions } = useWeddingDataStore();
  const { showStackSnackbar } = useSnackbarStore();

  // 유효성 상태를 스토어에 업데이트
  useEffect(() => {
    setData({ step5Valid: isDomainChecked && !myDomainError });
  }, [myDomain, isDomainChecked, myDomainError, setData]);

  // 도메인을 스토어에 저장
  useEffect(() => {
    if (isDomainChecked && myDomain) {
      actions.setWeddingDomain(myDomain);
    }
  }, [isDomainChecked, myDomain, actions]);

  // 도메인 중복 확인 API 호출
  const checkDomainAvailability = async () => {
    if (!myDomain) {
      setMyDomainError("도메인을 입력해주세요.");
      return;
    }

    setIsCheckingDomain(true);
    setMyDomainError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `/api/wedding?domain=${encodeURIComponent(myDomain)}`
      );
      const result = await response.json();

      if (response.ok && result.available) {
        setIsDomainChecked(true);
        actions.setDomainCheck(true);
        setSuccessMessage(result.message);
        showStackSnackbar("도메인 사용이 가능합니다!", { variant: "success" });
      } else {
        setIsDomainChecked(false);
        actions.setDomainCheck(false);
        setMyDomainError(
          result.error ||
            result.message ||
            "도메인 확인 중 오류가 발생했습니다."
        );
        showStackSnackbar(result.error || "이미 사용중인 도메인입니다.", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("도메인 확인 오류:", error);
      setIsDomainChecked(false);
      actions.setDomainCheck(false);
      setMyDomainError("네트워크 오류가 발생했습니다.");
      showStackSnackbar("네트워크 오류가 발생했습니다.", { variant: "error" });
    } finally {
      setIsCheckingDomain(false);
    }
  };

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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <AppTextField
                id="domain-input"
                fullWidth
                value={myDomain}
                error={!!myDomainError}
                helperText={myDomainError}
                sx={{
                  width: "100%",
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
                  const validChars = /^[a-zA-Z0-9]*$/;
                  if (!validChars.test(value)) {
                    setMyDomainError("영어, 숫자만 입력 가능합니다.");
                  } else if (value.length > 10) {
                    setMyDomainError("10자 이하로 입력해주세요.");
                  } else {
                    setMyDomainError("");
                    setMyDomain(value);
                    setIsDomainChecked(false);
                    actions.setDomainCheck(false);
                    setSuccessMessage("");
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {isCheckingDomain ? (
                          <CircularProgress size={20} />
                        ) : (
                          <CheckCircle
                            color={isDomainChecked ? "primary" : "disabled"}
                          />
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Box>
            <AppButton
              variant="outlined"
              disabled={isCheckingDomain || !myDomain}
              sx={{
                height: "56px",
                width: "100px",
                minWidth: "100px",
                maxWidth: "100px",
                paddingX: "8px",
                flexShrink: 0,
              }}
              onClick={checkDomainAvailability}
            >
              {isCheckingDomain ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                "중복확인"
              )}
            </AppButton>
          </Box>
          <Typography fontSize={14} color="#b1b1b1" pl={1}>
            https://wedding.com/card/{myDomain}
          </Typography>

          {/* 도메인 사용 가능 상태 표시 */}
          {isDomainChecked && myDomain && successMessage && (
            <Box
              sx={{
                backgroundColor: "#f0f9ff",
                border: "1px solid #0ea5e9",
                borderRadius: "8px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CheckCircle sx={{ color: "#0ea5e9", fontSize: "20px" }} />
              <Typography fontSize={14} color="#0369a1" fontWeight={500}>
                {successMessage}
              </Typography>
            </Box>
          )}

          {/* 도메인 가이드 텍스트 */}
          <Box
            sx={{
              backgroundColor: "#f8fafc",
              borderRadius: "8px",
              padding: "12px 16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography fontSize={13} color="#64748b" mb={1} fontWeight={600}>
              도메인 설정
            </Typography>
            <Typography fontSize={12} color="#64748b" lineHeight={1.4}>
              • 나만의 도메인을 만들어보세요.
              <br />• 영어, 숫자 조합으로 10자 이하로 사용 가능합니다.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Step5_Domain;
