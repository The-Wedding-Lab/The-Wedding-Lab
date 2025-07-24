"use client";
import React, { useRef, useEffect, useState } from "react";
import { Box, Typography, IconButton, Modal } from "@mui/material";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";

gsap.registerPlugin(Draggable);

const CardsContainer = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardsList = styled(Box)`
  position: relative;
  width: 100%;
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled(Box)`
  position: absolute;
  width: 200px;
  height: 300px;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  transform-origin: center center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 35px 70px rgba(0, 0, 0, 0.5);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

const CardContent = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 25px 20px 20px;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const ControlsContainer = styled(Box)`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 30px;
  z-index: 1000;
`;

const ControlButton = styled(IconButton)`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  color: white;
  width: 70px;
  height: 70px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  }

  svg {
    font-size: 2rem;
  }
`;

const ModalContainer = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(Box)`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;

  overflow: hidden;

  box-shadow: 0 50px 100px rgba(0, 0, 0, 0.5);
  outline: none;

  img {
    width: 100%;
    height: auto;
    max-height: 90vh;
    object-fit: contain;
  }
`;

const ModalHeader = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.7), transparent);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  z-index: 10;
`;

const CloseButton = styled(IconButton)`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const SwipeGallery = ({ images }: { images: any[] }) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardsListRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const { setupData } = useWeddingDataStore();
  const backgroundColor =
    setupData?.weddingInfo?.pages?.gallery?.backgroundColor;
  const backgroundColor2 =
    setupData?.weddingInfo?.pages?.gallery?.backgroundColor2;

  const GalleryContainer = styled(Box)`
    position: relative;
    width: 100%;
    height: 500px;
    background: linear-gradient(
      135deg,
      ${backgroundColor} 0%,
      ${backgroundColor2} 100%
    );
    overflow: hidden;
  `;

  const imagesSample = [
    {
      url: "https://picsum.photos/400/600?random=1",
    },
    {
      url: "https://picsum.photos/400/600?random=2",
    },
    {
      url: "https://picsum.photos/400/600?random=3",
    },
    {
      url: "https://picsum.photos/400/600?random=4",
    },
    {
      url: "https://picsum.photos/400/600?random=5",
    },
    {
      url: "https://picsum.photos/400/600?random=6",
    },
    {
      url: "https://picsum.photos/400/600?random=7",
    },
    {
      url: "https://picsum.photos/400/600?random=8",
    },
  ];

  if (!images || images.length === 0) {
    images = imagesSample;
  }

  const nextCard = () => {
    const cards = cardsListRef.current?.querySelectorAll(".scroll-card");
    if (cards) {
      // 현재 카드를 왼쪽으로 슬라이드
      gsap.to(cards[currentIndex], {
        xPercent: -100,
        scale: 0.8,
        opacity: 0.7,
        duration: 0.3,
        ease: "power2.out",
      });

      // 다음 카드를 중앙으로 슬라이드
      const nextIndex = (currentIndex + 1) % images.length;
      gsap.to(cards[nextIndex], {
        xPercent: 0,
        scale: 1,
        opacity: 1,
        zIndex: 10,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevCard = () => {
    const cards = cardsListRef.current?.querySelectorAll(".scroll-card");
    if (cards) {
      // 현재 카드를 오른쪽으로 슬라이드
      gsap.to(cards[currentIndex], {
        xPercent: 100,
        scale: 0.8,
        opacity: 0.7,
        duration: 0.3,
        ease: "power2.out",
      });

      // 이전 카드를 중앙으로 슬라이드
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      gsap.to(cards[prevIndex], {
        xPercent: 0,
        scale: 1,
        opacity: 1,
        zIndex: 10,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageClick = (image: any) => {
    setSelectedImage(image);

    // 모달 오픈 애니메이션
    gsap.fromTo(
      ".modal-content",
      { scale: 0.5, opacity: 0, rotationY: 180 },
      {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      }
    );
  };

  const handleCloseModal = () => {
    gsap.to(".modal-content", {
      scale: 0.5,
      opacity: 0,
      rotationY: -180,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => setSelectedImage(null),
    });
  };

  useEffect(() => {
    if (!cardsListRef.current) return;

    const cards = Array.from(
      cardsListRef.current.querySelectorAll(".scroll-card")
    );
    if (cards.length === 0) return;

    // 카드 초기 위치 설정
    cards.forEach((card, index) => {
      if (index === currentIndex) {
        gsap.set(card, { xPercent: 0, scale: 1, zIndex: 10, opacity: 1 });
      } else if (
        index === currentIndex + 1 ||
        (currentIndex === images.length - 1 && index === 0)
      ) {
        gsap.set(card, { xPercent: 100, scale: 0.8, zIndex: 5, opacity: 0.7 });
      } else if (
        index === currentIndex - 1 ||
        (currentIndex === 0 && index === images.length - 1)
      ) {
        gsap.set(card, { xPercent: -100, scale: 0.8, zIndex: 5, opacity: 0.7 });
      } else {
        gsap.set(card, { xPercent: 200, scale: 0.5, zIndex: 1, opacity: 0 });
      }
    });

    // 모바일 최적화된 스와이프 기능
    const draggable = Draggable.create(cardsListRef.current, {
      type: "x",
      bounds: { minX: -150, maxX: 150 },
      inertia: false, // 모바일에서 더 정확한 제어를 위해 비활성화
      allowNativeTouchScrolling: false, // 네이티브 스크롤 방지
      minimumMovement: 5, // 최소 움직임 설정
      onPress: function () {
        gsap.set(cardsListRef.current, { cursor: "grabbing" });
      },
      onDrag: function () {
        const progress = Math.abs(this.x) / 150;
        gsap.set(cardsListRef.current, {
          scale: 1 - progress * 0.05,
          opacity: 1 - progress * 0.2,
          cursor: "grabbing",
        });
      },
      onRelease: function () {
        gsap.set(cardsListRef.current, { cursor: "grab" });
      },
      onDragEnd: function () {
        const dragDistance = Math.abs(this.x);

        // 모바일에서 더 민감하게 반응 (30px)
        if (dragDistance > 30) {
          if (this.x > 0) {
            prevCard();
          } else {
            nextCard();
          }
        }

        // 원래 위치로 복귀
        gsap.to(cardsListRef.current, {
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      },
    });

    return () => {
      draggable[0]?.kill();
    };
  }, [currentIndex, images.length]);

  return (
    <GalleryContainer ref={galleryRef}>
      <CardsContainer>
        <CardsList className="gallery" ref={cardsListRef}>
          {images.map((image, index) => (
            <Card
              key={index}
              className="scroll-card"
              onClick={() => handleImageClick(image)}
              // 모바일에서 탭(터치) 시 카드가 커지는 애니메이션을 추가합니다.
              // 스와이프(드래그)와 겹치지 않도록 터치 시작/끝 좌표 차이가 거의 없을 때만 확대합니다.
              onTouchStart={(e) => {
                // 터치 시작 좌표 저장
                e.currentTarget.dataset.touchStartX =
                  e.touches[0].clientX.toString();
                e.currentTarget.dataset.touchStartY =
                  e.touches[0].clientY.toString();
                // 카드에 터치 중임을 표시
                e.currentTarget.dataset.touching = "true";
              }}
              onTouchEnd={(e) => {
                const startX = Number(e.currentTarget.dataset.touchStartX || 0);
                const startY = Number(e.currentTarget.dataset.touchStartY || 0);
                const endX = e.changedTouches[0].clientX;
                const endY = e.changedTouches[0].clientY;
                const dx = Math.abs(endX - startX);
                const dy = Math.abs(endY - startY);
                // 스와이프가 아니라면(거의 움직이지 않았다면) 확대 애니메이션 실행
                if (
                  dx < 10 &&
                  dy < 10 &&
                  e.currentTarget.dataset.touching === "true"
                ) {
                  // 카드 확대
                  gsap.to(e.currentTarget, {
                    scale: 1.12,
                    duration: 0.18,
                    ease: "power2.out",
                    onComplete: () => {
                      gsap.to(e.currentTarget, {
                        scale: 1,
                        duration: 0.18,
                        ease: "power2.in",
                      });
                    },
                  });
                  handleImageClick(image);
                }
                e.currentTarget.dataset.touching = "false";
              }}
            >
              <img src={image.url} alt={image.title} />
            </Card>
          ))}
        </CardsList>
      </CardsContainer>

      <Typography
        sx={{
          position: "absolute",
          top: 50,
          left: "50%",
          width: "100%",
          transform: "translateX(-50%)",
          color: "#777",
          textAlign: "center",
          opacity: 0.8,
          fontSize: "1.1rem",
        }}
      >
        이미지를 클릭하면 크게 볼 수 있어요!
      </Typography>

      {/* 인디케이터 */}
      <Box
        sx={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 1,
          zIndex: 1000,
        }}
      >
        {images.map((_, index) => (
          <Box
            key={index}
            sx={{
              width: index === currentIndex ? 30 : 8,
              height: 8,
              borderRadius: 4,
              background:
                index === currentIndex
                  ? "linear-gradient(45deg, #667eea, #764ba2)"
                  : "rgba(255, 255, 255, 0.4)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Box>

      {/* 이미지 확대 모달 */}
      <ModalContainer
        open={!!selectedImage}
        onClose={handleCloseModal}
        BackdropProps={{
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <ModalContent className="modal-content">
          {selectedImage && (
            <>
              <ModalHeader>
                <Box></Box>
                <CloseButton onClick={handleCloseModal}>
                  <CloseIcon />
                </CloseButton>
              </ModalHeader>
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                style={{
                  borderRadius: "25px",
                }}
              />
            </>
          )}
        </ModalContent>
      </ModalContainer>
    </GalleryContainer>
  );
};

export default SwipeGallery;
