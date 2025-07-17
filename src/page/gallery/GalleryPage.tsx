"use client";
import React, { useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useRouter } from "next/navigation";

import StackedGallery from "@/components/gallery/StackedGallery";
import SwipeGallery from "@/components/gallery/SwipeGallery";

import styled from "@emotion/styled";
import GridGallery from "@/components/gallery/GridGallery";

const GalleryContainer = styled(Box)`
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
`;

const ControlPanel = styled(Box)`
  position: fixed;
  top: 50%;
  right: 30px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 2000;

  @media (max-width: 768px) {
    top: auto;
    bottom: 30px;
    right: 50%;
    transform: translateX(50%);
    flex-direction: row;
    gap: 10px;
  }
`;

const GalleryButton = styled(Chip)<{ active: boolean }>`
  background: ${(props) =>
    props.active
      ? "linear-gradient(45deg, #667eea, #764ba2)"
      : "rgba(255, 255, 255, 0.2)"};
  color: white;
  backdrop-filter: blur(10px);
  border: 2px solid
    ${(props) => (props.active ? "#667eea" : "rgba(255, 255, 255, 0.3)")};
  font-weight: bold;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.active
        ? "linear-gradient(45deg, #764ba2, #667eea)"
        : "rgba(255, 255, 255, 0.3)"};
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  .MuiChip-label {
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

const WelcomeOverlay = styled(Box)<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  pointer-events: ${(props) => (props.visible ? "all" : "none")};
  transition: all 0.5s ease;
`;

const WelcomeContent = styled(Box)`
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 40px;
`;

const GalleryPage = () => {
  const router = useRouter();
  const [galleryType, setGalleryType] = useState<"stacked" | "swipe" | "grid">(
    "stacked"
  );
  const [showWelcome, setShowWelcome] = useState(true);

  const changeGalleryType = (type: "stacked" | "swipe" | "grid") => {
    setGalleryType(type);
  };

  const hideWelcome = () => {
    setShowWelcome(false);
  };

  const galleryTypes = [
    { key: "stacked", label: "💝 스택", description: "스와이프 카드 갤러리" },
    {
      key: "swipe",
      label: "🌊 스와이프",
      description: "무한 스와이프",
    },
    {
      key: "grid",
      label: "🌊 그리드",
      description: "Seamless 무한 스크롤",
    },
  ];

  return (
    <GalleryContainer>
      {/* 갤러리 렌더링 */}

      {galleryType === "stacked" && <StackedGallery images={[]} />}
      {galleryType === "swipe" && <SwipeGallery images={[]} />}
      {galleryType === "grid" && <GridGallery images={[]} />}

      {/* 컨트롤 패널 */}
      <ControlPanel>
        {galleryTypes.map((type) => (
          <GalleryButton
            key={type.key}
            label={type.label}
            active={galleryType === type.key}
            onClick={() => changeGalleryType(type.key as any)}
            title={type.description}
          />
        ))}
      </ControlPanel>
    </GalleryContainer>
  );
};

export default GalleryPage;
