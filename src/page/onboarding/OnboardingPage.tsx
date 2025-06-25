"use client";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Typography } from "@mui/material";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import AppButton from "@/components/ui/AppButton";

export const OnboardingPage = () => {
  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          ".swiper-pagination": {
            position: "absolute",
            bottom: "0px",
            width: "90px",
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
          modules={[Pagination, Navigation, Autoplay]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          centeredSlides={false}
          style={{ paddingBottom: "50px" }}
        >
          <SwiperSlide key={"swiper-slide-1"}>
            <Box
              sx={{
                width: "100%",
                height: "60vh",
                backgroundColor: "red",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
              }}
            >
              1
            </Box>
          </SwiperSlide>
          <SwiperSlide key={"swiper-slide-2"}>
            <Box
              sx={{
                width: "100%",
                height: "60vh",
                backgroundColor: "blue",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
              }}
            >
              2
            </Box>
          </SwiperSlide>
          <SwiperSlide key={"swiper-slide-3"}>
            <Box
              sx={{
                width: "100%",
                height: "60vh",
                backgroundColor: "green",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "2rem",
              }}
            >
              3
            </Box>
          </SwiperSlide>
        </Swiper>
      </Box>
      <Box sx={{ px: 3, py: 1 }}>
        <Box className="TextContainer">
          <Typography fontSize={24} fontWeight={700} gutterBottom>
            모바일 청첩장 튜토리얼
          </Typography>
          <Typography fontSize={12} fontWeight={500} color="#888888">
            모바일 청첩장을 만드는 방법을 알려드립니다.
          </Typography>
        </Box>
        <Box className="ButtonContainer" my={4}>
          <AppButton variant="contained" color="highlight" fullWidth>
            다음
          </AppButton>
        </Box>
      </Box>
    </>
  );
};

export default OnboardingPage;
