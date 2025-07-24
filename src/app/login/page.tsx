"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import loginBg from "../../../public/loginBg-1.png";
import AppButton from "@/components/ui/AppButton";
import AppTextField from "@/components/ui/AppTextField";
import styled from "@emotion/styled";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Button, Divider, IconButton, InputAdornment } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSnackbarStore } from "@/store/useSnackbarStore";
import { useLogin } from "@/hooks/useAuth";

const RepresentativeImage = styled.div`
  height: 250px;
  text-align: center;
  img {
    width: 100%;
    height: 100%;
    display: inline-block;
    margin: 0 auto;
    object-fit: cover;
    object-position: top center;
  }
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Section = styled.section`
  background-color: #fff;
  padding: 18px;
`;

const Email = styled.div`
  margin-bottom: 16px;
`;

const FindPasswordButton = styled.button`
  font-size: 12px;
  color: #0065f8;
  font-weight: bold;
  margin-top: 16px;
  background-color: transparent;
  border: 0;
`;

const AuthActions = styled.div`
  margin: 24px 0 8px 0;
`;

const OAuthLogin = styled.div`
  p {
    font-size: 12px;
    color: #71727a;
    text-align: center;
    margin-bottom: 16px;
  }

  ul {
    display: flex;
    justify-content: center;
    list-style: none;
    li {
      width: 40px;
      height: 40px;
      margin-right: 12px;
      text-align: center;
      &:last-child {
        margin-right: 0;
      }
      button {
        background-color: transparent;
        border: 0;
      }
    }
  }
`;

export default function Login() {
  const [isVisibilityPw, setIsVisibilityPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { showStackSnackbar } = useSnackbarStore();

  // useLogin 훅을 컴포넌트 레벨에서 호출
  const loginMutation = useLogin();

  const handlePasswordSubmit = (e?: React.KeyboardEvent | React.FormEvent) => {
    if (!email.trim() || !password.trim()) {
      showStackSnackbar("이메일과 비밀번호를 입력해주세요.", {
        variant: "error",
      });
      return;
    }

    // mutation 실행
    loginMutation.mutate(
      {
        user_email: email,
        user_pw: password,
      },
      {
        onSuccess: (data) => {
          console.log("로그인 성공", data);

          // 로그인 성공 시 메인 페이지로 이동 (React Native는 자체 네비게이션 처리)
          if (!window.ReactNativeWebView) {
            router.push("/");
          }
        },
      }
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        scrollBehavior: "smooth",
        position: "relative",
        overflowAnchor: "none",
      }}
    >
      <RepresentativeImage>
        <Image
          src={loginBg}
          alt="이미지 예시"
          width={300}
          height={250}
          style={{ objectFit: "cover" }}
        />
      </RepresentativeImage>
      <Section>
        <Title>로그인</Title>
        <Email>
          <AppTextField
            name="email"
            placeholder="이메일"
            fullWidth
            labelText="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            inputMode="email"
            enterKeyHint="next"
          />
        </Email>

        <AppTextField
          name="password"
          placeholder="비밀번호"
          fullWidth
          labelText="비밀번호"
          type={isVisibilityPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit(e)}
          required
          enterKeyHint="done"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="비밀번호 보기/숨기기"
                    onClick={() => setIsVisibilityPw((v) => !v)}
                  >
                    {isVisibilityPw ? (
                      <VisibilityIcon color="disabled" fontSize="small" />
                    ) : (
                      <VisibilityOffIcon color="disabled" fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <AuthActions>
          <AppButton
            color="highlight"
            variant="contained"
            fullWidth
            onClick={() => handlePasswordSubmit()}
            disabled={
              !email.trim() || !password.trim() || loginMutation.isPending
            }
          >
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </AppButton>
          <AppButton
            color="highlight"
            variant="text"
            fullWidth
            onClick={() => router.push("/signup")}
          >
            회원가입
          </AppButton>
        </AuthActions>
        <Divider
          sx={{
            mb: 2,
          }}
        />
        <OAuthLogin>
          <p>SNS 간편 로그인</p>
          <ul>
            <li aria-label="네이버 로그인">
              <button>
                <Image
                  src="/naver.png"
                  alt="네이버 로그인"
                  width={40}
                  height={40}
                />
              </button>
            </li>
            <li aria-label="카카오 로그인">
              <button>
                <Image
                  src="/kakao.png"
                  alt="카카오 로그인"
                  width={40}
                  height={40}
                />
              </button>
            </li>
            <li aria-label="구글 로그인">
              <button>
                <Image
                  src="/google.png"
                  alt="구글 로그인"
                  width={40}
                  height={40}
                />
              </button>
            </li>
          </ul>
        </OAuthLogin>
      </Section>
    </main>
  );
}
