import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db";
import { getMongoDatabase } from "@/lib/mongodb";
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
      balancePaise: 0,
      version: 0,
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
  const existingEntry = await prisma.benefitLedgerEntry.findUnique({
    where: { idempotencyKey: params.idempotencyKey },
  });
  if (existingEntry) {
    return { id: existingEntry.id, balanceAfter: existingEntry.balanceAfter };
  }

  const db = await getMongoDatabase();
  const walletsCol = db.collection<any>("benefit_wallets");
  const entriesCol = db.collection<any>("benefit_ledger_entries");

  const updatedWallet = await walletsCol.findOneAndUpdate(
    { _id: params.walletId, status: "ACTIVE_WALLET" },
    {
      $inc: { balance_paise: params.amountPaise, version: 1 },
      $set: { updated_at: new Date() },
    },
    { returnDocument: "after" }
  );

  if (!updatedWallet) {
    const wallet = await walletsCol.findOne({ _id: params.walletId });
    if (!wallet) {
      throw new Error(`Wallet not found: ${params.walletId}`);
    }
    throw new Error(`Cannot issue credits. Wallet status is: ${wallet.status}`);
  }

  const newBalance = (updatedWallet as any).balance_paise;
  const entryId = randomUUID();
  const now = new Date();

  try {
    await entriesCol.insertOne({
      _id: entryId,
      wallet_id: params.walletId,
      entry_type: "CREDIT_ISSUED",
      amount_paise: params.amountPaise,
      balance_after: newBalance,
      reference: params.reference ?? null,
      invoice_id: params.invoiceId ?? null,
      idempotency_key: params.idempotencyKey,
      created_at: now,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      await walletsCol.updateOne(
        { _id: params.walletId },
        { $inc: { balance_paise: -params.amountPaise } }
      );
      const existing = await entriesCol.findOne({ idempotency_key: params.idempotencyKey });
      if (existing) {
        return { id: String(existing._id), balanceAfter: existing.balance_after };
      }
    }
    throw err;
  }

  return { id: entryId, balanceAfter: newBalance };
}

export async function redeemCredits(params: {
  walletId: string;
  amountPaise: number;
  bookingId?: string;
  reference?: string;
  idempotencyKey: string;
}): Promise<{ id: string; balanceAfter: number }> {
  const existingEntry = await prisma.benefitLedgerEntry.findUnique({
    where: { idempotencyKey: params.idempotencyKey },
  });
  if (existingEntry) {
    return { id: existingEntry.id, balanceAfter: existingEntry.balanceAfter };
  }

  const db = await getMongoDatabase();
  const walletsCol = db.collection<any>("benefit_wallets");
  const entriesCol = db.collection<any>("benefit_ledger_entries");

  // ATOMIC conditional decrement: $inc guarded by $gte
  const updatedWallet = await walletsCol.findOneAndUpdate(
    {
      _id: params.walletId,
      status: "ACTIVE_WALLET",
      balance_paise: { $gte: params.amountPaise },
    },
    {
      $inc: { balance_paise: -params.amountPaise, version: 1 },
      $set: { updated_at: new Date() },
    },
    { returnDocument: "after" }
  );

  if (!updatedWallet) {
    const wallet = await walletsCol.findOne({ _id: params.walletId });
    if (!wallet) {
      throw new Error(`Wallet not found: ${params.walletId}`);
    }
    if (wallet.status !== "ACTIVE_WALLET") {
      throw new Error(`Cannot redeem credits. Wallet status is: ${wallet.status}`);
    }
    throw new InsufficientBenefitCreditsError();
  }

  const newBalance = (updatedWallet as any).balance_paise;
  const entryId = randomUUID();
  const now = new Date();

  try {
    await entriesCol.insertOne({
      _id: entryId,
      wallet_id: params.walletId,
      entry_type: "CREDIT_REDEEMED",
      amount_paise: params.amountPaise,
      balance_after: newBalance,
      booking_id: params.bookingId ?? null,
      reference: params.reference ?? null,
      idempotency_key: params.idempotencyKey,
      created_at: now,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      await walletsCol.updateOne(
        { _id: params.walletId },
        { $inc: { balance_paise: params.amountPaise } }
      );
      const existing = await entriesCol.findOne({ idempotency_key: params.idempotencyKey });
      if (existing) {
        return { id: String(existing._id), balanceAfter: existing.balance_after };
      }
    }
    throw err;
  }

  return { id: entryId, balanceAfter: newBalance };
}

export async function expireCredits(
  walletId: string,
  idempotencyKey: string
): Promise<{ id: string; balanceAfter: number }> {
  const existingEntry = await prisma.benefitLedgerEntry.findUnique({
    where: { idempotencyKey },
  });
  if (existingEntry) {
    return { id: existingEntry.id, balanceAfter: existingEntry.balanceAfter };
  }

  const db = await getMongoDatabase();
  const walletsCol = db.collection<any>("benefit_wallets");
  const entriesCol = db.collection<any>("benefit_ledger_entries");

  const wallet = await walletsCol.findOne({ _id: walletId });
  if (!wallet) throw new Error(`Wallet not found: ${walletId}`);
  const currentBalance = (wallet as any).balance_paise ?? 0;
  if (currentBalance <= 0) {
    return { id: "", balanceAfter: 0 };
  }

  await walletsCol.findOneAndUpdate(
    { _id: walletId, status: "ACTIVE_WALLET" },
    {
      $set: { balance_paise: 0, status: "EXPIRED_WALLET", updated_at: new Date() },
      $inc: { version: 1 },
    }
  );

  const entryId = randomUUID();
  await entriesCol.insertOne({
    _id: entryId,
    wallet_id: walletId,
    entry_type: "CREDIT_EXPIRED",
    amount_paise: currentBalance,
    balance_after: 0,
    idempotency_key: idempotencyKey,
    created_at: new Date(),
  });

  return { id: entryId, balanceAfter: 0 };
}

export async function getBalance(walletId: string): Promise<number> {
  const db = await getMongoDatabase();
  const wallet = await db.collection<any>("benefit_wallets").findOne({ _id: walletId });
  if (wallet && typeof (wallet as any).balance_paise === "number") {
    return (wallet as any).balance_paise;
  }
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
    take: 100,
  });
}
