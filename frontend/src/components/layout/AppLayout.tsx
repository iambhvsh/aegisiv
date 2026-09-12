import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, BedDouble, Bell, Activity, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { ThemeToggle } from "../theme-toggle";

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="h-screen w-full bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row overflow-hidden font-sans relative">
      {/* Mobile Top Header */}
      <header className="md:hidden h-16 shrink-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center px-4 justify-between z-10">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">AegisIV</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 flex-col z-10 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">AegisIV</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/beds" icon={<BedDouble size={20} />} label="Beds" />
          <NavItem to="/alerts" icon={<Bell size={20} />} label="Alerts" />
          <NavItem to="/system" icon={<Activity size={20} />} label="System Status" />
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
              <UserCircle size={16} />
              <span>{user?.name}</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${user?.role === "DOCTOR" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"}`}>
              {user?.role}
            </span>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-md text-sm font-medium transition-colors">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 shrink-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 items-center px-8 justify-between z-10">
          <h2 className="text-lg font-medium text-slate-800 dark:text-slate-200">Nurse Monitoring Station</h2>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> <span className="text-sm font-medium text-slate-600 dark:text-slate-400">System Online</span>
          </div>
        </header>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 pb-20 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden absolute bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <MobileNavItem to="/" icon={<LayoutDashboard size={20} />} label="Dash" />
        <MobileNavItem to="/beds" icon={<BedDouble size={20} />} label="Beds" />
        <MobileNavItem to="/alerts" icon={<Bell size={20} />} label="Alerts" />
        <MobileNavItem to="/system" icon={<Activity size={20} />} label="System" />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { readonly to: string; readonly icon: React.ReactNode; readonly label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

function MobileNavItem({ to, icon, label }: { readonly to: string; readonly icon: React.ReactNode; readonly label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
          isActive ? "text-slate-900 dark:text-slate-100" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        }`
      }
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
}
