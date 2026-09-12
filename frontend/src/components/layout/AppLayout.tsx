import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, BedDouble, Bell, Activity } from "lucide-react";

export function AppLayout() {
  return (
    <div className="h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans relative">
      {/* Mobile Top Header */}
      <header className="md:hidden h-16 shrink-0 bg-white border-b border-slate-200 flex items-center px-4 justify-between z-10">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">AegisIV</h1>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> <span className="text-sm font-medium text-slate-600">Online</span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col z-10 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 shrink-0">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">AegisIV</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/beds" icon={<BedDouble size={20} />} label="Beds" />
          <NavItem to="/alerts" icon={<Bell size={20} />} label="Alerts" />
          <NavItem to="/system" icon={<Activity size={20} />} label="System Status" />
        </nav>
        <div className="p-4 border-t border-slate-200 shrink-0">
          <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live System
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 shrink-0 bg-white border-b border-slate-200 items-center px-8 justify-between z-10">
          <h2 className="text-lg font-medium text-slate-800">Nurse Monitoring Station</h2>
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> <span className="text-sm font-medium text-slate-600">System Online</span>
          </div>
        </header>
        
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 pb-20 md:pb-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
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
            ? "bg-slate-100 text-slate-900"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
          isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
        }`
      }
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
}
