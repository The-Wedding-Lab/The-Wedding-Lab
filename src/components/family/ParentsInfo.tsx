/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Box, Typography } from "@mui/material";

interface ParentInfo {
  name: string;
  deceased?: boolean;
}

interface ParentsInfoProps {
  groomFather: ParentInfo;
  groomMother: ParentInfo;
  groomName: string;
  brideFather: ParentInfo;
  brideMother: ParentInfo;
  brideName: string;
  backgroundColor?: string;
}

const formatName = (parent: ParentInfo) =>
  parent.deceased ? `故${parent.name}` : parent.name;

export const ParentsInfo: React.FC<ParentsInfoProps> = ({
  groomFather,
  groomMother,
  groomName,
  brideFather,
  brideMother,
  brideName,
  backgroundColor = "#f9f7f3",
}) => {
  return (
    <Box
      css={css`
        background-color: ${backgroundColor};
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
            color: #444;
            margin-bottom: 4px;
          `}
        >
          {formatName(groomFather)} · {formatName(groomMother)} 의 아들
        </Typography>
        <Typography
          css={css`
            font-size: 1.3rem;
            font-weight: 500;
            color: #2d2d2d;
          `}
        >
          신랑 {groomName}
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
            color: #444;
            margin-bottom: 4px;
          `}
        >
          {formatName(brideFather)} · {formatName(brideMother)} 의 딸
        </Typography>
        <Typography
          css={css`
            font-size: 1.3rem;
            font-weight: 500;
            color: #2d2d2d;
          `}
        >
          신부 {brideName}
        </Typography>
      </Box>
    </Box>
  );
};
