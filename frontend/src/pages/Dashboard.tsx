import { useAegisData } from "../hooks/useAegisData";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Activity, AlertTriangle, BedDouble, CheckCircle2, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

export default function Dashboard() {
  const { beds, alerts, isConnected, acknowledgeAlert, resetSystem } = useAegisData();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    if (status === "NORMAL") return "text-emerald-600";
    if (status === "LOW") return "text-amber-500";
    if (status === "CRITICAL") return "text-red-600";
    return "text-slate-500";
  };

  const generateSparkline = (percentage: number) => {
    return [
      { v: Math.min(percentage + 15, 100) },
      { v: Math.min(percentage + 10, 100) },
      { v: Math.max(percentage + 5, 0) },
      { v: Math.max(percentage + 2, 0) },
      { v: percentage },
    ];
  };

  const total = beds.length;
  const normal = beds.filter(b => b.status === "NORMAL").length;
  const low = beds.filter(b => b.status === "LOW").length;
  const critical = beds.filter(b => b.status === "CRITICAL").length;
  const offline = beds.filter(b => b.status === "OFFLINE").length;

  const activeAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time IV monitoring across all wards.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetSystem}>Reset System</Button>
          <Button onClick={() => navigate("/beds")}>View All Beds</Button>
        </div>
      </div>

      {!isConnected && (
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>Connection Lost</AlertTitle>
          <AlertDescription>
            Lost connection to the monitoring server. Retrying...
          </AlertDescription>
        </Alert>
      )}

      {activeAlerts.map(alert => (
        <Alert key={alert.id} variant="destructive" className="bg-red-50 border-red-200 text-red-900">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <div className="flex justify-between items-center w-full ml-2">
            <div>
              <AlertTitle className="text-red-800 font-semibold">{alert.bedId} - {alert.type}</AlertTitle>
              <AlertDescription className="text-red-700">{alert.message}</AlertDescription>
            </div>
            <Button variant="destructive" size="sm" onClick={() => acknowledgeAlert(alert.id)}>
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
        <Card className="col-span-2 shadow-sm border-slate-200 flex flex-col max-h-[650px]">
          <CardHeader className="shrink-0 border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-medium">Live Status (All Beds)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pt-4 pr-3">
            <div className="space-y-4">
              {beds.map(bed => (
                <button key={bed.id} type="button" className="w-full text-left flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => navigate(`/beds/${bed.id}`)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                      <BedDouble size={20} className="text-slate-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{bed.id}</p>
                      <p className="text-sm text-slate-500">{bed.deviceId}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-6">
                    <div className="w-20 h-8 hidden sm:block opacity-50">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={generateSparkline(bed.percentage)}>
                          <YAxis domain={[0, 100]} hide />
                          <Line type="monotone" dataKey="v" stroke="#64748b" strokeWidth={2.5} dot={false} isAnimationActive={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-16">
                      <p className="text-2xl font-bold tracking-tight text-slate-800">{bed.percentage}%</p>
                      <p className={`text-xs font-semibold uppercase tracking-wider ${getStatusColor(bed.status)}`}>{bed.status}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Critical Attention</CardTitle>
          </CardHeader>
          <CardContent>
            {critical === 0 && activeAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <CheckCircle2 size={48} className="mb-4 text-emerald-200" />
                <p>No critical beds</p>
              </div>
            ) : (
              <div className="space-y-4">
                {beds.filter(b => b.status === "CRITICAL").map(bed => (
                  <button key={bed.id} type="button" className="w-full text-left block p-4 rounded-lg bg-red-50 border border-red-100 cursor-pointer" onClick={() => navigate(`/beds/${bed.id}`)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-red-900">{bed.id}</p>
                        <p className="text-xs text-red-700">{bed.deviceId}</p>
                      </div>
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">{bed.percentage}%</span>
                    </div>
                    <p className="mt-3 text-sm text-red-800 font-medium">
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
    slate: "bg-slate-100 text-slate-700",
    emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700",
    red: "bg-red-100 text-red-700",
  };
  
  return (
    <Card className="shadow-sm border-slate-200 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h2>
          </div>
          <div className={`p-3 rounded-xl ${bgColors[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
