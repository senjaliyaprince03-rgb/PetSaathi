const indiaOffsetMs = 5.5 * 60 * 60_000;

export type QuoteAmounts = {
  subtotalPaise: number;
  taxPaise: number;
  totalPaise: number;
};

export function calculateQuote(amountPaise: number, taxBasisPoints: number): QuoteAmounts {
  if (!Number.isSafeInteger(amountPaise) || amountPaise < 0) throw new Error("Invalid service amount");
  if (!Number.isInteger(taxBasisPoints) || taxBasisPoints < 0 || taxBasisPoints > 10_000) throw new Error("Invalid tax rate");
  const taxPaise = Math.round((amountPaise * taxBasisPoints) / 10_000);
  return { subtotalPaise: amountPaise, taxPaise, totalPaise: amountPaise + taxPaise };
}

export function indiaServiceDate(value: Date) {
  if (Number.isNaN(value.getTime())) throw new Error("Invalid service date");
  const india = new Date(value.getTime() + indiaOffsetMs);
  return new Date(Date.UTC(india.getUTCFullYear(), india.getUTCMonth(), india.getUTCDate()));
}

export function serviceDateFromInput(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error("Invalid service date");
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (date.toISOString().slice(0, 10) !== value) throw new Error("Invalid service date");
  return date;
}

export function toSlug(value: string) {
  return value.trim().toLocaleLowerCase("en-IN").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export type ReconciliationTotals = {
  capturedPaise: number;
  refundedPaise: number;
  paidOutPaise: number;
  netCashPaise: number;
};

export function reconciliationTotals(capturedPaise: number, refundedPaise: number, paidOutPaise: number): ReconciliationTotals {
  for (const value of [capturedPaise, refundedPaise, paidOutPaise]) {
    if (!Number.isSafeInteger(value) || value < 0) throw new Error("Invalid reconciliation amount");
  }
  return { capturedPaise, refundedPaise, paidOutPaise, netCashPaise: capturedPaise - refundedPaise - paidOutPaise };
}

export function reconciliationDifference(expected: ReconciliationTotals, actual: ReconciliationTotals) {
  return {
    capturedPaise: actual.capturedPaise - expected.capturedPaise,
    refundedPaise: actual.refundedPaise - expected.refundedPaise,
    paidOutPaise: actual.paidOutPaise - expected.paidOutPaise,
    netCashPaise: actual.netCashPaise - expected.netCashPaise
  };
}

export function reconciliationMatches(difference: ReturnType<typeof reconciliationDifference>) {
  return Object.values(difference).every((value) => value === 0);
}
