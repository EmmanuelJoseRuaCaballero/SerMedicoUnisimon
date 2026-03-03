import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Stethoscope,
  ClipboardList,
  TrendingUp,
  Settings,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Portfolio", href: "/portfolio", icon: BookOpen },
  { label: "Clinical Practice", href: "/clinical-practice", icon: Stethoscope },
  { label: "Evaluations", href: "/evaluations", icon: ClipboardList },
  { label: "Academic Progress", href: "/academic-progress", icon: TrendingUp },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-primary text-sidebar-foreground
          flex flex-col border-r border-sidebar-border z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="bg-white/20 h-16 rounded-lg flex items-center justify-center mb-4">
            <span className="text-sm font-medium text-white">
              University Logo
            </span>
          </div>
          <h1 className="text-lg font-bold text-white">
            E-Portafolio
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-r-lg"></div>
                )}
                <Icon size={20} />
                <span className="font-medium text-sm">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4 text-xs opacity-60">
          v1.0 • Medical Platform
        </div>
      </aside>
    </>
  );
}