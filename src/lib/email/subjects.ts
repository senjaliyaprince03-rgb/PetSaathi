export function getOtpSubject(purpose: string): string {
  const subjects: Record<string, string> = {
    registration: "Your PetSaathi verification code",
    login: "Your PetSaathi login code",
    "password-reset": "Reset your PetSaathi password",
    "email-change": "Confirm your new email — PetSaathi",
  };
  return subjects[purpose] ?? "Your PetSaathi verification code";
}

export const EMAIL_SUBJECTS = {
  WELCOME_CUSTOMER: "🐾 Welcome to PetSaathi!",
  WELCOME_SAATHI: "🐾 Welcome to the PetSaathi Saathi Family!",
  BOOKING_CONFIRMED: "✅ Your PetSaathi booking is confirmed",
  BOOKING_CANCELLED: "Your PetSaathi booking has been cancelled",
  PAYMENT_RECEIPT: "🧾 PetSaathi Payment Receipt",
  SAATHI_APPLICATION: "📋 PetSaathi — Application Received",
  SERVICE_REPORT_READY: "📸 Your pet's care report is ready",
} as const;
