import { prisma } from "@/lib/db";

export interface RecurringMatchPrediction {
  recommendedSitterId: string;
  confidenceScore: number;
  reasons: string[];
}

export async function predictOptimalSitter(bookingId: string): Promise<RecurringMatchPrediction | null> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { pet: true, serviceType: true },
  });

  if (!booking) return null;

  // Find sitters who have successfully completed this EXACT service for this EXACT pet before
  const previousSuccesses = await prisma.bookingAssignment.findMany({
    where: {
      status: "COMPLETED",
      booking: { petId: booking.petId, serviceTypeId: booking.serviceTypeId },
    },
    select: { sitterId: true },
  });

  if (previousSuccesses.length === 0) {
    return null; // No strong historical prediction available
  }

  // Count frequencies
  const frequencies = previousSuccesses.reduce((acc: Record<string, number>, val: { sitterId: string }) => {
    acc[val.sitterId] = (acc[val.sitterId] || 0) + 1;
    return acc;
  }, {});

  // Find the most frequent sitter
  const sorted = Object.entries(frequencies).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return null;
  const top = sorted[0];
  if (!top) return null;
  const [topSitterId, count] = top;

  // Calculate confidence (basic heuristic: 1 success = 60%, 3+ successes = 95%)
  const confidenceScore = Math.min(0.95, 0.5 + (count * 0.15));

  return {
    recommendedSitterId: topSitterId,
    confidenceScore,
    reasons: [
      `Sitter has successfully completed ${count} similar bookings with ${booking.pet.name}`,
      "Strong historical reliability score",
    ],
  };
}
