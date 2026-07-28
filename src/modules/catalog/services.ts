import { Clock3, HeartHandshake, Home, MapPinned, PawPrint, ShieldCheck } from "lucide-react";

export const coreServiceCodes = ["DOG_WALK_30", "DOG_WALK_60", "HOME_VISIT", "HOME_SITTING_60", "GROOMING_HOME", "VET_SUPPORT", "TRAINING_ASSESSMENT", "PET_TAXI"] as const;
export type CoreServiceCode = (typeof coreServiceCodes)[number];

export const services = [
  {
    slug: "dog-walking",
    name: "Dog Walking",
    kicker: "30 or 60-Minute Outings",
    description: "Assigned local Saathi, GPS-tracked routes, timed pee/poop logs, and a complete post-walk report.",
    tone: "saffron",
    icon: MapPinned,
    image: "/images/service_dog_walking_v2.jpg"
  },
  {
    slug: "home-pet-sitting",
    name: "Home Pet Sitting",
    kicker: "In-Home Companionship & Care",
    description: "Nutritional feeding, fresh water, playful interaction, and home safety checks tailored to your pet's routine.",
    tone: "coral",
    icon: Home,
    image: "/images/service_pet_sitting_v2.jpg"
  },
  {
    slug: "boarding-beta",
    name: "Boarding Beta",
    kicker: "Verified Host Residences",
    description: "Exclusive, hand-assessed host homes with pet compatibility matching and 24/7 supervisor check-ins.",
    tone: "leaf",
    icon: ShieldCheck,
    image: "/images/service-pet-boarding.jpg"
  },
  {
    slug: "grooming",
    name: "In-Home Grooming",
    kicker: "Sanitized Mobile Spa",
    description: "Professional groomers, hypoallergenic coat treatments, sanitized tools, and photo report cards.",
    tone: "blue",
    icon: PawPrint,
    image: "/images/service-pet-grooming.jpg"
  },
  {
    slug: "veterinary",
    name: "Veterinary Care",
    kicker: "Certified Health Professionals",
    description: "In-person wellness checkups, digital pet health passports, and priority clinic emergency routing.",
    tone: "teal",
    icon: ShieldCheck,
    image: "/images/service-vet-care.jpg"
  },
  {
    slug: "training",
    name: "Positivity Training",
    kicker: "Certified Positive Reinforcement",
    description: "Gentle, science-based behavioral coaching designed to strengthen trust and communication.",
    tone: "indigo",
    icon: HeartHandshake,
    image: "/images/service-dog-training.jpg"
  }
] as const;

export const trustSignals = [
  { label: "100% Background-Checked Saathis", icon: PawPrint },
  { label: "Real-Time Telemetry & Photo Reports", icon: Clock3 },
  { label: "24/7 Human Exception Support", icon: HeartHandshake }
] as const;
