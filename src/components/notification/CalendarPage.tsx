import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import React from "react";
import WeddingCalendar from "./WeddingCalendar";

const CalendarPage = () => {
  const { setupData } = useWeddingDataStore();
  const calendar = setupData.weddingInfo?.pages?.calendar;
  return (
    <div>
      <WeddingCalendar weddingDate={calendar.weddingDate} />
    </div>
  );
};

export default CalendarPage;
