import { NextResponse } from "next/server";
import { ClientStatus, EventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type ClientPayload = {
  budget?: string;
  date?: string;
  email?: string;
  event?: string;
  guests?: number;
  name?: string;
  next?: string;
  phone?: string;
  place?: string;
  status?: string;
};

const eventTypeMap: Record<string, EventType> = {
  boda: EventType.WEDDING,
  corporativo: EventType.CORPORATE,
  cumpleanos: EventType.BIRTHDAY,
  cumpleaños: EventType.BIRTHDAY,
  quinceanos: EventType.QUINCEANERA,
  quinceaños: EventType.QUINCEANERA,
  religioso: EventType.RELIGIOUS,
  social: EventType.SOCIAL
};

const clientStatusMap: Record<string, ClientStatus> = {
  cerrado: ClientStatus.CLOSED,
  contratado: ClientStatus.CONTRACTED,
  cotizado: ClientStatus.QUOTED,
  prospecto: ClientStatus.PROSPECT
};

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function parseMoney(value = "") {
  const parsed = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parsePlannerDate(value = "") {
  const normalized = normalize(value);
  if (!normalized) return undefined;

  const direct = new Date(normalized);
  if (!Number.isNaN(direct.getTime())) return direct;

  const months: Record<string, number> = {
    abr: 3,
    abril: 3,
    ago: 7,
    agosto: 7,
    dic: 11,
    diciembre: 11,
    ene: 0,
    enero: 0,
    feb: 1,
    febrero: 1,
    jul: 6,
    julio: 6,
    jun: 5,
    junio: 5,
    mar: 2,
    marzo: 2,
    may: 4,
    mayo: 4,
    nov: 10,
    noviembre: 10,
    oct: 9,
    octubre: 9,
    sep: 8,
    septiembre: 8
  };
  const match = normalized.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/);
  if (!match) return undefined;
  const month = months[match[2]];
  if (month === undefined) return undefined;
  return new Date(Number(match[3]), month, Number(match[1]));
}

function formatPlannerDate(value?: Date | null) {
  if (!value) return "";
  return value.toLocaleDateString("es-PA", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function formatMoney(value?: unknown) {
  if (value === null || value === undefined) return "$0";
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency"
  }).format(Number(value));
}

function inputFromPayload(payload: ClientPayload) {
  return {
    email: payload.email?.trim() || null,
    estimatedBudget: parseMoney(payload.budget),
    eventDate: parsePlannerDate(payload.date),
    eventPlace: payload.place?.trim() || null,
    eventType: eventTypeMap[normalize(payload.event)] ?? EventType.WEDDING,
    fullName: payload.name?.trim() || "Cliente sin nombre",
    guestCount: Number(payload.guests) || null,
    internalNotes: payload.next?.trim() || null,
    phone: payload.phone?.trim() || null,
    status: clientStatusMap[normalize(payload.status)] ?? ClientStatus.PROSPECT
  };
}

function toClientResponse(client: Awaited<ReturnType<typeof prisma.client.findFirstOrThrow>>) {
  return {
    budget: formatMoney(client.estimatedBudget),
    date: formatPlannerDate(client.eventDate),
    email: client.email ?? "",
    event: client.eventType === EventType.QUINCEANERA ? "Quinceanos" : client.eventType === EventType.CORPORATE ? "Corporativo" : client.eventType === EventType.BIRTHDAY ? "Cumpleanos" : client.eventType === EventType.RELIGIOUS ? "Religioso" : client.eventType === EventType.SOCIAL ? "Evento social" : "Boda",
    guests: client.guestCount ?? 0,
    id: client.id,
    name: client.fullName,
    next: client.internalNotes ?? "",
    phone: client.phone ?? "",
    place: client.eventPlace ?? "",
    status: client.status === ClientStatus.QUOTED ? "Cotizado" : client.status === ClientStatus.CONTRACTED ? "Contratado" : client.status === ClientStatus.CLOSED ? "Cerrado" : "Prospecto"
  };
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const payload = (await request.json()) as ClientPayload;
  const client = await prisma.client.update({
    data: inputFromPayload(payload),
    where: {
      id: params.id
    }
  });
  return NextResponse.json(toClientResponse(client));
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.client.delete({
    where: {
      id: params.id
    }
  });
  return NextResponse.json({ ok: true });
}
