import { NextResponse } from "next/server";
import { VendorStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const ORGANIZATION_NAME = "Vanessa Escala Planner OS";

type VendorPayload = {
  category?: string;
  contact?: string;
  contractedAmount?: number;
  email?: string;
  name?: string;
  paidAmount?: number;
  phone?: string;
  rate?: string;
  status?: string;
};

const statusMap: Record<string, VendorStatus> = {
  activo: VendorStatus.ACTIVE,
  recomendado: VendorStatus.RECOMMENDED,
  pendiente: VendorStatus.PENDING,
  "no recomendado": VendorStatus.NOT_RECOMMENDED
};

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function asNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
}

function parseMoney(value = "") {
  return asNumber(value.replace(/[^0-9.-]/g, ""));
}

function formatMoney(value: unknown) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    minimumFractionDigits: 2,
    style: "currency"
  }).format(asNumber(value));
}

async function getOrganization() {
  const existing = await prisma.organization.findFirst({
    where: { name: ORGANIZATION_NAME }
  });
  if (existing) return existing;

  return prisma.organization.create({
    data: {
      brandName: "Planner OS",
      name: ORGANIZATION_NAME
    }
  });
}

function statusLabel(status: VendorStatus) {
  if (status === VendorStatus.RECOMMENDED) return "Recomendado";
  if (status === VendorStatus.PENDING) return "Pendiente";
  if (status === VendorStatus.NOT_RECOMMENDED) return "No recomendado";
  return "Activo";
}

function toResponse(vendor: Awaited<ReturnType<typeof prisma.vendor.findFirstOrThrow>>) {
  return {
    category: vendor.category,
    contact: vendor.contactName ?? "",
    contractedAmount: asNumber(vendor.contractedAmount),
    email: vendor.email ?? "",
    id: vendor.id,
    name: vendor.name,
    paidAmount: asNumber(vendor.paidAmount),
    phone: vendor.phone ?? "",
    rate: formatMoney(vendor.referenceRates),
    status: statusLabel(vendor.status)
  };
}

function inputFromPayload(payload: VendorPayload, organizationId: string) {
  return {
    category: payload.category?.trim() || "Otros",
    contactName: payload.contact?.trim() || null,
    contractedAmount: asNumber(payload.contractedAmount),
    email: payload.email?.trim() || null,
    name: payload.name?.trim() || "Proveedor sin nombre",
    organizationId,
    paidAmount: asNumber(payload.paidAmount),
    phone: payload.phone?.trim() || null,
    referenceRates: parseMoney(payload.rate),
    status: statusMap[normalize(payload.status)] ?? VendorStatus.ACTIVE
  };
}

export async function GET() {
  const organization = await getOrganization();
  const vendors = await prisma.vendor.findMany({
    orderBy: { updatedAt: "desc" },
    where: { organizationId: organization.id }
  });
  return NextResponse.json(vendors.map(toResponse));
}

export async function POST(request: Request) {
  const payload = (await request.json()) as VendorPayload;
  const organization = await getOrganization();
  const vendor = await prisma.vendor.create({
    data: inputFromPayload(payload, organization.id)
  });
  return NextResponse.json(toResponse(vendor), { status: 201 });
}
