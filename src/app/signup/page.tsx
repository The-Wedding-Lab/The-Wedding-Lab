"use client";

import { useState } from "react";
import AppTextField from "@/components/ui/AppTextField";
import AppButton from "@/components/ui/AppButton";
import styled from "@emotion/styled";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import { useSignup } from "@/hooks/useAuth";

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
`;

const Field = styled.div`
  margin-bottom: 16px;
`;

// const Label = styled.label`
//   display: block;
//   margin-bottom: 6px;
//   font-size: 15px;
//   font-weight: 500;
//   color: #333;
// `;

const BottomText = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const Section = styled.section`
  background-color: #fff;
  padding: 18px;
`;

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [agree, setAgree] = useState(false);

  const { showStackSnackbar } = useSnackbarStore();
  const router = useRouter();

  // useSignup 훅을 컴포넌트 레벨에서 호출
  const signupMutation = useSignup();

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async () => {
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword) {
      showStackSnackbar("모든 필드를 입력해주세요.", { variant: "error" });
      return;
    }
    if (nameError) {
      showStackSnackbar("이름은 2자 이상 입력해주세요.", { variant: "error" });
      return;
    }
    if (emailError) {
      showStackSnackbar("이메일 형식이 올바르지 않습니다.", {
        variant: "error",
      });
      return;
    }
    if (passwordError) {
      showStackSnackbar("비밀번호는 6자 이상 입력해주세요.", {
        variant: "error",
      });
      return;
    }
    if (password !== confirmPassword) {
      showStackSnackbar("비밀번호가 일치하지 않습니다.", { variant: "error" });
      return;
    }

    // mutation 실행
    signupMutation.mutate(
      {
        user_name: name,
        user_email: email,
        user_pw: password,
      },
      {
        onSuccess: () => {
          // 회원가입 성공 시 로그인 페이지로 이동
          router.push("/login");
        },
      }
    );
  };

  return (
    <main
      style={{
        minHeight: "100svh",
        scrollBehavior: "smooth",
        position: "relative",
        overflowAnchor: "none",
      }}
    >
      <Section>
        <Title>회원가입</Title>

        <Field>
          <AppTextField
            labelText="이름"
            placeholder="이름"
            fullWidth
            value={formData.name}
            onChange={handleInputChange("name")}
            onBlur={() => {
              if (formData.name.length < 2) {
                setNameError(true);
              } else {
                setNameError(false);
              }
            }}
            error={nameError}
            helperText={nameError ? "이름은 2자 이상 입력해주세요." : null}
          />
        </Field>
        <Field>
          <AppTextField
            labelText="이메일"
            placeholder="이메일"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange("email")}
            onBlur={() => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(formData.email)) {
                setEmailError(true);
              } else {
                setEmailError(false);
              }
            }}
            error={emailError}
            helperText={emailError ? "이메일 형식이 올바르지 않습니다." : null}
          />
        </Field>
        <Field>
          <AppTextField
            name="password"
            placeholder="비밀번호"
            fullWidth
            labelText="비밀번호"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange("password")}
            onBlur={() => {
              if (formData.password.length < 6) {
                setPasswordError(true);
              } else {
                setPasswordError(false);
              }
            }}
            error={passwordError}
            helperText={
              passwordError ? "비밀번호는 6자 이상 입력해주세요." : null
            }
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="비밀번호 보기/숨기기"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Visibility color="disabled" fontSize="small" />
                      ) : (
                        <VisibilityOff color="disabled" fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Field>
        <Field>
          <AppTextField
            name="password"
            placeholder="비밀번호 확인"
            fullWidth
            labelText="비밀번호 확인"
            type={showPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleInputChange("confirmPassword")}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="비밀번호 보기/숨기기"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Visibility color="disabled" fontSize="small" />
                      ) : (
                        <VisibilityOff color="disabled" fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Field>
        <AppButton
          color="highlight"
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={signupMutation.isPending}
        >
          {signupMutation.isPending ? "회원가입 중..." : "회원가입"}
        </AppButton>
        <BottomText>
          <Typography variant="body2">이미 계정이 있으신가요?</Typography>
          <Button onClick={() => router.push("/login")}>로그인</Button>
        </BottomText>
      </Section>
    </main>
  );
}
