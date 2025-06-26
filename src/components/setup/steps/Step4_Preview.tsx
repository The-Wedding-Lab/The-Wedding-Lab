import { Box, Typography } from "@mui/material";
import React from "react";

interface StepProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const Step4_Preview = ({ data, setData }: StepProps) => {
  return (
    <Box>
      <Typography fontSize={24} fontWeight={700} gutterBottom>
        방법 선택
      </Typography>
    </Box>
  );
};

export default Step4_Preview;
