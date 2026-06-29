"use client";

import { useState } from "react";
import FundraiserSidebar from "./Sidebar";
import FundraiserHeader from "./Header";

interface FundraiserLayoutProps {
  children: React.ReactNode;
  email: string;
  fullName: string;
  orgName: string;
}

export default function FundraiserLayout({
  children,
  email,
  fullName,
  orgName,
}: FundraiserLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAFAFA]">
      {/* Sidebar navigation */}
      <FundraiserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <FundraiserHeader
          email={email}
          fullName={fullName}
          orgName={orgName}
          onMenuToggle={() => setIsSidebarOpen(true)}
        />

        {/* Scrollable Sub-pages */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
