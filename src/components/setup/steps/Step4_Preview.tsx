import { Box, Typography } from "@mui/material";
import React from "react";

interface StepProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const PreviewBox = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#EAF2FF",
        width: "100%",
        height: "300px",
      }}
    />
  );
};

const Step4_Preview = ({ data, setData }: StepProps) => {
  return (
    <Box>
      <Typography fontSize={24} fontWeight={700} gutterBottom>
        미리보기
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <PreviewBox />
        <PreviewBox />
        <PreviewBox />
        <PreviewBox />
        <PreviewBox />
      </Box>
    </Box>
  );
};

export default Step4_Preview;
