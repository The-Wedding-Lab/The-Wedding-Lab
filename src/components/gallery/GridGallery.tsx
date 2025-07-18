"use client";
import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Modal,
} from "@mui/material";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FilterListIcon from "@mui/icons-material/FilterList";
import styled from "@emotion/styled";

gsap.registerPlugin(ScrollTrigger);

const GalleryContainer = styled(Box)`
  width: 100%;
  min-height: 500px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  padding: 20px;
`;

const HeaderSection = styled(Box)`
  text-align: center;
  margin-bottom: 60px;
  color: white;
`;

const FilterSection = styled(Box)`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const FilterChip = styled(Chip)<{ active: boolean }>`
  background: ${(props) =>
    props.active
      ? "linear-gradient(45deg, #667eea, #764ba2)"
      : "rgba(255, 255, 255, 0.1)"};
  color: white;
  border: 2px solid
    ${(props) => (props.active ? "#667eea" : "rgba(255, 255, 255, 0.2)")};
  backdrop-filter: blur(10px);
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: ${(props) =>
      props.active
        ? "linear-gradient(45deg, #764ba2, #667eea)"
        : "rgba(255, 255, 255, 0.2)"};
    transform: scale(1.05);
  }
`;

const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;

  @media (max-width: 768px) {
    gap: 15px;
    padding: 15px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    padding: 10px;
  }
`;

const GridItem = styled(Box)`
  position: relative;
  aspect-ratio: 4/5;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;

  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
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

  &:hover .item-overlay {
    opacity: 1;
  }
`;

const ItemOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    transparent 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const LikeButton = styled(IconButton)`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.2);
  }

  &.liked {
    color: #e91e63;
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
  border-radius: 25px;
  overflow: hidden;

  box-shadow: 0 50px 100px rgba(0, 0, 0, 0.5);
  outline: none;

  img {
    width: 100%;
    height: auto;
    max-height: 70vh;
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

const LoadMoreButton = styled(Button)`
  display: block;
  margin: 40px auto 0 auto;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 15px 40px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1.1rem;
  text-transform: none;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #764ba2, #667eea);
    transform: scale(1.05);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  }
`;

interface ImageData {
  id: number;
  url: string;
}

const GridGallery = ({ images }: { images: any[] }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(4);
  const imagesSample = [
    {
      id: 1,
      url: "https://picsum.photos/400/500?random=1",
    },
    {
      id: 2,
      url: "https://picsum.photos/400/500?random=2",
    },
    {
      id: 3,
      url: "https://picsum.photos/400/500?random=3",
    },
    {
      id: 4,
      url: "https://picsum.photos/400/500?random=4",
    },
    {
      id: 5,
      url: "https://picsum.photos/400/500?random=5",
    },
    {
      id: 6,
      url: "https://picsum.photos/400/500?random=6",
    },
    {
      id: 7,
      url: "https://picsum.photos/400/500?random=7",
    },
    {
      id: 8,
      url: "https://picsum.photos/400/500?random=8",
    },
    {
      id: 9,
      url: "https://picsum.photos/400/500?random=9",
    },
    {
      id: 10,
      url: "https://picsum.photos/400/500?random=10",
    },
    {
      id: 11,
      url: "https://picsum.photos/400/500?random=11",
    },
    {
      id: 12,
      url: "https://picsum.photos/400/500?random=12",
    },
  ];

  if (!images || images.length === 0) {
    images = imagesSample;
  }

  const categories = ["all", "자연", "도시", "건축", "예술", "라이프"];

  const filteredImages =
    filter === "all"
      ? images.slice(0, visibleCount)
      : images.filter((img) => img.category === filter).slice(0, visibleCount);

  useEffect(() => {
    if (!gridRef.current) return;

    const items = gridRef.current.querySelectorAll(".grid-item");

    // 초기 상태 설정
    gsap.set(items, { opacity: 0, y: 60, scale: 0.8 });

    // 순차 등장 애니메이션
    gsap.to(items, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.7)",
    });

    // ScrollTrigger로 스크롤 애니메이션
    items.forEach((item, index) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 100, rotateY: 45 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            end: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [filteredImages]);

  const handleFilterChange = (newFilter: string) => {
    const items = gridRef.current?.querySelectorAll(".grid-item");

    if (items) {
      // 아웃 애니메이션
      gsap.to(items, {
        opacity: 0,
        scale: 0.8,
        y: -30,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.in",
        onComplete: () => {
          setFilter(newFilter);
          setVisibleCount(6);
        },
      });
    }
  };

  const handleImageClick = (image: ImageData) => {
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

  const loadMore = () => {
    const currentItems = gridRef.current?.querySelectorAll(".grid-item");
    setVisibleCount((prev) => prev + 4);

    // 로드 더 애니메이션
    setTimeout(() => {
      const newItems = gridRef.current?.querySelectorAll(
        ".grid-item:nth-last-child(-n+4)"
      );
      if (newItems) {
        gsap.fromTo(
          newItems,
          { opacity: 0, y: 100, scale: 0.5 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)",
          }
        );
      }
    }, 100);
  };

  return (
    <GalleryContainer>
      <GridContainer ref={gridRef}>
        {filteredImages.map((image) => (
          <GridItem
            key={image.id}
            className="grid-item"
            data-image-id={image.id}
            onClick={() => handleImageClick(image)}
          >
            <img src={image.url} alt={`image${image.id}`} />
          </GridItem>
        ))}
      </GridContainer>

      {(filter === "all"
        ? images.length
        : images.filter((img) => img.category === filter).length) >
        visibleCount && (
        <LoadMoreButton onClick={loadMore}>더보기</LoadMoreButton>
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
                alt={`image${selectedImage.id}`}
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

export default GridGallery;
