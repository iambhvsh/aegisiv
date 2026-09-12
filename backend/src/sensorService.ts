import { Bed, BedStatus, Alert } from "./types.js";
import { EventEmitter } from "node:events";
import crypto from "node:crypto";

export const sensorEmitter = new EventEmitter();

let beds: Bed[] = [];
let alerts: Alert[] = [];
let tickInterval: NodeJS.Timeout | null = null;

const INITIAL_BEDS: Bed[] = [
  { id: "BED-001", deviceId: "IV-001", percentage: 82, status: "NORMAL", timeRemainingMs: 82 * 60000, lastUpdated: Date.now() },
  { id: "BED-002", deviceId: "IV-002", percentage: 64, status: "NORMAL", timeRemainingMs: 64 * 60000, lastUpdated: Date.now() },
  { id: "BED-003", deviceId: "IV-003", percentage: 35, status: "NORMAL", timeRemainingMs: 35 * 60000, lastUpdated: Date.now() }, // Will decrement
  { id: "BED-004", deviceId: "IV-004", percentage: 25, status: "LOW", timeRemainingMs: 25 * 60000, lastUpdated: Date.now() },
  { id: "BED-005", deviceId: "IV-005", percentage: 8, status: "CRITICAL", timeRemainingMs: 8 * 60000, lastUpdated: Date.now() },
  { id: "BED-006", deviceId: "IV-006", percentage: 45, status: "OFFLINE", timeRemainingMs: 45 * 60000, lastUpdated: Date.now() - 300000 },
];

for (let i = 7; i <= 144; i++) {
  // Generate beds
  const isLow = i % 12 === 0; 
  const isOffline = i % 42 === 0;
  const percentage = isLow ? crypto.randomInt(15, 30) : crypto.randomInt(35, 99);
  
  let bedStatus: "NORMAL" | "LOW" | "CRITICAL" | "OFFLINE" = "NORMAL";
  if (isLow) bedStatus = "LOW";
  if (isOffline) bedStatus = "OFFLINE";

  INITIAL_BEDS.push({
    id: `BED-${i.toString().padStart(3, '0')}`,
    deviceId: `IV-${i.toString().padStart(3, '0')}`,
    percentage,
    status: bedStatus,
    timeRemainingMs: percentage * 60000,
    lastUpdated: isOffline ? Date.now() - 300000 : Date.now() - crypto.randomInt(0, 10000),
  });
}

export function initSensorService() {
  resetSystem();
  if (!tickInterval) {
    tickInterval = setInterval(updateTick, 3000); // Update every 3 seconds for testing
  }
}

export function resetSystem() {
  beds = structuredClone(INITIAL_BEDS);
  alerts = [];
  
  // Pre-populate some historical resolved alerts
  for (let i = 0; i < 25; i++) {
    const isCritical = crypto.randomInt(0, 10) > 4;
    alerts.push({
      id: `alert-hist-${i}`,
      bedId: `BED-${crypto.randomInt(10, 140).toString().padStart(3, '0')}`,
      type: isCritical ? "CRITICAL" : "OFFLINE",
      message: isCritical ? "Critical: IV level dropped below 10%" : "Device lost Wi-Fi connection",
      timestamp: Date.now() - crypto.randomInt(100000, 8000000),
      acknowledged: true,
      acknowledgedAt: Date.now() - crypto.randomInt(10000, 100000),
    });
  }
  
  sensorEmitter.emit("update");
}

export function getBeds() {
  return beds;
}

export function getAlerts() {
  return alerts;
}

export function acknowledgeAlert(alertId: string) {
  const alert = alerts.find((a) => a.id === alertId);
  if (alert) {
    alert.acknowledged = true;
    alert.acknowledgedAt = Date.now();
    sensorEmitter.emit("update");
    return true;
  }
  return false;
}

function calculateStatus(percentage: number, isOffline: boolean): BedStatus {
  if (isOffline) return "OFFLINE";
  if (percentage < 10) return "CRITICAL";
  if (percentage <= 30) return "LOW";
  return "NORMAL";
}

function updateTick() {
  let changed = false;

  // Decrease BED-003 specifically for testing
  const bed3 = beds.find((b) => b.id === "BED-003");
  if (bed3 && bed3.percentage > 8) {
    // Drop faster for testing purposes
    bed3.percentage = Math.max(8, bed3.percentage - 5);
    bed3.lastUpdated = Date.now();
    bed3.timeRemainingMs = bed3.percentage * 60000;
    
    const newStatus = calculateStatus(bed3.percentage, false);
    
    if (newStatus === "CRITICAL" && bed3.status !== "CRITICAL") {
      // Create alert
      alerts.push({
        id: `alert-${Date.now()}`,
        bedId: bed3.id,
        type: "CRITICAL",
        message: `Critical: ${bed3.percentage}% IV remaining. Approx ${Math.round(bed3.timeRemainingMs / 60000)} min left.`,
        timestamp: Date.now(),
        acknowledged: false,
      });
    }
    
    bed3.status = newStatus;
    changed = true;
  }

  // Also subtly update other normal beds
  for (const bed of beds) {
    if (bed.id !== "BED-003" && bed.id !== "BED-006" && bed.percentage > 0) {
      if (crypto.randomInt(0, 10) > 6) {
        bed.percentage -= 1;
        bed.lastUpdated = Date.now();
        bed.timeRemainingMs = bed.percentage * 60000;
        bed.status = calculateStatus(bed.percentage, false);
        changed = true;
      }
    }
  }

  if (changed) {
    sensorEmitter.emit("update");
  }
}
