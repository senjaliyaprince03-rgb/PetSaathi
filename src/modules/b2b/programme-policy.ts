import type {
  EligibilityMethod,
  ProgrammeStatus,
} from "@prisma/client";

type ProgrammeAvailability = {
  status: ProgrammeStatus | string;
  startDate: Date | null;
  endDate: Date | null;
};

export const implementedEligibilityMethods = [
  "INVITATION_TOKEN",
  "OPEN_ACCESS",
] as const satisfies readonly EligibilityMethod[];

export function isProgrammeCurrentlyAvailable(
  programme: ProgrammeAvailability,
  now = new Date(),
) {
  return (
    programme.status === "ACTIVE_PROGRAMME" &&
    (!programme.startDate || programme.startDate <= now) &&
    (!programme.endDate || programme.endDate > now)
  );
}

export function isEligibilityMethodImplemented(method: EligibilityMethod) {
  return implementedEligibilityMethods.includes(
    method as (typeof implementedEligibilityMethods)[number],
  );
}

export function hasValidProgrammeDateWindow(programme: {
  startDate: Date | null;
  endDate: Date | null;
}) {
  return (
    !programme.startDate ||
    !programme.endDate ||
    programme.endDate > programme.startDate
  );
}
