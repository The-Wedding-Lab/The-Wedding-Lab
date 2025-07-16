/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";

export const ParentsInfo: React.FC = () => {
  const { setupData } = useWeddingDataStore();

  return (
    <Box
      css={css`
        background-color: ${setupData.weddingInfo?.pages?.familyInfo
          ?.backgroundColor};
        padding: 48px 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: "Nanum Myeongjo", serif;
      `}
    >
      <Box
        css={css`
          margin-bottom: 32px;
          text-align: center;
        `}
      >
        <Typography
          css={css`
            font-size: 1.1rem;
            color: ${setupData.weddingInfo?.pages?.familyInfo?.fontColor};
            margin-bottom: 4px;
          `}
        >
          {setupData.weddingInfo?.groom?.father?.deceased && "故"}
          {setupData.weddingInfo?.groom?.father?.name} ·{" "}
          {setupData.weddingInfo?.groom?.mother?.deceased && "故"}
          {setupData.weddingInfo?.groom?.mother?.name} 의 아들
        </Typography>
        <Typography
          css={css`
            font-size: 1.3rem;
            font-weight: 500;
            color: ${setupData.weddingInfo?.pages?.familyInfo?.fontColor};
          `}
        >
          신랑 {setupData.weddingInfo?.groom?.name}
        </Typography>
      </Box>

      <Box
        css={css`
          text-align: center;
        `}
      >
        <Typography
          css={css`
            font-size: 1.1rem;
            color: ${setupData.weddingInfo?.pages?.familyInfo?.fontColor};
            margin-bottom: 4px;
          `}
        >
          {setupData.weddingInfo?.bride?.father?.deceased && "故"}
          {setupData.weddingInfo?.bride?.father?.name} ·{" "}
          {setupData.weddingInfo?.bride?.mother?.deceased && "故"}
          {setupData.weddingInfo?.bride?.mother?.name} 의 딸
        </Typography>
        <Typography
          css={css`
            font-size: 1.3rem;
            font-weight: 500;
            color: ${setupData.weddingInfo?.pages?.familyInfo?.fontColor};
          `}
        >
          신부 {setupData.weddingInfo?.bride?.name}
        </Typography>
      </Box>
    </Box>
  );
};
