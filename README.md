# AegisIV Monitoring System

AegisIV is a low-cost retrofit monitoring system for existing gravity-fed IV stands. This repository contains the complete software stack (Frontend Dashboard + Backend Service) designed to provide real-time telemetry, active alerts, and system health status to nurses.

Currently, the backend runs a **Mock Simulator Engine** simulating a massive 144-bed ward to allow for demonstration and UI testing without requiring physical hardware.

## 📂 Project Structure

This is a modular, full-stack monorepo:

### `/frontend` (React + Vite + Tailwind + TypeScript)
- **`src/pages/`**: The core screens (Dashboard, Beds Directory, Bed Details, Alerts, System Status).
- **`src/components/`**: Reusable premium UI components (cards, charts, badges, interactive elements).
- **`src/hooks/useAegisData.ts`**: The central nervous system of the frontend. It connects to the backend via Server-Sent Events (SSE) and seamlessly manages all real-time state.

### `/backend` (Node.js + Express + TypeScript)
- **`src/server.ts`**: The main Express server. It hosts the `/api/stream` endpoint which pushes live telemetry to the frontend via SSE.
- **`src/sensorService.ts`**: The core logic engine. Currently, this houses the mock data generator, but it is modular by design. This is where your hardware integration will live.

---

## 🔌 Connecting Actual Hardware (ESP32)

When your hardware prototype (Load Cell → HX711 → ESP32) is ready, switching from the mock simulator to real, live physical data is incredibly simple. **You do not need to rewrite or touch the frontend React code at all.** 

Follow these 3 simple steps:

### Step 1: Create an ingestion endpoint
In `backend/src/server.ts`, create a simple HTTP POST endpoint. Your ESP32 will send its Wi-Fi payload here.

```typescript
// Add this to server.ts
app.post('/api/readings', express.json(), (req, res) => {
  const { deviceId, percentage } = req.body;
  
  // Pass the real physical data into the service
  sensorService.updateRealReading(deviceId, percentage);
  
  res.sendStatus(200);
});
```

### Step 2: Stop the Mock Simulator
In `backend/src/sensorService.ts`, find the `initSensorService()` function. Delete or comment out the `setInterval` loop so the mock data stops overwriting your real physical data.

```typescript
export function initSensorService() {
  resetSystem();
  // Comment out the simulator tick
  // if (!tickInterval) {
  //   tickInterval = setInterval(updateTick, 3000); 
  // }
}
```

### Step 3: Handle the Real Data
In `backend/src/sensorService.ts`, create the `updateRealReading` function you called in Step 1. It takes the data, updates the specific bed, checks for critical alerts, and broadcasts it to the frontend.

```typescript
export function updateRealReading(deviceId: string, percentage: number) {
  // Find the exact bed this ESP32 is attached to
  const bed = beds.find(b => b.deviceId === deviceId);
  
  if (bed) {
    // Update telemetry
    bed.percentage = percentage;
    bed.lastUpdated = Date.now();
    bed.timeRemainingMs = percentage * 60000;
    
    // Automatically calculate if it is LOW or CRITICAL
    const newStatus = calculateStatus(percentage, false);
    
    // Trigger an alert if it just became CRITICAL
    if (newStatus === "CRITICAL" && bed.status !== "CRITICAL") {
      alerts.push({
        id: `alert-${Date.now()}`,
        bedId: bed.id,
        type: "CRITICAL",
        message: `Critical: IV level dropped to ${percentage}%`,
        timestamp: Date.now(),
        acknowledged: false,
      });
    }
    
    bed.status = newStatus;
    
    // 🚀 CRITICAL: This one line instantly pushes the new data 
    // to every connected Nurse Dashboard screen!
    sensorEmitter.emit("update"); 
  }
}
```

That's it! As long as you call `sensorEmitter.emit("update")` when your ESP32 pushes new data, the frontend dashboard will instantly update, charts will draw, and alerts will trigger automatically.
