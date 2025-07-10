/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
      `}
    >
      <Box
        component="img"
        src={imageUrl}
        alt="청첩장 이미지"
        css={css`
          width: 100%;
          height: ${isMobile ? "55vh" : "65vh"};
          object-fit: cover;
          border-bottom: 1px solid #e7dfd8;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
        `}
      />
      <Box
        css={css`
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: ${isMobile ? "24px 20px" : "48px"};
          background-color: transparent;
        `}
      >
        <Typography
          align="center"
          css={css`
            white-space: pre-line;
            font-size: ${isMobile ? "1.1rem" : "1.5rem"};
            line-height: ${isMobile ? "1.9" : "2.2"};
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
