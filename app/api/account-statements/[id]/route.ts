import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type StatementPaymentPayload = {
  amount?: number;
  date?: string;
  description?: string;
  id?: string;
  receiptNumber?: string;
};

type StatementSectionPayload = {
  id?: string;
  payments?: StatementPaymentPayload[];
  title?: string;
  total?: number;
};

type AccountStatementPayload = {
  client?: string;
  clientEmail?: string;
  eventName?: string;
  issueDate?: string;
  notes?: string;
  sections?: StatementSectionPayload[];
  statementNumber?: string;
  status?: string;
};

function asNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sanitizeSections(sections: StatementSectionPayload[] | undefined) {
  return (sections ?? []).slice(0, 3).map((section, sectionIndex) => ({
    id: section.id?.trim() || `section-${sectionIndex + 1}`,
    payments: (section.payments ?? []).map((payment, paymentIndex) => ({
      amount: asNumber(payment.amount),
      date: payment.date?.trim() || "",
      description: payment.description?.trim() || "Abono",
      id: payment.id?.trim() || `payment-${sectionIndex + 1}-${paymentIndex + 1}`,
      receiptNumber: payment.receiptNumber?.trim() || ""
    })),
    title: section.title?.trim() || `Servicio ${sectionIndex + 1}`,
    total: asNumber(section.total)
  }));
}

function toResponse(statement: {
  client: string;
  clientEmail: string | null;
  eventName: string | null;
  id: string;
  issueDate: string | null;
  notes: string | null;
  sections: Prisma.JsonValue;
  statementNumber: string;
  status: string;
}) {
  return {
    client: statement.client,
    clientEmail: statement.clientEmail ?? "",
    eventName: statement.eventName ?? "",
    id: statement.id,
    issueDate: statement.issueDate ?? "",
    notes: statement.notes ?? "",
    sections: statement.sections,
    statementNumber: statement.statementNumber,
    status: statement.status
  };
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const payload = (await request.json()) as AccountStatementPayload;
  const statement = await prisma.accountStatement.update({
    data: {
      client: payload.client?.trim() || "Cliente sin nombre",
      clientEmail: payload.clientEmail?.trim() || null,
      eventName: payload.eventName?.trim() || null,
      issueDate: payload.issueDate?.trim() || null,
      notes: payload.notes?.trim() || null,
      sections: sanitizeSections(payload.sections) as Prisma.InputJsonValue,
      statementNumber: payload.statementNumber?.trim() || undefined,
      status: payload.status?.trim() || "Borrador"
    },
    where: { id: params.id }
  });
  return NextResponse.json(toResponse(statement));
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.accountStatement.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
