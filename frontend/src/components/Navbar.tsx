import { LogOut, Menu } from "lucide-react";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  console.log("Usuario cargado en Navbar:", user);

  const handleLogout = () => {
    localStorage.removeItem("user");
    console.log("Usuario:", user);
  };

    return (
      <nav className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white border-b border-border flex items-center px-4 md:px-6 shadow-sm transition-all">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">
          {/* Hamburger (mobile only) */}
          <button className="md:hidden" onClick={onMenuClick}>
            <Menu size={22} />
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="ml-auto flex items-center gap-4 md:gap-6">
          {/* User Profile */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Profile Image */}
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] md:text-xs font-medium text-muted-foreground text-center">
                Img
              </span>
            </div>

            {/* User Info */}
            <div className="flex flex-col">
              <p className="text-xs md:text-sm font-semibold text-foreground">
                {user?.nombre} {user?.apellido}
              </p>
              <p className="h-6 text-xs text-muted-foreground">
                Code: 2045547646
              </p>
            </div>
          </div>

          {/* Divider (desktop only) */}
          <div className="hidden md:block h-6 w-px bg-border"></div>

          {/* Logout Button */}
          <button
            onClick={() => {
              window.location.href = "/";
              handleLogout();
            }}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors font-medium text-xs md:text-sm"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>
    );
  };

