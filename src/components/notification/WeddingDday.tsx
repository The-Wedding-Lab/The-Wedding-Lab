/** @jsxImportSource @emotion/react */
import { Typography, Box } from "@mui/material";
import { css, keyframes } from "@emotion/react";
import dayjs from "dayjs";

interface WeddingDdayProps {
  weddingDate: string; // "YYYY-MM-DD"
}

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const WeddingDday = ({ weddingDate }: WeddingDdayProps) => {
  const today = dayjs().startOf("day");
  const target = dayjs(weddingDate).startOf("day");
  const diffDays = target.diff(today, "day");

  const label =
    diffDays > 0
      ? `D-${diffDays}`
      : diffDays === 0
      ? "💍 D-Day 💍"
      : `D+${Math.abs(diffDays)}`;

  return (
    <Box
      css={css`
        background: linear-gradient(135deg, #ffe3ec, #ffcfd2);
        border-radius: 20px;
        padding: 32px 24px;
        text-align: center;
        box-shadow: 0 8px 20px rgba(255, 192, 203, 0.3);
        margin-top: 24px;
        animation: ${fadeInUp} 0.6s ease-out;
      `}
    >
      <Typography
        variant="h4"
        css={css`
          font-weight: 700;
          color: #d81b60;
          margin-bottom: 8px;
        `}
      >
        우리의 결혼식까지
      </Typography>
      <Typography
        variant="h2"
        css={css`
          font-weight: 900;
          font-size: 3rem;
          color: #ad1457;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        `}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default WeddingDday;
