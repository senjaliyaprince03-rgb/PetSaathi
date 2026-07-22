export const incidentStatuses = ["REPORTED", "TRIAGING", "ACTIVE_RESPONSE", "VET_CONTACTED", "TRANSPORTING", "MONITORING", "IMMEDIATE_RISK_RESOLVED", "REVIEW_PENDING", "CORRECTIVE_ACTION_OPEN", "CLOSED"] as const;
export type IncidentStatus = (typeof incidentStatuses)[number];

export const incidentTransitions: Record<IncidentStatus, readonly IncidentStatus[]> = {
  REPORTED: ["TRIAGING"],
  TRIAGING: ["ACTIVE_RESPONSE", "MONITORING"],
  ACTIVE_RESPONSE: ["VET_CONTACTED", "TRANSPORTING", "MONITORING", "IMMEDIATE_RISK_RESOLVED"],
  VET_CONTACTED: ["TRANSPORTING", "MONITORING", "IMMEDIATE_RISK_RESOLVED"],
  TRANSPORTING: ["MONITORING", "IMMEDIATE_RISK_RESOLVED"],
  MONITORING: ["ACTIVE_RESPONSE", "VET_CONTACTED", "IMMEDIATE_RISK_RESOLVED"],
  IMMEDIATE_RISK_RESOLVED: ["REVIEW_PENDING"],
  REVIEW_PENDING: ["CORRECTIVE_ACTION_OPEN", "CLOSED"],
  CORRECTIVE_ACTION_OPEN: ["CLOSED"],
  CLOSED: []
};

export function canTransitionIncident(from: IncidentStatus, to: IncidentStatus) {
  return incidentTransitions[from].includes(to);
}
