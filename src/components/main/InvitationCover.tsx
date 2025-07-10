/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Box, Typography } from "@mui/material";

interface InvitationCoverProps {
  imageUrl: string;
  message?: string | null;
  brideName: string;
  groomName: string;
}

export const InvitationCover: React.FC<InvitationCoverProps> = ({
  imageUrl,
  message,
  brideName,
  groomName,
}) => {
  const displayMessage =
    message?.trim() || `${groomName} & ${brideName}\n저희 결혼합니다`;

  return (
    <Box
      css={css`
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: linear-gradient(180deg, #faf6f2 0%, #fdfdfd 100%);
        font-family: "Nanum Myeongjo", serif;
        padding: 32px;
        box-sizing: border-box;
      `}
    >
      <Box
        component="img"
        src={imageUrl}
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
          {displayMessage}
        </Typography>
      </Box>
    </Box>
  );
};
