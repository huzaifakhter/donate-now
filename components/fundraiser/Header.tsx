"use client";

import { signOut } from "@/app/actions/auth";
import { User, LogOut, CheckCircle2, Building2, Menu } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface HeaderProps {
  email: string;
  fullName: string;
  orgName: string;
  onMenuToggle?: () => void;
}

export default function FundraiserHeader({ email, fullName, orgName, onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200/60 h-16 px-6 sticky top-0 z-40 flex items-center justify-between">
      {/* Left side: Mobile Toggle & Org Info */}
      <div className="flex items-center gap-4">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer flex items-center justify-center border border-input transition-colors h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <Building2 className="h-4 w-4 text-primary" />
          <div>
            <span className="font-semibold text-xs text-on-surface block leading-none">
              {orgName || "Fundraising Organization"}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold tracking-wider uppercase flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="h-3 w-3 fill-emerald-100 text-emerald-600" />
              Verified Partner
            </span>
          </div>
        </div>
      </div>

      {/* Right side: User Dropdown */}
      <div className="flex items-center gap-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 hover:opacity-90 transition-all cursor-pointer focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                {fullName ? fullName.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <span className="block text-xs font-bold text-on-surface leading-none">
                  {fullName || "Fundraiser"}
                </span>
                <span className="block text-[10px] text-on-surface-variant mt-0.5">
                  {email}
                </span>
              </div>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="bg-white border border-slate-200/60 rounded-lg p-1 min-w-[200px] shadow-sm z-50 animate-in fade-in slide-in-from-top-1 duration-100"
              align="end"
            >
              <div className="px-3 py-1.5 border-b border-slate-200/60 mb-1">
                <span className="block text-[10px] text-on-surface-variant font-medium">Logged In As</span>
                <span className="block text-xs font-bold text-on-surface truncate mt-0.5">{email}</span>
              </div>

              <form action={signOut}>
                <DropdownMenu.Item asChild>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </DropdownMenu.Item>
              </form>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
