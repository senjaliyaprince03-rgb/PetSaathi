import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateQuote } from "@/modules/pricing/economics";
import type { CoreServiceCode } from "@/modules/catalog/services";
import type { Prisma, ServiceCode } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const addressId = searchParams.get("addressId");
  const serviceCode = searchParams.get("serviceCode");

  if (!addressId || !serviceCode) {
    return NextResponse.json({ error: "missing_params", message: "addressId and serviceCode are required." }, { status: 400 });
  }

  const [address, service] = await Promise.all([
    prisma.address.findUnique({
      where: { id: addressId },
      select: { city: true, state: true, postalCode: true },
    }),
    prisma.serviceType.findUnique({
      where: { code: serviceCode as ServiceCode },
      select: { id: true, code: true },
    }),
  ]);

  if (!address || !service) {
    return NextResponse.json({ error: "not_found", message: "Address or service type not found." }, { status: 404 });
  }

  const serviceArea = await prisma.serviceArea.findFirst({
    where: {
      status: "ACTIVE",
      postalCodes: { has: address.postalCode },
      city: { name: { equals: address.city, mode: "insensitive" } },
    },
    select: { id: true },
  });

  const now = new Date();
  const priceScope = {
    serviceTypeId: service.id,
    effectiveAt: { lte: now },
    AND: [
      { OR: [{ variantId: null }, { variantId: { isSet: false } }] },
      {
        OR: [
          { expiresAt: null },
          { expiresAt: { isSet: false } },
          { expiresAt: { gt: now } },
        ],
      },
    ],
  } satisfies Prisma.ServicePriceWhereInput;

  const price = await prisma.servicePrice.findFirst({
    where: { ...priceScope, ...(serviceArea ? { serviceAreaId: serviceArea.id } : {}) },
    orderBy: [{ version: "desc" }, { effectiveAt: "desc" }],
  }) ?? await prisma.servicePrice.findFirst({
    where: { ...priceScope, OR: [{ serviceAreaId: null }, { serviceAreaId: { isSet: false } }] },
    orderBy: [{ version: "desc" }, { effectiveAt: "desc" }],
  });

  if (!price) {
    return NextResponse.json({ error: "pricing_not_found", message: "No active price configured." }, { status: 404 });
  }

  const quote = calculateQuote(price.amountPaise, price.taxBasisPoints);

  return NextResponse.json({
    addressId,
    serviceCode: service.code as CoreServiceCode,
    servicePriceId: price.id,
    subtotalPaise: quote.subtotalPaise,
    taxPaise: quote.taxPaise,
    totalPaise: quote.totalPaise,
    currency: price.currency,
  });
}
