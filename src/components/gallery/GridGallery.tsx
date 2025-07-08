import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

const GridWrapper = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto;
  max-width: 100%;
  gap: 6px;
  width: 100%;

  li {
    aspect-ratio: 1 / 1;
  }

  li:nth-of-type(1) {
    background-color: aqua;
  }
  li:nth-of-type(2) {
    background-color: blue;
  }
  li:nth-of-type(3) {
    background-color: brown;
  }
  li:nth-of-type(4) {
    background-color: teal;
  }
  li:nth-of-type(5) {
    background-color: yellow;
  }
  li:nth-of-type(6) {
    background-color: yellowgreen;
  }
  li:nth-of-type(7) {
    background-color: pink;
  }
  li:nth-of-type(8) {
    background-color: orange;
  }
  li:nth-of-type(9) {
    background-color: green;
  }
  li:nth-of-type(10) {
    background-color: purple;
  }
`;

const AddButton = styled.button`
  display: block;
  width: 100%;
  padding: 8px 0;
  margin-top: 10px;
  text-align: center;
  border: 1px solid #ccc;
`;

const GridGallery = () => {
  const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [imgArray, setImgArray] = useState<number[]>([]);
  const [startNumber, setStartNumber] = useState<number>(0);

  const sliceArray = () => {
    const newArray = testArray.slice(startNumber, startNumber + 2);
    setStartNumber(startNumber + 2);
    setImgArray([...imgArray, ...newArray]);
  };

  useEffect(() => {
    if (testArray.length >= 2) {
      sliceArray();
    }
  }, []);

  return (
    <>
      <GridWrapper>
        {imgArray.map((value) => (
          <li>{value}</li>
        ))}
      </GridWrapper>
      {testArray.length !== imgArray.length && (
        <AddButton onClick={() => sliceArray()}>더보기</AddButton>
      )}
    </>
  );
};

export default GridGallery;
