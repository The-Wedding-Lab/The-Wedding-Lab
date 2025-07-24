import React, { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Swiper as SwiperType } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import { Box, Typography } from "@mui/material";

const FadeSwiper = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <>
      <Swiper
        modules={[EffectFade, Pagination, Navigation, Autoplay]}
        effect={"fade"}
        pagination={{ clickable: true }}
        navigation
        slidesPerView={1}
        spaceBetween={10}
        centeredSlides={true}
        className="mySwiper"
      >
        <SwiperSlide key={"swiper-slide-1"}>
          <Box
            sx={{
              width: "100%",
              // 60vh
              height: "40vh",
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
              height: "40vh",
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
              height: "40vh",
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
    </>
  );
};

export default FadeSwiper;
