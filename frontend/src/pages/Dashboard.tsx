import React, { useMemo, useCallback } from "react";
import { useAegisData } from "../hooks/useAegisData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Activity, AlertTriangle, BedDouble, CheckCircle2, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, YAxis } from "recharts";
import { Spinner } from "../components/ui/spinner";
import { useAuth } from "../lib/auth";
import type { Bed } from "../../../backend/src/types";

// Extracted and memoized to prevent lag during scroll
const BedRow = React.memo(({ bed, onClick, getStatusColor }: { bed: Bed, onClick: () => void, getStatusColor: (status: string) => string }) => {
  // Memoize sparkline generation so it doesn't recalculate unless percentage changes
  const sparklineData = useMemo(() => {
    const p = bed.percentage;
    return [
      { v: Math.min(p + 15, 100) },
      { v: Math.min(p + 10, 100) },
      { v: Math.max(p + 5, 0) },
      { v: Math.max(p + 2, 0) },
      { v: p },
    ];
  }, [bed.percentage]);

  return (
    <button 
      type="button" 
      className="w-full text-left flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer transition-all hover:scale-[1.01]" 
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
          <BedDouble size={20} className="text-slate-600 dark:text-slate-400" />
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{bed.id}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{bed.deviceId}</p>
        </div>
      </div>
      <div className="text-right flex items-center gap-6">
        <div className="w-20 h-8 hidden sm:block opacity-50 dark:opacity-70">
          {/* Removed ResponsiveContainer to drastically improve scroll performance */}
          <LineChart width={80} height={32} data={sparklineData}>
            <YAxis domain={[0, 100]} hide />
            <Line type="monotone" dataKey="v" stroke="currentColor" className="text-slate-400 dark:text-slate-500" strokeWidth={2.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </div>
        <div className="w-16">
          <p className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-200">{bed.percentage}%</p>
          <p className={`text-xs font-semibold uppercase tracking-wider ${getStatusColor(bed.status)}`}>{bed.status}</p>
        </div>
      </div>
    </button>
  );
});
BedRow.displayName = 'BedRow';

export default function Dashboard() {
  const { user } = useAuth();
  const { beds, alerts, isConnected, isLoading, acknowledgeAlert, resetSystem } = useAegisData();
  const navigate = useNavigate();

  const getStatusColor = useCallback((status: string) => {
    if (status === "NORMAL") return "text-emerald-600 dark:text-emerald-400";
    if (status === "LOW") return "text-amber-500 dark:text-amber-400";
    if (status === "CRITICAL") return "text-red-600 dark:text-red-400";
    return "text-slate-500 dark:text-slate-400";
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner />
      </div>
    );
  }

  const total = beds.length;
  const normal = beds.filter(b => b.status === "NORMAL").length;
  const low = beds.filter(b => b.status === "LOW").length;
  const critical = beds.filter(b => b.status === "CRITICAL").length;
  const offline = beds.filter(b => b.status === "OFFLINE").length;

  const activeAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative z-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time IV monitoring across all wards.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          {user?.role === "DOCTOR" && (
            <Button variant="outline" className="flex-1 sm:flex-none border-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" onClick={resetSystem}>Reset System</Button>
          )}
          <Button onClick={() => navigate("/beds")} className="flex-1 sm:flex-none bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white shadow-md hover:scale-[1.02] transition-all">View All Beds</Button>
        </div>
      </div>

      {!isConnected && (
        <Alert variant="destructive" className="dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-300">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Connection Lost</AlertTitle>
          <AlertDescription>
            Lost connection to the monitoring server. Retrying...
          </AlertDescription>
        </Alert>
      )}

      {activeAlerts.map(alert => (
        <Alert key={alert.id} variant="destructive" className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-200 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500 mt-0.5 sm:mt-0" />
          <div className="flex flex-row justify-between items-center w-full ml-1 sm:ml-2 gap-2 sm:gap-4">
            <div>
              <AlertTitle className="font-semibold">{alert.bedId} - {alert.type}</AlertTitle>
              <AlertDescription className="text-xs sm:text-sm opacity-90">{alert.message}</AlertDescription>
            </div>
            <Button variant="destructive" size="sm" className="shrink-0 shadow-sm text-xs sm:text-sm px-3 sm:px-4 hover:scale-105 transition-transform" onClick={() => acknowledgeAlert(alert.id)}>
              Acknowledge
            </Button>
          </div>
        </Alert>
      ))}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Beds" value={total} icon={<BedDouble size={20} />} color="slate" />
        <StatCard title="Normal" value={normal} icon={<CheckCircle2 size={20} />} color="emerald" />
        <StatCard title="Low" value={low} icon={<Activity size={20} />} color="amber" />
        <StatCard title="Critical" value={critical} icon={<AlertTriangle size={20} />} color="red" />
        <StatCard title="Offline" value={offline} icon={<WifiOff size={20} />} color="slate" />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-2 shadow-lg dark:shadow-2xl/10 border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm flex flex-col max-h-[650px] transition-all">
          <CardHeader className="shrink-0 border-b border-slate-100 dark:border-slate-800/50 pb-4">
            <CardTitle className="text-lg font-medium dark:text-slate-200">Live Status (All Beds)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pt-4 pr-3">
            <div className="space-y-4">
              {beds.map(bed => (
                <BedRow 
                  key={bed.id} 
                  bed={bed} 
                  onClick={() => navigate(`/beds/${bed.id}`)} 
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg dark:shadow-2xl/10 border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm transition-all">
          <CardHeader className="px-4 md:px-6">
            <CardTitle className="text-lg font-medium dark:text-slate-200">Critical Attention</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            {critical === 0 && activeAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400 dark:text-slate-500">
                <CheckCircle2 size={48} className="mb-4 text-emerald-200 dark:text-emerald-900/50" />
                <p>No critical beds</p>
              </div>
            ) : (
              <div className="space-y-4">
                {beds.filter(b => b.status === "CRITICAL").map(bed => (
                  <button key={bed.id} type="button" className="w-full text-left block p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 cursor-pointer hover:scale-[1.02] transition-transform shadow-sm" onClick={() => navigate(`/beds/${bed.id}`)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-red-900 dark:text-red-200">{bed.id}</p>
                        <p className="text-xs text-red-700 dark:text-red-400">{bed.deviceId}</p>
                      </div>
                      <span className="bg-red-600 dark:bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">{bed.percentage}%</span>
                    </div>
                    <p className="mt-3 text-sm text-red-800 dark:text-red-300 font-medium">
                      Est. {Math.round(bed.timeRemainingMs / 60000)} min remaining
                    </p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { readonly title: string; readonly value: number; readonly icon: React.ReactNode; readonly color: string }) {
  const bgColors: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  
  return (
    <Card className="shadow-md hover:shadow-lg dark:shadow-xl/10 dark:hover:shadow-2xl/20 transition-all duration-300 border-slate-200 dark:border-slate-800/60 overflow-hidden bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{value}</h2>
          </div>
          <div className={`p-3 rounded-xl ${bgColors[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
