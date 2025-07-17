"use client";
import React, { useRef, useEffect, useState } from "react";
import { Box, Typography, IconButton, Chip } from "@mui/material";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import styled from "@emotion/styled";

gsap.registerPlugin(Draggable);

const GalleryContainer = styled(Box)`
  position: relative;
  width: 100%;
  height: 100dvh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const StackContainer = styled(Box)`
  position: relative;
  width: 350px;
  height: 500px;
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
    height: 70%;
    object-fit: cover;
  }
`;

const CardContent = styled(Box)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ActionButtons = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const LikeButton = styled(IconButton)<{ liked: boolean }>`
  color: ${(props) => (props.liked ? "#e91e63" : "#ccc")};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.2);
    color: #e91e63;
  }
`;

const ControlPanel = styled(Box)`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 1000;
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

interface CardData {
  id: number;
  url: string;
  liked: boolean;
}

const StackedGallery = ({ images }: { images: any[] }) => {
  const stackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetKey, setResetKey] = useState(0); // 강제 리렌더링용
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

  const randomTitle = [
    "우리의 결혼식",
    "사랑의 시작",
    "영원히 함께",
    "행복한 동행",
    "두 사람의 약속",
    "우리의 특별한 날",
    "함께 걷는 길",
    "사랑이 피어나는 순간",
    "축복의 시간",
    "우리 둘만의 이야기",
  ];

  const randomDescription = [
    "운명의 그 순간",
    "설레는 마음으로",
    "영원을 약속하며",
    "당신과 함께",
    "아름다운 추억",
    "행복한 출발",
    "달콤한 시간",
    "함께 걸어갈 길",
    "새로운 모험의 첫 걸음",
    "하루의 마지막 순간",
    "반짝이는 네온사인들",
    "순수한 아름다움",
    "따뜻한 오후의 기억",
    "무한한 우주의 신비",
    "파도가 들려주는 이야기",
  ];

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
            <img src={card.url} alt={`image${index}`} />
            <CardContent>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {randomTitle[Math.floor(Math.random() * randomTitle.length)]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {
                    randomDescription[
                      Math.floor(Math.random() * randomDescription.length)
                    ]
                  }
                </Typography>
              </Box>
              <ActionButtons>
                <Box>
                  <LikeButton
                    liked={card.liked}
                    onClick={() => toggleLike(card.id)}
                    className="heart-icon"
                  >
                    {card.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </LikeButton>
                  <IconButton color="primary">
                    <ShareIcon />
                  </IconButton>
                </Box>
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

      <ControlPanel>
        <ControlButton onClick={resetGallery}>
          <RestartAltIcon />
        </ControlButton>
      </ControlPanel>
    </GalleryContainer>
  );
};

export default StackedGallery;
