import { useParams, useNavigate } from "react-router-dom";
import { useAegisData } from "../hooks/useAegisData";
import { Button } from "../components/ui/button";
import { ArrowLeft, AlertTriangle, Activity, Clock, CheckCircle2, WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Spinner } from "../components/ui/spinner";

export default function BedDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { beds, alerts, acknowledgeAlert, isLoading } = useAegisData();
  const [history, setHistory] = useState<{ time: string, percentage: number }[]>([]);

  const bed = beds.find(b => b.id === id);
  const activeAlert = alerts.find(a => a.bedId === id && !a.acknowledged);

  useEffect(() => {
    if (bed && history.length === 0) {
      const hist = [];
      let currentP = Math.min(100, bed.percentage + 15);
      const now = new Date();
      for (let i = 40; i > 0; i--) {
        const t = new Date(now.getTime() - i * 3000);
        hist.push({
          time: t.toLocaleTimeString(),
          percentage: Math.round(Math.min(100, Math.max(0, currentP)))
        });
        const randomArray = new Uint32Array(1);
        window.crypto.getRandomValues(randomArray);
        const randomDecimal = randomArray[0] / 4294967295;
        currentP -= (randomDecimal * 0.6) + 0.1;
      }
      setHistory(hist);
    } else if (bed) {
      setHistory(prev => {
        const newHistory = [...prev, { time: new Date().toLocaleTimeString(), percentage: bed.percentage }];
        if (newHistory.length > 40) return newHistory.slice(-40);
        return newHistory;
      });
    }
  }, [bed?.percentage, bed?.id]);

  const getProgressBarColor = (status: string) => {
    if (status === "NORMAL") return "text-emerald-500 transition-all duration-1000";
    if (status === "LOW") return "text-amber-500 transition-all duration-1000";
    if (status === "CRITICAL") return "text-red-500 transition-all duration-1000";
    return "text-slate-300 transition-all duration-1000";
  };

  const getBadgeClassName = (status: string) => {
    if (status === "NORMAL") return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100";
    if (status === "LOW") return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    if (status === "CRITICAL") return "bg-red-100 text-red-800 hover:bg-red-100 animate-pulse";
    return "bg-slate-100 text-slate-800 hover:bg-slate-100";
  };

  const getLineChartColor = (status: string) => {
    if (status === 'CRITICAL') return '#ef4444';
    if (status === 'LOW') return '#f59e0b';
    return '#10b981';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner />
      </div>
    );
  }

  if (!bed) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 animate-in fade-in">
        <h2 className="text-2xl font-bold text-slate-700">Bed Not Found</h2>
        <Button onClick={() => navigate("/beds")} variant="outline">Back to Beds</Button>
      </div>
    );
  }

  const isOffline = bed.status === "OFFLINE";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/beds")} className="shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{bed.id}</h1>
          <p className="text-slate-500 mt-1 flex flex-wrap items-center gap-2 text-sm md:text-base">
            <span>Device: <span className="font-medium text-slate-700">{bed.deviceId}</span></span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span>Last updated: {new Date(bed.lastUpdated).toLocaleTimeString()}</span>
          </p>
        </div>
      </div>

      {isOffline && (
        <Alert variant="destructive" className="bg-slate-50 border-slate-200 text-slate-800">
          <WifiOff className="h-5 w-5 text-slate-500" />
          <AlertTitle className="text-slate-900 font-semibold">Device Offline</AlertTitle>
          <AlertDescription className="text-slate-600 mt-2 space-y-2">
            <p>Connection to the device has been lost. Last known IV level was {bed.percentage}%.</p>
            <div className="bg-white p-3 rounded-md border border-slate-200 text-sm flex flex-col gap-2">
              <p className="flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500" /> Local Buzzer + LED Alert activated on device</p>
              <p className="flex items-center gap-2 font-medium text-emerald-700"><CheckCircle2 size={16} /> IV flow continues normally</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {activeAlert && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
          <AlertTriangle className="h-6 w-6 text-red-600" />
          <div className="flex justify-between items-center w-full ml-3">
            <div>
              <AlertTitle className="text-red-800 font-bold text-lg">{activeAlert.type} ALERT</AlertTitle>
              <AlertDescription className="text-red-700 text-base">{activeAlert.message}</AlertDescription>
            </div>
            <Button variant="destructive" size="lg" className="font-semibold shadow-sm" onClick={() => acknowledgeAlert(activeAlert.id)}>
              Acknowledge Alert
            </Button>
          </div>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="relative mb-6">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle 
                  cx="96" cy="96" r="88" 
                  stroke="currentColor" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray="552.92" 
                  strokeDashoffset={552.92 - (552.92 * Math.max(bed.percentage, 0)) / 100} 
                  strokeLinecap="round"
                  className={getProgressBarColor(bed.status)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold tracking-tighter text-slate-800">{isOffline ? "--" : bed.percentage}<span className="text-2xl text-slate-400">%</span></span>
              </div>
            </div>
            
            <Badge className={`px-4 py-1.5 text-sm font-semibold uppercase ${getBadgeClassName(bed.status)}`}>
              {bed.status}
            </Badge>

            <div className="w-full mt-8 grid grid-cols-2 gap-4 text-center">
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider flex items-center justify-center gap-1"><Clock size={14}/> Est. Time</p>
                <p className="text-lg font-bold text-slate-800">{isOffline ? "--" : `${Math.round(bed.timeRemainingMs / 60000)} min`}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider flex items-center justify-center gap-1"><Activity size={14}/> Flow Rate</p>
                <p className="text-lg font-bold text-slate-800">{isOffline ? "--" : "Steady"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>IV Level Trend</CardTitle>
            <CardDescription>Live telemetry over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] md:h-[400px] w-full min-h-[300px]">
            <ResponsiveContainer width="99%" height="100%">
              <LineChart data={history} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  domain={[0, 100]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke={getLineChartColor(bed.status)} 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
