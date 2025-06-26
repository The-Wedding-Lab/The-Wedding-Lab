import { Box, Typography } from "@mui/material";
import React from "react";

interface StepProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const Step2_AIPrompt = ({ data, setData }: StepProps) => {
  return (
    <Box>
      <Typography fontSize={24} fontWeight={700} gutterBottom>
        방법 선택
      </Typography>
      {/* 여기에 AI 프롬프트 입력창, 카테고리 선택 등 구현 */}
    </Box>
  );
};

export default Step2_AIPrompt;
