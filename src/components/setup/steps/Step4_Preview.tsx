import AppButton from "@/components/ui/AppButton";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";

import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

interface StepProps {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
}

const PreviewBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#EAF2FF",
        width: "100%",
        height: "300px",
      }}
    >
      {children}
    </Box>
  );
};

const Step4_Preview = ({ data, setData }: StepProps) => {
  const { setupData } = useWeddingDataStore();
  const [enabledPages, setEnabledPages] = useState<any>({});

  useEffect(() => {
    const pages = setupData.weddingInfo?.pages;
    if (pages) {
      const allEnabledPages = Object.entries(pages)
        .filter(([key, value]: [string, any]) => value?.enabled === true)
        .sort(
          ([, a], [, b]) => ((a as any)?.order || 0) - ((b as any)?.order || 0)
        ) // order 순서대로 정렬
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as any);

      setEnabledPages(allEnabledPages);
      console.log(allEnabledPages, "allEnabledPages");
    }
  }, [setupData.weddingInfo?.pages]);

  const handleLogZustandData = () => {
    console.log(setupData.weddingInfo);

    // pages에서 enabled가 true인 것만 필터링
    const pages = setupData.weddingInfo?.pages;
    if (pages) {
      const enabledPages = Object.entries(pages)
        .filter(([key, value]: [string, any]) => value?.enabled === true)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as any);

      console.log("Enabled pages:", enabledPages);
      console.log("Enabled page names:", Object.keys(enabledPages));
    }
  };
  return (
    <Box>
      <Typography fontSize={24} fontWeight={700} gutterBottom>
        미리보기
      </Typography>
      <Box
        sx={{
          backgroundColor: "#1e1e1e",
          border: "1px solid #333",
          borderRadius: 2,
          padding: 2,
          fontFamily: "monospace",
          color: "#f8f8f2",
          margin: "16px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography
          sx={{
            color: "#50fa7b",
            fontSize: "14px",
            fontFamily: "monospace",
            marginBottom: 1,
            textAlign: "center",
          }}
        >
          TEST 영역
        </Typography>
        <AppButton
          variant="outlined"
          onClick={handleLogZustandData}
          sx={{
            color: "#8be9fd",
            borderColor: "#8be9fd",
            fontFamily: "monospace",
            fontSize: "12px",
            textTransform: "none",
            "&:hover": {
              borderColor: "#50fa7b",
              backgroundColor: "rgba(139, 233, 253, 0.1)",
            },
          }}
        >
          console.log(setupData)
        </AppButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {Object.keys(enabledPages).map((page) => (
          <PreviewBox key={page}>{page}</PreviewBox>
        ))}
      </Box>
    </Box>
  );
};

export default Step4_Preview;
