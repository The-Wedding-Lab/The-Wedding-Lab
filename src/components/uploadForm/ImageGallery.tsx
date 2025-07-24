"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Close, Delete } from "@mui/icons-material";
import { TransitionProps } from "@mui/material/transitions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

interface ImageGalleryProps {
  images: (File | string)[]; // File 객체 또는 URL 문자열
  onImageRemove?: (index: number) => void;
  showRemoveButton?: boolean;
  mode?: "single" | "grid"; // 이미지 1개 모드 또는 그리드 모드
  imageHeight?: number;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImageRemove,
  showRemoveButton = true,
  mode = "grid",
  imageHeight = 120,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const getImageUrl = (image: File | string) => {
    if (typeof image === "string") {
      return image; // 이미 URL인 경우 그대로 반환
    }
    return URL.createObjectURL(image); // File 객체인 경우 URL 생성
  };

  const getImageName = (image: File | string, index: number) => {
    if (typeof image === "string") {
      return `Image ${index + 1}`; // URL인 경우 기본 이름
    }
    return image.name; // File 객체인 경우 파일명
  };

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    // 다이얼로그 열린 후 해당 슬라이드로 이동
    setTimeout(() => {
      if (swiperInstance) {
        swiperInstance.slideTo(index);
      }
    }, 100);
  };

  const handleCloseDialog = () => {
    setSelectedIndex(-1);
  };

  const handleRemoveImage = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    onImageRemove?.(index);
    // 현재 보고 있던 이미지가 삭제되었을 때 다이얼로그 닫기
    if (selectedIndex === index) {
      setSelectedIndex(-1);
    } else if (selectedIndex > index) {
      // 앞의 이미지가 삭제되면 인덱스 조정
      setSelectedIndex(selectedIndex - 1);
    }
  };

  if (images.length === 0) {
    return null;
  }

  const renderSingleMode = () => (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: imageHeight,
        borderRadius: "8px",
        overflow: "hidden",
        cursor: "pointer",
        border: "1px solid #e0e0e0",
      }}
      onClick={() => handleImageClick(0)}
    >
      <Box
        component="img"
        src={getImageUrl(images[0])}
        alt="uploaded-0"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </Box>
  );

  const renderGridMode = () => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1,
        p: 1,
      }}
    >
      {images.map((image, index) => {
        return (
          <Box
            key={index}
            sx={{
              position: "relative",
              width: "100%",
              height: imageHeight,
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "pointer",
              border: "1px solid #e0e0e0",
            }}
            onClick={() => handleImageClick(index)}
          >
            {/* 이미지 */}
            <Box
              component="img"
              src={getImageUrl(image)}
              alt={`uploaded-${index}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />

            {/* 삭제 버튼 */}
            {showRemoveButton && (
              <IconButton
                size="small"
                onClick={(e) => handleRemoveImage(index, e)}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 1)",
                  },
                }}
              >
                <Delete fontSize="small" color="error" />
              </IconButton>
            )}
          </Box>
        );
      })}
    </Box>
  );

  return (
    <>
      {mode === "single" ? renderSingleMode() : renderGridMode()}

      {/* 이미지 확대 보기 다이얼로그 with 스와이퍼 */}
      <Dialog
        open={selectedIndex !== -1}
        onClose={handleCloseDialog}
        fullScreen={fullScreen}
        maxWidth="lg"
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            backgroundColor: "black",
            margin: fullScreen ? 0 : 2,
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: fullScreen ? "100vh" : "60vh",
            backgroundColor: "black",
          }}
        >
          {/* 닫기 버튼 */}
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 10,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <Close />
          </IconButton>

          {/* 스와이퍼 컨테이너 */}
          <Box
            sx={{
              width: "100%",
              height: "100%",
              position: "relative",
              ".swiper": {
                width: "100%",
                height: "100%",
              },
              ".swiper-pagination": {
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "auto",
                textAlign: "center",
              },
              ".swiper-pagination-bullet": {
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                width: "8px",
                height: "8px",
                opacity: 1,
                margin: "0 4px",
              },
              ".swiper-pagination-bullet-active": {
                backgroundColor: "#ffffff",
              },
              ".swiper-button-next, .swiper-button-prev": {
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                "&:after": {
                  fontSize: "16px",
                },
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            }}
          >
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={images.length > 1}
              pagination={{
                clickable: true,
                enabled: images.length > 1,
              }}
              slidesPerView={1}
              spaceBetween={0}
              centeredSlides={true}
              initialSlide={selectedIndex >= 0 ? selectedIndex : 0}
              onSwiper={setSwiperInstance}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              {images.map((image, index) => {
                return (
                  <SwiperSlide key={index}>
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        minHeight: fullScreen ? "100vh" : "60vh",
                      }}
                    >
                      <Box
                        component="img"
                        src={getImageUrl(image)}
                        alt={`enlarged-${index}`}
                        sx={{
                          maxWidth: "100%",
                          maxHeight: "90%",
                          objectFit: "contain",
                          userSelect: "none",
                          display: "block",
                          margin: "auto",
                        }}
                      />

                      {/* 이미지 정보 */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 16,
                          left: 16,
                          right: 16,
                          color: "white",
                          zIndex: 5,
                        }}
                      >
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {getImageName(image, index)}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.6 }}>
                          {index + 1} / {images.length}
                        </Typography>
                      </Box>
                    </Box>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
