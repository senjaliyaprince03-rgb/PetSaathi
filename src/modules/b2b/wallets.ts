import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import type { BenefitLedgerEntry } from "@prisma/client";

export class InsufficientBenefitCreditsError extends Error {
  constructor(message = "Insufficient benefit credits") {
    super(message);
    this.name = "InsufficientBenefitCreditsError";
  }
}

export async function createWallet(programmeMembershipId: string): Promise<{ id: string }> {
  const wallet = await prisma.benefitWallet.create({
    data: {
      programmeMembershipId,
      status: "ACTIVE_WALLET",
    },
    select: { id: true },
  });
  return { id: wallet.id };
}

export async function issueCredits(params: {
  walletId: string;
  amountPaise: number;
  reference?: string;
  invoiceId?: string;
  idempotencyKey: string;
}): Promise<{ id: string; balanceAfter: number }> {
  return await prisma.$transaction(
    async (tx) => {
      const existingEntry = await tx.benefitLedgerEntry.findUnique({
        where: { idempotencyKey: params.idempotencyKey },
      });
      if (existingEntry) {
        return { id: existingEntry.id, balanceAfter: existingEntry.balanceAfter };
      }

      const wallet = await tx.benefitWallet.findUnique({
        where: { id: params.walletId },
      });
      if (!wallet) {
        throw new Error(`Wallet not found: ${params.walletId}`);
      }
      if (wallet.status !== "ACTIVE_WALLET") {
        throw new Error(`Cannot issue credits. Wallet status is: ${wallet.status}`);
      }

      const latestEntry = await tx.benefitLedgerEntry.findFirst({
        where: { walletId: params.walletId },
        orderBy: { createdAt: "desc" },
      });

      const currentBalance = latestEntry?.balanceAfter ?? 0;
      const newBalance = currentBalance + params.amountPaise;

      const entry = await tx.benefitLedgerEntry.create({
        data: {
          walletId: params.walletId,
          entryType: "CREDIT_ISSUED",
          amountPaise: params.amountPaise,
          balanceAfter: newBalance,
          reference: params.reference,
          invoiceId: params.invoiceId,
          idempotencyKey: params.idempotencyKey,
        },
      });

      return { id: entry.id, balanceAfter: entry.balanceAfter };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
}

export async function redeemCredits(params: {
  walletId: string;
  amountPaise: number;
  bookingId?: string;
  reference?: string;
  idempotencyKey: string;
}): Promise<{ id: string; balanceAfter: number }> {
  return await prisma.$transaction(
    async (tx) => {
      const existingEntry = await tx.benefitLedgerEntry.findUnique({
        where: { idempotencyKey: params.idempotencyKey },
      });
      if (existingEntry) {
        return { id: existingEntry.id, balanceAfter: existingEntry.balanceAfter };
      }

      const wallet = await tx.benefitWallet.findUnique({
        where: { id: params.walletId },
      });
      if (!wallet) {
        throw new Error(`Wallet not found: ${params.walletId}`);
      }
      if (wallet.status !== "ACTIVE_WALLET") {
        throw new Error(`Cannot redeem credits. Wallet status is: ${wallet.status}`);
      }

      const latestEntry = await tx.benefitLedgerEntry.findFirst({
        where: { walletId: params.walletId },
        orderBy: { createdAt: "desc" },
      });

      const currentBalance = latestEntry?.balanceAfter ?? 0;

      if (currentBalance < params.amountPaise) {
        throw new InsufficientBenefitCreditsError();
      }

      const newBalance = currentBalance - params.amountPaise;

      const entry = await tx.benefitLedgerEntry.create({
        data: {
          walletId: params.walletId,
          entryType: "CREDIT_REDEEMED",
          amountPaise: params.amountPaise,
          balanceAfter: newBalance,
          bookingId: params.bookingId,
          reference: params.reference,
          idempotencyKey: params.idempotencyKey,
        },
      });

      return { id: entry.id, balanceAfter: entry.balanceAfter };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
}

export async function expireCredits(
  walletId: string,
  idempotencyKey: string
): Promise<{ id: string; balanceAfter: number }> {
  return await prisma.$transaction(
    async (tx) => {
      const existingEntry = await tx.benefitLedgerEntry.findUnique({
        where: { idempotencyKey },
      });
      if (existingEntry) {
        return { id: existingEntry.id, balanceAfter: existingEntry.balanceAfter };
      }

      const latestEntry = await tx.benefitLedgerEntry.findFirst({
        where: { walletId },
        orderBy: { createdAt: "desc" },
      });

      const currentBalance = latestEntry?.balanceAfter ?? 0;

      const entry = await tx.benefitLedgerEntry.create({
        data: {
          walletId,
          entryType: "CREDIT_EXPIRED",
          amountPaise: currentBalance,
          balanceAfter: 0,
          idempotencyKey,
        },
      });

      await tx.benefitWallet.update({
        where: { id: walletId },
        data: { status: "EXPIRED_WALLET" },
      });

      return { id: entry.id, balanceAfter: entry.balanceAfter };
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );
}

export async function getBalance(walletId: string): Promise<number> {
  const latestEntry = await prisma.benefitLedgerEntry.findFirst({
    where: { walletId },
    orderBy: { createdAt: "desc" },
  });
  return latestEntry?.balanceAfter ?? 0;
}

export async function getWalletHistory(walletId: string): Promise<BenefitLedgerEntry[]> {
  return await prisma.benefitLedgerEntry.findMany({
    where: { walletId },
    orderBy: { createdAt: "desc" },
  });
}
