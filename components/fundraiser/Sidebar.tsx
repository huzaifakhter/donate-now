"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  HeartHandshake,
  Settings,
  Heart,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { href: "/fundraiser", label: "Dashboard", icon: LayoutDashboard },
  { href: "/fundraiser/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/fundraiser/donations", label: "Donations", icon: HeartHandshake },
  { href: "/fundraiser/settings", label: "Portal Settings", icon: Settings },
];

export default function FundraiserSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-48 flex-col border-r border-slate-200/60 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-outline-variant/20">
          <Link href="/" className="text-xl font-extrabold text-primary tracking-tight">
            Donate Now
          </Link>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md border border-input bg-background hover:bg-accent text-slate-500 hover:text-slate-900 lg:hidden cursor-pointer flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            // Check if active: exact match or starts with (excluding root dashboard)
            const isActive =
              pathname === item.href ||
              (item.href !== "/fundraiser" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose()}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors group mx-auto w-[164px] ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-primary hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-white"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer branding */}
        <div className="border-t border-slate-200/60 p-4">
          <p className="text-center text-[10px] text-slate-400 font-semibold">
            Partner Panel v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
