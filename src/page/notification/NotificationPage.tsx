"use client";
import { useState } from "react";
import WeddingCountdown from "@/components/notification/WeddingCountdown";
import WeddingDatePicker from "@/components/notification/WeddingCalendar";
import WeddingDday from "@/components/notification/WeddingDday";
import dayjs, { Dayjs } from "dayjs";
import WeddingCalendar from "@/components/notification/WeddingCalendar";

const NotificationPage = () => {
  const [weddingDate, setWeddingDate] = useState<Dayjs>(dayjs("2025-10-15"));

  return (
    <>
      <WeddingDday weddingDate={"2025-09-25"} />
      <WeddingCountdown weddingDateTime={"2025-09-25T13:00:00"} />
      <WeddingCalendar weddingDate={"2025-10-15"} />
    </>
  );
};

export default NotificationPage;
