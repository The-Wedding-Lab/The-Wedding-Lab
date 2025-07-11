"use client";
import { useState } from "react";
import WeddingCountdown from "@/components/notification/WeddingCountdown";
import WeddingDatePicker from "@/components/notification/WeddingCalendar";
import WeddingDday from "@/components/notification/WeddingDday";
import dayjs, { Dayjs } from "dayjs";
import WeddingCalendar from "@/components/notification/WeddingCalendar";
import { useWeddingDataStore } from "@/store/useWeddingDataStore";

const NotificationPage = () => {
  const { setupData } = useWeddingDataStore();
  return (
    <>
      <WeddingDday weddingDate={setupData.weddingInfo.weddingDateTime} />
      <WeddingCountdown
        weddingDateTime={setupData.weddingInfo.weddingDateTime}
      />
      <WeddingCalendar weddingDate={setupData.weddingInfo.weddingDateTime} />
    </>
  );
};

export default NotificationPage;
