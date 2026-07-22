import type { LeadStatus } from "@prisma/client";

export const leadTransitions: Record<LeadStatus, readonly LeadStatus[]> = {
  NEW: ["CONTACTED", "DISQUALIFIED"],
  CONTACTED: ["QUALIFIED", "DISQUALIFIED"],
  QUALIFIED: ["PILOT_PROPOSED", "CONVERTED", "DISQUALIFIED"],
  PILOT_PROPOSED: ["CONVERTED", "QUALIFIED", "DISQUALIFIED"],
  CONVERTED: [],
  DISQUALIFIED: ["NEW"]
};

export function canTransitionLead(from: LeadStatus, to: LeadStatus) { return leadTransitions[from].includes(to); }
