"use client";
import React, { useRef, useEffect, useState } from "react";
import { Box, Typography, IconButton, Chip, Modal } from "@mui/material";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";

gsap.registerPlugin(Draggable);

const GalleryContainer = styled(Box)`
  position: relative;
  width: 100%;
  height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const StackContainer = styled(Box)`
  position: relative;
  width: 220px;
  height: 350px;
  margin: 0 auto;
`;

const Card = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  cursor: grab;
  background: white;

  &:active {
    cursor: grabbing;
  }

  img {
    width: 100%;
    height: 80%;
    object-fit: cover;
  }
`;

const CardContent = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20%;
  background: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ActionButtons = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  margin-bottom: 5px;
`;

const LikeButton = styled(Box)<{ liked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px;
  color: ${(props) => (props.liked ? "#e91e63" : "#ccc")};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.2);
    color: #e91e63;
  }
`;

const ControlPanel = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  display: flex;
  gap: 20px;
  z-index: 0;
`;

const ControlButton = styled(IconButton)`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  width: 60px;
  height: 60px;
  border: 2px solid rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const Counter = styled(Typography)`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 1000;
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

interface CardData {
  id: number;
  url: string;
  liked: boolean;
}

const StackedGallery = ({ images }: { images: any[] }) => {
  const stackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetKey, setResetKey] = useState(0); // 강제 리렌더링용
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const imagesSample = [
    {
      id: 1,
      url: "https://picsum.photos/400/600?random=1",
      liked: false,
    },
    {
      id: 2,
      url: "https://picsum.photos/400/600?random=2",
      liked: true,
    },
    {
      id: 3,
      url: "https://picsum.photos/400/600?random=3",
      liked: true,
    },
    {
      id: 4,
      url: "https://picsum.photos/400/600?random=4",
      liked: false,
    },
    {
      id: 5,
      url: "https://picsum.photos/400/600?random=5",
      liked: true,
    },
    {
      id: 6,
      url: "https://picsum.photos/400/600?random=6",
      liked: true,
    },
    {
      id: 7,
      url: "https://picsum.photos/400/600?random=7",
      liked: false,
    },
    {
      id: 8,
      url: "https://picsum.photos/400/600?random=8",
      liked: true,
    },
  ];

  if (!images || images.length === 0) {
    images = imagesSample;
  }

  const [cards, setCards] = useState<CardData[]>(images);

  console.log(cards);

  useEffect(() => {
    if (!stackRef.current) return;

    const cardElements = stackRef.current.querySelectorAll(".stack-card");

    // 카드 스택 초기 설정 및 애니메이션
    cardElements.forEach((card, index) => {
      const isVisible = index >= currentIndex && index < currentIndex + 3;
      const stackIndex = index - currentIndex;

      if (isVisible) {
        // 보이는 카드들은 부드럽게 애니메이션
        gsap.fromTo(
          card,
          {
            scale: 0.7,
            y: 100,
            opacity: 0,
            rotation: 0,
            zIndex: cards.length - index,
          },
          {
            scale: 1 - stackIndex * 0.1,
            y: stackIndex * 20,
            opacity: 1 - stackIndex * 0.3,
            rotation: (Math.random() - 0.5) * 5,
            duration: 0.4,
            delay: stackIndex * 0.1,
            ease: "back.out(1.4)",
          }
        );
      } else {
        // 보이지 않는 카드들은 즉시 설정
        gsap.set(card, {
          zIndex: cards.length - index,
          scale: 0.7,
          y: 100,
          opacity: 0,
          rotation: 0,
        });
      }
    });

    // 드래그 설정
    cardElements.forEach((card, index) => {
      if (index === currentIndex) {
        let isDragging = false;

        Draggable.create(card, {
          type: "x,y",
          inertia: true,
          bounds: {
            minX: -400,
            maxX: 400,
            minY: -200,
            maxY: 200,
          },
          onDragStart: function () {
            isDragging = true;
            console.log("드래그 시작");
          },
          onDrag: function () {
            const rotation = this.x * 0.1;
            gsap.set(card, { rotation });

            // 드래그 거리에 따른 투명도 조절
            const dragDistance = Math.abs(this.x) + Math.abs(this.y);
            const opacity = Math.max(0.3, 1 - dragDistance / 300);
            gsap.set(card, { opacity });

            console.log("드래그 중:", this.x, this.y);
          },
          onDragEnd: function () {
            isDragging = false;
            const dragDistance = Math.abs(this.x) + Math.abs(this.y);
            console.log("드래그 끝:", dragDistance);

            if (dragDistance > 80) {
              // 다음 카드로 즉시 전환
              if (currentIndex < cards.length - 1) {
                setCurrentIndex((prev) => prev + 1);
              }

              // 카드 날리기 애니메이션 (빠르게)
              const direction = this.x > 0 ? 1 : -1;
              console.log("카드 넘기기");
              gsap.to(card, {
                x: direction * 600,
                y: Math.random() * 300 - 150,
                rotation: direction * 30,
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            } else {
              // 원래 위치로 복귀
              console.log("원래 위치로 복귀");
              gsap.to(card, {
                x: 0,
                y: 0,
                rotation: (Math.random() - 0.5) * 5,
                opacity: 1,
                duration: 0.25,
                ease: "back.out(1.7)",
              });
            }
          },
          onThrowComplete: function () {
            if (!isDragging) {
              const dragDistance = Math.abs(this.x) + Math.abs(this.y);
              console.log("관성 끝:", dragDistance);

              if (dragDistance > 120) {
                // 다음 카드로 즉시 전환
                if (currentIndex < cards.length - 1) {
                  setCurrentIndex((prev) => prev + 1);
                }

                // 카드 날리기 애니메이션 (빠르게)
                const direction = this.x > 0 ? 1 : -1;
                gsap.to(card, {
                  x: direction * 800,
                  y: Math.random() * 400 - 200,
                  rotation: direction * 45,
                  opacity: 0,
                  duration: 0.4,
                  ease: "power2.out",
                });
              }
            }
          },
        });
      }
    });

    return () => {
      cardElements.forEach((card) => {
        const draggable = Draggable.get(card);
        if (draggable) {
          draggable.kill();
        }
      });
    };
  }, [currentIndex, cards, resetKey]);

  const toggleLike = (cardId: number) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, liked: !card.liked } : card
      )
    );

    // 하트 애니메이션
    const heartIcon = document.querySelector(
      `[data-card-id="${cardId}"] .heart-icon`
    );
    if (heartIcon) {
      gsap.fromTo(
        heartIcon,
        { scale: 1 },
        { scale: 1.5, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out" }
      );
    }
  };

  const resetGallery = () => {
    setCurrentIndex(0);
    setResetKey((prev) => prev + 1); // 컴포넌트 강제 리렌더링
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

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);

      // 다음 카드 애니메이션
      const currentCard = stackRef.current?.querySelector(
        `[data-card-index="${currentIndex}"]`
      );
      if (currentCard) {
        gsap.to(currentCard, {
          x: 300,
          rotation: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }
  };

  return (
    <GalleryContainer key={resetKey}>
      <Counter>
        {currentIndex + 1} / {cards.length}
      </Counter>

      <StackContainer ref={stackRef}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            className="stack-card"
            data-card-index={index}
            data-card-id={card.id}
            sx={{
              display: index >= currentIndex ? "block" : "none",
            }}
          >
            <img
              src={card.url}
              alt={`image${index}`}
              onClick={() => handleImageClick(card)}
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
                  handleImageClick(card);
                }
                e.currentTarget.dataset.touching = "false";
              }}
              style={{ cursor: "pointer" }}
            />
            <CardContent>
              <ActionButtons>
                <LikeButton
                  liked={card.liked}
                  onClick={() => toggleLike(card.id)}
                  onTouchStart={() => toggleLike(card.id)}
                  className="heart-icon"
                >
                  {card.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </LikeButton>
                <Chip
                  label={`${index + 1}/${cards.length}`}
                  size="small"
                  color="primary"
                />
              </ActionButtons>
            </CardContent>
          </Card>
        ))}
      </StackContainer>

      {currentIndex === cards.length - 1 && (
        <ControlPanel>
          <ControlButton onClick={resetGallery}>
            <RestartAltIcon />
          </ControlButton>
        </ControlPanel>
      )}

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
                alt={`확대된 이미지`}
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

export default StackedGallery;
