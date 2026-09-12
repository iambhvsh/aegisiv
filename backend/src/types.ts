export type BedStatus = "NORMAL" | "LOW" | "CRITICAL" | "OFFLINE";

export interface Bed {
  id: string; // e.g. BED-001
  deviceId: string; // e.g. IV-001
  percentage: number;
  status: BedStatus;
  timeRemainingMs: number; // calculated from percentage
  lastUpdated: number; // timestamp
}

export interface Alert {
  id: string;
  bedId: string;
  type: "CRITICAL" | "OFFLINE";
  message: string;
  timestamp: number;
  acknowledged: boolean;
  acknowledgedAt?: number;
}
