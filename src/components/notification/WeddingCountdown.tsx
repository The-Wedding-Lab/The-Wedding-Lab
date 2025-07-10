/** @jsxImportSource @emotion/react */
import { Typography, Box } from "@mui/material";
import { css, keyframes } from "@emotion/react";
import { useEffect, useState } from "react";

interface CountdownProps {
  weddingDateTime: string; // "YYYY-MM-DDTHH:mm:ss"
}
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const WeddingCountdown = ({ weddingDateTime }: CountdownProps) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const target = new Date(weddingDateTime).getTime();
    const diff = target - now;

    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<ReturnType<
    typeof calculateTimeLeft
  > | null>();

  useEffect(() => {
    setTimeLeft(calculateTimeLeft()); // hydration 이후에만 계산
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (timeLeft === null) {
    return (
      <Typography
        variant="h6"
        css={css`
          color: #4caf50;
          text-align: center;
          margin-top: 12px;
        `}
      >
        결혼식이 시작되었습니다 🎊
      </Typography>
    );
  }

  if (timeLeft) {
    return (
      <Box
        css={css`
          background-color: #fff1f5;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(255, 192, 203, 0.25);
          text-align: center;
          margin-top: 16px;
          animation: ${fadeIn} 0.5s ease-out;
        `}
      >
        <Typography
          variant="h6"
          css={css`
            font-weight: 600;
            color: #c2185b;
            margin-bottom: 8px;
          `}
        >
          남은 시간
        </Typography>
        <Typography
          variant="h4"
          css={css`
            color: #ad1457;
            font-weight: bold;
            font-size: 1.8rem;
          `}
        >
          {timeLeft.days}일 {timeLeft.hours}시간 {timeLeft.minutes}분{" "}
          {timeLeft.seconds}초
        </Typography>
      </Box>
    );
  }
};

export default WeddingCountdown;
