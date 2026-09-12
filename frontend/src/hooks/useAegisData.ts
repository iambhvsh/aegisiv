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
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
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

  useEffect(() => {
    if (isConnected || beds.length === 0) return;

    const interval = setInterval(() => {
      setBeds(prev => prev.map(bed => {
        if (bed.status === "OFFLINE" || bed.percentage <= 0) return bed;
        
        // Randomly drop the IV bag percentage by a tiny amount
        const randomArray = new Uint32Array(1);
        window.crypto.getRandomValues(randomArray);
        const randomDecimal = randomArray[0] / 4294967295;
        let newP = bed.percentage - (randomDecimal * 0.4 + 0.1);
        if (newP < 0) newP = 0;
        
        let newStatus: "NORMAL" | "LOW" | "CRITICAL" | "OFFLINE";
        if (newP < 15) newStatus = "CRITICAL";
        else if (newP < 35) newStatus = "LOW";
        else newStatus = "NORMAL";

        return {
          ...bed,
          percentage: Number(newP.toFixed(1)),
          status: newStatus,
          timeRemainingMs: newP * 60000,
          lastUpdated: Date.now()
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected, beds.length]);

  const acknowledgeAlert = async (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId ? { ...a, acknowledged: true, acknowledgedAt: Date.now() } : a
    ));

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
      // Force refresh data
      const [bedsRes, alertsRes] = await Promise.all([
        fetch(`${baseUrl}/api/beds`),
        fetch(`${baseUrl}/api/alerts`)
      ]);
      if (bedsRes.ok && alertsRes.ok) {
        setBeds(await bedsRes.json());
        setAlerts(await alertsRes.json());
      }
    } catch (error) {
      console.error("Failed to reset system:", error);
    }
  };

  return {
    beds,
    alerts,
    isConnected,
    isLoading,
    acknowledgeAlert,
    resetSystem,
  };
}
