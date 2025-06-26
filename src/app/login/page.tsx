"use client";

import Image from "next/image";
import exampleImg from "../../../public/imageExample.jpg";
import AppButton from "@/components/ui/AppButton";
import AppTextField from "@/components/ui/AppTextField";
import styled from "@emotion/styled";

import visibilityIcon from "../../../public/visibility.png";

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
`;

const Section = styled.section`
  background-color: #fff;
  padding: 40px 24px;
`;

const Email = styled.div`
  margin-bottom: 16px;
`;

const Password = styled.div`
  position: relative;
  button {
    position: absolute;
    top: 50%;
    right: 14px;
    margin-top: -8px;
    background-color: transparent;
  }
`;

const FindPasswordButton = styled.button`
  font-size: 12px;
  color: #0065f8;
  font-weight: bold;
  margin-top: 16px;
`;

const AuthActions = styled.div`
  margin: 24px 0 8px 0;
`;

const OAuthLogin = styled.div`
  padding-top: 24px;
  border-top: 1px solid #d4d6dd;
  p {
    font-size: 12px;
    color: #71727a;
    text-align: center;
    margin-bottom: 16px;
  }

  ul {
    display: flex;
    justify-content: center;
    li {
      width: 40px;
      height: 40px;
      margin-right: 12px;
      text-align: center;
      /* background-color: azure; */
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

export default function Login() {
  return (
    <main>
      <div>
        <Image src={exampleImg} alt="이미지 예시" width={500} height={500} />
      </div>
      <Section>
        <Title>Login</Title>
        <form action="#">
          <Email>
            <label htmlFor="email" className="sr-only">
              이메일 주소
            </label>
            <AppTextField placeholder="Email Address" fullWidth />
          </Email>
          <Password>
            <label htmlFor="password" className="sr-only">
              비밀번호
            </label>
            <AppTextField placeholder="Password" fullWidth />
            <button type="button">
              <Image
                src={visibilityIcon}
                alt="비밀번호 가리기"
                width={16}
                height={16}
              />
            </button>
          </Password>
        </form>
        <FindPasswordButton type="button">비밀번호 찾기</FindPasswordButton>
        <AuthActions>
          <AppButton color="highlight" variant="contained" fullWidth>
            로그인
          </AppButton>
          <AppButton color="highlight" variant="text" fullWidth>
            회원가입
          </AppButton>
        </AuthActions>
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
