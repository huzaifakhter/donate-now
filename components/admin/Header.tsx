"use client";

import { useEffect, useState, useRef } from "react";
import { Menu, Bell, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/actions/auth";

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? "Administrator");
      }
    };
    fetchUser();
  }, [supabase]);

  // Handle clicking outside profile dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-outline-variant/30 bg-white px-6">
      {/* Mobile Toggle & Brand */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-low lg:hidden cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-sm font-semibold text-on-surface-variant">System Status:</span>
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Operational
          </span>
        </div>
      </div>

      {/* User Area */}
      <div className="flex items-center gap-4">
        {/* Notifications Mock */}
        <button className="relative rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white" />
        </button>

        {/* Vertical Separator */}
        <div className="h-6 w-px bg-outline-variant/30" />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 text-sm font-semibold text-on-surface hover:bg-surface-container-low cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed text-primary">
              <UserIcon className="h-4 w-4" />
            </div>
            <span className="hidden md:block max-w-[150px] truncate text-on-surface">
              {userEmail}
            </span>
            <ChevronDown className="h-4 w-4 text-on-surface-variant" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-outline-variant/30 bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
              <div className="px-4 py-2 border-b border-outline-variant/20">
                <p className="text-xs text-on-surface-variant">Logged in as</p>
                <p className="truncate text-sm font-bold text-on-surface">{userEmail}</p>
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
