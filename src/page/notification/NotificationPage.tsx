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
    <Box
      sx={{
        width: "100%",
        background: `linear-gradient(135deg, ${calendar?.backgroundColor} 0%, ${calendar?.backgroundColor2} 100%)`,
      }}
    >
      {calendar?.view?.calendar && (
        <Box sx={{ width: "100%", height: "100%", padding: "24px" }}>
          <WeddingCalendar
            weddingDate={setupData.weddingInfo.weddingDateTime}
          />
        </Box>
      )}
      {calendar?.view?.dDay && (
        <Box sx={{ width: "100%", height: "100%", padding: "24px" }}>
          <WeddingDday weddingDate={setupData.weddingInfo.weddingDateTime} />
        </Box>
      )}
      {calendar?.view?.countdown && (
        <Box sx={{ width: "100%", height: "100%", padding: "24px" }}>
          <WeddingCountdown
            weddingDateTime={setupData.weddingInfo.weddingDateTime}
          />
        </Box>
      )}
    </Box>
  );
};

export default NotificationPage;
