"use client";

import { useState } from "react";
import AppTextField from "@/components/ui/AppTextField";
import AppButton from "@/components/ui/AppButton";
import styled from "@emotion/styled";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 24px;
`;

// const Section = styled.section`
//   background-color: #fff;
//   padding: 40px 24px;
//   max-width: 400px;
//   margin: 40px auto;
//   border-radius: 16px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
// `;

const Field = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-size: 15px;
  font-weight: 500;
  color: #333;
`;

const BottomText = styled.div`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #666;
`;

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: 회원가입 처리 로직
    console.log("회원가입 데이터:", formData, "약관동의:", agree);
  };

  return (
    <main>
      <section>
        <Title>회원가입</Title>
        <form onSubmit={handleSubmit}>
          <Field>
            <Label htmlFor="signup-name">Name</Label>
            <AppTextField
              id="signup-name"
              placeholder="이름"
              fullWidth
              value={formData.name}
              onChange={handleInputChange("name")}
              required
            />
          </Field>
          <Field>
            <Label htmlFor="signup-email">Email Address</Label>
            <AppTextField
              id="signup-email"
              placeholder="name@email.com"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleInputChange("email")}
              required
            />
          </Field>
          <Field>
            <Label htmlFor="signup-password">Password</Label>
            <AppTextField
              id="signup-password"
              placeholder="비밀번호"
              type={showPassword ? "text" : "password"}
              fullWidth
              value={formData.password}
              onChange={handleInputChange("password")}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="비밀번호 보기/숨기기"
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Field>
          <Field>
            <AppTextField
              id="signup-confirm-password"
              placeholder="비밀번호 확인"
              type={showConfirm ? "text" : "password"}
              fullWidth
              value={formData.confirmPassword}
              onChange={handleInputChange("confirmPassword")}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="비밀번호 확인 보기/숨기기"
                      onClick={() => setShowConfirm((v) => !v)}
                      edge="end"
                      tabIndex={-1}
                    >
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Field>
          <FormControlLabel
            control={
              <Checkbox
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                color="primary"
              />
            }
            label="이용약관 및 개인정보 수집에 동의합니다."
            sx={{ mb: 2 }}
          />
          <AppButton
            color="highlight"
            variant="contained"
            fullWidth
            type="submit"
          >
            회원가입
          </AppButton>
        </form>
        <BottomText>
          이미 계정이 있으신가요?{" "}
          <a
            href="/login"
            style={{ color: "#1976d2", textDecoration: "underline" }}
          >
            로그인
          </a>
        </BottomText>
      </section>
    </main>
  );
}
