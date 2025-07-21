"use client";

import { ReactNode } from "react";
import { IPLDataProvider } from "@/components/data-provider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <IPLDataProvider refreshInterval={30000}>{children}</IPLDataProvider>;
}
