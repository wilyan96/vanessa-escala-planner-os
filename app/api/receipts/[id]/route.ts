import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ReceiptItemPayload = {
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

function asNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function itemInput(item: ReceiptItemPayload) {
  return {
    description: item.description?.trim() || "Servicio",
    quantity: Number(item.quantity) || 1,
    unitPrice: asNumber(item.unitPrice)
  };
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

function receiptInput(payload: ReceiptPayload) {
  return {
    accountNumber: payload.accountNumber?.trim() || null,
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
    paymentDueDate: payload.paymentDueDate?.trim() || null,
    paymentMethod: payload.paymentMethod?.trim() || "ACH",
    receiptNumber: payload.receiptNumber?.trim() || undefined,
    serviceCharge: asNumber(payload.serviceCharge),
    status: payload.status?.trim() || "Borrador"
  };
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const payload = (await request.json()) as ReceiptPayload;

  const receipt = await prisma.$transaction(async (tx) => {
    await tx.receiptItem.deleteMany({
      where: {
        receiptId: params.id
      }
    });

    return tx.receipt.update({
      data: {
        ...receiptInput(payload),
        items: {
          create: (payload.items?.length ? payload.items : [{ description: "Servicio", quantity: 1, unitPrice: 0 }]).map(itemInput)
        }
      },
      include: {
        items: true
      },
      where: {
        id: params.id
      }
    });
  });

  return NextResponse.json(toReceiptResponse(receipt));
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.receipt.delete({
    where: {
      id: params.id
    }
  });
  return NextResponse.json({ ok: true });
}
