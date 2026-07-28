/* eslint-disable */
import { prisma } from "@/lib/db";
import type { InvoiceStatus } from "@prisma/client";

export function computeTax(params: {
  taxableValuePaise: number;
  supplierState: string;
  placeOfSupply: string;
  gstRateBps?: number;
}): { cgst: number; sgst: number; igst: number; total: number } {
  const gstRateBps = params.gstRateBps ?? 1800; // 18% default
  const taxAmount = Math.round((params.taxableValuePaise * gstRateBps) / 10000);

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (params.supplierState === params.placeOfSupply) {
    cgst = Math.round(taxAmount / 2);
    sgst = taxAmount - cgst;
  } else {
    igst = taxAmount;
  }

  const total = params.taxableValuePaise + cgst + sgst + igst;

  return { cgst, sgst, igst, total };
}

export async function generateInvoiceNumber(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const monthPrefix = `${year}${month}`;

  const startOfMonth = new Date(year, now.getMonth(), 1);
  const endOfMonth = new Date(year, now.getMonth() + 1, 0, 23, 59, 59, 999);

  const count = await prisma.enterpriseInvoice.count({
    where: {
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  const sequentialCount = String(count + 1).padStart(4, "0");
  return `PS-INV-${monthPrefix}-${sequentialCount}`;
}

export async function createInvoice(data: {
  organizationId: string;
  contractId?: string;
  supplierGstin?: string;
  customerGstin?: string;
  placeOfSupply?: string;
  billingAddress?: string;
  serviceAddress?: string;
  sacCode?: string;
  taxableValuePaise: number;
  supplierState?: string;
  gstRateBps?: number;
  dueDate: Date;
  poReference?: string;
  notes?: string;
}) {
  const invoiceNumber = await generateInvoiceNumber();

  let cgst = 0;
  let sgst = 0;
  let igst = 0;
  let totalAmount = data.taxableValuePaise;

  if (data.supplierState && data.placeOfSupply) {
    const tax = computeTax({
      taxableValuePaise: data.taxableValuePaise,
      supplierState: data.supplierState,
      placeOfSupply: data.placeOfSupply,
      gstRateBps: data.gstRateBps,
    });
    cgst = tax.cgst;
    sgst = tax.sgst;
    igst = tax.igst;
    totalAmount = tax.total;
  }

  return prisma.enterpriseInvoice.create({
    data: {
      invoiceNumber,
      organizationId: data.organizationId,
      contractId: data.contractId,
      supplierGstin: data.supplierGstin,
      customerGstin: data.customerGstin,
      placeOfSupply: data.placeOfSupply,
      billingAddress: data.billingAddress,
      serviceAddress: data.serviceAddress,
      sacCode: data.sacCode,
      taxableValue: data.taxableValuePaise,
      cgst,
      sgst,
      igst,
      totalAmount,
      status: "DRAFT_INVOICE" as InvoiceStatus,
      dueDate: data.dueDate,
      poReference: data.poReference,
      notes: data.notes,
    },
  });
}

export async function sendInvoice(id: string) {
  const invoice = await prisma.enterpriseInvoice.findUnique({ where: { id } });
  if (!invoice) throw new Error("Invoice not found");
  if (invoice.status !== "DRAFT_INVOICE") {
    throw new Error("Only draft invoices can be sent");
  }

  return prisma.enterpriseInvoice.update({
    where: { id },
    data: { status: "SENT" as InvoiceStatus },
  });
}

export async function recordPayment(id: string, amountPaise: number) {
  return prisma.$transaction(async (tx) => {
    const invoice = await tx.enterpriseInvoice.findUnique({ where: { id } });
    if (!invoice) throw new Error("Invoice not found");
    if (invoice.status === "PAID" || invoice.status === "CANCELLED_INVOICE") {
      throw new Error("Cannot record payment for PAID or CANCELLED_INVOICE");
    }

    const newAmountPaid = invoice.amountPaid + amountPaise;
    let newStatus: InvoiceStatus = invoice.status;
    let paidAt = invoice.paidAt;

    if (newAmountPaid >= invoice.totalAmount) {
      newStatus = "PAID" as InvoiceStatus;
      paidAt = new Date();
    } else {
      newStatus = "PARTIALLY_PAID" as InvoiceStatus;
    }

    return tx.enterpriseInvoice.update({
      where: { id },
      data: {
        amountPaid: newAmountPaid,
        status: newStatus,
        paidAt,
      },
    });
  });
}

export async function issueCreditNote(invoiceId: string, reason?: string) {
  return prisma.$transaction(async (tx) => {
    const original = await tx.enterpriseInvoice.findUnique({ where: { id: invoiceId } });
    if (!original) throw new Error("Invoice not found");

    const creditNoteNumber = await generateInvoiceNumber();

    const creditNote = await tx.enterpriseInvoice.create({
      data: {
        invoiceNumber: creditNoteNumber,
        organizationId: original.organizationId,
        contractId: original.contractId,
        supplierGstin: original.supplierGstin,
        customerGstin: original.customerGstin,
        placeOfSupply: original.placeOfSupply,
        billingAddress: original.billingAddress,
        serviceAddress: original.serviceAddress,
        sacCode: original.sacCode,
        taxableValue: -original.taxableValue,
        cgst: -original.cgst,
        sgst: -original.sgst,
        igst: -original.igst,
        totalAmount: -original.totalAmount,
        amountPaid: 0,
        currency: original.currency,
        status: "DRAFT_INVOICE" as InvoiceStatus,
        dueDate: new Date(),
        poReference: original.poReference,
        notes: reason,
        creditNoteOf: invoiceId,
      },
    });

    await tx.enterpriseInvoice.update({
      where: { id: invoiceId },
      data: { status: "CREDIT_NOTED" as InvoiceStatus },
    });

    return creditNote;
  });
}

export async function listInvoices(filters: {
  organizationId?: string;
  status?: InvoiceStatus;
  overdue?: boolean;
  page?: number;
  pageSize?: number;
}) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;

  const where: Record<string, unknown> = {};

  if (filters.organizationId) {
    where.organizationId = filters.organizationId;
  }
  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.overdue) {
    where.dueDate = { lt: new Date() };
    where.status = { in: ["SENT", "PARTIALLY_PAID"] as InvoiceStatus[] };
  }

  const [items, total] = await prisma.$transaction([
    prisma.enterpriseInvoice.findMany({
      where,
      include: { organization: { select: { displayName: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.enterpriseInvoice.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function getInvoice(id: string) {
  return prisma.enterpriseInvoice.findUnique({
    where: { id },
    include: { organization: true },
  });
}
