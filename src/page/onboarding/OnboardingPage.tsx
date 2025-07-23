"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Typography } from "@mui/material";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import AppButton from "@/components/ui/AppButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef } from "react";

export const OnboardingPage = () => {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<any>(null);
  const [gifKeys, setGifKeys] = useState({
    step1: 0,
    step2: 0,
    step3: 0,
    step4: 0,
    step5: 0,
    step6: 0,
  });

  const handleSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex;
    setActiveSlide(newIndex);

    // 현재 활성 슬라이드의 GIF만 재시작
    if (newIndex === 0) {
      setGifKeys((prev) => ({ ...prev, step1: prev.step1 + 1 }));
    } else if (newIndex === 1) {
      setGifKeys((prev) => ({ ...prev, step2: prev.step2 + 1 }));
    } else if (newIndex === 2) {
      setGifKeys((prev) => ({ ...prev, step3: prev.step3 + 1 }));
    } else if (newIndex === 3) {
      setGifKeys((prev) => ({ ...prev, step4: prev.step4 + 1 }));
    } else if (newIndex === 4) {
      setGifKeys((prev) => ({ ...prev, step5: prev.step5 + 1 }));
    } else if (newIndex === 5) {
      setGifKeys((prev) => ({ ...prev, step6: prev.step6 + 1 }));
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          ".swiper-pagination": {
            position: "absolute",
            bottom: "10px",
            width: "140px",
            textAlign: "center",
          },
          ".swiper-pagination-bullet": {
            backgroundColor: "#c5c5c5",
            width: "8px",
            height: "8px",
            opacity: 1,
            margin: "0 4px",
          },
          ".swiper-pagination-bullet-active": {
            backgroundColor: "#006ffd",
          },
        }}
      >
        <Swiper
          ref={swiperRef}
          modules={[Pagination, Navigation, Autoplay]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          centeredSlides={false}
          style={{ paddingBottom: "50px" }}
          onSlideChange={handleSlideChange}
        >
          <SwiperSlide key={"swiper-slide-1"}>
            <Box
              sx={{
                width: "100%",
                height: "350px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
                backgroundColor: "#cfe2ff",
              }}
            >
              <Image
                key={`step1-${gifKeys.step1}`}
                src="/onboarding/step1.gif"
                alt="onboarding"
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
          </SwiperSlide>
          <SwiperSlide key={"swiper-slide-2"}>
            <Box
              sx={{
                width: "100%",
                height: "350px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
                backgroundColor: "#cfe2ff",
              }}
            >
              <Image
                key={`step2-${gifKeys.step2}`}
                src="/onboarding/step2.gif"
                alt="onboarding"
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
          </SwiperSlide>
          <SwiperSlide key={"swiper-slide-3"}>
            <Box
              sx={{
                width: "100%",
                height: "350px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
                backgroundColor: "#cfe2ff",
              }}
            >
              <Image
                key={`step3-${gifKeys.step3}`}
                src="/onboarding/step3.gif"
                alt="onboarding"
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
          </SwiperSlide>
          <SwiperSlide key={"swiper-slide-4"}>
            <Box
              sx={{
                width: "100%",
                height: "350px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
                backgroundColor: "#cfe2ff",
              }}
            >
              <Image
                key={`step4-${gifKeys.step4}`}
                src="/onboarding/step4.gif"
                alt="onboarding"
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
          </SwiperSlide>
          <SwiperSlide key={"swiper-slide-5"}>
            <Box
              sx={{
                width: "100%",
                height: "350px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
                backgroundColor: "#cfe2ff",
              }}
            >
              <Image
                key={`step5-${gifKeys.step5}`}
                src="/onboarding/step5.gif"
                alt="onboarding"
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
          </SwiperSlide>
          <SwiperSlide key={"swiper-slide-6"}>
            <Box
              sx={{
                width: "100%",
                height: "350px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
                backgroundColor: "#cfe2ff",
              }}
            >
              <Image
                key={`step6-${gifKeys.step6}`}
                src="/onboarding/step6.gif"
                alt="onboarding"
                fill
                style={{ objectFit: "contain" }}
              />
            </Box>
          </SwiperSlide>
        </Swiper>
      </Box>
      <Box sx={{ px: 3, py: 1 }}>
        <Box className="TextContainer">
          <Typography fontSize={24} fontWeight={700} gutterBottom>
            모청 튜토리얼
          </Typography>
          <Typography fontSize={16} fontWeight={500} color="#888888">
            <b>모두의 청첩장</b>을 사용 방법을 알려드릴게요!
          </Typography>
        </Box>
        <Box
          className="ButtonContainer"
          sx={{
            position: "fixed",
            left: 0,
            bottom: 0,
            width: "100vw",
            maxWidth: "768px", // 원하는 최대 너비로 제한 (예: 480px)
            zIndex: 100,
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto", // 가운데 정렬
            right: 0, // 좌우 모두 0으로 두면 가운데 정렬됨
            // 모바일에서 스크롤바 생기는 것 방지
            boxSizing: "border-box",
          }}
        >
          <AppButton
            variant="contained"
            color="highlight"
            fullWidth
            onClick={() => {
              router.push("/setup");
            }}
          >
            시작하기
          </AppButton>
        </Box>
      </Box>
    </>
  );
};

export default OnboardingPage;
