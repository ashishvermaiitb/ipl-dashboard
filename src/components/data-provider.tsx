"use client";

import { createContext, useContext, ReactNode } from "react";
import { useIPLData } from "@/hooks/use-ipl-data";
import { IPLData } from "@/types/ipl";

interface IPLDataContextType {
  data: IPLData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const IPLDataContext = createContext<IPLDataContextType | undefined>(undefined);

export function IPLDataProvider({
  children,
  refreshInterval = 60000,
}: {
  children: ReactNode;
  refreshInterval?: number;
}) {
  const iplData = useIPLData(refreshInterval);

  return (
    <IPLDataContext.Provider value={iplData}>
      {children}
    </IPLDataContext.Provider>
  );
}

export function useIPLDataContext() {
  const context = useContext(IPLDataContext);

  if (context === undefined) {
    throw new Error("useIPLDataContext must be used within an IPLDataProvider");
  }

  return context;
}
