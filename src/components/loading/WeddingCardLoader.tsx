"use client";

import React, { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { gsap } from "gsap";
import styled from "@emotion/styled";

const LoaderContainer = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100svh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
`;

const HeartContainer = styled(Box)`
  position: relative;
  margin-bottom: 40px;
`;

const Heart = styled(Box)`
  width: 60px;
  height: 54px;
  position: relative;

  &:before,
  &:after {
    content: "";
    width: 32px;
    height: 48px;
    position: absolute;
    left: 30px;
    transform: rotate(-45deg);
    background: #ff6b9d;
    border-radius: 32px 32px 0 0;
    transform-origin: 0 100%;
  }

  &:after {
    left: 0;
    transform: rotate(45deg);
    transform-origin: 100% 100%;
  }
`;

const PetalsContainer = styled(Box)`
  position: absolute;
  width: 100%;
  height: 110%;
  pointer-events: none;
`;

const Petal = styled(Box)<{
  delay: number;
  size: number;
  color: string;
  duration: number;
  leftPosition: number;
}>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: ${(props) => props.color};
  border-radius: 50% 10% 50% 10%;
  animation: fall ${(props) => props.duration}s linear infinite;
  animation-delay: ${(props) => props.delay}s;
  left: ${(props) => props.leftPosition}%;

  @keyframes fall {
    0% {
      transform: translateY(-10vh) rotate(0deg);
      opacity: 0;
    }
    5% {
      opacity: 1;
    }
    95% {
      opacity: 1;
    }
    100% {
      transform: translateY(110vh) rotate(360deg);
      opacity: 0;
    }
  }
`;

const FloatingHeart = styled(Box)<{
  delay: number;
  size: number;
  duration: number;
  leftPosition: number;
}>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  left: ${(props) => props.leftPosition}%;
  animation: floatHeart ${(props) => props.duration}s linear infinite;
  animation-delay: ${(props) => props.delay}s;

  &:before {
    content: "♥";
    color: rgba(255, 105, 180, 0.6);
    font-size: ${(props) => props.size}px;
    position: absolute;
  }

  @keyframes floatHeart {
    0% {
      transform: translateY(110vh) scale(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-10vh) scale(1) rotate(360deg);
      opacity: 0;
    }
  }
`;

interface WeddingCardLoaderProps {
  groomName?: string;
  brideName?: string;
}

const WeddingCardLoader = ({
  groomName = "신랑",
  brideName = "신부",
}: WeddingCardLoaderProps) => {
  const heartRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // 꽃잎 데이터 생성 (로딩 2초에 맞춰 조정)
  const petals = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5, // 0-0.5초 딜레이 (빠른 시작)
    size: 8 + Math.random() * 8, // 8-16px
    color: [
      "rgba(255, 182, 193, 0.8)", // 연핑크
      "rgba(255, 105, 180, 0.7)", // 핫핑크
      "rgba(255, 20, 147, 0.6)", // 딥핑크
      "rgba(255, 192, 203, 0.8)", // 핑크
      "rgba(255, 255, 255, 0.9)", // 흰색
    ][Math.floor(Math.random() * 5)],
    duration: 1.5 + Math.random() * 1, // 1.5-2.5초 (로딩 시간 내)
    leftPosition: Math.random() * 100,
  }));

  // 하트 데이터 생성 (로딩 2초에 맞춰 조정)
  const hearts = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.3, // 0-0.3초 딜레이
    size: 12 + Math.random() * 8, // 12-20px
    duration: 1.8 + Math.random() * 0.4, // 1.8-2.2초 (로딩 시간 내)
    leftPosition: Math.random() * 100,
  }));

  useEffect(() => {
    // 하트 펄스 애니메이션
    if (heartRef.current) {
      gsap.to(heartRef.current, {
        scale: 1.2,
        duration: 0.8,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    // 텍스트 페이드 애니메이션
    if (textRef.current) {
      gsap.fromTo(
        textRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: "power2.out",
          repeat: -1,
          repeatDelay: 2,
        }
      );
    }

    return () => {
      gsap.killTweensOf([heartRef.current, textRef.current]);
    };
  }, []);

  return (
    <LoaderContainer>
      {/* 꽃잎 떨어지는 효과 */}
      <PetalsContainer>
        {petals.map((petal) => (
          <Petal
            key={petal.id}
            delay={petal.delay}
            size={petal.size}
            color={petal.color}
            duration={petal.duration}
            leftPosition={petal.leftPosition}
          />
        ))}
        {/* 떠오르는 하트 효과 */}
        {hearts.map((heart) => (
          <FloatingHeart
            key={`heart-${heart.id}`}
            delay={heart.delay}
            size={heart.size}
            duration={heart.duration}
            leftPosition={heart.leftPosition}
          />
        ))}
      </PetalsContainer>

      {/* 하트 애니메이션 */}
      <HeartContainer>
        <Heart ref={heartRef} />
      </HeartContainer>

      {/* 중앙 하트 */}
      <Box sx={{ margin: "20px 0" }}>
        <Typography
          sx={{
            color: "white",
            fontSize: "32px",
            fontWeight: "bold",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            textAlign: "center",
            animation: "glow 2s ease-in-out infinite alternate",
            "@keyframes glow": {
              "0%": {
                textShadow:
                  "0 0 5px rgba(255,255,255,0.5), 0 0 10px rgba(255,105,180,0.5)",
              },
              "100%": {
                textShadow:
                  "0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,105,180,0.8)",
              },
            },
          }}
        >
          ♥
        </Typography>
      </Box>

      {/* 로딩 텍스트 */}
      <Box ref={textRef} sx={{ textAlign: "center", mt: 3 }}>
        <Typography
          sx={{
            color: "white",
            fontSize: "18px",
            fontWeight: 600,
            mb: 1,
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          {groomName} ♥ {brideName}
        </Typography>
        <Typography
          sx={{
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "14px",
            fontWeight: 400,
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          청첩장을 준비하고 있습니다...
        </Typography>
      </Box>

      {/* 진행 표시 점들 */}
      <Box sx={{ display: "flex", gap: 1, mt: 4 }}>
        {Array.from({ length: 3 }, (_, i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              animation: `pulse 1.5s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              "@keyframes pulse": {
                "0%, 100%": {
                  opacity: 0.6,
                  transform: "scale(1)",
                },
                "50%": {
                  opacity: 1,
                  transform: "scale(1.2)",
                },
              },
            }}
          />
        ))}
      </Box>
    </LoaderContainer>
  );
};

export default WeddingCardLoader;
