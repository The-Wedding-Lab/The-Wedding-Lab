/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";

export const InvitationCover: React.FC = () => {
  const { setupData } = useWeddingDataStore();
  const coverDesign = setupData.weddingInfo?.pages?.coverDesign;

  const displayMessage = coverDesign?.text?.trim() || "";

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        background: `linear-gradient(180deg, ${coverDesign?.backgroundColor} 0%, ${coverDesign?.backgroundColor2} 100%)`,
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      {coverDesign?.image?.url ? (
        <Box
          component="img"
          src={coverDesign.image.url}
          alt="청첩장 커버 이미지"
          css={css`
            width: 100%;
            height: 65vh;
            object-fit: cover;
            border-radius: 28px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            margin-bottom: 32px;
          `}
        />
      ) : (
        <Box
          component="img"
          src={`https://picsum.photos/400/600?random=1`}
          alt="청첩장 커버 이미지"
          css={css`
            width: 100%;
            height: 65vh;
            object-fit: cover;
            border-radius: 28px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            margin-bottom: 32px;
          `}
        />
      )}

      <Box
        css={css`
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 32px;
        `}
      >
        <Typography
          align="center"
          css={css`
            white-space: pre-line;
            font-size: 1.5rem;
            line-height: 2.2;
            color: #4c3f3f;
            font-weight: 300;
            letter-spacing: 0.03em;
          `}
        >
          {displayMessage
            ? displayMessage
            : "커버 디자인 텍스트를 입력해주세요."}
        </Typography>
      </Box>
    </Box>
  );
};
