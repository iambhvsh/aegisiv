import { useAegisData } from "../hooks/useAegisData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { AlertTriangle, Server, Wifi, WifiOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";

export default function SystemStatus() {
  const { isConnected } = useAegisData();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Status</h1>
        <p className="text-slate-500 mt-1">Network health and fail-safe protocols.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-slate-500" />
              Network Status
            </CardTitle>
            <CardDescription>Connection to central server</CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <Wifi className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-900">Server Online</p>
                  <p className="text-sm text-emerald-700">SSE Stream connected and active</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
                <WifiOff className="h-6 w-6 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">Server Offline</p>
                  <p className="text-sm text-red-700">Disconnected from SSE Stream</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-slate-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              Offline Fail-Safe Behavior
            </CardTitle>
            <CardDescription>What happens when a device loses Wi-Fi?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              When a device (like <span className="font-semibold">BED-006</span>) loses connection to the network, the central system marks it as <strong>OFFLINE</strong>.
            </p>
            <Alert className="bg-white border-slate-200">
              <WifiOff className="h-4 w-4 text-slate-500" />
              <AlertTitle className="text-slate-800">1. Wi-Fi Offline</AlertTitle>
              <AlertDescription className="text-slate-600">
                The device detects loss of connection.
              </AlertDescription>
            </Alert>
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">2. Local Buzzer + LED Alert</AlertTitle>
              <AlertDescription className="text-amber-700">
                The device relies on local hardware alerts to notify nearby staff.
              </AlertDescription>
            </Alert>
            <Alert className="bg-emerald-50 border-emerald-200">
              <AlertTriangle className="h-4 w-4 text-emerald-600" />
              <AlertTitle className="text-emerald-800">3. IV Flow Continues</AlertTitle>
              <AlertDescription className="text-emerald-700 font-medium">
                EXTREMELY IMPORTANT: Wi-Fi failure does NOT stop IV flow.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
