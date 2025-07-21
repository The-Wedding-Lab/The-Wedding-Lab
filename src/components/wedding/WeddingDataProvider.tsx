"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface WeddingDataContextType {
  setupData: any;
  domain: string;
  weddingId: string;
}

const WeddingDataContext = createContext<WeddingDataContextType | null>(null);

interface WeddingDataProviderProps {
  children: ReactNode;
  setupData: any;
  domain: string;
  weddingId: string;
}

export const WeddingDataProvider = ({
  children,
  setupData,
  domain,
  weddingId,
}: WeddingDataProviderProps) => {
  return (
    <WeddingDataContext.Provider value={{ setupData, domain, weddingId }}>
      {children}
    </WeddingDataContext.Provider>
  );
};

export const useWeddingData = () => {
  const context = useContext(WeddingDataContext);
  if (!context) {
    throw new Error("useWeddingData must be used within a WeddingDataProvider");
  }
  return context;
};
