import { type ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Navbar onMenuClick={() => setIsOpen(true)} />

      <main className="mt-16 p-4 md:ml-64 md:p-6 transition-all">
        {children}
      </main>
    </div>
  );
}