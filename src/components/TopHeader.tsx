"use client";

import { useState, createContext, useContext, useEffect, type ReactNode } from "react";
import { Search, Bell, ChevronDown, Moon, Sun } from "lucide-react";
import { wells } from "@/lib/data";

interface AppContextType {
  activeWellId: string;
  setActiveWellId: (id: string) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType>({
  activeWellId: "well-004",
  setActiveWellId: () => {},
  theme: "dark",
  toggleTheme: () => {},
});

export function useActiveWell() {
  return useContext(AppContext);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeWellId, setActiveWellId] = useState("well-004");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("nwis-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      if (saved === "light") document.body.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("nwis-theme", next);
      if (next === "light") document.body.classList.add("light");
      else document.body.classList.remove("light");
      return next;
    });
  };

  return (
    <AppContext.Provider value={{ activeWellId, setActiveWellId, theme, toggleTheme }}>
      {children}
    </AppContext.Provider>
  );
}

export function TopHeader({ title }: { title: string }) {
  const { activeWellId, setActiveWellId, theme, toggleTheme } = useActiveWell();
  const activeWell = wells.find((w) => w.id === activeWellId);

  return (
    <header className="top-header">
      <div className="header-left">
        <div className="header-breadcrumb">
          <span>NWIS</span>
          <span style={{ color: "var(--text-muted)" }}>/</span>
          <span className="current">{title}</span>
        </div>

        <div className="header-well-select">
          <ChevronDown size={14} style={{ color: "var(--text-tertiary)" }} />
          <select
            value={activeWellId}
            onChange={(e) => setActiveWellId(e.target.value)}
          >
            {wells.filter((w) => w.status === "Active").map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>

        <div className="header-search">
          <Search size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input placeholder="Search wells, events, documents..." />
        </div>
      </div>

      <div className="header-right">
        <div className="header-status">
          <span className="dot online" />
          <span className="mono">System OK</span>
        </div>

        <span className="header-demo-badge">Demo Environment</span>

        <button className="header-icon-btn" title="Toggle Theme" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button className="header-icon-btn" title="Notifications">
          <Bell size={17} />
          <span className="notif-dot" />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "4px 8px", borderRadius: "var(--radius)", transition: "background 150ms" }}>
          <div style={{
            width: 28, height: 28, borderRadius: "var(--radius)", background: "var(--accent-blue-muted)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 600, color: "var(--accent-blue)"
          }}>DE</div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{activeWell?.name || "Select Well"}</span>
        </div>
      </div>
    </header>
  );
}
