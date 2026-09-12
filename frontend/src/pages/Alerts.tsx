import { useAegisData } from "../hooks/useAegisData";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Button } from "../components/ui/button";
import { Spinner } from "../components/ui/spinner";

export default function Alerts() {
  const { alerts, acknowledgeAlert, isLoading } = useAegisData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner />
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => !a.acknowledged).sort((a, b) => b.timestamp - a.timestamp);
  const resolvedAlerts = alerts.filter(a => a.acknowledged).sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Alerts & Notifications</h1>
        <p className="text-slate-500 mt-2 text-lg">System-wide monitoring of critical warnings and resolved events.</p>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>Requires Attention</span>
            <span className="bg-red-100 text-red-700 text-sm py-0.5 px-2.5 rounded-full font-semibold">
              {activeAlerts.length}
            </span>
          </h2>
        </div>
        
        {activeAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <p className="text-lg font-medium text-slate-700">All Clear</p>
            <p className="text-sm mt-1">There are no active alerts requiring your attention.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeAlerts.map(alert => (
              <div key={alert.id} className="relative overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm transition-all hover:shadow-md">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-50 rounded-full shrink-0">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center flex-wrap gap-2">
                        {alert.bedId} 
                        <span className="text-slate-300 hidden sm:inline">•</span> 
                        <span className="text-red-600">{alert.type}</span>
                      </h3>
                      <p className="text-slate-600 mt-1 text-base leading-relaxed">{alert.message}</p>
                      <p className="text-sm font-medium text-slate-400 mt-3 flex items-center gap-1.5">
                        <Info size={14} />
                        Triggered at {new Date(alert.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="lg" 
                    className="w-full sm:w-auto font-semibold shadow-sm hover:shadow-md transition-all text-base px-8" 
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    Acknowledge
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-5 pt-8">
        <h2 className="text-xl font-bold text-slate-800">Recently Resolved</h2>
        
        {resolvedAlerts.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <p className="text-slate-500">No recently resolved alerts to show.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resolvedAlerts.map(alert => (
              <div key={alert.id} className="group p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-50 rounded-full shrink-0 mt-0.5 sm:mt-0">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                      {alert.bedId} 
                      <span className="text-slate-300 font-normal">|</span> 
                      <span className="text-slate-600 font-normal">{alert.type}</span>
                    </p>
                    <p className="text-sm text-slate-500 mt-1">{alert.message}</p>
                  </div>
                </div>
                <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
                    Resolved by Nurse
                  </span>
                  <p className="text-slate-400 text-xs font-medium">
                    {new Date(alert.acknowledgedAt || alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
