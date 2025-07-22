/** @jsxImportSource @emotion/react */
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Typography } from "@mui/material";
import { css, keyframes } from "@emotion/react";
import dayjs from "dayjs";
import "dayjs/locale/ko";

interface WeddingCalendarProps {
  weddingDate: string;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
`;

const WeddingCalendar = ({ weddingDate }: WeddingCalendarProps) => {
  const weddingDay = dayjs(weddingDate);

  const CustomPickersDay = (props: PickersDayProps) => {
    const { day, ...other } = props;
    const isWeddingDay = dayjs(day).isSame(weddingDay, "day");

    return (
      <PickersDay
        {...other}
        day={day}
        disabled
        sx={{
          ...(isWeddingDay && {
            color: "#ffffff",
            fontWeight: "bold",
            borderRadius: "50%",
          }),
          opacity: 1,
          color: "#444", // 기본 날짜 글자색
        }}
      />
    );
  };

  return (
    <div
      css={css`
        text-align: center;
        background-color: #fdf6ec; // 따뜻한 배경색
        padding: 24px;
        border-radius: 16px;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        max-height: 350px;
        animation: ${fadeIn} 0.6s ease;

        .MuiPickersCalendarHeader-label {
          color: #6d4c41; // 모카 브라운
          font-weight: 700;
        }

        .MuiDayCalendar-weekDayLabel {
          color: #5d4037;
          font-weight: 600;
        }

        .MuiPickersArrowSwitcher-button {
          color: #6d4c41;
        }
      `}
    >
      {/* <Typography
        variant="h6"
        css={css`
          margin-bottom: 12px;
          color: #2e7d32;
          font-weight: bold;
        `}
      >
        결혼 날짜 캘린더
      </Typography> */}
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <Typography
          fontSize={20}
          fontWeight={600}
          color="#333333"
          sx={{ my: 2 }}
        >
          {weddingDay.format("YYYY년 MM월 DD일")}
        </Typography>
        <DateCalendar
          defaultValue={weddingDay}
          readOnly
          disableHighlightToday
          minDate={weddingDay}
          maxDate={weddingDay}
          slots={{
            day: CustomPickersDay,
          }}
          sx={{
            width: "100%",
          }}
          slotProps={{
            calendarHeader: {
              sx: {
                display: "none",
              },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default WeddingCalendar;
