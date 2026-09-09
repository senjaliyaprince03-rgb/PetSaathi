import { CheckCircle2, Clock3, HeartHandshake, Home, MapPinned, Navigation, PawPrint, ShieldCheck, UserCheck, Video } from "lucide-react";

export const coreServiceCodes = ["DOG_WALK_30", "DOG_WALK_60", "HOME_VISIT", "HOME_SITTING_60", "GROOMING_HOME", "VET_SUPPORT", "TRAINING_ASSESSMENT", "PET_TAXI"] as const;
export type CoreServiceCode = (typeof coreServiceCodes)[number];

export const services = [
  {
    slug: "dog-walking",
    name: "Dog Walking",
    kicker: "30 or 60-Minute Outings",
    description: "Assisted local matching with structured start, completion and care-report events. Live tracking appears only when the gated service is eligible and consented.",
    tone: "saffron",
    icon: MapPinned,
    image: "/images/service_dog_walking_v2.webp"
  },
  {
    slug: "home-pet-sitting",
    name: "Home Pet Sitting",
    kicker: "In-Home Companionship & Care",
    description: "Nutritional feeding, fresh water, playful interaction, and home safety checks tailored to your pet's routine.",
    tone: "coral",
    icon: Home,
    image: "/images/service_pet_sitting_v2.webp"
  },
  {
    slug: "boarding-beta",
    name: "Boarding Beta",
    kicker: "Controlled Host Pilot",
    description: "Request-only boarding for property-assessed hosts and compatible pets, enabled only after the pilot gate and operating controls are approved.",
    tone: "leaf",
    icon: ShieldCheck,
    image: "/images/service-pet-boarding.webp"
  },
  {
    slug: "grooming",
    name: "In-Home Grooming",
    kicker: "Request-Only Home Grooming",
    description: "Partner-delivered grooming requested for the pet's home, with exact service scope and provider availability confirmed before an order proceeds.",
    tone: "blue",
    icon: PawPrint,
    image: "/images/service-pet-grooming.webp"
  },
  {
    slug: "veterinary",
    name: "Veterinary Support",
    kicker: "Non-Emergency Coordination",
    description: "Request-only coordination with approved veterinary partners. PetSaathi does not diagnose, promise clinic availability or replace emergency services.",
    tone: "teal",
    icon: ShieldCheck,
    image: "/images/service-vet-care.webp"
  },
  {
    slug: "training",
    name: "Training Assessment",
    kicker: "Specialist Intake",
    description: "A request for reward-led behaviour and training intake with an approved specialist, subject to fit, scope and availability.",
    tone: "indigo",
    icon: HeartHandshake,
    image: "/images/service-dog-training.webp"
  },
  {
    slug: "pet-taxi",
    name: "Pet Taxi",
    kicker: "Scheduled & Safe Transport",
    description: "Traceable doorstep-to-destination pet transit with vetted drivers, stress-free crates, and real-time status updates.",
    tone: "saffron",
    icon: Navigation,
    image: "/images/service_dog_walking_v2.webp"
  }
] as const;

export const trustSignals = [
  { label: "Service-Specific Permission Checks", icon: PawPrint },
  { label: "Structured Milestones and Reports", icon: Clock3 },
  { label: "Human Exception Workflows", icon: HeartHandshake },
  { label: "Background-Verified Saathis", icon: UserCheck },
  { label: "Real-time Location Tracking", icon: MapPinned },
  { label: "Secure Digital Payments", icon: ShieldCheck },
  { label: "Photo & Video Updates", icon: Video },
  { label: "Quality Assurance Guarantee", icon: CheckCircle2 },
  { label: "Emergency Vet Support Contacts", icon: HeartHandshake },
  { label: "Locally Vetted and Trained", icon: UserCheck },
  { label: "No Vague Verified Labels", icon: ShieldCheck },
  { label: "Secure Care Protocols", icon: ShieldCheck },
  { label: "Premium Support Experience", icon: HeartHandshake },
  { label: "Transparent Pricing Upfront", icon: CheckCircle2 },
  { label: "Pet Personality Matching", icon: PawPrint },
  { label: "Care That Feels Like Family", icon: Home }
] as const;
