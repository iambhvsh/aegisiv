import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, BedDouble, Bell, Activity } from "lucide-react";

export function AppLayout() {
  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">AegisIV</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem to="/beds" icon={<BedDouble size={20} />} label="Beds" />
          <NavItem to="/alerts" icon={<Bell size={20} />} label="Alerts" />
          <NavItem to="/system" icon={<Activity size={20} />} label="System Status" />
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="text-sm text-slate-500 font-medium">Live System</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center px-8 justify-between">
          <h2 className="text-lg font-medium text-slate-800">Nurse Monitoring Station</h2>
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-sm font-medium text-slate-600">System Online</span>
          </div>
        </header>
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
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
