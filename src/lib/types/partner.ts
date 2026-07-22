export type ServiceCategory = 'WALKING' | 'SITTING' | 'GROOMING_HOME' | 'VET_SUPPORT' | 'TRAINING_ASSESSMENT';

export type VerificationLevel = 
  | 'IDENTITY_VERIFIED' 
  | 'BACKGROUND_CHECKED' 
  | 'SKILLS_ASSESSED' 
  | 'SPECIALIST_APPROVED' 
  | 'PREFERRED';

export type SpecialistBadge = 
  | 'CAT_GROOMING'
  | 'LARGE_BREEDS'
  | 'SENIOR_PETS'
  | 'REACTIVE_PETS'
  | 'VET_BEHAVIORIST_PARTNER'
  | 'EXOTIC_PETS';

export interface PartnerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceCategories: ServiceCategory[];
  verificationLevel: VerificationLevel;
  specialistBadges: SpecialistBadge[];
  isVerified: boolean;
  registrationNumber?: string; // For veterinarians
  stateCouncil?: string; // For veterinarians
  certifications?: string[]; // For trainers/groomers
  bio: string;
  rating: number;
  completedBookings: number;
  joinedAt: string;
}
