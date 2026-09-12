import express from "express";
import cors from "cors";
import { initSensorService, getBeds, getAlerts, acknowledgeAlert, resetSystem, sensorEmitter } from "./sensorService.js";

const app = express();
app.disable("x-powered-by");
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Initialize the system
initSensorService();

app.get("/api/beds", (req, res) => {
  res.json(getBeds());
});

app.get("/api/beds/:bedId", (req, res) => {
  const bed = getBeds().find((b) => b.id === req.params.bedId);
  if (bed) res.json(bed);
  else res.status(404).json({ error: "Bed not found" });
});

app.get("/api/alerts", (req, res) => {
  res.json(getAlerts());
});

app.post("/api/alerts/:alertId/acknowledge", (req, res) => {
  const success = acknowledgeAlert(req.params.alertId);
  if (success) res.json({ success: true });
  else res.status(404).json({ error: "Alert not found" });
});

app.post("/api/system/reset", (req, res) => {
  resetSystem();
  res.json({ success: true, message: "System reset" });
});

// SSE Endpoint
app.get("/api/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE

  // Send initial data
  res.write(`data: ${JSON.stringify({ beds: getBeds(), alerts: getAlerts() })}\n\n`);

  const onUpdate = () => {
    res.write(`data: ${JSON.stringify({ beds: getBeds(), alerts: getAlerts() })}\n\n`);
  };

  sensorEmitter.on("update", onUpdate);

  req.on("close", () => {
    sensorEmitter.off("update", onUpdate);
  });
});

export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}
