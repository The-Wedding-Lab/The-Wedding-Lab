"use client";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import AppButton from "@/components/ui/AppButton";
import { useRouter } from "next/navigation";

import ThumbSwiper from "@/components/gallery/ThumbSwiper";
import FadeSwiper from "@/components/gallery/FadeSwiper";
import GridGallery from "@/components/gallery/GridGallery";

import styled from "@emotion/styled";

const ButtonWrapper = styled.ul`
  margin-top: 100px;
  display: flex;
  justify-content: space-around;
  li {
    width: 100%;
    margin-right: 10px;
  }
  li:nth-of-type(3) {
    margin-right: 0;
  }
  li button {
    display: block;
    width: 100%;
    border: 1px solid #ccc;
    padding: 10px 0;
  }
`;

const GalleryPage = () => {
  const router = useRouter();
  // paging, fade, grid
  const [swiperStyle, setSwiperStyle] = useState("paging");

  const changeSwiperStyle = (styleName: string) => {
    setSwiperStyle(styleName);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "95%",
          margin: "0 auto",
          ".swiper-button-prev": {
            color: "#fff",
          },
          ".swiper-button-next": {
            color: "#fff",
          },
        }}
      >
        {swiperStyle === "paging" && (
          <Box
            sx={{
              ".mySwiper .swiper-slide": {
                background: "#444",
              },
              ".mySwiper .swiper-slide img": {
                opacity: 0.4,
              },
              ".mySwiper .swiper-slide-thumb-active img": {
                opacity: 1,
              },
            }}
          >
            <ThumbSwiper />
          </Box>
        )}
        {swiperStyle === "fade" && <FadeSwiper />}
        {swiperStyle === "grid" && <GridGallery />}

        <ButtonWrapper>
          <li>
            <button onClick={() => changeSwiperStyle("paging")}>paging</button>
          </li>
          <li>
            <button onClick={() => changeSwiperStyle("fade")}>fade</button>
          </li>
          <li>
            <button onClick={() => changeSwiperStyle("grid")}>grid</button>
          </li>
        </ButtonWrapper>
      </Box>
    </>
  );
};

export default GalleryPage;
