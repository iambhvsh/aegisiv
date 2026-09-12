import { useAegisData } from "../hooks/useAegisData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { AlertTriangle, Server, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Spinner } from "../components/ui/spinner";

export default function SystemStatus() {
  const { isConnected, isLoading } = useAegisData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">System Status</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Network health and fail-safe protocols.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md dark:shadow-xl/10 border-slate-200 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-slate-200">
              <Server className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              Network Status
            </CardTitle>
            <CardDescription className="dark:text-slate-400">Connection to central server</CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm transition-all hover:scale-[1.02]">
                <Wifi className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
                <div>
                  <p className="font-semibold text-emerald-900 dark:text-emerald-200">Server Online</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">SSE Stream connected and active</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/50 shadow-sm transition-all hover:scale-[1.02]">
                <WifiOff className="h-6 w-6 text-red-600 dark:text-red-500" />
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-200">Server Offline</p>
                  <p className="text-sm text-red-700 dark:text-red-400">Disconnected from SSE Stream</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md dark:shadow-xl/10 border-slate-200 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-900/50 backdrop-blur-sm transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
              <AlertTriangle className="h-5 w-5" />
              Offline Fail-Safe Behavior
            </CardTitle>
            <CardDescription className="dark:text-slate-400">What happens when a device loses Wi-Fi?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              When a device (like <span className="font-semibold dark:text-slate-200">BED-006</span>) loses connection to the network, the central system marks it as <strong className="dark:text-slate-200">OFFLINE</strong>.
            </p>
            <Alert className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 shadow-sm">
              <WifiOff className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <AlertTitle className="text-slate-800 dark:text-slate-200">1. Wi-Fi Offline</AlertTitle>
              <AlertDescription className="text-slate-600 dark:text-slate-400">
                The device detects loss of connection.
              </AlertDescription>
            </Alert>
            <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 shadow-sm">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">2. Local Buzzer + LED Alert</AlertTitle>
              <AlertDescription className="text-amber-700 dark:text-amber-400">
                The device relies on local hardware alerts to notify nearby staff.
              </AlertDescription>
            </Alert>
            <Alert className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 shadow-sm">
              <AlertTriangle className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
              <AlertTitle className="text-emerald-800 dark:text-emerald-300">3. IV Flow Continues</AlertTitle>
              <AlertDescription className="text-emerald-700 dark:text-emerald-400 font-medium">
                EXTREMELY IMPORTANT: Wi-Fi failure does NOT stop IV flow.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
