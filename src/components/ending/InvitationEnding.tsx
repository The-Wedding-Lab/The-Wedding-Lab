/** @jsxImportSource @emotion/react */
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import { css } from "@emotion/react";
import { Box, Typography } from "@mui/material";

const DEFAULT_IMAGE = "https://picsum.photos/400/600?random=2";

export const InvitationEnding: React.FC = () => {
  const { setupData } = useWeddingDataStore();

  const imageUrl = setupData.weddingInfo?.pages?.endingMessage?.image?.url;
  const message = setupData.weddingInfo?.pages?.endingMessage?.text;

  return (
    <Box
      css={css`
        position: relative;
        width: 100%;
        height: 500px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-family: "Nanum Myeongjo", serif;
        padding: 24px;
        box-sizing: border-box;
      `}
    >
      {/* 흑백 이미지 백그라운드 */}
      <Box
        css={css`
          position: absolute;
          inset: 0;
          background-image: url(${imageUrl ? imageUrl : DEFAULT_IMAGE});
          background-size: cover;
          background-position: center;
          filter: grayscale(100%);
          z-index: 0;
        `}
      />
      {/* 어두운 오버레이 */}
      <Box
        css={css`
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.655);
          z-index: 1;
        `}
      />
      {/* 텍스트 */}
      <Typography
        component="div"
        css={css`
          position: relative;
          white-space: pre-line;
          font-size: 1.3rem;
          line-height: 2;
          color: white;
          max-width: 90%;
          z-index: 2;
        `}
      >
        {message ? message : "마지막 글을 입력해주세요."}
      </Typography>
    </Box>
  );
};
