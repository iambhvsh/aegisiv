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
    if (percentage > 30) return "bg-emerald-500";
    if (percentage > 10) return "bg-amber-500";
    return "bg-red-500";
  };

  const getBadgeVariant = (status: string) => {
    if (status === "NORMAL") return "default";
    if (status === "LOW") return "secondary";
    if (status === "CRITICAL") return "destructive";
    return "outline";
  };

  const getBadgeClassName = (status: string) => {
    if (status === "NORMAL") return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none";
    if (status === "LOW") return "bg-amber-100 text-amber-800 hover:bg-amber-100 border-none";
    if (status === "CRITICAL") return "bg-red-100 text-red-800 hover:bg-red-100 border-none";
    return "bg-slate-100 text-slate-800 hover:bg-slate-100 border-none";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Beds Directory</h1>
        <p className="text-slate-500 mt-1">Comprehensive view of all monitored IV systems.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by Bed ID or Device ID..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-48 shrink-0">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select 
            className="w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 appearance-none cursor-pointer"
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

      <div className="rounded-md border border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[750px]">
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Bed ID</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Device ID</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap min-w-[150px]">IV Remaining</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Est. Time</TableHead>
                <TableHead className="font-semibold text-slate-700 whitespace-nowrap">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBeds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                    No beds found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBeds.map((bed) => (
                  <TableRow 
                    key={bed.id} 
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => navigate(`/beds/${bed.id}`)}
                  >
                    <TableCell className="font-medium text-slate-900 whitespace-nowrap">{bed.id}</TableCell>
                    <TableCell className="text-slate-500 whitespace-nowrap">{bed.deviceId}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-9">{bed.percentage}%</span>
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
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
                    <TableCell className="text-slate-600 whitespace-nowrap">
                      {bed.status === "OFFLINE" ? "Unknown" : `${Math.round(bed.timeRemainingMs / 60000)} min`}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm whitespace-nowrap">
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
