export function percentage(numerator: number, denominator: number) {
  return denominator > 0 ? (numerator / denominator) * 100 : 0;
}

export function averageResolutionHours(
  complaints: Array<{ createdAt: Date; resolvedAt: Date | null }>,
) {
  const durations = complaints.flatMap((complaint) =>
    complaint.resolvedAt
      ? [(complaint.resolvedAt.getTime() - complaint.createdAt.getTime()) / 3_600_000]
      : [],
  );

  return durations.length
    ? durations.reduce((total, duration) => total + duration, 0) /
        durations.length
    : 0;
}
