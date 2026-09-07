/**
 * Incident State Machine
 * Enforces valid incident lifecycle transitions
 */

import "server-only";

import { IncidentStatus, IncidentSeverity } from "@prisma/client";

// Re-export types for external use
export type { IncidentStatus, IncidentSeverity } from "@prisma/client";

/**
 * Valid incident state transitions
 */
export const incidentTransitions: Record<IncidentStatus, readonly IncidentStatus[]> = {
  REPORTED: ["TRIAGING", "CLOSED"],
  TRIAGING: ["ACTIVE_RESPONSE", "MONITORING", "CLOSED"],
  ACTIVE_RESPONSE: ["VET_CONTACTED", "TRANSPORTING", "MONITORING", "IMMEDIATE_RISK_RESOLVED"],
  VET_CONTACTED: ["TRANSPORTING", "MONITORING", "IMMEDIATE_RISK_RESOLVED"],
  TRANSPORTING: ["MONITORING", "IMMEDIATE_RISK_RESOLVED"],
  MONITORING: ["IMMEDIATE_RISK_RESOLVED", "ACTIVE_RESPONSE", "CLOSED"],
  IMMEDIATE_RISK_RESOLVED: ["REVIEW_PENDING"],
  REVIEW_PENDING: ["CORRECTIVE_ACTION_OPEN", "CLOSED"],
  CORRECTIVE_ACTION_OPEN: ["CLOSED"],
  CLOSED: [] // Terminal state
};

/**
 * Check if an incident state transition is valid
 */
export function canTransitionIncident(from: IncidentStatus, to: IncidentStatus): boolean {
  return incidentTransitions[from].includes(to);
}

/**
 * Validate incident transition or throw error
 */
export function validateIncidentTransition(
  from: IncidentStatus,
  to: IncidentStatus
): IncidentStatus {
  if (!canTransitionIncident(from, to)) {
    const validStates = incidentTransitions[from].join(", ");
    throw new Error(
      `Invalid incident transition from ${from} to ${to}. Valid transitions: ${validStates}`
    );
  }
  return to;
}

/**
 * Check if incident severity requires automatic sitter hold
 */
export function requiresAutomaticSitterHold(severity: IncidentSeverity): boolean {
  return severity === "CRITICAL" || severity === "HIGH";
}

/**
 * Check if incident severity requires immediate vet contact
 */
export function requiresVetContact(severity: IncidentSeverity): boolean {
  return severity === "CRITICAL" || severity === "HIGH";
}

/**
 * Get escalation timeline for incident severity
 * Returns time in minutes before escalation is required
 */
export function getEscalationTimelineMinutes(severity: IncidentSeverity): number {
  switch (severity) {
    case "CRITICAL":
      return 15; // Escalate after 15 minutes if not resolved
    case "HIGH":
      return 60; // Escalate after 1 hour
    case "MODERATE":
      return 120; // Escalate after 2 hours
    case "LOW":
      return 240; // Escalate after 4 hours
    default:
      return 120;
  }
}

/**
 * Check if incident requires corrective action
 */
export function requiresCorrectiveAction(
  severity: IncidentSeverity,
  status: IncidentStatus
): boolean {
  // Critical and High incidents always require corrective action
  if (severity === "CRITICAL" || severity === "HIGH") {
    return status === "REVIEW_PENDING";
  }

  // Moderate incidents may require corrective action based on review
  return false;
}

/**
 * Check if incident is in an active response phase
 */
export function isActiveResponse(status: IncidentStatus): boolean {
  return [
    "ACTIVE_RESPONSE",
    "VET_CONTACTED",
    "TRANSPORTING",
    "MONITORING"
  ].includes(status);
}

/**
 * Check if incident is resolved
 */
export function isResolved(status: IncidentStatus): boolean {
  return [
    "IMMEDIATE_RISK_RESOLVED",
    "REVIEW_PENDING",
    "CORRECTIVE_ACTION_OPEN",
    "CLOSED"
  ].includes(status);
}

/**
 * Check if incident status allows evidence upload
 */
export function canUploadEvidence(status: IncidentStatus): boolean {
  // Evidence can be uploaded at any stage except CLOSED
  return status !== "CLOSED";
}

/**
 * Get required response time in minutes based on severity
 */
export function getRequiredResponseTimeMinutes(severity: IncidentSeverity): number {
  switch (severity) {
    case "CRITICAL":
      return 5; // 5 minutes
    case "HIGH":
      return 15; // 15 minutes
    case "MODERATE":
      return 30; // 30 minutes
    case "LOW":
      return 60; // 1 hour
    default:
      return 30;
  }
}
