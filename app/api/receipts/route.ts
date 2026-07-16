import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ORGANIZATION_NAME = "Vanessa Escala Planner OS";

type ReceiptItemPayload = {
  id?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
};

type ReceiptPayload = {
  accountNumber?: string;
  client?: string;
  clientEmail?: string;
  clientPhone?: string;
  deliveryFee?: number;
  eventDate?: string;
  eventId?: string;
  eventName?: string;
  eventPlace?: string;
  issueDate?: string;
  items?: ReceiptItemPayload[];
  itbmsRate?: number;
  notes?: string;
  paymentDueDate?: string;
  paymentMethod?: string;
  receiptNumber?: string;
  serviceCharge?: number;
  status?: string;
};

const recoveredReceipts: ReceiptPayload[] = [
  {
    accountNumber: "VE-000250",
    client: "Zulyberh Maclao",
    clientPhone: "+507 69805925",
    eventName: "15 Años Analia",
    eventPlace: "Hotel Plaza Paitilla",
    issueDate: "18/05/2026",
    items: [{ description: "Abono Planificación", quantity: 1, unitPrice: 125 }],
    notes: "Recibo recuperado desde PDF local generado el 8 de julio de 2026.",
    paymentDueDate: "18/05/2026",
    paymentMethod: "ACH",
    receiptNumber: "REC-250",
    status: "Pagado"
  },
  {
    accountNumber: "VE-000251",
    client: "Zulyberh Maclao",
    clientPhone: "+507 69805925",
    eventName: "15 Años Analia",
    eventPlace: "Hotel Plaza Paitilla",
    issueDate: "11/06/2026",
    items: [{ description: "Abono planificación #2", quantity: 1, unitPrice: 175 }],
    notes: "Recibo recuperado desde PDF local generado el 8 de julio de 2026.",
    paymentDueDate: "11/06/2026",
    paymentMethod: "ACH",
    receiptNumber: "REC-251",
    status: "Pagado"
  },
  {
    accountNumber: "VE-000252",
    client: "Zulyberh Maclao",
    clientPhone: "+507 69805925",
    eventName: "15 Años Analia",
    eventPlace: "Hotel Plaza Paitilla",
    issueDate: "31/04/2026",
    items: [{ description: "Pago Decoración Bosque encantado", quantity: 1, unitPrice: 100 }],
    notes: "Recibo recuperado desde PDF local generado el 8 de julio de 2026.",
    paymentDueDate: "31/04/2026",
    paymentMethod: "ACH",
    receiptNumber: "REC-252",
    status: "Pagado"
  },
  {
    accountNumber: "VE-000253",
    client: "Zulyberh Maclao",
    clientPhone: "+507 69805925",
    eventName: "15 Años Analia",
    eventPlace: "Hotel Plaza Paitilla",
    issueDate: "18/05/2026",
    items: [{ description: "Pago de Decoración Bosque encantado", quantity: 1, unitPrice: 500 }],
    notes: "Recibo recuperado desde PDF local generado el 8 de julio de 2026.",
    paymentDueDate: "18/05/2026",
    paymentMethod: "ACH",
    receiptNumber: "REC-253",
    status: "Pagado"
  },
  {
    accountNumber: "VE-000254",
    client: "Zulyberh Maclao",
    clientPhone: "+507 69805925",
    eventName: "15 Años Analia",
    eventPlace: "Hotel Plaza Paitilla",
    issueDate: "15/06/2026",
    items: [{ description: "Pago Decoración Bosque encantado", quantity: 1, unitPrice: 250 }],
    notes: "Recibo recuperado desde PDF local generado el 8 de julio de 2026.",
    paymentDueDate: "15/06/2026",
    paymentMethod: "ACH",
    receiptNumber: "REC-254",
    status: "Pagado"
  },
  {
    accountNumber: "VE-000255",
    client: "Zulyberh Maclao",
    clientPhone: "+507 69805925",
    eventName: "15 Años Analia",
    eventPlace: "Hotel Plaza Paitilla",
    issueDate: "07/07/2026",
    items: [{ description: "Pago Decoración Bosque encantado", quantity: 1, unitPrice: 500 }],
    notes: "Recibo recuperado desde PDF local generado el 8 de julio de 2026.",
    paymentDueDate: "07/07/2026",
    paymentMethod: "ACH",
    receiptNumber: "REC-255",
    status: "Pagado"
  }
];

async function getOrganization() {
  const existing = await prisma.organization.findFirst({
    where: {
      name: ORGANIZATION_NAME
    }
  });
  if (existing) return existing;

  return prisma.organization.create({
    data: {
      brandName: "Planner OS",
      name: ORGANIZATION_NAME
    }
  });
}

function asNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toReceiptResponse(receipt: {
  accountNumber: string | null;
  client: string;
  clientEmail: string | null;
  clientPhone: string | null;
  deliveryFee: unknown;
  eventDate: string | null;
  eventId: string | null;
  eventName: string | null;
  eventPlace: string | null;
  id: string;
  issueDate: string | null;
  items: Array<{
    description: string;
    id: string;
    quantity: number;
    unitPrice: unknown;
  }>;
  itbmsRate: unknown;
  notes: string | null;
  paymentDueDate: string | null;
  paymentMethod: string | null;
  receiptNumber: string;
  serviceCharge: unknown;
  status: string;
}) {
  return {
    accountNumber: receipt.accountNumber ?? "",
    client: receipt.client,
    clientEmail: receipt.clientEmail ?? "",
    clientPhone: receipt.clientPhone ?? "",
    deliveryFee: asNumber(receipt.deliveryFee),
    eventDate: receipt.eventDate ?? "",
    eventId: receipt.eventId ?? "",
    eventName: receipt.eventName ?? "",
    eventPlace: receipt.eventPlace ?? "",
    id: receipt.id,
    issueDate: receipt.issueDate ?? "",
    items: receipt.items.map((item) => ({
      description: item.description,
      id: item.id,
      quantity: item.quantity,
      unitPrice: asNumber(item.unitPrice)
    })),
    itbmsRate: asNumber(receipt.itbmsRate),
    notes: receipt.notes ?? "",
    paymentDueDate: receipt.paymentDueDate ?? "",
    paymentMethod: receipt.paymentMethod ?? "ACH",
    receiptNumber: receipt.receiptNumber,
    serviceCharge: asNumber(receipt.serviceCharge),
    status: receipt.status
  };
}

function itemInput(item: ReceiptItemPayload) {
  return {
    description: item.description?.trim() || "Servicio",
    quantity: Number(item.quantity) || 1,
    unitPrice: asNumber(item.unitPrice)
  };
}

function receiptInput(payload: ReceiptPayload, organizationId: string, receiptNumber: string) {
  return {
    accountNumber: payload.accountNumber?.trim() || `VE-${receiptNumber.replace("REC-", "").padStart(6, "0")}`,
    client: payload.client?.trim() || "Cliente sin nombre",
    clientEmail: payload.clientEmail?.trim() || null,
    clientPhone: payload.clientPhone?.trim() || null,
    deliveryFee: asNumber(payload.deliveryFee),
    eventDate: payload.eventDate?.trim() || null,
    eventId: payload.eventId?.trim() || null,
    eventName: payload.eventName?.trim() || null,
    eventPlace: payload.eventPlace?.trim() || null,
    issueDate: payload.issueDate?.trim() || null,
    itbmsRate: asNumber(payload.itbmsRate),
    notes: payload.notes?.trim() || null,
    organizationId,
    paymentDueDate: payload.paymentDueDate?.trim() || null,
    paymentMethod: payload.paymentMethod?.trim() || "ACH",
    receiptNumber,
    serviceCharge: asNumber(payload.serviceCharge),
    status: payload.status?.trim() || "Borrador"
  };
}

async function nextReceiptNumber(organizationId: string) {
  const receipts = await prisma.receipt.findMany({
    select: {
      receiptNumber: true
    },
    where: {
      organizationId
    }
  });
  const maxSequence = receipts.reduce((max, receipt) => {
    const match = receipt.receiptNumber.match(/REC-(\d+)/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 249);
  return `REC-${maxSequence + 1}`;
}

async function seedRecoveredReceipts(organizationId: string) {
  const existingCount = await prisma.receipt.count({
    where: {
      organizationId
    }
  });
  if (existingCount > 0) return;

  await prisma.$transaction(
    recoveredReceipts.map((receipt) => {
      const receiptNumber = receipt.receiptNumber ?? "REC-250";
      return prisma.receipt.create({
        data: {
          ...receiptInput(receipt, organizationId, receiptNumber),
          items: {
            create: (receipt.items ?? []).map(itemInput)
          }
        }
      });
    })
  );
}

export async function GET() {
  const organization = await getOrganization();
  await seedRecoveredReceipts(organization.id);

  const receipts = await prisma.receipt.findMany({
    include: {
      items: true
    },
    orderBy: {
      receiptNumber: "asc"
    },
    where: {
      organizationId: organization.id
    }
  });
  return NextResponse.json(receipts.map(toReceiptResponse));
}

export async function POST(request: Request) {
  const payload = (await request.json()) as ReceiptPayload;
  const organization = await getOrganization();
  const receiptNumber = payload.receiptNumber?.trim() || (await nextReceiptNumber(organization.id));

  const receipt = await prisma.receipt.create({
    data: {
      ...receiptInput(payload, organization.id, receiptNumber),
      items: {
        create: (payload.items?.length ? payload.items : [{ description: "Servicio", quantity: 1, unitPrice: 0 }]).map(itemInput)
      }
    },
    include: {
      items: true
    }
  });

  return NextResponse.json(toReceiptResponse(receipt), { status: 201 });
}
