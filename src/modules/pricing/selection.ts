export type PriceCandidate = {
  id: string;
  serviceTypeId: string;
  serviceAreaId: string | null;
  version: number;
  amountPaise: number;
  sitterPaise: number;
  taxBasisPoints: number;
  currency: string;
  effectiveAt: Date;
  expiresAt: Date | null;
};

export function isPriceEffective(price: PriceCandidate, now: Date) {
  return price.effectiveAt <= now && (price.expiresAt === null || price.expiresAt > now);
}

export function selectApplicablePrice(prices: readonly PriceCandidate[], serviceTypeId: string, serviceAreaId: string, now: Date) {
  const available = prices
    .filter((price) => price.serviceTypeId === serviceTypeId && isPriceEffective(price, now))
    .sort((left, right) => right.version - left.version || right.effectiveAt.getTime() - left.effectiveAt.getTime());
  return available.find((price) => price.serviceAreaId === serviceAreaId) ?? available.find((price) => price.serviceAreaId === null) ?? null;
}
