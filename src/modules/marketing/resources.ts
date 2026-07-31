import { publicEnv } from "@/lib/env";

const leadMagnets = {
  "new-pet-checklist": {
    title: "The calm first-week pet checklist",
    path: "/resources/new-pet-checklist",
  },
} as const;

export type LeadMagnetSlug = keyof typeof leadMagnets;

export const leadMagnetSlugs = Object.keys(leadMagnets) as [
  LeadMagnetSlug,
  ...LeadMagnetSlug[],
];

export function getLeadMagnetResource(slug: LeadMagnetSlug) {
  const resource = leadMagnets[slug];
  return {
    ...resource,
    url: new URL(resource.path, publicEnv.NEXT_PUBLIC_APP_URL).toString(),
  };
}
