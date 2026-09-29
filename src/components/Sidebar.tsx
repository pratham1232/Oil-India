"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, MapPin, ShieldAlert, Radio, BookOpen,
  FileText, Bot, Network, Settings, HelpCircle, LogOut,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const mainNav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/map", label: "Nearby Wells", icon: MapPin },
  { href: "/risk", label: "Risk Intelligence", icon: ShieldAlert },
  { href: "/simulator", label: "Live Monitor", icon: Radio },
  { href: "/knowledge", label: "Knowledge Base", icon: BookOpen },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/architecture", label: "System Architecture", icon: Network },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-mark">NW</div>
          <div className="logo-text">
            <span className="brand">NWIS</span>
            <span className="sub">eRTMAC Integration</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Navigation</div>
        {mainNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${isActive(item.href) ? "active" : ""}`}>
              <Icon className="nav-icon" size={18} strokeWidth={1.8} />
              <span className="nav-label">{item.label}</span>
              {item.href === "/risk" && <span className="nav-badge">3</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-info">
          <div className="sidebar-footer-avatar">DE</div>
          <div className="logo-text" style={{ flex: 1 }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--text-primary)" }}>Demo Engineer</span>
            <span className="sub">Drilling Operations</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
          <button className="collapse-btn" title="Settings" style={{ flex: 1 }}>
            <Settings size={15} /> <span className="collapse-text">Settings</span>
          </button>
          <button className="collapse-btn" title="Help" style={{ flex: 1 }}>
            <HelpCircle size={15} /> <span className="collapse-text">Help</span>
          </button>
          <button className="collapse-btn" title="Sign out" style={{ flex: 1 }}>
            <LogOut size={15} /> <span className="collapse-text">Sign Out</span>
          </button>
        </div>

        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)} style={{ marginTop: "4px" }}>
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          <span className="collapse-text">Collapse</span>
        </button>
      </div>
    </aside>
  );
}
