import { useAegisData } from "../hooks/useAegisData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Spinner } from "../components/ui/spinner";

export default function Beds() {
  const { beds, isLoading } = useAegisData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner />
      </div>
    );
  }

  const filteredBeds = beds.filter(bed => {
    const matchesSearch = bed.id.toLowerCase().includes(search.toLowerCase()) || bed.deviceId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || bed.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getProgressBarColor = (percentage: number) => {
    if (percentage > 30) return "bg-emerald-500 dark:bg-emerald-400";
    if (percentage > 10) return "bg-amber-500 dark:bg-amber-400";
    return "bg-red-500 dark:bg-red-400";
  };

  const getBadgeVariant = (status: string) => {
    if (status === "NORMAL") return "default";
    if (status === "LOW") return "secondary";
    if (status === "CRITICAL") return "destructive";
    return "outline";
  };

  const getBadgeClassName = (status: string) => {
    if (status === "NORMAL") return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border-none";
    if (status === "LOW") return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 border-none";
    if (status === "CRITICAL") return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border-none";
    return "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-none";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Beds Directory</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Comprehensive view of all monitored IV systems.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400 z-10 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search by Bed ID or Device ID..." 
            className="w-full pl-10 pr-4 py-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 transition-all shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-48 shrink-0">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400 z-10 pointer-events-none" />
          <select 
            className="w-full pl-10 pr-8 py-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-500 appearance-none cursor-pointer shadow-sm transition-all"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
            <option value="CRITICAL">Critical</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm overflow-hidden transition-all">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[750px]">
            <TableHeader className="bg-slate-50/50 dark:bg-slate-950/50">
              <TableRow className="border-slate-200 dark:border-slate-800">
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Bed ID</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Device ID</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap min-w-[150px]">IV Remaining</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Est. Time</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBeds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-500 dark:text-slate-400">
                    No beds found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBeds.map((bed) => (
                  <TableRow 
                    key={bed.id} 
                    className="cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 border-slate-200 dark:border-slate-800 transition-colors"
                    onClick={() => navigate(`/beds/${bed.id}`)}
                  >
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">{bed.id}</TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400 whitespace-nowrap">{bed.deviceId}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-9 dark:text-slate-300">{bed.percentage}%</span>
                        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(bed.percentage)}`}
                            style={{ width: `${Math.max(bed.percentage, 0)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant={getBadgeVariant(bed.status) as any} className={getBadgeClassName(bed.status)}>
                        {bed.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {bed.status === "OFFLINE" ? "Unknown" : `${Math.round(bed.timeRemainingMs / 60000)} min`}
                    </TableCell>
                    <TableCell className="text-slate-500 dark:text-slate-400 text-sm whitespace-nowrap">
                      {new Date(bed.lastUpdated).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
