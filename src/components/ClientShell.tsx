"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { AppProvider } from "@/components/TopHeader";

export function ClientShell({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <div className="app-shell">
        <Sidebar />
        <main className="main-area">
          {children}
        </main>
      </div>
    </AppProvider>
  );
}
