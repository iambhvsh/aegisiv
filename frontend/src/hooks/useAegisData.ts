import { useState, useEffect } from "react";

export type BedStatus = "NORMAL" | "LOW" | "CRITICAL" | "OFFLINE";

export interface Bed {
  id: string;
  deviceId: string;
  percentage: number;
  status: BedStatus;
  timeRemainingMs: number;
  lastUpdated: number;
}

export interface Alert {
  id: string;
  bedId: string;
  type: string;
  message: string;
  timestamp: number;
  acknowledged: boolean;
  acknowledgedAt?: number;
}

export function useAegisData() {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Instantly fetch initial data (Crucial for Vercel Serverless which buffers SSE)
    const fetchInitialData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || "";
        const [bedsRes, alertsRes] = await Promise.all([
          fetch(`${baseUrl}/api/beds`),
          fetch(`${baseUrl}/api/alerts`)
        ]);
        if (bedsRes.ok && alertsRes.ok) {
          setBeds(await bedsRes.json());
          setAlerts(await alertsRes.json());
        }
      } catch (e) {
        console.error("Failed to fetch initial data", e);
      }
    };
    fetchInitialData();

    // 2. Establish SSE Connection
    const eventSource = new EventSource(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/stream` : "/api/stream");

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.beds) setBeds(data.beds);
        if (data.alerts) setAlerts(data.alerts);
      } catch (err) {
        console.error("Failed to parse SSE data", err);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
      
      setTimeout(() => {
        setIsConnected(true); // visual only
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      await fetch(`${baseUrl}/api/alerts/${alertId}/acknowledge`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Failed to acknowledge alert", err);
    }
  };

  const resetSystem = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      await fetch(`${baseUrl}/api/system/reset`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to reset system:", error);
    }
  };

  return {
    beds,
    alerts,
    isConnected,
    acknowledgeAlert,
    resetSystem,
  };
}
