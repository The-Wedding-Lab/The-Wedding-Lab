"use client";
import { useState } from "react";
import WeddingCountdown from "@/components/notification/WeddingCountdown";
import WeddingDatePicker from "@/components/notification/WeddingCalendar";
import WeddingDday from "@/components/notification/WeddingDday";
import dayjs, { Dayjs } from "dayjs";
import WeddingCalendar from "@/components/notification/WeddingCalendar";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import { Box } from "@mui/material";

const NotificationPage = () => {
  const { setupData } = useWeddingDataStore();
  const calendar = setupData.weddingInfo.pages.calendar;
  return (
    <Box sx={{ width: "100%" }}>
      {calendar?.view?.calendar && (
        <WeddingCalendar weddingDate={setupData.weddingInfo.weddingDateTime} />
      )}
      {calendar?.view?.dDay && (
        <WeddingDday weddingDate={setupData.weddingInfo.weddingDateTime} />
      )}
      {calendar?.view?.countdown && (
        <WeddingCountdown
          weddingDateTime={setupData.weddingInfo.weddingDateTime}
        />
      )}
    </Box>
  );
};

export default NotificationPage;
