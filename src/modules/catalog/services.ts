import { Clock3, HeartHandshake, Home, MapPinned, PawPrint, ShieldCheck } from "lucide-react";

export const coreServiceCodes = ["DOG_WALK_30", "DOG_WALK_60", "HOME_VISIT", "HOME_SITTING_60", "GROOMING_HOME", "VET_SUPPORT", "TRAINING_ASSESSMENT", "PET_TAXI"] as const;
export type CoreServiceCode = (typeof coreServiceCodes)[number];

export const services = [
  {
    slug: "dog-walking",
    name: "Dog walking",
    kicker: "30 or 60 minutes",
    description: "A familiar Saathi, a controlled service window and a clear walk report when your pet is back home.",
    tone: "saffron",
    icon: MapPinned
  },
  {
    slug: "home-pet-sitting",
    name: "Home pet sitting",
    kicker: "Comfort in their own space",
    description: "Feeding, water, play and calm company—guided by the care instructions you choose to share.",
    tone: "coral",
    icon: Home
  },
  {
    slug: "boarding-beta",
    name: "Boarding beta",
    kicker: "Availability confirmed manually",
    description: "A carefully controlled beta for assessed hosts, compatible pets and administrator-approved stays.",
    tone: "leaf",
    icon: ShieldCheck
  },
  {
    slug: "grooming",
    name: "Grooming-at-Home",
    kicker: "Verified groomers at your doorstep",
    description: "Transparent packages, hygienic equipment, and before-and-after reports without leaving your house.",
    tone: "blue",
    icon: PawPrint
  },
  {
    slug: "veterinary",
    name: "Veterinary Support",
    kicker: "Records, routing, and physical care",
    description: "Connect with registered veterinary professionals. We route emergencies straight to the clinic.",
    tone: "teal",
    icon: ShieldCheck
  },
  {
    slug: "training",
    name: "Dog Training",
    kicker: "Reward-based learning",
    description: "Humane, rewards-based coaching from verified trainers to help you and your pet communicate better.",
    tone: "indigo",
    icon: HeartHandshake
  }
] as const;

export const trustSignals = [
  { label: "Service-approved caregivers", icon: PawPrint },
  { label: "Structured updates and reports", icon: Clock3 },
  { label: "Human support for exceptions", icon: HeartHandshake }
] as const;
