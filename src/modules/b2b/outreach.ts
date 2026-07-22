export function generateCorporateMessage(params: { contactName: string; companyName: string; city: string; specificContext?: string }): string {
  const { contactName, companyName, city, specificContext } = params;
  return `Hi ${contactName},

PetSaathi helps working pet parents arrange verified dog walking, sitting, boarding and related local support.

We are testing a low-administration employee benefit for teams in ${city}, with employee eligibility, booking support and aggregate usage reporting.

${specificContext ? `I noticed ${specificContext}. ` : ''}Would a 20-minute discussion about a 30–45 day pilot for ${companyName} be relevant?

Best regards,
PetSaathi Enterprise Team`;
}

export function generateTownshipMessage(params: { contactName: string; propertyName: string; towers?: string }): string {
  const { contactName, propertyName, towers } = params;
  return `Hi ${contactName},

We provide managed pet-care support for occupied residential communities, including verified walking and sitting, resident onboarding, structured gate protocols, events and monthly reporting.

We would like to evaluate a limited pilot for ${propertyName}${towers ? `, beginning with ${towers}` : ''}. May we schedule a short operational discussion?

Best regards,
PetSaathi Community Partnerships`;
}

export function generateVetMessage(params: { doctorName: string; city: string }): string {
  const { doctorName, city } = params;
  return `Hi Dr. ${doctorName},

PetSaathi is building a local network for non-medical pet-care services in ${city}. We are looking for registered veterinary partners for referrals, emergency-directory support, community sessions and clinically reviewed educational content.

Clinical decisions would remain entirely with your practice. Would you be open to discussing a structured local referral partnership?

Best regards,
PetSaathi Veterinary Partnerships`;
}
