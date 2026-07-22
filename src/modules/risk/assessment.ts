export type RiskFactors = {
  biteHistory: boolean;
  aggressionTowardPeople: boolean;
  aggressionTowardAnimals: boolean;
  escapeRisk: boolean;
  leashReactivity: boolean;
  medicalComplexity: boolean;
};

export function suggestRiskLevel(factors: RiskFactors) {
  if (factors.biteHistory || factors.aggressionTowardPeople) return "RED" as const;
  if (factors.aggressionTowardAnimals || factors.escapeRisk || factors.leashReactivity || factors.medicalComplexity) return "YELLOW" as const;
  return "GREEN" as const;
}
