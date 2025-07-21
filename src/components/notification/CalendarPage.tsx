import { useWeddingDataStore } from "@/store/useWeddingDataStore";
import React from "react";

const CalendarPage = () => {
  const { setupData } = useWeddingDataStore();
  const calendar = setupData.weddingInfo?.pages?.calendar;
  return <div>CalendarPage</div>;
};

export default CalendarPage;
