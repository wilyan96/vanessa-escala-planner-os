import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const ORGANIZATION_NAME = "Vanessa Escala Planner OS";

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

function asNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sanitizeSections(sections: StatementSectionPayload[] | undefined) {
  const source = sections?.length
    ? sections
    : [
        { id: "section-decoration", payments: [], title: "Decoración", total: 0 },
        { id: "section-planning", payments: [], title: "Planificación", total: 0 }
      ];

  return source.slice(0, 3).map((section, sectionIndex) => ({
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

function inputFromPayload(
  payload: AccountStatementPayload,
  organizationId: string,
  statementNumber: string
) {
  return {
    client: payload.client?.trim() || "Cliente sin nombre",
    clientEmail: payload.clientEmail?.trim() || null,
    eventName: payload.eventName?.trim() || null,
    issueDate: payload.issueDate?.trim() || null,
    notes: payload.notes?.trim() || null,
    organizationId,
    sections: sanitizeSections(payload.sections) as Prisma.InputJsonValue,
    statementNumber,
    status: payload.status?.trim() || "Borrador"
  };
}

async function nextStatementNumber(organizationId: string) {
  const statements = await prisma.accountStatement.findMany({
    select: { statementNumber: true },
    where: { organizationId }
  });
  const maxSequence = statements.reduce((max, statement) => {
    const match = statement.statementNumber.match(/EDC-(\d+)/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `EDC-${String(maxSequence + 1).padStart(3, "0")}`;
}

export async function GET() {
  const organization = await getOrganization();
  const statements = await prisma.accountStatement.findMany({
    orderBy: { updatedAt: "desc" },
    where: { organizationId: organization.id }
  });
  return NextResponse.json(statements.map(toResponse));
}

export async function POST(request: Request) {
  const payload = (await request.json()) as AccountStatementPayload;
  const organization = await getOrganization();
  const statementNumber =
    payload.statementNumber?.trim() || (await nextStatementNumber(organization.id));
  const statement = await prisma.accountStatement.create({
    data: inputFromPayload(payload, organization.id, statementNumber)
  });
  return NextResponse.json(toResponse(statement), { status: 201 });
}
