import React, { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { Swiper as SwiperType } from "swiper";

import "swiper/css/grid";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  Thumbs,
  FreeMode,
} from "swiper/modules";
import { Box, Typography } from "@mui/material";

const ThumbSwiper = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <>
      <Swiper
        modules={[Pagination, Navigation, Autoplay, Thumbs, FreeMode]}
        pagination={{ clickable: true }}
        thumbs={{ swiper: thumbsSwiper }}
        navigation
        slidesPerView={1}
        spaceBetween={10}
        centeredSlides={true}
        className="mySwiper2"
      >
        <SwiperSlide key={"swiper-slide-1"}>
          <Box
            sx={{
              width: "100%",
              height: "40vh",
              display: "flex",
            }}
          >
            <img
              src="https://swiperjs.com/demos/images/nature-1.jpg"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </SwiperSlide>
        <SwiperSlide key={"swiper-slide-2"}>
          <Box
            sx={{
              width: "100%",
              height: "40vh",
              display: "flex",
            }}
          >
            <img
              src="https://swiperjs.com/demos/images/nature-2.jpg"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </SwiperSlide>
        <SwiperSlide key={"swiper-slide-3"}>
          <Box
            sx={{
              width: "100%",
              height: "40vh",
              display: "flex",
              objectFit: "cover",
            }}
          >
            <img
              src="https://swiperjs.com/demos/images/nature-3.jpg"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </SwiperSlide>
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={5}
        slidesPerView={3}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
        style={{ marginTop: "5px" }}
      >
        <SwiperSlide key={"swiper-slide-1"}>
          <Box
            sx={{
              width: "100%",
              // 60vh
              height: "10vh",
              display: "flex",
            }}
          >
            <img
              src="https://swiperjs.com/demos/images/nature-1.jpg"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </SwiperSlide>
        <SwiperSlide key={"swiper-slide-2"}>
          <Box
            sx={{
              width: "100%",
              // 60vh
              height: "10vh",
              display: "flex",
            }}
          >
            <img
              src="https://swiperjs.com/demos/images/nature-2.jpg"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </SwiperSlide>
        <SwiperSlide key={"swiper-slide-3"}>
          <Box
            sx={{
              width: "100%",
              // 60vh
              height: "10vh",
              display: "flex",
            }}
          >
            <img
              src="https://swiperjs.com/demos/images/nature-3.jpg"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default ThumbSwiper;
