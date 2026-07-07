"use client";
/* eslint-disable @next/next/no-img-element */

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckSquare,
  CircleDollarSign,
  ClipboardList,
  Copy,
  Download,
  Edit3,
  FileSignature,
  FolderOpen,
  Handshake,
  LayoutDashboard,
  Mail,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Send,
  Trash2,
  Upload,
  UsersRound,
  X
} from "lucide-react";

type ModuleId =
  | "dashboard"
  | "clients"
  | "events"
  | "timeline"
  | "vendors"
  | "quotes"
  | "contracts"
  | "documents"
  | "emails";

type StatusTone = "success" | "warning" | "danger" | "neutral" | "blue";

type Client = {
  id: string;
  name: string;
  phone: string;
  email: string;
  event: string;
  date: string;
  place: string;
  guests: number;
  budget: string;
  status: string;
  next: string;
};

type EventRecord = {
  id: string;
  eventNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  decisionMaker: string;
  emergencyContact: string;
  clientNotes: string;
  name: string;
  type: string;
  date: string;
  time: string;
  endTime: string;
  ceremonyTime: string;
  receptionTime: string;
  vendorArrivalTime: string;
  clientArrivalTime: string;
  setupTime: string;
  teardownTime: string;
  venue: string;
  ceremony: string;
  address: string;
  room: string;
  city: string;
  locationLink: string;
  venueContact: string;
  venuePhone: string;
  guests: number;
  budget: string;
  approvedBudget: string;
  contractedAmount: string;
  deposit: string;
  paid: string;
  pendingBalance: string;
  paymentDeadline: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentNotes: string;
  progress: number;
  status: string;
  health: StatusTone;
  owner: string;
  assistant: string;
  protocolTeam: string;
  setupCoordinator: string;
  vendorCoordinator: string;
  paymentOwner: string;
  teardownOwner: string;
  style: string;
  colorPalette: string;
  concept: string;
  formality: string;
  dressCode: string;
  specialRequirements: string;
  venueRestrictions: string;
  importantNotes: string;
  documents: string[];
  checklist: Array<{ label: string; status: string }>;
  providers: Array<{ category: string; name: string; contact: string; phone: string; service: string; amount: number; status: string; arrival: string; pendingPayment: number; notes: string }>;
  tasks: Array<{ title: string; owner: string; dueDate: string; priority: string; status: string; relatedTo: string; notes: string }>;
  history: string[];
  lastUpdate: string;
};

type TimelineItem = {
  id: string;
  eventId: string;
  date: string;
  time: string;
  endTime: string;
  title: string;
  category: string;
  owner: string;
  team: string;
  place: string;
  vendor: string;
  vendorContact: string;
  vendorPhone: string;
  priority: "Baja" | "Media" | "Alta" | "Critica";
  description: string;
  internalInstructions: string;
  vendorInstructions: string;
  requiresConfirmation: boolean;
  isCritical: boolean;
  dependsOn: string;
  duration: string;
  files: string[];
  internalNotes: string;
  clientNotes: string;
  teamComments: string;
  vendorConfirmed: boolean;
  confirmationDate: string;
  confirmationBy: string;
  confirmationMethod: string;
  confirmationNotes: string;
  history: string[];
  status: string;
};

type Vendor = {
  id: string;
  name: string;
  category: string;
  contact: string;
  phone: string;
  email: string;
  rate: string;
  status: string;
};

type Quote = {
  id: string;
  quoteNumber: string;
  client: string;
  clientTaxId: string;
  clientEmail: string;
  event: string;
  eventPlace: string;
  paymentMethod: "Yappy" | "Link de pago" | "ACH" | "Efectivo";
  observations: string;
  items: QuoteItem[];
  expires: string;
  status: string;
};

type QuoteItem = {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  tax: number;
};

type Contract = {
  id: string;
  contractNumber: string;
  kind: "Cliente" | "Proveedor";
  contractType: string;
  client: string;
  event: string;
  template: string;
  name: string;
  amount: number;
  deposit: number;
  balance: number;
  createdAt: string;
  sentAt: string;
  signatureDeadline: string;
  signedAt: string;
  owner: string;
  services: string;
  paymentTerms: string;
  cancellationPolicy: string;
  clientResponsibilities: string;
  companyResponsibilities: string;
  specialClauses: string;
  internalNotes: string;
  documents: string[];
  history: string[];
  terms: string;
  status: string;
  signatureRequired: boolean;
};

type Payment = {
  id: string;
  eventId: string;
  concept: string;
  amount: number;
  paid: number;
  dueDate: string;
  status: string;
};

type DocumentItem = {
  id: string;
  name: string;
  owner: string;
  kind: string;
  visibility: string;
};

type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
};

type AlertPriority = "Baja" | "Media" | "Alta" | "Critica";

type AutomationAlert = {
  id: string;
  title: string;
  category: string;
  priority: AlertPriority;
  dueDate: string;
  eventId?: string;
  eventName?: string;
  clientName?: string;
  owner: string;
  status: "Abierta" | "Resuelta";
  action: string;
  module: ModuleId;
  tone: StatusTone;
};

type DashboardMetric = {
  label: string;
  value: string;
  hint: string;
  description: string;
  icon: typeof LayoutDashboard;
  tone: string;
};

type AutomationSnapshot = {
  alerts: AutomationAlert[];
  calendarItems: Array<{ date: string; label: string; type: string }>;
  checklistAreas: Array<{ label: string; value: number; tone: StatusTone }>;
  events: EventRecord[];
  metrics: DashboardMetric[];
  recentActivity: string[];
  totals: {
    estimatedProfit: number;
    monthExpenses: number;
    monthIncome: number;
    payable: number;
    receivables: number;
  };
};

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clients", label: "Clientes", icon: UsersRound },
  { id: "events", label: "Gestion Integral de Eventos", icon: CalendarDays },
  { id: "timeline", label: "Cronograma Operativo", icon: ClipboardList },
  { id: "vendors", label: "Proveedores", icon: Handshake },
  { id: "quotes", label: "Cotizaciones", icon: CircleDollarSign },
  { id: "contracts", label: "Contratos y Firmas", icon: FileSignature },
  { id: "documents", label: "Documentos", icon: FolderOpen },
  { id: "emails", label: "Correos", icon: Mail }
] satisfies Array<{ id: ModuleId; label: string; icon: typeof LayoutDashboard }>;

const moduleCopy: Record<ModuleId, { title: string; description: string }> = {
  dashboard: {
    title: "Panel Ejecutivo",
    description:
      "Vista general de operacion, finanzas, eventos y alertas criticas."
  },
  clients: {
    title: "Clientes",
    description:
      "CRUD de clientes y prospectos con ficha, seguimiento, busqueda y PDF."
  },
  events: {
    title: "Gestion Integral de Eventos",
    description:
      "Centro principal para clientes, presupuesto, pagos, proveedores, contratos, documentos, cronograma y operacion."
  },
  timeline: {
    title: "Cronograma Operativo",
    description:
      "Centro de control para timeline, responsables, proveedores, alertas y ejecucion del evento."
  },
  vendors: {
    title: "Proveedores",
    description:
      "CRUD de proveedores, categorias, contactos, tarifas y estados."
  },
  quotes: {
    title: "Cotizaciones",
    description:
      "Cotizaciones editables, duplicables, descargables en PDF y listas para enviar."
  },
  contracts: {
    title: "Contratos y Firmas",
    description:
      "Gestion legal de contratos, documentos, firmas, estados, archivos e historial."
  },
  documents: {
    title: "Documentos",
    description:
      "Biblioteca editable de archivos por cliente, evento, tipo y visibilidad."
  },
  emails: {
    title: "Correos",
    description:
      "Plantillas CRUD, vista previa personalizada e historial de envios."
  }
};

const quoteStatusOptions = [
  "Borrador",
  "Lista para enviar",
  "Enviada",
  "Aceptada",
  "Rechazada"
];

const contractStatusOptions = [
  "Borrador",
  "En revision interna",
  "Enviado al cliente",
  "Enviado al proveedor",
  "Pendiente de firma",
  "Firmado",
  "Vencido",
  "Cancelado",
  "Requiere modificacion",
  "Archivado"
];

const contractTypeOptions = [
  "Contrato de boda integral",
  "Contrato de coordinacion del dia",
  "Contrato de planificacion parcial",
  "Contrato de decoracion",
  "Contrato de quinceanos",
  "Contrato de evento corporativo",
  "Contrato de proveedor",
  "Contrato de mixologia",
  "Contrato de alquiler",
  "Contrato de montaje y desmontaje",
  "Adenda de contrato",
  "Acuerdo de pago",
  "Recibo o comprobante"
];

const contractTemplateOptions = [
  "Contrato boda premium",
  "Contrato boda coordinacion del dia",
  "Contrato quinceanos",
  "Contrato decoracion",
  "Contrato evento social",
  "Contrato proveedor decoracion",
  "Contrato proveedor fotografia",
  "Contrato proveedor musica / DJ",
  "Contrato mixologia",
  "Adenda de contrato",
  "Acuerdo de pago"
];

const contractTemplateContent: Record<string, Partial<Contract>> = {
  "Contrato boda premium": {
    name: "Contrato de planificacion integral de boda",
    services:
      "Planificacion integral, coordinacion general, gestion de proveedores, cronograma maestro, acompanamiento el dia del evento y seguimiento administrativo.",
    paymentTerms:
      "50% para reservar la fecha, 30% durante la etapa de planificacion y 20% diez dias antes del evento.",
    cancellationPolicy:
      "La cancelacion debe notificarse por escrito. Los pagos realizados por reserva de fecha y trabajo ejecutado no son reembolsables.",
    companyResponsibilities:
      "La empresa coordinara el alcance contratado, dara seguimiento a proveedores aprobados y mantendra comunicacion formal con el cliente.",
    clientResponsibilities:
      "El cliente debe entregar informacion, aprobaciones y pagos en las fechas acordadas para evitar retrasos operativos."
  },
  "Contrato proveedor decoracion": {
    name: "Contrato de proveedor de decoracion",
    services:
      "Diseno, montaje, desmontaje, transporte de elementos decorativos y coordinacion con el equipo de logistica del evento.",
    paymentTerms: "40% al confirmar, 40% quince dias antes del evento y 20% contra montaje aprobado.",
    cancellationPolicy:
      "Cambios de alcance o cancelaciones pueden generar cargos por materiales, produccion y reserva de agenda.",
    companyResponsibilities:
      "La empresa coordinara accesos, horarios de montaje y comunicacion con venue y cliente final.",
    clientResponsibilities:
      "El proveedor debe cumplir horarios, entregables aprobados, normas del venue y desmontaje segun cronograma."
  },
  "Acuerdo de pago": {
    name: "Acuerdo de pago",
    services: "Formalizacion del calendario de pagos y condiciones administrativas acordadas.",
    paymentTerms: "Los pagos deberan realizarse segun el calendario descrito y confirmarse con comprobante.",
    cancellationPolicy:
      "El incumplimiento de pagos puede pausar servicios, reservas o entregables hasta regularizar el saldo."
  }
};

const timelineStatusOptions = [
  "Pendiente",
  "Confirmado",
  "En proceso",
  "Completado",
  "Atrasado",
  "Cancelado",
  "Requiere atencion"
];

const timelineCategoryOptions = [
  "Pre evento",
  "Montaje",
  "Decoracion",
  "Mobiliario",
  "Audio y luces",
  "Fotografia y video",
  "Catering",
  "Llegada de proveedores",
  "Llegada de familia",
  "Llegada de novios",
  "Ceremonia",
  "Recepcion",
  "Protocolo",
  "Brindis",
  "Bailes especiales",
  "Show / artista",
  "Hora loca",
  "Coordinacion de invitados",
  "Transporte",
  "Pagos / validaciones",
  "Cierre del evento",
  "Desmontaje",
  "Post evento"
];

const timelinePriorityOptions: TimelineItem["priority"][] = [
  "Baja",
  "Media",
  "Alta",
  "Critica"
];

const timelineVersions = [
  "Version 1 - Cronograma inicial",
  "Version 2 - Ajustes de proveedores",
  "Version 3 - Cronograma final",
  "Version final enviada al cliente"
];

const eventStatusOptions = [
  "Prospecto",
  "Cotizacion enviada",
  "Pendiente de abono",
  "Confirmado",
  "En planificacion",
  "En produccion",
  "Semana del evento",
  "Dia del evento",
  "Realizado",
  "En cierre",
  "Cerrado",
  "Cancelado",
  "Pausado"
];

const eventTypeOptions = [
  "Boda",
  "Quinceanos",
  "Corporativo",
  "Cumpleanos",
  "Evento social",
  "Decoracion",
  "Logistica",
  "Religioso"
];

const eventChecklistTemplate = [
  "Cliente registrado",
  "Evento creado",
  "Cotizacion aprobada",
  "Abono recibido",
  "Contrato generado",
  "Contrato firmado",
  "Venue confirmado",
  "Proveedores asignados",
  "Proveedores confirmados",
  "Cronograma creado",
  "Cronograma enviado al equipo",
  "Cronograma enviado a proveedores",
  "Documentos cargados",
  "Presupuesto actualizado",
  "Pagos al dia",
  "Reunion final realizada",
  "Evento ejecutado",
  "Desmontaje completado",
  "Cierre financiero completado",
  "Evento cerrado"
];

function moduleFromHash(): ModuleId {
  if (typeof window === "undefined") return "dashboard";
  const hash = window.location.hash.replace("#", "");
  return hash in moduleCopy ? (hash as ModuleId) : "dashboard";
}

const initialClients: Client[] = [
  {
    id: "cl-1",
    name: "Mariana Lopez",
    phone: "+507 6123-4455",
    email: "mariana@example.com",
    event: "Boda",
    date: "18 jul 2026",
    place: "Casa Veranda",
    guests: 180,
    budget: "$22,000",
    status: "Cotizado",
    next: "Llamada de seguimiento"
  },
  {
    id: "cl-2",
    name: "Grupo Altair",
    phone: "+507 6677-1122",
    email: "eventos@altair.test",
    event: "Corporativo",
    date: "02 ago 2026",
    place: "Museo del Canal",
    guests: 95,
    budget: "$14,500",
    status: "Prospecto",
    next: "Enviar propuesta"
  },
  {
    id: "cl-3",
    name: "Familia Rivera",
    phone: "+507 6988-2244",
    email: "rivera@example.com",
    event: "Cumpleanos",
    date: "14 sep 2026",
    place: "Residencia privada",
    guests: 80,
    budget: "$6,800",
    status: "Contratado",
    next: "Solicitar anticipo"
  }
];

function enrichEvent(event: Omit<EventRecord, "eventNumber" | "clientPhone" | "clientEmail" | "decisionMaker" | "emergencyContact" | "clientNotes" | "endTime" | "ceremonyTime" | "receptionTime" | "vendorArrivalTime" | "clientArrivalTime" | "setupTime" | "teardownTime" | "address" | "room" | "city" | "locationLink" | "venueContact" | "venuePhone" | "approvedBudget" | "contractedAmount" | "deposit" | "paid" | "pendingBalance" | "paymentDeadline" | "paymentMethod" | "paymentStatus" | "paymentNotes" | "owner" | "assistant" | "protocolTeam" | "setupCoordinator" | "vendorCoordinator" | "paymentOwner" | "teardownOwner" | "style" | "colorPalette" | "concept" | "formality" | "dressCode" | "specialRequirements" | "venueRestrictions" | "importantNotes" | "documents" | "checklist" | "providers" | "tasks" | "history" | "lastUpdate"> & Partial<EventRecord>): EventRecord {
  const budgetNumber = currencyToNumber(event.budget);
  const paid = event.paid ?? money(Math.round(budgetNumber * 0.45));
  return {
    eventNumber: event.eventNumber ?? "VE-EVT-2026-0001",
    clientPhone: event.clientPhone ?? "+507 6000-0000",
    clientEmail: event.clientEmail ?? "cliente@example.com",
    decisionMaker: event.decisionMaker ?? event.clientName,
    emergencyContact: event.emergencyContact ?? "",
    clientNotes: event.clientNotes ?? "Preferencias y notas importantes del cliente pendientes de ampliar.",
    endTime: event.endTime ?? "01:00",
    ceremonyTime: event.ceremonyTime ?? "16:30",
    receptionTime: event.receptionTime ?? "18:30",
    vendorArrivalTime: event.vendorArrivalTime ?? "10:00",
    clientArrivalTime: event.clientArrivalTime ?? "15:30",
    setupTime: event.setupTime ?? "09:00",
    teardownTime: event.teardownTime ?? "01:30",
    address: event.address ?? event.venue,
    room: event.room ?? event.ceremony,
    city: event.city ?? "Panama",
    locationLink: event.locationLink ?? "",
    venueContact: event.venueContact ?? "Coordinacion venue",
    venuePhone: event.venuePhone ?? "+507 6000-1111",
    approvedBudget: event.approvedBudget ?? event.budget,
    contractedAmount: event.contractedAmount ?? event.budget,
    deposit: event.deposit ?? money(Math.round(budgetNumber * 0.25)),
    paid,
    pendingBalance: event.pendingBalance ?? money(Math.max(budgetNumber - currencyToNumber(paid), 0)),
    paymentDeadline: event.paymentDeadline ?? "10 jul 2026",
    paymentMethod: event.paymentMethod ?? "ACH",
    paymentStatus: event.paymentStatus ?? "Pendiente",
    paymentNotes: event.paymentNotes ?? "Validar pagos antes de cierre operativo.",
    owner: event.owner ?? "Vanessa Escala",
    assistant: event.assistant ?? "Asistente de evento",
    protocolTeam: event.protocolTeam ?? "Equipo protocolo",
    setupCoordinator: event.setupCoordinator ?? "Coordinador montaje",
    vendorCoordinator: event.vendorCoordinator ?? "Coordinador proveedores",
    paymentOwner: event.paymentOwner ?? "Finanzas",
    teardownOwner: event.teardownOwner ?? "Logistica",
    style: event.style ?? "Elegante contemporaneo",
    colorPalette: event.colorPalette ?? "Blanco, dorado y verdes suaves",
    concept: event.concept ?? "Experiencia personalizada premium",
    formality: event.formality ?? "Formal",
    dressCode: event.dressCode ?? "Formal / cocktail",
    specialRequirements: event.specialRequirements ?? "Confirmar requerimientos especiales con cliente.",
    venueRestrictions: event.venueRestrictions ?? "Validar horarios de montaje, ruido y desmontaje.",
    importantNotes: event.importantNotes ?? "Revisar pendientes una semana antes del evento.",
    documents: event.documents ?? ["Cotizacion aprobada.pdf", "Contrato cliente.pdf", "Moodboard.pdf"],
    checklist: event.checklist ?? eventChecklistTemplate.map((label, index) => ({ label, status: index < 8 ? "Completado" : index < 14 ? "En proceso" : "Pendiente" })),
    providers: event.providers ?? [
      { category: "Decoracion", name: "Bloom Atelier", contact: "Laura Mendez", phone: "+507 6000-1212", service: "Decoracion floral", amount: 3500, status: "Confirmado", arrival: "10:00", pendingPayment: 1500, notes: "Confirmar desmontaje." },
      { category: "Audio y luces", name: "Luz Viva Studio", contact: "Diego Vega", phone: "+507 6000-5656", service: "Audio, luces y tarima", amount: 2800, status: "Pendiente de pago", arrival: "12:30", pendingPayment: 1400, notes: "Pendiente rider final." }
    ],
    tasks: event.tasks ?? [
      { title: "Confirmar proveedores clave", owner: "Coordinadora", dueDate: "08 jul 2026", priority: "Alta", status: "En proceso", relatedTo: "Proveedor", notes: "Audio pendiente." },
      { title: "Enviar cronograma final", owner: "Vanessa Escala", dueDate: "12 jul 2026", priority: "Media", status: "Pendiente", relatedTo: "Cronograma", notes: "Enviar a cliente y proveedores." }
    ],
    history: event.history ?? ["05 jul 2026 - Evento creado en sistema.", "05 jul 2026 - Carpeta digital actualizada."],
    lastUpdate: event.lastUpdate ?? "05 jul 2026",
    ...event
  };
}

const initialEvents: EventRecord[] = [
  enrichEvent({
    id: "ev-1",
    eventNumber: "VE-EVT-2026-0001",
    clientName: "Mariana Lopez",
    clientPhone: "+507 6123-4455",
    clientEmail: "mariana@example.com",
    name: "Boda Valeria & Andres",
    type: "Boda",
    date: "18 jul 2026",
    time: "16:30 - 01:00",
    venue: "Casa Veranda",
    ceremony: "Jardin norte",
    guests: 180,
    budget: "$42,000",
    progress: 86,
    status: "En planificacion",
    health: "success"
  }),
  enrichEvent({
    id: "ev-2",
    eventNumber: "VE-EVT-2026-0002",
    clientName: "Isabella Torres",
    name: "Quinceanos Isabella",
    type: "Quinceanos",
    date: "24 jul 2026",
    time: "18:00 - 00:30",
    venue: "Hotel Bristol",
    ceremony: "Salon imperial",
    guests: 220,
    budget: "$28,500",
    progress: 62,
    status: "Pagos pendientes",
    health: "warning"
  }),
  enrichEvent({
    id: "ev-3",
    eventNumber: "VE-EVT-2026-0003",
    clientName: "Grupo Altair",
    name: "Cena corporativa Nova",
    type: "Corporativo",
    date: "02 ago 2026",
    time: "19:00 - 23:00",
    venue: "Museo del Canal",
    ceremony: "Auditorio",
    guests: 95,
    budget: "$14,500",
    progress: 48,
    status: "Proveedores sin confirmar",
    health: "danger"
  })
];

const initialTimeline: TimelineItem[] = [
  {
    id: "tl-1",
    eventId: "ev-1",
    date: "18 jul 2026",
    time: "10:00",
    endTime: "12:30",
    title: "Montaje de mobiliario",
    category: "Mobiliario",
    owner: "Equipo logistico",
    team: "Logistica y asistentes",
    place: "Salon principal",
    vendor: "Rental Pro",
    vendorContact: "Carlos Ruiz",
    vendorPhone: "+507 6000-9090",
    priority: "Alta",
    description: "Ingreso, distribucion y revision de mobiliario segun plano aprobado.",
    internalInstructions: "Validar cantidades contra inventario y dejar pasillos libres.",
    vendorInstructions: "Llegar por acceso de carga y reportarse con coordinadora.",
    requiresConfirmation: true,
    isCritical: false,
    dependsOn: "",
    duration: "2h 30m",
    files: ["Plano salon principal.pdf"],
    internalNotes: "Confirmar manteleria antes de ubicar mesas.",
    clientNotes: "Montaje general del salon.",
    teamComments: "Revisar estaciones de agua para staff.",
    vendorConfirmed: true,
    confirmationDate: "04 jul 2026",
    confirmationBy: "Carlos Ruiz",
    confirmationMethod: "WhatsApp",
    confirmationNotes: "Confirmo 6 personas para montaje.",
    history: ["02 jul 2026 - Actividad creada.", "04 jul 2026 - Proveedor confirmo horario."],
    status: "Confirmado"
  },
  {
    id: "tl-2",
    eventId: "ev-1",
    date: "18 jul 2026",
    time: "13:30",
    endTime: "14:30",
    title: "Prueba de sonido e iluminacion",
    category: "Audio y luces",
    owner: "Proveedor audiovisual",
    team: "Audio, luces y coordinadora",
    place: "Tarima",
    vendor: "Luz Viva Studio",
    vendorContact: "Diego Vega",
    vendorPhone: "+507 6000-5656",
    priority: "Critica",
    description: "Prueba completa de microfonos, pista, luces de entrada y musica de ceremonia.",
    internalInstructions: "No iniciar recepcion si esta prueba queda pendiente.",
    vendorInstructions: "Tener playlist offline y microfono adicional disponible.",
    requiresConfirmation: true,
    isCritical: true,
    dependsOn: "Montaje de mobiliario",
    duration: "1h",
    files: ["Rider tecnico.pdf", "Playlist entradas.pdf"],
    internalNotes: "Depende de energia estable del venue.",
    clientNotes: "Prueba tecnica previa al evento.",
    teamComments: "Avisar a protocolo al finalizar.",
    vendorConfirmed: false,
    confirmationDate: "",
    confirmationBy: "",
    confirmationMethod: "",
    confirmationNotes: "Pendiente confirmacion final de tecnico.",
    history: ["02 jul 2026 - Actividad creada.", "05 jul 2026 - Marcada como critica."],
    status: "Pendiente"
  },
  {
    id: "tl-3",
    eventId: "ev-1",
    date: "18 jul 2026",
    time: "16:00",
    endTime: "16:25",
    title: "Llegada de familia y fotografos",
    category: "Llegada de familia",
    owner: "Coordinadora",
    team: "Protocolo y foto/video",
    place: "Suite novia",
    vendor: "Memoria Films",
    vendorContact: "Andrea Molina",
    vendorPhone: "+507 6111-3344",
    priority: "Alta",
    description: "Recepcion de familiares inmediatos y coordinacion de fotos previas.",
    internalInstructions: "Mantener suite privada y evitar ingreso de invitados generales.",
    vendorInstructions: "Priorizar fotos con padres y cortejo.",
    requiresConfirmation: true,
    isCritical: false,
    dependsOn: "",
    duration: "25m",
    files: ["Shotlist familia.pdf"],
    internalNotes: "Tener agua y costurero disponible.",
    clientNotes: "Fotos familiares previas.",
    teamComments: "Asignar asistente en puerta.",
    vendorConfirmed: true,
    confirmationDate: "05 jul 2026",
    confirmationBy: "Andrea Molina",
    confirmationMethod: "Correo",
    confirmationNotes: "Confirmo llegada 15:45.",
    history: ["02 jul 2026 - Actividad creada.", "05 jul 2026 - Foto/video confirmo llegada."],
    status: "Confirmado"
  },
  {
    id: "tl-4",
    eventId: "ev-2",
    date: "24 jul 2026",
    time: "15:00",
    endTime: "15:45",
    title: "Confirmar entrada de quinceanera",
    category: "Protocolo",
    owner: "Coordinadora",
    team: "Protocolo, DJ y familia",
    place: "Salon imperial",
    vendor: "DJ Live",
    vendorContact: "Roberto DJ",
    vendorPhone: "+507 6888-1010",
    priority: "Critica",
    description: "Ensayo de entrada, timing musical, luces y ubicacion de familia.",
    internalInstructions: "Confirmar senal de entrada con maestro de ceremonia.",
    vendorInstructions: "Tener pista editada y version de respaldo.",
    requiresConfirmation: true,
    isCritical: true,
    dependsOn: "",
    duration: "45m",
    files: ["Programa quinceanos.pdf"],
    internalNotes: "Actividad critica para apertura.",
    clientNotes: "Ensayo de entrada principal.",
    teamComments: "Revisar zapatos y vestido antes del ensayo.",
    vendorConfirmed: false,
    confirmationDate: "",
    confirmationBy: "",
    confirmationMethod: "",
    confirmationNotes: "",
    history: ["01 jul 2026 - Actividad creada.", "04 jul 2026 - Pendiente confirmacion de DJ."],
    status: "Pendiente"
  },
  {
    id: "tl-5",
    eventId: "ev-3",
    date: "02 ago 2026",
    time: "18:00",
    endTime: "18:30",
    title: "Prueba de microfonos ejecutivos",
    category: "Audio y luces",
    owner: "Tecnico audiovisual",
    team: "Tecnica y protocolo corporativo",
    place: "Auditorio",
    vendor: "Luz Viva Studio",
    vendorContact: "Diego Vega",
    vendorPhone: "+507 6000-5656",
    priority: "Alta",
    description: "Prueba de microfonos para discursos ejecutivos y panel.",
    internalInstructions: "Validar nombres y orden de intervencion.",
    vendorInstructions: "Preparar microfonos de solapa y mano.",
    requiresConfirmation: true,
    isCritical: false,
    dependsOn: "",
    duration: "30m",
    files: ["Programa corporativo.pdf"],
    internalNotes: "Cancelado por cambio de agenda del cliente.",
    clientNotes: "Prueba tecnica corporativa.",
    teamComments: "Reprogramar si cliente confirma nueva hora.",
    vendorConfirmed: false,
    confirmationDate: "",
    confirmationBy: "",
    confirmationMethod: "",
    confirmationNotes: "",
    history: ["03 jul 2026 - Actividad creada.", "05 jul 2026 - Cancelada por cambio de agenda."],
    status: "Cancelado"
  }
];

const initialVendors: Vendor[] = [
  {
    id: "vd-1",
    name: "Bloom Atelier",
    category: "Decoracion",
    contact: "Laura Mendez",
    phone: "+507 6000-1212",
    email: "hola@bloom.test",
    rate: "$3,500",
    status: "Recomendado"
  },
  {
    id: "vd-2",
    name: "Catering Aura",
    category: "Catering",
    contact: "Sofia Ramos",
    phone: "+507 6000-3434",
    email: "ventas@aura.test",
    rate: "$48 por persona",
    status: "Activo"
  },
  {
    id: "vd-3",
    name: "Luz Viva Studio",
    category: "Foto y video",
    contact: "Diego Vega",
    phone: "+507 6000-5656",
    email: "studio@luzviva.test",
    rate: "$2,800",
    status: "Pendiente"
  }
];

const initialQuotes: Quote[] = [
  {
    id: "qt-1",
    quoteNumber: "COT-2026-0001",
    client: "Mariana Lopez",
    clientTaxId: "8-888-888",
    clientEmail: "mariana@example.com",
    event: "Boda Valeria & Andres",
    eventPlace: "Casa Veranda",
    paymentMethod: "ACH",
    observations:
      "Para iniciar la prestacion del servicio se requiere el pago anticipado del 50%. El restante debera cancelarse antes del evento.",
    items: [
      {
        id: "qi-1",
        description: "Planificacion integral del evento",
        quantity: 1,
        unit: "Servicio",
        unitPrice: 14000,
        discount: 0,
        tax: 0
      },
      {
        id: "qi-2",
        description: "Coordinacion del dia del evento",
        quantity: 1,
        unit: "Servicio",
        unitPrice: 8000,
        discount: 0,
        tax: 0
      }
    ],
    expires: "12 jul 2026",
    status: "Lista para enviar"
  },
  {
    id: "qt-2",
    quoteNumber: "COT-2026-0002",
    client: "Grupo Altair",
    clientTaxId: "RUC-155-991",
    clientEmail: "eventos@altair.test",
    event: "Cena corporativa Nova",
    eventPlace: "Museo del Canal",
    paymentMethod: "Link de pago",
    observations: "Cotizacion sujeta a disponibilidad de proveedores.",
    items: [
      {
        id: "qi-3",
        description: "Coordinacion corporativa y protocolo",
        quantity: 1,
        unit: "Servicio",
        unitPrice: 9500,
        discount: 0,
        tax: 0
      },
      {
        id: "qi-4",
        description: "Ambientacion general",
        quantity: 1,
        unit: "Servicio",
        unitPrice: 5000,
        discount: 0,
        tax: 0
      }
    ],
    expires: "09 jul 2026",
    status: "Borrador"
  }
];

const initialContracts: Contract[] = [
  {
    id: "ct-1",
    contractNumber: "VE-CONT-2026-0001",
    kind: "Cliente",
    contractType: "Contrato de boda integral",
    client: "Mariana Lopez",
    event: "Boda Valeria & Andres",
    template: "Contrato boda premium",
    name: "Contrato integral boda Valeria & Andres",
    amount: 42000,
    deposit: 21000,
    balance: 21000,
    createdAt: "04 jul 2026",
    sentAt: "05 jul 2026",
    signatureDeadline: "12 jul 2026",
    signedAt: "",
    owner: "Vanessa Escala",
    services:
      "Planificacion integral, coordinacion del dia, gestion de proveedores, cronograma maestro y supervision de montaje.",
    paymentTerms: "50% para reservar fecha, 30% durante planificacion y 20% diez dias antes del evento.",
    cancellationPolicy:
      "Cancelaciones deben notificarse por escrito. La reserva de fecha y servicios ejecutados no son reembolsables.",
    clientResponsibilities:
      "Entregar aprobaciones, informacion de invitados y pagos en las fechas acordadas.",
    companyResponsibilities:
      "Coordinar proveedores aprobados, cronograma, montaje y ejecucion del evento segun alcance contratado.",
    specialClauses:
      "Cambios de alcance despues de la aprobacion final pueden generar costos adicionales.",
    internalNotes: "Pendiente confirmar ajuste de decoracion floral.",
    documents: ["Cotizacion aprobada.pdf", "Comprobante reserva.jpg"],
    history: [
      "04 jul 2026 - Vanessa creo el contrato en borrador.",
      "05 jul 2026 - Contrato enviado al cliente por correo.",
      "06 jul 2026 - Cliente solicito revisar clausula de decoracion."
    ],
    terms: "50% para reservar fecha, 50% diez dias antes del evento.",
    status: "Pendiente de firma",
    signatureRequired: true
  },
  {
    id: "ct-2",
    contractNumber: "VE-CONT-2026-0002",
    kind: "Cliente",
    contractType: "Contrato de evento corporativo",
    client: "Familia Rivera",
    event: "Cumpleanos privado",
    template: "Contrato evento social",
    name: "Contrato evento social Familia Rivera",
    amount: 6800,
    deposit: 3400,
    balance: 3400,
    createdAt: "29 jun 2026",
    sentAt: "30 jun 2026",
    signatureDeadline: "06 jul 2026",
    signedAt: "02 jul 2026",
    owner: "Equipo Comercial",
    services:
      "Coordinacion de evento social, logistica de proveedores, ambientacion basica y supervision general.",
    paymentTerms: "50% al firmar y 50% cinco dias antes del evento.",
    cancellationPolicy:
      "Cancelacion con menos de quince dias puede generar cargos por proveedores reservados.",
    clientResponsibilities:
      "Confirmar invitados, horario, accesos y pagos en los plazos establecidos.",
    companyResponsibilities:
      "Gestionar cronograma, proveedores confirmados y ejecucion del servicio contratado.",
    specialClauses: "Servicio sujeto a disponibilidad de proveedores confirmados.",
    internalNotes: "Contrato firmado, falta subir cedula del cliente.",
    documents: ["Contrato firmado Rivera.pdf", "Comprobante abono 1.jpg"],
    history: [
      "29 jun 2026 - Contrato creado.",
      "30 jun 2026 - Contrato enviado.",
      "02 jul 2026 - Contrato marcado como firmado."
    ],
    terms: "Servicio sujeto a confirmacion de proveedores y pagos acordados.",
    status: "Firmado",
    signatureRequired: true
  },
  {
    id: "ct-3",
    contractNumber: "VE-CONT-2026-0003",
    kind: "Proveedor",
    contractType: "Contrato de proveedor",
    client: "Bloom Atelier",
    event: "Boda Valeria & Andres",
    template: "Contrato proveedor decoracion",
    name: "Contrato proveedor decoracion Bloom Atelier",
    amount: 3500,
    deposit: 1400,
    balance: 2100,
    createdAt: "03 jul 2026",
    sentAt: "",
    signatureDeadline: "09 jul 2026",
    signedAt: "",
    owner: "Coordinadora Senior",
    services:
      "Montaje floral, desmontaje, transporte de elementos decorativos y coordinacion con venue.",
    paymentTerms: "40% al confirmar, 40% quince dias antes del evento y 20% contra montaje aprobado.",
    cancellationPolicy:
      "Cambios o cancelaciones pueden generar cargos por materiales, produccion y reserva de agenda.",
    clientResponsibilities:
      "El proveedor debe cumplir horarios, entregables, montaje y desmontaje segun cronograma aprobado.",
    companyResponsibilities:
      "La empresa coordinara accesos, horario de montaje, desmontaje y comunicacion con venue.",
    specialClauses: "Proveedor debe contar con personal suficiente para desmontaje nocturno.",
    internalNotes: "Revisar clausula de dano a mobiliario del venue.",
    documents: ["Propuesta Bloom Atelier.pdf"],
    history: [
      "03 jul 2026 - Borrador creado desde plantilla de proveedor.",
      "04 jul 2026 - En revision interna por logistica."
    ],
    terms:
      "El proveedor se compromete a montaje, desmontaje, puntualidad, confidencialidad y entrega de servicio segun cronograma aprobado.",
    status: "En revision interna",
    signatureRequired: true
  }
];

const initialPayments: Payment[] = [
  {
    id: "py-1",
    eventId: "ev-1",
    concept: "Reserva de fecha",
    amount: 12000,
    paid: 12000,
    dueDate: "01 jul 2026",
    status: "Pagado"
  },
  {
    id: "py-2",
    eventId: "ev-1",
    concept: "Segundo abono",
    amount: 15000,
    paid: 8500,
    dueDate: "10 jul 2026",
    status: "Pendiente"
  },
  {
    id: "py-3",
    eventId: "ev-2",
    concept: "Anticipo proveedores",
    amount: 9000,
    paid: 3000,
    dueDate: "15 jul 2026",
    status: "Pendiente"
  },
  {
    id: "py-4",
    eventId: "ev-3",
    concept: "Pago corporativo inicial",
    amount: 7250,
    paid: 0,
    dueDate: "08 jul 2026",
    status: "Vencido"
  }
];

const initialDocuments: DocumentItem[] = [
  {
    id: "dc-1",
    name: "Cotizacion boda premium.pdf",
    owner: "Mariana Lopez",
    kind: "Cotizacion",
    visibility: "Cliente"
  },
  {
    id: "dc-2",
    name: "Comprobante abono 1.jpg",
    owner: "Familia Rivera",
    kind: "Comprobante",
    visibility: "Interno"
  },
  {
    id: "dc-3",
    name: "Inspiracion decoracion.pdf",
    owner: "Boda Valeria & Andres",
    kind: "Inspiracion",
    visibility: "Cliente"
  }
];

const initialTemplates: EmailTemplate[] = [
  {
    id: "em-1",
    name: "Bienvenida",
    subject: "Bienvenida a Eventora, {{cliente}}",
    body: "Hola {{cliente}}, gracias por confiar en nosotros para tu {{evento}}. Ya estamos organizando los proximos pasos."
  },
  {
    id: "em-2",
    name: "Seguimiento de cotizacion",
    subject: "Seguimiento de tu cotizacion",
    body: "Hola {{cliente}}, queriamos saber si tienes dudas sobre la cotizacion de tu {{evento}} del {{fecha}}."
  },
  {
    id: "em-3",
    name: "Recordatorio de pago",
    subject: "Recordatorio de pago pendiente",
    body: "Hola {{cliente}}, te compartimos un recordatorio amable sobre el proximo pago de tu {{evento}}."
  }
];

const blankClient: Client = {
  id: "",
  name: "",
  phone: "",
  email: "",
  event: "Boda",
  date: "",
  place: "",
  guests: 0,
  budget: "$0",
  status: "Prospecto",
  next: ""
};

const blankEvent: EventRecord = enrichEvent({
  id: "",
  eventNumber: "",
  clientName: "",
  name: "",
  type: "Boda",
  date: "",
  time: "",
  venue: "",
  ceremony: "",
  guests: 0,
  budget: "$0",
  progress: 10,
  status: "En planificacion",
  health: "warning"
});

const blankVendor: Vendor = {
  id: "",
  name: "",
  category: "Decoracion",
  contact: "",
  phone: "",
  email: "",
  rate: "$0",
  status: "Activo"
};

const blankQuote: Quote = {
  id: "",
  quoteNumber: "",
  client: "",
  clientTaxId: "",
  clientEmail: "",
  event: "",
  eventPlace: "",
  paymentMethod: "ACH",
  observations:
    "Para iniciar la prestacion del servicio se requiere el pago anticipado del 50%. El restante debera cancelarse antes del evento.",
  items: [
    {
      id: "qi-draft-1",
      description: "",
      quantity: 1,
      unit: "Servicio",
      unitPrice: 0,
      discount: 0,
      tax: 0
    }
  ],
  expires: "",
  status: "Borrador"
};

const blankContract: Contract = {
  id: "",
  contractNumber: "",
  kind: "Cliente",
  contractType: "Contrato de boda integral",
  client: "",
  event: "",
  template: "Contrato boda premium",
  name: "",
  amount: 0,
  deposit: 0,
  balance: 0,
  createdAt: "05 jul 2026",
  sentAt: "",
  signatureDeadline: "",
  signedAt: "",
  owner: "Vanessa Escala",
  services: "",
  paymentTerms: "",
  cancellationPolicy: "",
  clientResponsibilities: "",
  companyResponsibilities: "",
  specialClauses: "",
  internalNotes: "",
  documents: [],
  history: [],
  terms: "",
  status: "Borrador",
  signatureRequired: true
};

const blankDocument: DocumentItem = {
  id: "",
  name: "",
  owner: "",
  kind: "Documento",
  visibility: "Interno"
};

const blankTemplate: EmailTemplate = {
  id: "",
  name: "",
  subject: "",
  body: ""
};

const blankTimelineItem: TimelineItem = {
  id: "",
  eventId: "ev-1",
  date: "",
  time: "",
  endTime: "",
  title: "",
  category: "Montaje",
  owner: "",
  team: "",
  place: "",
  vendor: "",
  vendorContact: "",
  vendorPhone: "",
  priority: "Media",
  description: "",
  internalInstructions: "",
  vendorInstructions: "",
  requiresConfirmation: false,
  isCritical: false,
  dependsOn: "",
  duration: "",
  files: [],
  internalNotes: "",
  clientNotes: "",
  teamComments: "",
  vendorConfirmed: false,
  confirmationDate: "",
  confirmationBy: "",
  confirmationMethod: "WhatsApp",
  confirmationNotes: "",
  history: [],
  status: "Pendiente"
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

function nextQuoteNumber(quotes: Quote[]) {
  const year = new Date().getFullYear();
  const maxSequence = quotes.reduce((max, quote) => {
    const match = quote.quoteNumber.match(/COT-\d{4}-(\d{4})/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `COT-${year}-${String(maxSequence + 1).padStart(4, "0")}`;
}

function quoteItemReference(index: number) {
  return String(index + 1).padStart(2, "0");
}

function quoteItemSubtotal(item: QuoteItem) {
  return item.quantity * item.unitPrice;
}

function quoteItemTotal(item: QuoteItem) {
  const subtotal = quoteItemSubtotal(item);
  return Math.max(subtotal - item.discount + item.tax, 0);
}

function quoteTotals(quote: Quote) {
  const subtotal = quote.items.reduce((sum, item) => sum + quoteItemSubtotal(item), 0);
  const discount = quote.items.reduce((sum, item) => sum + item.discount, 0);
  const tax = quote.items.reduce((sum, item) => sum + item.tax, 0);
  const total = quote.items.reduce((sum, item) => sum + quoteItemTotal(item), 0);
  return { discount, subtotal, tax, total };
}

function quoteShareText(quote: Quote) {
  const quoteNumber = quote.quoteNumber || "cotizacion";
  return `Hola ${quote.client || ""}, te comparto la cotizacion ${quoteNumber} para ${quote.event || "tu evento"}. Total: ${money(quoteTotals(quote).total)}.`;
}

function nextContractNumber(contracts: Contract[]) {
  const maxSequence = contracts.reduce((max, contract) => {
    const match = contract.contractNumber.match(/VE-CONT-\d{4}-(\d{4})/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `VE-CONT-2026-${String(maxSequence + 1).padStart(4, "0")}`;
}

function nextEventNumber(events: EventRecord[]) {
  const maxSequence = events.reduce((max, event) => {
    const match = event.eventNumber.match(/VE-EVT-\d{4}-(\d{4})/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `VE-EVT-2026-${String(maxSequence + 1).padStart(4, "0")}`;
}

function eventAlerts(event: EventRecord, payments: Payment[], contracts: Contract[], timeline: TimelineItem[]) {
  const alerts: string[] = [];
  const eventPayments = payments.filter((payment) => payment.eventId === event.id);
  const eventContracts = contracts.filter((contract) => contract.event === event.name);
  const eventTimeline = timeline.filter((item) => item.eventId === event.id);
  if (eventPayments.some((payment) => payment.status !== "Pagado")) alerts.push("Pago pendiente");
  if (eventContracts.some((contract) => contract.status !== "Firmado")) alerts.push("Contrato pendiente de firma");
  if (event.providers.some((provider) => provider.status !== "Confirmado" && provider.status !== "Pagado")) alerts.push("Proveedores sin confirmar");
  if (eventTimeline.length === 0 || eventTimeline.some((item) => item.status === "Pendiente")) alerts.push("Cronograma incompleto");
  if (event.documents.length < 3) alerts.push("Documentos faltantes");
  if (event.tasks.some((task) => task.status === "Vencida")) alerts.push("Tareas vencidas");
  if (!event.owner) alerts.push("Falta asignar responsable");
  if (!event.venue) alerts.push("Falta lugar del evento");
  if (!event.ceremonyTime) alerts.push("Falta hora de ceremonia");
  if (!event.receptionTime) alerts.push("Falta hora de recepcion");
  if (!event.guests) alerts.push("Falta cantidad de invitados");
  return alerts;
}

function eventPdfLines(event: EventRecord, includeInternal = true) {
  return [
    event.eventNumber || "Evento sin numero",
    `Evento: ${event.name}`,
    `Cliente: ${event.clientName}`,
    `Fecha: ${event.date}`,
    `Lugar: ${event.venue}`,
    `Tipo: ${event.type}`,
    `Estado: ${event.status}`,
    `Invitados: ${event.guests}`,
    `Presupuesto: ${event.budget}`,
    `Pagado: ${event.paid}`,
    `Saldo: ${event.pendingBalance}`,
    `Responsable: ${event.owner}`,
    "",
    "Proveedores:",
    ...event.providers.map((provider) => `${provider.category} - ${provider.name} - ${provider.status} - ${money(provider.amount)}`),
    "",
    "Checklist:",
    ...event.checklist.map((item) => `${item.status} - ${item.label}`),
    ...(includeInternal ? ["", "Notas internas:", event.importantNotes, ...event.history] : []),
    "",
    "Vanessa Escala Wedding & Events Planner - Carpeta digital del evento"
  ];
}

function contractPdfLines(contract: Contract) {
  return [
    contract.contractNumber || "Contrato sin numero",
    `Tipo de contrato: ${contract.contractType || "-"}`,
    `Cliente / proveedor: ${contract.client || "-"}`,
    `Evento: ${contract.event || "-"}`,
    `Plantilla: ${contract.template || "-"}`,
    `Monto total: ${money(contract.amount)}`,
    `Abono inicial: ${money(contract.deposit)}`,
    `Saldo pendiente: ${money(contract.balance)}`,
    `Fecha de emision: ${contract.createdAt || "-"}`,
    `Fecha limite de firma: ${contract.signatureDeadline || "-"}`,
    `Estado: ${contract.status}`,
    "",
    "Servicios incluidos:",
    contract.services || "-",
    "",
    "Condiciones de pago:",
    contract.paymentTerms || contract.terms || "-",
    "",
    "Politica de cancelacion:",
    contract.cancellationPolicy || "-",
    "",
    "Responsabilidades del cliente / proveedor:",
    contract.clientResponsibilities || "-",
    "",
    "Responsabilidades de Vanessa Escala:",
    contract.companyResponsibilities || "-",
    "",
    "Clausulas especiales:",
    contract.specialClauses || "-",
    "",
    "Firmas:",
    "Cliente / proveedor: ________________________________",
    "Vanessa Escala: ________________________________"
  ];
}

function escapePdfText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, "");
}

function wrapLine(line: string, max = 82) {
  const words = line.split(" ");
  const lines: string[] = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function createPdfDocument(title: string, lines: string[]) {
  const pageLines = [title, "", ...lines].flatMap((line) => wrapLine(line));
  const content = [
    "BT",
    "/F1 16 Tf",
    "50 790 Td",
    `(${escapePdfText(pageLines[0] ?? title)}) Tj`,
    "/F1 11 Tf",
    "0 -22 Td",
    "14 TL",
    ...pageLines.slice(1, 52).map((line) => `(${escapePdfText(line)}) Tj T*`),
    "ET"
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

function pdfDataUri(title: string, lines: string[]) {
  return `data:application/pdf;charset=utf-8,${encodeURIComponent(
    createPdfDocument(title, lines)
  )}`;
}

function downloadPdf(title: string, lines: string[], filename: string) {
  const pdf = createPdfDocument(title, lines);

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency"
  }).format(value);
}

function currencyToNumber(value: string) {
  const parsed = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function downloadDocx(title: string, html: string, filename: string) {
  const documentHtml = `
    <html>
      <head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;font-size:11pt;line-height:1.45;color:#111} h1{text-align:center;font-size:18pt} table{border-collapse:collapse;width:100%} td,th{border:1px solid #333;padding:7px} .signature{margin-top:40px;display:flex;gap:80px}.line{border-top:1px solid #111;padding-top:8px;width:260px;text-align:center}</style></head>
      <body><h1>${title}</h1>${html}</body>
    </html>`;
  const blob = new Blob([documentHtml], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function printElement(elementId: string, title: string) {
  const element = document.getElementById(elementId);
  if (!element) return;
  const popup = window.open("", "_blank", "width=960,height=720");
  if (!popup) return;
  popup.document.write(`<!doctype html><html><head><title>${title}</title><base href="${window.location.origin}/"><style>
    @page{size:letter portrait;margin:0}
    *{box-sizing:border-box}
    html,body{background:#fff;color:#000;font-family:Arial,sans-serif;margin:0}
    body{display:grid;place-items:start center}
    .no-print{display:none!important}
    .quote-paper{background:#fff;border:0;color:#000;font-family:Arial,sans-serif;font-size:9.2pt;height:11in;line-height:1.24;overflow:hidden;padding:.28in .33in;width:8.5in}
    .quote-paper h2,.quote-paper h3,.quote-paper p{margin:0}
    .quote-header{align-items:start;display:grid;gap:.14in;grid-template-columns:1.2in 1fr 2.1in;margin-bottom:.14in}
    .quote-header img{max-height:.78in;max-width:1.05in;object-fit:contain}
    .quote-header h2{font-size:17pt;font-weight:800;line-height:1;text-align:center}
    .quote-header table,.quote-bottom table,.quote-items{border-collapse:collapse;width:100%}
    .quote-header th,.quote-header td,.quote-bottom th,.quote-bottom td,.quote-items th,.quote-items td{border:1px solid #222;padding:3.2px 4px}
    .quote-header th,.quote-header td{font-size:8.6pt}
    .quote-company{display:grid;gap:2px;margin-bottom:.12in}
    .quote-company h3{font-size:12.5pt;line-height:1.15}
    .quote-band{background:#e5e5e5;font-size:10.2pt;font-weight:800;margin:.09in 0 .04in;padding:2.5px 4px}
    .quote-client{display:grid;gap:2px;margin-bottom:.14in}
    .quote-client p{display:grid;grid-template-columns:.95in 1fr}
    .quote-items{table-layout:fixed}
    .quote-items th{background:#e5e5e5;font-size:8.6pt;font-weight:800;white-space:nowrap}
    .quote-items td{font-size:8.4pt;height:.24in;overflow-wrap:anywhere;text-align:center;vertical-align:top}
    .quote-items td:nth-child(2){text-align:left}
    .quote-items th:nth-child(1),.quote-items td:nth-child(1){width:.72in}
    .quote-items th:nth-child(2),.quote-items td:nth-child(2){width:2.28in}
    .quote-items th:nth-child(3),.quote-items td:nth-child(3){width:.62in}
    .quote-items th:nth-child(4),.quote-items td:nth-child(4){width:.7in}
    .quote-items th:nth-child(5),.quote-items td:nth-child(5){width:.86in}
    .quote-items th:nth-child(6),.quote-items td:nth-child(6){width:.58in}
    .quote-items th:nth-child(7),.quote-items td:nth-child(7){width:.62in}
    .quote-items th:nth-child(8),.quote-items td:nth-child(8){width:.92in}
    .quote-bottom{display:grid;gap:.18in;grid-template-columns:minmax(0,1.45fr) 2.15in;margin-top:.14in}
    .quote-bottom p{margin-bottom:4px}
    .quote-paper ul{margin:.07in 0 0 .22in;padding:0}
    @media print{body{display:block}.quote-paper{break-after:avoid;break-inside:avoid;margin:0;page-break-after:avoid;page-break-inside:avoid}}
  </style></head><body>${element.outerHTML}<script>
    window.addEventListener("load", function () {
      window.setTimeout(function () {
        window.focus();
        window.print();
      }, 250);
    });
  </script></body></html>`);
  popup.document.close();
  popup.focus();
}

function statusToneFromLabel(status: string): StatusTone {
  const normalized = status.toLowerCase();
  if (
    normalized.includes("aceptada") ||
    normalized.includes("completado") ||
    normalized.includes("firmado") ||
    normalized.includes("confirmado")
  ) {
    return "success";
  }
  if (
    normalized.includes("pendiente") ||
    normalized.includes("borrador") ||
    normalized.includes("revision")
  ) {
    return "warning";
  }
  if (
    normalized.includes("cancelado") ||
    normalized.includes("atrasado") ||
    normalized.includes("modificacion") ||
    normalized.includes("requiere atencion") ||
    normalized.includes("rechazada") ||
    normalized.includes("sin") ||
    normalized.includes("vencido")
  ) {
    return "danger";
  }
  if (normalized.includes("enviada") || normalized.includes("enviado")) return "blue";
  return "neutral";
}

const monthNames: Record<string, number> = {
  ene: 0,
  enero: 0,
  feb: 1,
  febrero: 1,
  mar: 2,
  marzo: 2,
  abr: 3,
  abril: 3,
  may: 4,
  mayo: 4,
  jun: 5,
  junio: 5,
  jul: 6,
  julio: 6,
  ago: 7,
  agosto: 7,
  sep: 8,
  septiembre: 8,
  oct: 9,
  octubre: 9,
  nov: 10,
  noviembre: 10,
  dic: 11,
  diciembre: 11
};

function parsePlannerDate(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  const iso = new Date(normalized);
  if (!Number.isNaN(iso.getTime())) return iso;

  const match = normalized.match(/^(\d{1,2})\s+([a-záéíóúñ]+)\s+(\d{4})$/i);
  if (!match) return undefined;
  const month = monthNames[match[2].normalize("NFD").replace(/[\u0300-\u036f]/g, "")];
  if (month === undefined) return undefined;
  return new Date(Number(match[3]), month, Number(match[1]));
}

function daysUntil(value: string, today = new Date()) {
  const date = parsePlannerDate(value);
  if (!date) return Number.POSITIVE_INFINITY;
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return Math.ceil((end - start) / 86_400_000);
}

function normalizePercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function alertTone(priority: AlertPriority): StatusTone {
  if (priority === "Critica") return "danger";
  if (priority === "Alta") return "danger";
  if (priority === "Media") return "warning";
  return "neutral";
}

class AutomationEngine {
  constructor(
    private readonly input: {
      clients: Client[];
      contracts: Contract[];
      events: EventRecord[];
      payments: Payment[];
      quotes: Quote[];
      timeline: TimelineItem[];
    },
    private readonly today = new Date()
  ) {}

  run(): AutomationSnapshot {
    const events = this.input.events.map((event) => this.synchronizeEvent(event));
    const alerts = this.createAlerts(events);
    const totals = this.calculateTotals(events);
    const metrics = this.createMetrics(events, alerts, totals);
    const checklistAreas = this.createChecklistAreas(events, totals);
    const calendarItems = this.createCalendarItems(events);
    const recentActivity = this.createRecentActivity(events, alerts);

    return { alerts, calendarItems, checklistAreas, events, metrics, recentActivity, totals };
  }

  private synchronizeEvent(event: EventRecord): EventRecord {
    const eventPayments = this.input.payments.filter((payment) => payment.eventId === event.id);
    const eventContracts = this.input.contracts.filter((contract) => contract.event === event.name);
    const eventTimeline = this.input.timeline.filter((item) => item.eventId === event.id);
    const contractedAmount = currencyToNumber(event.contractedAmount || event.budget);
    const paid = eventPayments.reduce((sum, payment) => sum + payment.paid, 0);
    const pendingBalance = Math.max(contractedAmount - paid, 0);
    const hasSignedContract = eventContracts.some((contract) => contract.status === "Firmado");
    const hasDeposit = eventPayments.some((payment) => payment.paid > 0);
    const allPaymentsDone = eventPayments.length > 0 && eventPayments.every((payment) => payment.paid >= payment.amount || payment.status === "Pagado");
    const hasPendingProvider = event.providers.some((provider) => provider.status !== "Confirmado" && provider.status !== "Pagado");
    const timelineComplete = eventTimeline.length > 0 && eventTimeline.every((item) => ["Confirmado", "Completado"].includes(item.status));
    const documentsReady = event.documents.length >= 3;
    const checklistComplete = event.checklist.length > 0 && event.checklist.every((item) => item.status === "Completado");
    const progress = this.calculateEventProgress({
      allPaymentsDone,
      checklistComplete,
      documentsReady,
      event,
      hasDeposit,
      hasPendingProvider,
      hasSignedContract,
      timelineComplete
    });
    const autoStatus = this.calculateEventStatus(event, hasSignedContract, hasDeposit, pendingBalance);
    const paymentStatus = this.calculatePaymentStatus(eventPayments, pendingBalance);

    return {
      ...event,
      paid: money(paid),
      paymentStatus,
      pendingBalance: money(pendingBalance),
      progress,
      status: autoStatus
    };
  }

  private calculateEventProgress(input: {
    allPaymentsDone: boolean;
    checklistComplete: boolean;
    documentsReady: boolean;
    event: EventRecord;
    hasDeposit: boolean;
    hasPendingProvider: boolean;
    hasSignedContract: boolean;
    timelineComplete: boolean;
  }) {
    let progress = 0;
    if (input.hasSignedContract) progress += 15;
    if (input.hasDeposit) progress += 15;
    if (input.event.providers.length > 0) progress += 15;
    if (input.event.providers.length > 0 && !input.hasPendingProvider) progress += 15;
    if (input.timelineComplete) progress += 15;
    if (input.documentsReady) progress += 10;
    if (input.checklistComplete) progress += 10;
    if (input.allPaymentsDone) progress += 5;
    return normalizePercent(progress);
  }

  private calculateEventStatus(event: EventRecord, hasSignedContract: boolean, hasDeposit: boolean, pendingBalance: number) {
    const eventDistance = daysUntil(event.date, this.today);
    if (["Cerrado", "Cancelado"].includes(event.status)) return event.status;
    if (eventDistance < 0 && pendingBalance <= 0) return "Cerrado";
    if (eventDistance < 0) return "En cierre";
    if (eventDistance <= 0) return "Dia del evento";
    if (eventDistance <= 7) return "Semana del evento";
    if (hasSignedContract && hasDeposit) return "En planificacion";
    if (hasSignedContract && !hasDeposit) return "Pendiente de abono";
    if (event.status === "Prospecto" || event.status === "Cotizacion enviada") return event.status;
    return event.status || "Prospecto";
  }

  private calculatePaymentStatus(eventPayments: Payment[], pendingBalance: number) {
    if (!eventPayments.length) return "Sin abono";
    if (pendingBalance <= 0) return "Pagado completo";
    if (eventPayments.some((payment) => daysUntil(payment.dueDate, this.today) < 0 && payment.paid < payment.amount)) return "Pago vencido";
    if (eventPayments.some((payment) => payment.paid > 0 && payment.paid < payment.amount)) return "Pago parcial";
    if (eventPayments.some((payment) => payment.paid > 0)) return "Abono recibido";
    return "Sin abono";
  }

  private createAlerts(events: EventRecord[]) {
    const alerts: AutomationAlert[] = [];
    const add = (alert: AutomationAlert) => {
      if (!alerts.some((item) => item.id === alert.id)) alerts.push(alert);
    };

    this.input.clients.forEach((client) => {
      const followUpDistance = daysUntil(client.next, this.today);
      const hasQuote = this.input.quotes.some((quote) => quote.client === client.name);
      if (!client.next) {
        add(this.alert(`client-action-${client.id}`, "Cliente interesado sin proxima accion", "Comercial", "Media", "Sin fecha", client.name, undefined, "Ventas", "Registrar proximo seguimiento", "clients"));
      }
      if (followUpDistance < -3) {
        add(this.alert(`client-follow-${client.id}`, "Cliente sin seguimiento por mas de 3 dias", "Comercial", "Media", client.next, client.name, undefined, "Ventas", "Contactar cliente y actualizar seguimiento", "clients"));
      }
      if (currencyToNumber(client.budget) > 0 && !hasQuote) {
        add(this.alert(`client-quote-${client.id}`, "Cliente con presupuesto sin cotizacion", "Comercial", "Alta", client.date, client.name, undefined, "Ventas", "Crear cotizacion conectada al evento", "quotes"));
      }
    });

    this.input.quotes.forEach((quote) => {
      const due = daysUntil(quote.expires, this.today);
      if (quote.status === "Borrador" || quote.status === "Lista para enviar") {
        add(this.alert(`quote-draft-${quote.id}`, "Cotizacion en borrador", "Comercial", due <= 3 ? "Media" : "Baja", quote.expires, quote.client, quote.event, "Ventas", "Enviar cotizacion o completar propuesta", "quotes"));
      }
      if (quote.status === "Enviada" && due <= 12) {
        add(this.alert(`quote-follow-${quote.id}`, "Dar seguimiento a cotizacion enviada", "Comercial", "Media", quote.expires, quote.client, quote.event, "Ventas", "Contactar al cliente y registrar respuesta", "quotes"));
      }
      if (due < 0 && !["Aceptada", "Rechazada", "Vencida"].includes(quote.status)) {
        add(this.alert(`quote-expired-${quote.id}`, "Cotizacion vencida", "Comercial", "Alta", quote.expires, quote.client, quote.event, "Ventas", "Actualizar estado o emitir nueva propuesta", "quotes"));
      }
      if (quote.status === "Aceptada" && !this.input.contracts.some((contract) => contract.event === quote.event && contract.kind === "Cliente")) {
        add(this.alert(`quote-contract-${quote.id}`, "Contrato pendiente de generar", "Legal/documental", "Alta", quote.expires, quote.client, quote.event, "Legal", "Generar contrato desde la cotizacion aprobada", "contracts"));
      }
    });

    events.forEach((event) => {
      const eventDistance = daysUntil(event.date, this.today);
      const eventPayments = this.input.payments.filter((payment) => payment.eventId === event.id);
      const eventContracts = this.input.contracts.filter((contract) => contract.event === event.name);
      const eventTimeline = this.input.timeline.filter((item) => item.eventId === event.id);

      eventPayments.forEach((payment) => {
        const paymentDistance = daysUntil(payment.dueDate, this.today);
        if (payment.paid < payment.amount && paymentDistance < 0) {
          add(this.alert(`payment-overdue-${payment.id}`, "Pago vencido", "Financiera", eventDistance <= 7 ? "Critica" : "Alta", payment.dueDate, event.clientName, event.name, "Finanzas", `Cobrar ${money(payment.amount - payment.paid)} de ${payment.concept}`, "events", event.id));
        } else if (payment.paid < payment.amount && paymentDistance <= 3) {
          add(this.alert(`payment-soon-${payment.id}`, "Pago proximo a vencer", "Calendario", "Media", payment.dueDate, event.clientName, event.name, "Finanzas", `Enviar recordatorio de pago por ${money(payment.amount - payment.paid)}`, "events", event.id));
        }
      });

      if (!eventPayments.some((payment) => payment.paid > 0)) {
        add(this.alert(`event-deposit-${event.id}`, "Evento sin abono inicial", "Financiera", "Alta", event.paymentDeadline || event.date, event.clientName, event.name, "Finanzas", "Solicitar abono antes de confirmar evento", "events", event.id));
      }
      if (eventContracts.some((contract) => contract.status !== "Firmado") || !eventContracts.length) {
        add(this.alert(`event-contract-${event.id}`, "Contrato pendiente de firma", "Legal/documental", eventDistance <= 30 ? "Alta" : "Media", eventContracts[0]?.signatureDeadline || event.date, event.clientName, event.name, "Legal", "Enviar contrato y dar seguimiento de firma", "contracts", event.id));
      }
      if (event.providers.length === 0 || event.providers.some((provider) => provider.status !== "Confirmado" && provider.status !== "Pagado")) {
        add(this.alert(`event-provider-${event.id}`, eventDistance <= 7 ? "Proveedor clave sin confirmar" : "Proveedor sin confirmar", "Operativa", eventDistance <= 7 ? "Critica" : "Media", event.date, event.clientName, event.name, "Operacion", "Confirmar proveedores y anexar contrato", "vendors", event.id));
      }
      if (!eventTimeline.length || eventTimeline.some((item) => ["Pendiente", "Atrasado"].includes(item.status))) {
        add(this.alert(`event-timeline-${event.id}`, eventDistance <= 2 ? "Evento a 48 horas sin cronograma operativo completo" : "Cronograma operativo pendiente para evento proximo", "Operativa", eventDistance <= 2 ? "Critica" : eventDistance <= 15 ? "Alta" : "Media", event.date, event.clientName, event.name, "Operacion", "Completar horarios, responsables y proveedores", "timeline", event.id));
      }
      if (event.documents.length < 3) {
        add(this.alert(`event-docs-${event.id}`, "Documento faltante", "Legal/documental", eventDistance <= 15 ? "Alta" : "Media", event.date, event.clientName, event.name, "Administracion", "Subir contrato, comprobantes y documentos del evento", "documents", event.id));
      }
      event.tasks.filter((task) => task.status === "Vencida").forEach((task) => {
        add(this.alert(`task-${event.id}-${task.title}`, "Tarea vencida", "Operativa", "Alta", task.dueDate, event.clientName, event.name, task.owner || "Operacion", task.title, "events", event.id));
      });
    });

    this.input.timeline.forEach((item) => {
      const event = events.find((eventItem) => eventItem.id === item.eventId);
      if (!event) return;
      if (!item.owner) add(this.alert(`timeline-owner-${item.id}`, "Actividad sin responsable", "Operativa", "Media", item.date || event.date, event.clientName, event.name, "Operacion", `Asignar responsable a ${item.title}`, "timeline", event.id));
      if (!item.time) add(this.alert(`timeline-time-${item.id}`, "Actividad sin hora asignada", "Operativa", "Media", item.date || event.date, event.clientName, event.name, "Operacion", `Definir hora para ${item.title}`, "timeline", event.id));
      if (item.requiresConfirmation && !item.vendorConfirmed) add(this.alert(`timeline-confirm-${item.id}`, "Proveedor sin confirmar horario", "Operativa", item.priority === "Critica" ? "Critica" : "Media", item.date || event.date, event.clientName, event.name, "Operacion", `Confirmar ${item.vendor || item.title}`, "timeline", event.id));
    });

    return alerts.sort((a, b) => this.priorityWeight(b.priority) - this.priorityWeight(a.priority));
  }

  private alert(
    id: string,
    title: string,
    category: string,
    priority: AlertPriority,
    dueDate: string,
    clientName: string | undefined,
    eventName: string | undefined,
    owner: string,
    action: string,
    module: ModuleId,
    eventId?: string
  ): AutomationAlert {
    return {
      action,
      category,
      clientName,
      dueDate: dueDate || "Sin fecha",
      eventId,
      eventName,
      id,
      module,
      owner,
      priority,
      status: "Abierta",
      title,
      tone: alertTone(priority)
    };
  }

  private priorityWeight(priority: AlertPriority) {
    return { Baja: 1, Media: 2, Alta: 3, Critica: 4 }[priority];
  }

  private calculateTotals(events: EventRecord[]) {
    const monthIncome = events.reduce((sum, event) => sum + currencyToNumber(event.paid), 0);
    const monthExpenses = events.reduce((sum, event) => sum + event.providers.reduce((providerSum, provider) => providerSum + provider.amount - provider.pendingPayment, 0), 0);
    const payable = events.reduce((sum, event) => sum + event.providers.reduce((providerSum, provider) => providerSum + provider.pendingPayment, 0), 0);
    const receivables = events.reduce((sum, event) => sum + currencyToNumber(event.pendingBalance), 0);
    return {
      estimatedProfit: monthIncome - monthExpenses,
      monthExpenses,
      monthIncome,
      payable,
      receivables
    };
  }

  private createMetrics(events: EventRecord[], alerts: AutomationAlert[], totals: AutomationSnapshot["totals"]): DashboardMetric[] {
    const pendingQuotes = this.input.quotes.filter((quote) => ["Borrador", "Enviada", "Lista para enviar"].includes(quote.status));
    const unsignedContracts = this.input.contracts.filter((contract) => contract.status !== "Firmado");
    return [
      { label: "Eventos activos", value: `${events.filter((event) => !["Cerrado", "Cancelado"].includes(event.status)).length}`, hint: "Calculado por estado", description: "Eventos abiertos en operacion", icon: CalendarDays, tone: "metric-blue" },
      { label: "Clientes activos", value: `${this.input.clients.length}`, hint: "Pipeline comercial", description: "Prospectos y clientes confirmados", icon: UsersRound, tone: "metric-gold" },
      { label: "Cotizaciones pendientes", value: `${pendingQuotes.length}`, hint: `${alerts.filter((alert) => alert.category === "Comercial").length} alertas comerciales`, description: "Borradores o propuestas abiertas", icon: CircleDollarSign, tone: "metric-teal" },
      { label: "Contratos por firmar", value: `${unsignedContracts.length}`, hint: "Seguimiento legal", description: "Contratos no firmados", icon: FileSignature, tone: "metric-coral" },
      { label: "Ingresos del mes", value: money(totals.monthIncome), hint: "Pagos recibidos", description: "Pagos registrados de clientes", icon: Download, tone: "metric-teal" },
      { label: "Egresos del mes", value: money(totals.monthExpenses), hint: "Costos pagados", description: "Costos de proveedores pagados", icon: Upload, tone: "metric-gold" },
      { label: "Cuentas por cobrar", value: money(totals.receivables), hint: "Saldos de eventos", description: "Saldo pendiente registrado", icon: AlertTriangle, tone: "metric-coral" },
      { label: "Cuentas por pagar", value: money(totals.payable), hint: "Proveedores", description: "Saldos pendientes a proveedores", icon: Handshake, tone: "metric-coral" },
      { label: "Ganancia estimada", value: money(totals.estimatedProfit), hint: totals.estimatedProfit >= 0 ? "Margen positivo" : "Revisar costos", description: "Ingresos menos egresos", icon: CheckSquare, tone: totals.estimatedProfit >= 0 ? "metric-blue" : "metric-coral" },
      { label: "Alertas criticas", value: `${alerts.filter((alert) => alert.priority === "Critica").length}`, hint: "Motor automatico", description: "Riesgos que requieren accion", icon: AlertTriangle, tone: "metric-coral" }
    ];
  }

  private createChecklistAreas(events: EventRecord[], totals: AutomationSnapshot["totals"]) {
    const unsignedContracts = this.input.contracts.filter((contract) => contract.status !== "Firmado");
    return [
      { label: "Operacion general", value: normalizePercent(events.reduce((sum, event) => sum + event.progress, 0) / Math.max(events.length, 1)), tone: "blue" as StatusTone },
      { label: "Finanzas", value: normalizePercent((totals.monthIncome / Math.max(totals.monthIncome + totals.receivables, 1)) * 100), tone: "success" as StatusTone },
      { label: "Contratos", value: normalizePercent(((this.input.contracts.length - unsignedContracts.length) / Math.max(this.input.contracts.length, 1)) * 100), tone: "warning" as StatusTone },
      { label: "Proveedores", value: normalizePercent((events.filter((event) => event.providers.length > 0 && event.providers.every((provider) => ["Confirmado", "Pagado"].includes(provider.status))).length / Math.max(events.length, 1)) * 100), tone: "blue" as StatusTone },
      { label: "Cronograma", value: normalizePercent((this.input.timeline.filter((item) => item.status !== "Pendiente").length / Math.max(this.input.timeline.length, 1)) * 100), tone: "warning" as StatusTone },
      { label: "Documentos", value: normalizePercent((events.filter((event) => event.documents.length >= 3).length / Math.max(events.length, 1)) * 100), tone: "neutral" as StatusTone },
      { label: "Logistica del dia", value: normalizePercent((this.input.timeline.filter((item) => item.vendorConfirmed || !item.requiresConfirmation).length / Math.max(this.input.timeline.length, 1)) * 100), tone: "success" as StatusTone }
    ];
  }

  private createCalendarItems(events: EventRecord[]) {
    return [
      ...events.map((event) => ({ date: event.date, label: event.name, type: "Evento" })),
      ...this.input.payments.filter((payment) => payment.paid < payment.amount).map((payment) => ({ date: payment.dueDate, label: payment.concept, type: "Pago" })),
      ...this.input.timeline.filter((item) => item.status !== "Completado").map((item) => ({ date: item.date || item.time, label: item.title, type: item.category })),
      ...this.input.contracts.filter((contract) => contract.status !== "Firmado").map((contract) => ({ date: contract.signatureDeadline || contract.createdAt, label: contract.name, type: "Contrato" }))
    ].slice(0, 12);
  }

  private createRecentActivity(events: EventRecord[], alerts: AutomationAlert[]) {
    return [
      ...events.flatMap((event) => event.history.map((item) => `${item} · ${event.name}`)),
      ...this.input.contracts.map((contract) => `${contract.createdAt} - Contrato ${contract.contractNumber} en estado ${contract.status}.`),
      ...this.input.payments.filter((payment) => payment.paid > 0).map((payment) => `${payment.dueDate} - Pago registrado: ${payment.concept} por ${money(payment.paid)}.`),
      ...alerts.slice(0, 5).map((alert) => `${alert.dueDate} - Alerta ${alert.priority}: ${alert.title}.`)
    ].slice(0, 10);
  }
}

export default function Home() {
  const [activeModule, setActiveModule] = useState<ModuleId>("dashboard");
  const [globalQuery, setGlobalQuery] = useState("");

  const [clients, setClients] = useState<Client[]>(initialClients);
  const [events, setEvents] = useState<EventRecord[]>(initialEvents);
  const [timeline, setTimeline] = useState<TimelineItem[]>(initialTimeline);
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const [selectedClientId, setSelectedClientId] = useState(initialClients[0].id);
  const [selectedEventId, setSelectedEventId] = useState(initialEvents[0].id);
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    initialTemplates[0].id
  );
  const [clientFilter, setClientFilter] = useState("Todos");
  const [vendorFilter, setVendorFilter] = useState("Todas");
  const [emailHistory, setEmailHistory] = useState<string[]>([
    "Bienvenida enviada a Mariana Lopez"
  ]);

  const selectedClient =
    clients.find((client) => client.id === selectedClientId) ?? clients[0];
  const selectedEvent =
    events.find((event) => event.id === selectedEventId) ?? events[0];
  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateId) ??
    templates[0];

  const filteredClients = useMemo(() => {
    const query = globalQuery.toLowerCase();
    return clients.filter((client) => {
      const matchesStatus =
        clientFilter === "Todos" || client.status === clientFilter;
      const matchesQuery =
        !query ||
        `${client.name} ${client.event} ${client.phone} ${client.email}`
          .toLowerCase()
          .includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [clients, clientFilter, globalQuery]);

  const filteredVendors = vendors.filter((vendor) => {
    const matchesCategory =
      vendorFilter === "Todas" || vendor.category === vendorFilter;
    const query = globalQuery.toLowerCase();
    const matchesQuery =
      !query ||
      `${vendor.name} ${vendor.category} ${vendor.contact}`
        .toLowerCase()
        .includes(query);
    return matchesCategory && matchesQuery;
  });

  const header = moduleCopy[activeModule];

  useEffect(() => {
    function syncFromHash() {
      setActiveModule(moduleFromHash());
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function openModule(moduleId: ModuleId) {
    setActiveModule(moduleId);
    window.history.replaceState(null, "", `#${moduleId}`);
  }

  function exportDashboardPdf() {
    downloadPdf(
      "Reporte ejecutivo Eventora",
      [
        `Eventos activos: ${events.length}`,
        `Clientes registrados: ${clients.length}`,
        `Cotizaciones: ${quotes.length}`,
        `Contratos: ${contracts.length}`,
        "",
        "Proximos eventos:",
        ...events.map(
          (event) =>
            `${event.date} - ${event.name} - ${event.venue} - ${event.status}`
        )
      ],
      "reporte-dashboard-eventora.pdf"
    );
  }

  function sendEmail() {
    if (!selectedTemplate || !selectedClient) return;
    setEmailHistory((current) => [
      `${selectedTemplate.name} enviada a ${selectedClient.name}`,
      ...current
    ]);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img
            alt="Vanessa Escala Wedding & Events Planner"
            className="brand-logo"
            src="/logo-vanessa.png"
          />
          <div>
            <strong>Vanessa Escala</strong>
            <span>Planner OS</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Modulos principales">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <a
                className={`nav-item ${activeModule === item.id ? "active" : ""}`}
                data-module={item.id}
                href={`#${item.id}`}
                key={item.id}
                onClick={(event) => {
                  event.preventDefault();
                  openModule(item.id);
                }}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operacion integral de eventos</p>
            <h1>{header.title}</h1>
            <p className="lead">{header.description}</p>
          </div>
          <div className="actions">
            <label className="search-control">
              <Search size={17} aria-hidden="true" />
              <input
                aria-label="Buscar en la plataforma"
                onChange={(event) => setGlobalQuery(event.target.value)}
                placeholder="Buscar cliente, evento o proveedor"
                value={globalQuery}
              />
            </label>
            <button className="button" onClick={exportDashboardPdf} type="button">
              <Download size={18} aria-hidden="true" />
              PDF general
            </button>
            <button
              className="button primary"
              onClick={() => openModule("events")}
              type="button"
            >
              <Plus size={18} aria-hidden="true" />
              Nuevo evento
            </button>
          </div>
        </header>

        {activeModule === "dashboard" && (
          <DashboardView
            clients={clients}
            contracts={contracts}
            dismissedAlerts={dismissedAlerts}
            events={events}
            onOpenModule={openModule}
            onResolveAlert={(id) =>
              setDismissedAlerts((current) => [...current, id])
            }
            onSelectEvent={setSelectedEventId}
            payments={payments}
            quotes={quotes}
            timeline={timeline}
          />
        )}

        {activeModule === "clients" && (
          <ClientsView
            clients={filteredClients}
            filter={clientFilter}
            onDelete={(id) => {
              setClients((current) => current.filter((item) => item.id !== id));
              if (selectedClientId === id) setSelectedClientId(clients[0]?.id ?? "");
            }}
            onSave={(client) => {
              setClients((current) =>
                client.id
                  ? current.map((item) => (item.id === client.id ? client : item))
                  : [...current, { ...client, id: makeId("cl") }]
              );
            }}
            selectedClient={selectedClient}
            setFilter={setClientFilter}
            setSelectedClientId={setSelectedClientId}
          />
        )}

        {activeModule === "events" && (
          <EventsView
            events={events}
            contracts={contracts}
            onOpenModule={openModule}
            onDelete={(id) => {
              setEvents((current) => current.filter((item) => item.id !== id));
              if (selectedEventId === id) setSelectedEventId(events[0]?.id ?? "");
            }}
            onSave={(eventRecord) => {
              setEvents((current) =>
                eventRecord.id
                  ? current.map((item) =>
                      item.id === eventRecord.id ? eventRecord : item
                    )
                  : [
                      ...current,
                      {
                        ...eventRecord,
                        eventNumber: eventRecord.eventNumber || nextEventNumber(current),
                        id: makeId("ev")
                      }
                    ]
              );
            }}
            payments={payments}
            selectedEvent={selectedEvent}
            setSelectedEventId={setSelectedEventId}
            timeline={timeline}
            vendors={vendors}
          />
        )}

        {activeModule === "timeline" && (
          <TimelineView
            events={events}
            onDelete={(id) =>
              setTimeline((current) => current.filter((item) => item.id !== id))
            }
            onSave={(item) => {
              setTimeline((current) =>
                item.id
                  ? current.map((row) => (row.id === item.id ? item : row))
                  : [...current, { ...item, id: makeId("tl") }]
              );
            }}
            selectedEvent={selectedEvent}
            setSelectedEventId={setSelectedEventId}
            timeline={timeline}
          />
        )}

        {activeModule === "vendors" && (
          <VendorsView
            filteredVendors={filteredVendors}
            onDelete={(id) =>
              setVendors((current) => current.filter((item) => item.id !== id))
            }
            onSave={(vendor) => {
              setVendors((current) =>
                vendor.id
                  ? current.map((item) => (item.id === vendor.id ? vendor : item))
                  : [...current, { ...vendor, id: makeId("vd") }]
              );
            }}
            selectedEvent={selectedEvent}
            setVendorFilter={setVendorFilter}
            vendorFilter={vendorFilter}
          />
        )}

        {activeModule === "quotes" && (
          <QuotesView
            onDelete={(id) =>
              setQuotes((current) => current.filter((item) => item.id !== id))
            }
            onDuplicate={(quote) =>
              setQuotes((current) => [
                ...current,
                {
                  ...quote,
                  id: makeId("qt"),
                  quoteNumber: nextQuoteNumber(current),
                  client: `${quote.client} copia`,
                  items: quote.items.map((item) => ({
                    ...item,
                    id: makeId("qi")
                  })),
                  status: "Borrador"
                }
              ])
            }
            onSave={(quote) => {
              setQuotes((current) =>
                quote.id
                  ? current.map((item) => (item.id === quote.id ? quote : item))
                  : [
                      ...current,
                      {
                        ...quote,
                        id: makeId("qt"),
                        quoteNumber: nextQuoteNumber(current)
                      }
                    ]
              );
            }}
            quotes={quotes}
          />
        )}

        {activeModule === "contracts" && (
          <ContractsView
            contracts={contracts}
            onDelete={(id) =>
              setContracts((current) => current.filter((item) => item.id !== id))
            }
            onSave={(contract) => {
              setContracts((current) =>
                contract.id
                  ? current.map((item) =>
                      item.id === contract.id ? contract : item
                    )
                  : [...current, { ...contract, id: makeId("ct") }]
              );
            }}
          />
        )}

        {activeModule === "documents" && (
          <DocumentsView
            documents={documents}
            onDelete={(id) =>
              setDocuments((current) => current.filter((item) => item.id !== id))
            }
            onSave={(documentItem) => {
              setDocuments((current) =>
                documentItem.id
                  ? current.map((item) =>
                      item.id === documentItem.id ? documentItem : item
                    )
                  : [...current, { ...documentItem, id: makeId("dc") }]
              );
            }}
          />
        )}

        {activeModule === "emails" && (
          <EmailsView
            history={emailHistory}
            onDelete={(id) => {
              setTemplates((current) => current.filter((item) => item.id !== id));
              if (selectedTemplateId === id) {
                setSelectedTemplateId(templates[0]?.id ?? "");
              }
            }}
            onSave={(template) => {
              setTemplates((current) =>
                template.id
                  ? current.map((item) =>
                      item.id === template.id ? template : item
                    )
                  : [...current, { ...template, id: makeId("em") }]
              );
            }}
            selectedClient={selectedClient}
            selectedTemplate={selectedTemplate}
            sendEmail={sendEmail}
            setSelectedTemplateId={setSelectedTemplateId}
            templates={templates}
          />
        )}
      </main>
    </div>
  );
}

function DashboardView({
  clients,
  contracts,
  dismissedAlerts,
  events,
  onOpenModule,
  onResolveAlert,
  onSelectEvent,
  payments,
  quotes,
  timeline
}: Readonly<{
  clients: Client[];
  contracts: Contract[];
  dismissedAlerts: string[];
  events: EventRecord[];
  onOpenModule: (moduleId: ModuleId) => void;
  onResolveAlert: (id: string) => void;
  onSelectEvent: (eventId: string) => void;
  payments: Payment[];
  quotes: Quote[];
  timeline: TimelineItem[];
}>) {
  const [dashboardQuery, setDashboardQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("30 dias");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const query = dashboardQuery.toLowerCase();
  const automation = useMemo(
    () => new AutomationEngine({ clients, contracts, events, payments, quotes, timeline }).run(),
    [clients, contracts, events, payments, quotes, timeline]
  );
  const filteredEvents = automation.events.filter((event) => {
    const matchesQuery =
      !query ||
      `${event.name} ${event.clientName} ${event.venue} ${event.type} ${event.owner}`
        .toLowerCase()
        .includes(query);
    const matchesStatus = statusFilter === "Todos" || event.status === statusFilter;
    return matchesQuery && matchesStatus;
  });
  const metrics = automation.metrics;
  const alerts = automation.alerts.filter((alert) => !dismissedAlerts.includes(alert.id));
  const checklistAreas = automation.checklistAreas;
  const commercialFollowUps = clients.map((client, index) => ({
    ...client,
    lastContact: index === 0 ? "03 jul 2026" : index === 1 ? "01 jul 2026" : "28 jun 2026",
    nextAction: client.next,
    probability: index === 0 ? "72%" : index === 1 ? "45%" : "88%",
    prospectStatus: index === 0 ? "Propuesta enviada" : index === 1 ? "En negociacion" : "Cliente confirmado",
    followDate: index === 0 ? "06 jul 2026" : index === 1 ? "08 jul 2026" : "10 jul 2026"
  }));
  const calendarItems = automation.calendarItems;
  const recentActivity = automation.recentActivity;

  return (
    <section className="executive-dashboard">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Vanessa Escala Planner OS</p>
          <h2>Panel Ejecutivo</h2>
          <p className="lead">Vista general de operacion, finanzas, eventos y alertas criticas.</p>
        </div>
        <div className="dashboard-hero-actions">
          <button className="button primary" onClick={() => onOpenModule("events")} type="button"><Plus size={16} aria-hidden="true" />Nuevo evento</button>
          <button className="button" onClick={() => onOpenModule("quotes")} type="button"><CircleDollarSign size={16} aria-hidden="true" />Nueva cotizacion</button>
          <button className="button" onClick={() => onOpenModule("events")} type="button"><Save size={16} aria-hidden="true" />Registrar pago</button>
          <button className="button" onClick={() => downloadPdf("Reporte ejecutivo Vanessa Escala", [`Ingresos del mes: ${money(automation.totals.monthIncome)}`, `Egresos del mes: ${money(automation.totals.monthExpenses)}`, `Cuentas por cobrar: ${money(automation.totals.receivables)}`, `Cuentas por pagar: ${money(automation.totals.payable)}`, `Ganancia estimada: ${money(automation.totals.estimatedProfit)}`, "", "Alertas abiertas:", ...alerts.map((alert) => `${alert.priority} - ${alert.title} - ${alert.action}`)], "reporte-ejecutivo.pdf")} type="button"><Download size={16} aria-hidden="true" />Exportar reporte PDF</button>
        </div>
      </section>

      <section className="dashboard-filter-bar">
        <label className="search-control">
          <Search size={16} aria-hidden="true" />
          <input aria-label="Buscar en dashboard" onChange={(event) => setDashboardQuery(event.target.value)} placeholder="Buscar cliente, evento, proveedor, contrato o factura" value={dashboardQuery} />
        </label>
        <select className="input compact" onChange={(event) => setDateFilter(event.target.value)} value={dateFilter}>
          <option>7 dias</option>
          <option>15 dias</option>
          <option>30 dias</option>
        </select>
        <select className="input compact" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
          <option>Todos</option>
          {eventStatusOptions.map((status) => <option key={status}>{status}</option>)}
        </select>
      </section>

      <section className="metrics dashboard-metrics" aria-label="Indicadores principales">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article className={`metric executive-metric ${metric.tone}`} key={metric.label}>
              <Icon size={20} aria-hidden="true" />
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.hint}</small>
              <p>{metric.description}</p>
            </article>
          );
        })}
      </section>

      <section className="workspace executive-workspace">
        <div className="stack">
          <Panel
            title="Proximos eventos"
            action={
              <button
                className="button"
                onClick={() => onOpenModule("events")}
                type="button"
              >
                <CalendarDays size={17} aria-hidden="true" />
                Abrir eventos
              </button>
            }
          >
            <DataTable
              headers={["Evento", "Cliente", "Fecha", "Lugar", "Tipo", "Estado", "Avance", "Pago pendiente", "Acciones"]}
              rows={filteredEvents.map((event) => [
                <button
                  className="text-button"
                  key="event"
                  onClick={() => {
                    onSelectEvent(event.id);
                    onOpenModule("events");
                  }}
                  type="button"
                >
                  {event.name}
                </button>,
                event.clientName,
                event.date,
                event.venue,
                event.type,
                <Status key="status" label={event.status} tone={statusToneFromLabel(event.status)} />,
                `${event.progress}%`,
                event.pendingBalance,
                <div className="row-actions" key="actions">
                  <button className="icon-button" onClick={() => { onSelectEvent(event.id); onOpenModule("events"); }} title="Ver evento" type="button"><FolderOpen size={15} aria-hidden="true" /></button>
                  <button className="icon-button" onClick={() => { onSelectEvent(event.id); onOpenModule("events"); }} title="Editar evento" type="button"><Edit3 size={15} aria-hidden="true" /></button>
                  <button className="icon-button" onClick={() => downloadPdf(`Evento - ${event.name}`, eventPdfLines(event), `${event.eventNumber}.pdf`)} title="PDF evento" type="button"><Download size={15} aria-hidden="true" /></button>
                  <button className="icon-button" onClick={() => { onSelectEvent(event.id); onOpenModule("timeline"); }} title="Abrir cronograma" type="button"><ClipboardList size={15} aria-hidden="true" /></button>
                </div>
              ])}
            />
          </Panel>

          <Panel title="Seguimientos comerciales">
            <DataTable
              headers={["Cliente", "Tipo", "Presupuesto", "Estado", "Ultimo contacto", "Proxima accion", "Seguimiento", "Probabilidad", "Enviar"]}
              rows={commercialFollowUps.map((client) => [
                client.name,
                client.event,
                client.budget,
                <Status key="status" label={client.prospectStatus} tone={statusToneFromLabel(client.prospectStatus)} />,
                client.lastContact,
                client.nextAction,
                client.followDate,
                client.probability,
                <div className="row-actions" key="send"><button className="icon-button" title="Enviar correo" type="button"><Mail size={15} aria-hidden="true" /></button><button className="icon-button" title="Enviar WhatsApp" type="button"><MessageCircle size={15} aria-hidden="true" /></button></div>
              ])}
            />
          </Panel>

          <Panel title="Finanzas rapidas">
            <div className="finance-dashboard">
              <Detail label="Ingresos confirmados" value={money(automation.totals.monthIncome)} />
              <Detail label="Ingresos pendientes" value={money(automation.totals.receivables)} />
              <Detail label="Egresos programados" value={money(automation.totals.monthExpenses)} />
              <Detail label="Pagos a proveedores" value={money(events.reduce((sum, event) => sum + event.providers.reduce((total, provider) => total + provider.pendingPayment, 0), 0))} />
              <Detail label="Utilidad estimada" value={money(automation.totals.estimatedProfit)} />
              <div className="finance-bars">
                <span style={{ width: "78%" }}>Ingresos</span>
                <span style={{ width: "48%" }}>Egresos</span>
              </div>
            </div>
          </Panel>

          <Panel title="Calendario resumido">
            <div className="calendar-strip">
              {calendarItems.map((item) => (
                <article key={`${item.type}-${item.label}-${item.date}`}>
                  <strong>{item.date}</strong>
                  <span>{item.type}</span>
                  <p>{item.label}</p>
                </article>
              ))}
            </div>
          </Panel>
        </div>

        <aside className="stack">
          <Panel
            title="Alertas inteligentes"
            action={<AlertTriangle color="#b8872b" size={20} />}
          >
            <ul className="alert-list">
              {alerts.length === 0 && (
                <li className="smart-alert">
                  <div>
                    <strong>Sin alertas pendientes</strong>
                    <br />
                    <span className="muted">Todo validado por ahora.</span>
                  </div>
                </li>
              )}
              {alerts.map((alert) => (
                <li className={`smart-alert priority-${alert.priority.toLowerCase()}`} key={alert.id}>
                  <input
                    aria-label={`Completar ${alert.title}`}
                    onChange={() => onResolveAlert(alert.id)}
                    type="checkbox"
                  />
                  <div>
                    <span>{alert.category} · {alert.dueDate}</span>
                    <strong>{alert.title}</strong>
                    <small>Responsable: {alert.owner} · {alert.action}</small>
                  </div>
                  <Status label={alert.priority} tone={alert.tone} />
                  <button className="button compact-action" onClick={() => onResolveAlert(alert.id)} type="button">Resolver</button>
                  <button className="button compact-action secondary" onClick={() => onOpenModule(alert.module)} type="button">Ver detalle</button>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Checklist inteligente">
            <div className="dashboard-checklist">
              {checklistAreas.map((area) => (
                <div className="progress-card no-margin" key={area.label}>
                  <div>
                    <CheckSquare color="#2f6f9f" size={18} aria-hidden="true" />
                    <strong>{area.label}: {area.value}%</strong>
                  </div>
                  <div className="progress-track"><span style={{ width: `${area.value}%` }} /></div>
                </div>
              ))}
              <p className="dashboard-recommendation">Este evento tiene pagos pendientes y proveedores sin confirmar. Se recomienda validar contratos antes de continuar.</p>
            </div>
          </Panel>

          <Panel title="Accesos rapidos">
            <div className="quick-access-grid">
              <button className="button" onClick={() => onOpenModule("clients")} type="button"><UsersRound size={16} aria-hidden="true" />Crear cliente</button>
              <button className="button" onClick={() => onOpenModule("quotes")} type="button"><CircleDollarSign size={16} aria-hidden="true" />Crear cotizacion</button>
              <button className="button" onClick={() => onOpenModule("contracts")} type="button"><FileSignature size={16} aria-hidden="true" />Crear contrato</button>
              <button className="button" onClick={() => onOpenModule("documents")} type="button"><Upload size={16} aria-hidden="true" />Subir documento</button>
              <button className="button" onClick={() => onOpenModule("vendors")} type="button"><Handshake size={16} aria-hidden="true" />Registrar proveedor</button>
              <button className="button" onClick={() => onOpenModule("timeline")} type="button"><ClipboardList size={16} aria-hidden="true" />Crear tarea</button>
              <button className="button" onClick={() => onOpenModule("events")} type="button"><CalendarDays size={16} aria-hidden="true" />Abrir calendario</button>
              <button className="button" onClick={() => downloadPdf("Reporte general", recentActivity, "reporte-general.pdf")} type="button"><Download size={16} aria-hidden="true" />Generar reporte</button>
            </div>
          </Panel>

          <Panel title="Actividad reciente">
            <ul className="activity-timeline">
              {recentActivity.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </Panel>
        </aside>
      </section>
    </section>
  );
}

function ClientsView({
  clients,
  filter,
  onDelete,
  onSave,
  selectedClient,
  setFilter,
  setSelectedClientId
}: Readonly<{
  clients: Client[];
  filter: string;
  onDelete: (id: string) => void;
  onSave: (client: Client) => void;
  selectedClient?: Client;
  setFilter: (value: string) => void;
  setSelectedClientId: (value: string) => void;
}>) {
  const [draft, setDraft] = useState<Client>(blankClient);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    onSave(draft);
    setDraft(blankClient);
  }

  return (
    <section className="module-grid">
      <Panel
        title="Clientes"
        action={
          <select
            className="input compact"
            onChange={(event) => setFilter(event.target.value)}
            value={filter}
          >
            <option>Todos</option>
            <option>Prospecto</option>
            <option>Cotizado</option>
            <option>Contratado</option>
          </select>
        }
      >
        <DataTable
          headers={["Cliente", "Evento", "Fecha", "Estado", "Acciones"]}
          rows={clients.map((client) => [
            <button
              className="text-button"
              key="name"
              onClick={() => setSelectedClientId(client.id)}
              type="button"
            >
              {client.name}
            </button>,
            client.event,
            client.date,
            <Status key="status" label={client.status} tone="neutral" />,
            <RowActions
              key="actions"
              onDelete={() => onDelete(client.id)}
              onEdit={() => setDraft(client)}
              pdf={{
                title: `Cliente - ${client.name}`,
                filename: `${client.name}.pdf`,
                lines: [
                  `Telefono: ${client.phone}`,
                  `Correo: ${client.email}`,
                  `Tipo de evento: ${client.event}`,
                  `Fecha: ${client.date}`,
                  `Lugar: ${client.place}`,
                  `Invitados: ${client.guests}`,
                  `Presupuesto: ${client.budget}`,
                  `Estado: ${client.status}`,
                  `Seguimiento: ${client.next}`
                ]
              }}
            />
          ])}
        />
      </Panel>

      <Panel title={draft.id ? "Editar cliente" : "Nuevo cliente"}>
        <ClientForm draft={draft} onCancel={() => setDraft(blankClient)} onChange={setDraft} onSubmit={submit} />
        {selectedClient && (
          <div className="summary-box">
            <h3>Ficha seleccionada</h3>
            <Detail label="Nombre" value={selectedClient.name} />
            <Detail label="Telefono" value={selectedClient.phone} />
            <Detail label="Correo" value={selectedClient.email} />
            <Detail label="Seguimiento" value={selectedClient.next} />
          </div>
        )}
      </Panel>
    </section>
  );
}

function EventsView({
  contracts,
  events,
  onDelete,
  onOpenModule,
  onSave,
  payments,
  selectedEvent,
  setSelectedEventId,
  timeline,
  vendors
}: Readonly<{
  contracts: Contract[];
  events: EventRecord[];
  onDelete: (id: string) => void;
  onOpenModule: (moduleId: ModuleId) => void;
  onSave: (eventRecord: EventRecord) => void;
  payments: Payment[];
  selectedEvent?: EventRecord;
  setSelectedEventId: (value: string) => void;
  timeline: TimelineItem[];
  vendors: Vendor[];
}>) {
  const [draft, setDraft] = useState<EventRecord>(blankEvent);
  const [viewMode, setViewMode] = useState("Tarjetas");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("Fecha mas proxima");
  const [query, setQuery] = useState("");
  const eventPayments = payments.filter((payment) => payment.eventId === selectedEvent?.id);
  const eventTimeline = timeline.filter((item) => item.eventId === selectedEvent?.id);
  const eventContracts = contracts.filter((contract) => contract.event === selectedEvent?.name);
  const selectedAlerts = selectedEvent ? eventAlerts(selectedEvent, payments, contracts, timeline) : [];
  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    const result = events.filter((eventRecord) => {
      const matchesQuery =
        !normalizedQuery ||
        `${eventRecord.name} ${eventRecord.clientName} ${eventRecord.date} ${eventRecord.venue} ${eventRecord.owner}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus = statusFilter === "Todos" || eventRecord.status === statusFilter;
      const matchesType = typeFilter === "Todos" || eventRecord.type === typeFilter;
      return matchesQuery && matchesStatus && matchesType;
    });
    return [...result].sort((a, b) => {
      if (sortBy === "Mayor presupuesto") return currencyToNumber(b.budget) - currencyToNumber(a.budget);
      if (sortBy === "Menor avance") return a.progress - b.progress;
      if (sortBy === "Saldo pendiente") return currencyToNumber(b.pendingBalance) - currencyToNumber(a.pendingBalance);
      if (sortBy === "Ultima actualizacion") return b.lastUpdate.localeCompare(a.lastUpdate);
      return a.date.localeCompare(b.date);
    });
  }, [events, query, sortBy, statusFilter, typeFilter]);
  const summary = [
    { label: "Eventos activos", value: events.length, hint: "Operacion total", tone: "metric-blue" },
    { label: "En planificacion", value: events.filter((eventRecord) => eventRecord.status.includes("planificacion")).length, hint: "En avance", tone: "metric-teal" },
    { label: "Confirmados", value: events.filter((eventRecord) => eventRecord.status === "Confirmado").length, hint: "Con reserva", tone: "metric-gold" },
    { label: "Proximos", value: events.filter((eventRecord) => !["Cerrado", "Cancelado"].includes(eventRecord.status)).length, hint: "Por ejecutar", tone: "metric-blue" },
    { label: "Pagos pendientes", value: events.filter((eventRecord) => currencyToNumber(eventRecord.pendingBalance) > 0).length, hint: "Revisar finanzas", tone: "metric-coral" },
    { label: "Proveedores sin confirmar", value: events.filter((eventRecord) => eventRecord.providers.some((provider) => provider.status !== "Confirmado" && provider.status !== "Pagado")).length, hint: "Gestion operativa", tone: "metric-coral" },
    { label: "Contratos pendientes", value: events.filter((eventRecord) => contracts.some((contract) => contract.event === eventRecord.name && contract.status !== "Firmado")).length, hint: "Firmas abiertas", tone: "metric-gold" },
    { label: "Ingresos estimados", value: money(events.reduce((sum, eventRecord) => sum + currencyToNumber(eventRecord.budget), 0)), hint: "Presupuesto total", tone: "metric-teal" },
    { label: "Saldo pendiente", value: money(events.reduce((sum, eventRecord) => sum + currencyToNumber(eventRecord.pendingBalance), 0)), hint: "Por cobrar", tone: "metric-coral" }
  ];

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    onSave({
      ...draft,
      eventNumber: draft.eventNumber || nextEventNumber(events),
      pendingBalance: money(Math.max(currencyToNumber(draft.contractedAmount || draft.budget) - currencyToNumber(draft.paid), 0)),
      history: draft.history.length ? draft.history : ["05 jul 2026 - Evento creado por Vanessa Escala."]
    });
    setDraft(blankEvent);
  }

  function renderEventCards(items: EventRecord[]) {
    return (
      <div className="event-pro-grid">
        {items.map((eventRecord) => {
          const alerts = eventAlerts(eventRecord, payments, contracts, timeline);
          return (
            <article className={`event-pro-card ${selectedEvent?.id === eventRecord.id ? "selected" : ""}`} key={eventRecord.id}>
              <div className="card-header">
                <div>
                  <span className="muted">{eventRecord.eventNumber}</span>
                  <button className="text-button event-title-button" onClick={() => setSelectedEventId(eventRecord.id)} type="button">{eventRecord.name}</button>
                  <p className="muted">{eventRecord.clientName} · {eventRecord.type} · {eventRecord.date}</p>
                </div>
                <Status label={eventRecord.status} tone={statusToneFromLabel(eventRecord.status)} />
              </div>
              <div className="event-pro-meta">
                <Detail label="Lugar" value={eventRecord.venue || "Sin lugar"} />
                <Detail label="Invitados" value={`${eventRecord.guests}`} />
                <Detail label="Presupuesto" value={eventRecord.budget} />
                <Detail label="Pagado" value={eventRecord.paid} />
                <Detail label="Saldo" value={eventRecord.pendingBalance} />
                <Detail label="Responsable" value={eventRecord.owner || "Sin responsable"} />
              </div>
              <div className="progress-card no-margin">
                <strong>Avance operativo: {eventRecord.progress}%</strong>
                <div className="progress-track"><span style={{ width: `${eventRecord.progress}%` }} /></div>
              </div>
              <div className="event-alert-row">
                {(alerts.length ? alerts.slice(0, 3) : ["Sin alertas criticas"]).map((alert) => <span key={alert}>{alert}</span>)}
              </div>
              <p className="muted"><strong>Proxima tarea:</strong> {eventRecord.tasks.find((task) => task.status !== "Completada")?.title ?? "Sin tareas pendientes"}</p>
              <div className="row-actions">
                <button className="icon-button" onClick={() => setSelectedEventId(eventRecord.id)} title="Ver ficha del evento" type="button"><FolderOpen size={15} aria-hidden="true" /></button>
                <button className="icon-button" onClick={() => setDraft(eventRecord)} title="Editar evento" type="button"><Edit3 size={15} aria-hidden="true" /></button>
                <button className="icon-button" onClick={() => { setSelectedEventId(eventRecord.id); onOpenModule("timeline"); }} title="Ver cronograma" type="button"><ClipboardList size={15} aria-hidden="true" /></button>
                <button className="icon-button" onClick={() => { setSelectedEventId(eventRecord.id); onOpenModule("contracts"); }} title="Ver contratos" type="button"><FileSignature size={15} aria-hidden="true" /></button>
                <button className="icon-button" onClick={() => onOpenModule("vendors")} title="Agregar proveedor" type="button"><Handshake size={15} aria-hidden="true" /></button>
                <button className="icon-button" onClick={() => onOpenModule("documents")} title="Subir documento" type="button"><Upload size={15} aria-hidden="true" /></button>
                <button className="icon-button" onClick={() => downloadPdf("Carpeta digital del evento", eventPdfLines(eventRecord), `evento-${eventRecord.eventNumber}.pdf`)} title="Exportar carpeta PDF" type="button"><Download size={15} aria-hidden="true" /></button>
                <button className="icon-button" onClick={() => onSave({ ...eventRecord, id: "", eventNumber: nextEventNumber(events), name: `${eventRecord.name} copia` })} title="Duplicar evento" type="button"><Copy size={15} aria-hidden="true" /></button>
                <button className="icon-button danger" onClick={() => onDelete(eventRecord.id)} title="Eliminar evento" type="button"><Trash2 size={15} aria-hidden="true" /></button>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <section className="events-module">
      <section className="metrics event-metrics">{summary.map((metric) => <article className={`metric ${metric.tone}`} key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.hint}</small></article>)}</section>

      <div className="timeline-command-bar event-command-bar">
        <label className="search-control"><Search size={16} aria-hidden="true" /><input aria-label="Buscar eventos" onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente, evento, fecha, lugar o responsable" value={query} /></label>
        <select className="input compact" onChange={(event) => setViewMode(event.target.value)} value={viewMode}>{["Tarjetas", "Tabla", "Calendario", "Pipeline", "Mapa operativo", "Modo Evento"].map((view) => <option key={view}>{view}</option>)}</select>
        <select className="input compact" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}><option>Todos</option>{eventStatusOptions.map((status) => <option key={status}>{status}</option>)}</select>
        <select className="input compact" onChange={(event) => setTypeFilter(event.target.value)} value={typeFilter}><option>Todos</option>{eventTypeOptions.map((type) => <option key={type}>{type}</option>)}</select>
        <select className="input compact" onChange={(event) => setSortBy(event.target.value)} value={sortBy}>{["Fecha mas proxima", "Mayor presupuesto", "Menor avance", "Saldo pendiente", "Ultima actualizacion"].map((option) => <option key={option}>{option}</option>)}</select>
        <details className="action-menu export-menu">
          <summary className="button primary"><Download size={16} aria-hidden="true" />Exportar evento</summary>
          <div className="action-menu-panel">
            <button className="menu-action" onClick={() => selectedEvent && downloadPdf("Carpeta digital del evento", eventPdfLines(selectedEvent), `evento-${selectedEvent.eventNumber}.pdf`)} type="button">PDF de carpeta digital</button>
            <button className="menu-action" onClick={() => selectedEvent && downloadPdf("Resumen ejecutivo", eventPdfLines(selectedEvent, false), `resumen-${selectedEvent.eventNumber}.pdf`)} type="button">PDF de resumen ejecutivo</button>
            <button className="menu-action" onClick={() => selectedEvent && downloadPdf("PDF financiero", eventPdfLines(selectedEvent), `finanzas-${selectedEvent.eventNumber}.pdf`)} type="button">PDF financiero</button>
            <button className="menu-action" onClick={() => selectedEvent && downloadPdf("PDF para cliente", eventPdfLines(selectedEvent, false), `cliente-${selectedEvent.eventNumber}.pdf`)} type="button">PDF para cliente</button>
            <button className="menu-action" onClick={() => selectedEvent && downloadPdf("Checklist operativo", selectedEvent.checklist.map((item) => `${item.status} - ${item.label}`), `checklist-${selectedEvent.eventNumber}.pdf`)} type="button">PDF de checklist operativo</button>
          </div>
        </details>
      </div>

      <section className="module-grid event-workspace">
        <Panel title={`${viewMode} de eventos`}>
          {viewMode === "Tarjetas" && renderEventCards(filteredEvents)}
          {viewMode === "Tabla" && <DataTable headers={["Evento", "Cliente", "Tipo", "Fecha", "Lugar", "Invitados", "Presupuesto", "Pagado", "Saldo", "Estado", "Avance", "Responsable", "Acciones"]} rows={filteredEvents.map((eventRecord) => [eventRecord.name, eventRecord.clientName, eventRecord.type, eventRecord.date, eventRecord.venue, eventRecord.guests, eventRecord.budget, eventRecord.paid, eventRecord.pendingBalance, <Status key="status" label={eventRecord.status} tone={statusToneFromLabel(eventRecord.status)} />, `${eventRecord.progress}%`, eventRecord.owner, <button className="icon-button" key="open" onClick={() => setSelectedEventId(eventRecord.id)} title="Ver ficha" type="button"><FolderOpen size={15} aria-hidden="true" /></button>])} />}
          {viewMode === "Calendario" && <div className="calendar-board">{filteredEvents.map((eventRecord) => <article className="calendar-event" key={eventRecord.id}><strong>{eventRecord.date}</strong><span>{eventRecord.name}</span><Status label={eventRecord.status} tone={statusToneFromLabel(eventRecord.status)} /></article>)}</div>}
          {viewMode === "Pipeline" && <div className="ops-kanban">{["Cotizacion enviada", "Confirmado", "En planificacion", "Semana del evento", "Realizado", "Cerrado"].map((status) => <section className="kanban-column" key={status}><h3>{status}</h3>{filteredEvents.filter((eventRecord) => eventRecord.status === status || eventRecord.status.includes(status.split(" ")[0])).map((eventRecord) => <article className="kanban-card" key={eventRecord.id}><strong>{eventRecord.name}</strong><span>{eventRecord.clientName}</span><span>{eventRecord.date}</span></article>)}</section>)}</div>}
          {viewMode === "Mapa operativo" && <div className="ops-timeline">{filteredEvents.map((eventRecord) => <article className="ops-timeline-card" key={eventRecord.id}><div className="ops-time-block"><strong>{eventRecord.date}</strong><span>{eventRecord.type}</span></div><div className="ops-card-body"><h3>{eventRecord.name}</h3><div className="event-alert-row">{eventAlerts(eventRecord, payments, contracts, timeline).slice(0, 4).map((alert) => <span key={alert}>{alert}</span>)}</div><div className="progress-track"><span style={{ width: `${eventRecord.progress}%` }} /></div></div></article>)}</div>}
          {viewMode === "Modo Evento" && selectedEvent && <div className="event-mode"><article><span>Evento activo</span><strong>{selectedEvent.name}</strong><p>{selectedEvent.date} · {selectedEvent.venue}</p><button className="button primary" onClick={() => onOpenModule("timeline")} type="button"><ClipboardList size={16} aria-hidden="true" />Abrir cronograma</button></article><article><span>Alertas</span><strong>{selectedAlerts.length}</strong><p>{selectedAlerts[0] ?? "Sin alertas urgentes"}</p><button className="button" type="button"><Send size={16} aria-hidden="true" />Llamar responsable</button></article><article><span>Proveedores proximos</span><strong>{selectedEvent.providers.length}</strong><p>{selectedEvent.providers[0]?.name ?? "Sin proveedores"}</p></article></div>}
        </Panel>

        <div className="stack">
          <Panel title={draft.id ? "Editar evento" : "Nuevo evento"}>
            <EventForm draft={draft} onCancel={() => setDraft(blankEvent)} onChange={setDraft} onSubmit={submit} />
          </Panel>
          {selectedEvent && <EventDigitalFolder eventRecord={selectedEvent} eventContracts={eventContracts} eventPayments={eventPayments} eventTimeline={eventTimeline} onOpenModule={onOpenModule} selectedAlerts={selectedAlerts} />}
        </div>
      </section>
    </section>
  );
}

function EventDigitalFolder({
  eventContracts,
  eventPayments,
  eventRecord,
  eventTimeline,
  onOpenModule,
  selectedAlerts
}: Readonly<{
  eventContracts: Contract[];
  eventPayments: Payment[];
  eventRecord: EventRecord;
  eventTimeline: TimelineItem[];
  onOpenModule: (moduleId: ModuleId) => void;
  selectedAlerts: string[];
}>) {
  const completedChecklist = eventRecord.checklist.filter((item) => item.status === "Completado").length;
  const providerCosts = eventRecord.providers.reduce((sum, provider) => sum + provider.amount, 0);
  const providerPending = eventRecord.providers.reduce((sum, provider) => sum + provider.pendingPayment, 0);
  const estimatedProfit = currencyToNumber(eventRecord.contractedAmount) - providerCosts;
  return (
    <Panel title="Ficha del evento / Carpeta digital">
      <div className="event-folder">
        <section className="event-folder-hero">
          <div>
            <p className="eyebrow">{eventRecord.eventNumber}</p>
            <h2>{eventRecord.name}</h2>
            <p>{eventRecord.clientName} · {eventRecord.type} · {eventRecord.date}</p>
          </div>
          <Status label={eventRecord.status} tone={statusToneFromLabel(eventRecord.status)} />
        </section>

        <div className="contract-preview-grid">
          <Detail label="Cliente" value={eventRecord.clientName} />
          <Detail label="Telefono" value={eventRecord.clientPhone} />
          <Detail label="Correo" value={eventRecord.clientEmail} />
          <Detail label="Lugar" value={eventRecord.venue} />
          <Detail label="Invitados" value={`${eventRecord.guests}`} />
          <Detail label="Responsable" value={eventRecord.owner} />
          <Detail label="Presupuesto" value={eventRecord.budget} />
          <Detail label="Pagado" value={eventRecord.paid} />
          <Detail label="Saldo" value={eventRecord.pendingBalance} />
          <Detail label="Ultima actualizacion" value={eventRecord.lastUpdate} />
        </div>

        <div className="event-alert-row">
          {(selectedAlerts.length ? selectedAlerts : ["Sin alertas activas"]).map((alert) => <span key={alert}>{alert}</span>)}
        </div>

        <div className="quick-access-grid">
          <button className="button" onClick={() => onOpenModule("timeline")} type="button"><ClipboardList size={16} aria-hidden="true" />Ver cronograma</button>
          <button className="button" onClick={() => onOpenModule("contracts")} type="button"><FileSignature size={16} aria-hidden="true" />Ver contratos</button>
          <button className="button" onClick={() => onOpenModule("quotes")} type="button"><CircleDollarSign size={16} aria-hidden="true" />Ver cotizaciones</button>
          <button className="button" onClick={() => onOpenModule("vendors")} type="button"><Handshake size={16} aria-hidden="true" />Ver proveedores</button>
          <button className="button" onClick={() => onOpenModule("documents")} type="button"><FolderOpen size={16} aria-hidden="true" />Ver documentos</button>
          <button className="button" onClick={() => downloadPdf("Carpeta digital del evento", eventPdfLines(eventRecord), `evento-${eventRecord.eventNumber}.pdf`)} type="button"><Download size={16} aria-hidden="true" />Exportar carpeta</button>
        </div>

        <div className="event-folder-tabs">
          <section>
            <h3>Checklist operativo</h3>
            <div className="progress-track"><span style={{ width: `${(completedChecklist / eventRecord.checklist.length) * 100}%` }} /></div>
            <div className="mini-list">{eventRecord.checklist.map((item) => <span key={item.label}>{item.status} - {item.label}</span>)}</div>
          </section>
          <section>
            <h3>Finanzas</h3>
            <Detail label="Monto contratado" value={eventRecord.contractedAmount} />
            <Detail label="Costos proveedores" value={money(providerCosts)} />
            <Detail label="Pagos pendientes proveedores" value={money(providerPending)} />
            <Detail label="Ganancia estimada" value={money(estimatedProfit)} />
            <Detail label="Estado financiero" value={eventRecord.paymentStatus} />
            <DataTable headers={["Concepto", "Monto", "Pagado", "Estado"]} rows={eventPayments.map((payment) => [payment.concept, money(payment.amount), money(payment.paid), payment.status])} />
          </section>
          <section>
            <h3>Proveedores</h3>
            <DataTable headers={["Categoria", "Proveedor", "Servicio", "Monto", "Estado"]} rows={eventRecord.providers.map((provider) => [provider.category, provider.name, provider.service, money(provider.amount), provider.status])} />
          </section>
          <section>
            <h3>Cronograma y contratos</h3>
            <div className="mini-list">{eventTimeline.map((item) => <span key={item.id}>{item.time} - {item.title} - {item.status}</span>)}</div>
            <div className="mini-list">{eventContracts.length ? eventContracts.map((contract) => <span key={contract.id}>{contract.contractNumber} - {contract.status}</span>) : <span>No hay contratos asociados.</span>}</div>
          </section>
          <section>
            <h3>Tareas e historial</h3>
            <div className="mini-list">{eventRecord.tasks.map((task) => <span key={task.title}>{task.status} - {task.title} - {task.owner}</span>)}</div>
            <ul className="activity-timeline">{eventRecord.history.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        </div>
      </div>
    </Panel>
  );
}

function TimelineView({
  events,
  onDelete,
  onSave,
  selectedEvent,
  setSelectedEventId,
  timeline
}: Readonly<{
  events: EventRecord[];
  onDelete: (id: string) => void;
  onSave: (item: TimelineItem) => void;
  selectedEvent?: EventRecord;
  setSelectedEventId: (value: string) => void;
  timeline: TimelineItem[];
}>) {
  const [draft, setDraft] = useState<TimelineItem>(blankTimelineItem);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [viewMode, setViewMode] = useState("Timeline");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [priorityFilter, setPriorityFilter] = useState("Todas");
  const visibleTimeline = timeline.filter((item) => {
    const matchesEvent = item.eventId === selectedEvent?.id;
    const matchesStatus = statusFilter === "Todos" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "Todas" || item.category === categoryFilter;
    const matchesPriority = priorityFilter === "Todas" || item.priority === priorityFilter;
    return matchesEvent && matchesStatus && matchesCategory && matchesPriority;
  }).sort((a, b) => a.time.localeCompare(b.time));
  const eventTimeline = timeline.filter((item) => item.eventId === selectedEvent?.id);
  const completed = eventTimeline.filter((item) => item.status === "Completado").length;
  const progress = eventTimeline.length ? Math.round((completed / eventTimeline.length) * 100) : 0;
  const uniqueVendors = new Set(eventTimeline.filter((item) => item.vendor).map((item) => item.vendor)).size;
  const uniqueOwners = new Set(eventTimeline.filter((item) => item.owner).map((item) => item.owner)).size;
  const currentActivity =
    eventTimeline.find((item) => item.status === "En proceso") ??
    eventTimeline.find((item) => item.status !== "Completado" && item.status !== "Cancelado");
  const nextActivity = eventTimeline.find((item) => item.time > (currentActivity?.time ?? "") && item.status !== "Completado");
  const alerts = [
    ...eventTimeline.filter((item) => !item.owner).map((item) => `${item.title}: sin responsable asignado.`),
    ...eventTimeline.filter((item) => !item.place).map((item) => `${item.title}: sin lugar definido.`),
    ...eventTimeline.filter((item) => item.isCritical && item.status === "Pendiente").map((item) => `${item.title}: actividad critica pendiente.`),
    ...eventTimeline.filter((item) => item.status === "Atrasado").map((item) => `${item.title}: actividad atrasada.`),
    ...eventTimeline.filter((item) => item.requiresConfirmation && !item.vendorConfirmed).map((item) => `${item.title}: proveedor sin confirmar.`),
    ...eventTimeline.filter((item) => item.dependsOn && eventTimeline.some((dependency) => dependency.title === item.dependsOn && dependency.status !== "Completado")).map((item) => `${item.title}: dependencia sin completar.`)
  ].slice(0, 5);
  const summary = [
    { label: "Total actividades", value: eventTimeline.length, tone: "blue" as StatusTone },
    { label: "Pendientes", value: eventTimeline.filter((item) => item.status === "Pendiente").length, tone: "warning" as StatusTone },
    { label: "Confirmadas", value: eventTimeline.filter((item) => item.status === "Confirmado").length, tone: "success" as StatusTone },
    { label: "En proceso", value: eventTimeline.filter((item) => item.status === "En proceso").length, tone: "blue" as StatusTone },
    { label: "Completadas", value: completed, tone: "success" as StatusTone },
    { label: "Atrasadas", value: eventTimeline.filter((item) => item.status === "Atrasado").length, tone: "danger" as StatusTone },
    { label: "Criticas", value: eventTimeline.filter((item) => item.isCritical || item.priority === "Critica").length, tone: "danger" as StatusTone },
    { label: "Proveedores", value: uniqueVendors, tone: "neutral" as StatusTone },
    { label: "Responsables", value: uniqueOwners, tone: "neutral" as StatusTone },
    { label: "Sin responsable", value: eventTimeline.filter((item) => !item.owner).length, tone: "warning" as StatusTone }
  ];

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onSave({
      ...draft,
      date: draft.date || selectedEvent?.date || "",
      eventId: draft.eventId || selectedEvent?.id || "",
      history: draft.history.length ? draft.history : ["05 jul 2026 - Actividad creada por Vanessa Escala."]
    });
    setDraft(blankTimelineItem);
  }

  function exportTimeline(label: string, includeInternal = true) {
    downloadPdf(
      `${label} - ${selectedEvent?.name ?? "Evento"}`,
      [
        `Evento: ${selectedEvent?.name ?? "-"}`,
        `Cliente: ${selectedEvent?.clientName ?? "-"}`,
        `Fecha: ${selectedEvent?.date ?? "-"}`,
        `Lugar: ${selectedEvent?.venue ?? "-"}`,
        `Responsable general: Vanessa Escala`,
        "",
        ...visibleTimeline.map((item) =>
          `${item.time}-${item.endTime} | ${item.title} | ${item.owner || "Sin responsable"} | ${item.vendor || "Sin proveedor"} | ${item.place || "Sin lugar"} | ${item.status}${includeInternal ? ` | Nota: ${item.internalNotes || "-"}` : ""}`
        ),
        "",
        "Vanessa Escala Wedding & Events Planner - Cronograma operativo"
      ],
      "cronograma-operativo.pdf"
    );
  }

  function renderTimelineCards(items: TimelineItem[]) {
    return (
      <div className="ops-timeline">
        {items.map((item) => (
          <article className={`ops-timeline-card ${item.priority === "Critica" || item.isCritical ? "critical" : ""}`} key={item.id}>
            <div className="ops-time-block">
              <strong>{item.time}</strong>
              <span>{item.endTime}</span>
            </div>
            <div className="ops-card-body">
              <div className="card-header">
                <div>
                  <span className="category-pill">{item.category}</span>
                  <h3>{item.title}</h3>
                </div>
                <Status label={item.status} tone={statusToneFromLabel(item.status)} />
              </div>
              <p className="muted">{item.description || "Sin descripcion operativa."}</p>
              <div className="ops-meta-grid">
                <Detail label="Responsable" value={item.owner || "Sin asignar"} />
                <Detail label="Equipo" value={item.team || "-"} />
                <Detail label="Proveedor" value={item.vendor || "-"} />
                <Detail label="Lugar" value={item.place || "-"} />
                <Detail label="Prioridad" value={item.priority} />
                <Detail label="Dependencia" value={item.dependsOn || "-"} />
              </div>
              <div className="row-actions">
                <button className="icon-button" onClick={() => setDraft(item)} title="Editar actividad" type="button"><Edit3 size={15} aria-hidden="true" /></button>
                <button className="icon-button" onClick={() => onSave({ ...item, status: "Confirmado" })} title="Marcar confirmada" type="button"><CheckSquare size={15} aria-hidden="true" /></button>
                <button className="icon-button" onClick={() => onSave({ ...item, status: "En proceso" })} title="Marcar en proceso" type="button"><AlertTriangle size={15} aria-hidden="true" /></button>
                <button className="icon-button" onClick={() => onSave({ ...item, status: "Completado" })} title="Marcar completada" type="button"><Save size={15} aria-hidden="true" /></button>
                <button className="icon-button" onClick={() => onSave({ ...item, id: "", title: `${item.title} copia`, history: [`05 jul 2026 - Actividad duplicada desde ${item.title}.`] })} title="Duplicar actividad" type="button"><Copy size={15} aria-hidden="true" /></button>
                <button className="icon-button" title="Adjuntar archivo" type="button"><Upload size={15} aria-hidden="true" /></button>
                <button className="icon-button" title="Notificar responsable" type="button"><Send size={15} aria-hidden="true" /></button>
                <button className="icon-button danger" onClick={() => onDelete(item.id)} title="Eliminar actividad" type="button"><Trash2 size={15} aria-hidden="true" /></button>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <section className="timeline-module">
      <div className="timeline-command-bar">
        <select className="input compact" onChange={(event) => setSelectedEventId(event.target.value)} value={selectedEvent?.id ?? ""}>
          {events.map((eventItem) => <option key={eventItem.id} value={eventItem.id}>{eventItem.name}</option>)}
        </select>
        <select className="input compact" onChange={(event) => setViewMode(event.target.value)} value={viewMode}>
          {["Timeline", "Tabla", "Responsable", "Proveedor", "Categoria", "Kanban", "Modo Evento"].map((view) => <option key={view}>{view}</option>)}
        </select>
        <select className="input compact" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
          <option>Todos</option>
          {timelineStatusOptions.map((status) => <option key={status}>{status}</option>)}
        </select>
        <select className="input compact" onChange={(event) => setCategoryFilter(event.target.value)} value={categoryFilter}>
          <option>Todas</option>
          {timelineCategoryOptions.map((category) => <option key={category}>{category}</option>)}
        </select>
        <select className="input compact" onChange={(event) => setPriorityFilter(event.target.value)} value={priorityFilter}>
          <option>Todas</option>
          {timelinePriorityOptions.map((priority) => <option key={priority}>{priority}</option>)}
        </select>
        <details className="action-menu export-menu">
          <summary className="button primary"><Download size={16} aria-hidden="true" />Exportar cronograma</summary>
          <div className="action-menu-panel">
            <button className="menu-action" onClick={() => exportTimeline("PDF interno completo")} type="button">PDF interno completo</button>
            <button className="menu-action" onClick={() => exportTimeline("PDF para cliente", false)} type="button">PDF para cliente</button>
            <button className="menu-action" onClick={() => exportTimeline("PDF para proveedores", false)} type="button">PDF para proveedores</button>
            <button className="menu-action" onClick={() => exportTimeline("PDF de montaje")} type="button">PDF de montaje</button>
            <button className="menu-action" onClick={() => exportTimeline("PDF de ceremonia")} type="button">PDF de ceremonia</button>
            <button className="menu-action" onClick={() => exportTimeline("PDF de recepcion")} type="button">PDF de recepcion</button>
            <button className="menu-action" onClick={() => exportTimeline("PDF de desmontaje")} type="button">PDF de desmontaje</button>
          </div>
        </details>
      </div>

      <div className="contract-summary-grid timeline-summary-grid">
        {summary.map((item) => <article className={`contract-summary-card ${item.tone}`} key={item.label}><span>{item.label}</span><strong>{item.value}</strong></article>)}
      </div>

      <div className="progress-card no-margin">
        <strong>Cronograma completado: {progress}%</strong>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      </div>

      {alerts.length > 0 && (
        <section className="ops-alerts">
          {alerts.map((alert) => <span key={alert}><AlertTriangle size={15} aria-hidden="true" />{alert}</span>)}
        </section>
      )}

      <section className="module-grid timeline-workspace">
        <Panel title={`${viewMode} - ${selectedEvent?.name ?? "Evento"}`}>
          {viewMode === "Timeline" && renderTimelineCards(visibleTimeline)}
          {viewMode === "Tabla" && (
            <DataTable
              headers={["Inicio", "Fin", "Actividad", "Categoria", "Responsable", "Equipo", "Proveedor", "Lugar", "Estado", "Prioridad", "Acciones"]}
              rows={visibleTimeline.map((item) => [
                item.time,
                item.endTime,
                item.title,
                item.category,
                item.owner,
                item.team,
                item.vendor,
                item.place,
                <Status key="status" label={item.status} tone={statusToneFromLabel(item.status)} />,
                item.priority,
                <button className="icon-button" key="edit" onClick={() => setDraft(item)} title="Editar actividad" type="button"><Edit3 size={15} aria-hidden="true" /></button>
              ])}
            />
          )}
          {viewMode === "Responsable" && [...new Set(visibleTimeline.map((item) => item.owner || "Sin responsable"))].map((owner) => <div className="ops-group" key={owner}><h3>{owner}</h3>{renderTimelineCards(visibleTimeline.filter((item) => (item.owner || "Sin responsable") === owner))}</div>)}
          {viewMode === "Proveedor" && [...new Set(visibleTimeline.map((item) => item.vendor || "Sin proveedor"))].map((vendor) => <div className="ops-group" key={vendor}><h3>{vendor}</h3>{renderTimelineCards(visibleTimeline.filter((item) => (item.vendor || "Sin proveedor") === vendor))}</div>)}
          {viewMode === "Categoria" && [...new Set(visibleTimeline.map((item) => item.category))].map((category) => <div className="ops-group" key={category}><h3>{category}</h3>{renderTimelineCards(visibleTimeline.filter((item) => item.category === category))}</div>)}
          {viewMode === "Kanban" && (
            <div className="ops-kanban">
              {timelineStatusOptions.map((status) => (
                <section className="kanban-column" key={status}>
                  <h3>{status}</h3>
                  {visibleTimeline.filter((item) => item.status === status).map((item) => (
                    <article className="kanban-card" key={item.id}>
                      <strong>{item.time} - {item.title}</strong>
                      <span>{item.owner || "Sin responsable"}</span>
                      <Status label={item.priority} tone={item.priority === "Critica" ? "danger" : item.priority === "Alta" ? "warning" : "neutral"} />
                    </article>
                  ))}
                </section>
              ))}
            </div>
          )}
          {viewMode === "Modo Evento" && (
            <div className="event-mode">
              <article><span>Actividad actual</span><strong>{currentActivity?.title ?? "Sin actividad activa"}</strong><p>{currentActivity?.time} - {currentActivity?.place}</p><button className="button primary" onClick={() => currentActivity && onSave({ ...currentActivity, status: "Completado" })} type="button"><CheckSquare size={16} aria-hidden="true" />Completar</button></article>
              <article><span>Proxima actividad</span><strong>{nextActivity?.title ?? "Sin siguiente actividad"}</strong><p>{nextActivity?.time} - {nextActivity?.owner}</p><button className="button" type="button"><Send size={16} aria-hidden="true" />Notificar</button></article>
              <article><span>Urgencias</span><strong>{alerts.length}</strong><p>{alerts[0] ?? "Sin alertas urgentes"}</p></article>
            </div>
          )}
        </Panel>

        <Panel title={draft.id ? "Editar actividad operativa" : "Nueva actividad operativa"}>
          <TimelineForm draft={{ ...draft, eventId: draft.eventId || selectedEvent?.id || "", date: draft.date || selectedEvent?.date || "" }} events={events} onCancel={() => setDraft(blankTimelineItem)} onChange={setDraft} onSubmit={submit} />
        </Panel>
      </section>
    </section>
  );
}

function VendorsView({
  filteredVendors,
  onDelete,
  onSave,
  selectedEvent,
  setVendorFilter,
  vendorFilter
}: Readonly<{
  filteredVendors: Vendor[];
  onDelete: (id: string) => void;
  onSave: (vendor: Vendor) => void;
  selectedEvent?: EventRecord;
  setVendorFilter: (value: string) => void;
  vendorFilter: string;
}>) {
  const [draft, setDraft] = useState<Vendor>(blankVendor);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    onSave(draft);
    setDraft(blankVendor);
  }

  return (
    <section className="module-grid">
      <Panel
        title="Directorio de proveedores"
        action={
          <select
            className="input compact"
            onChange={(event) => setVendorFilter(event.target.value)}
            value={vendorFilter}
          >
            <option>Todas</option>
            <option>Decoracion</option>
            <option>Catering</option>
            <option>Foto y video</option>
            <option>Musica</option>
          </select>
        }
      >
        <div className="card-grid">
          {filteredVendors.map((vendor) => (
            <article className="card" key={vendor.id}>
              <div className="card-header">
                <div>
                  <h3>{vendor.name}</h3>
                  <span className="muted">{vendor.category}</span>
                </div>
                <Status label={vendor.status} tone="blue" />
              </div>
              <p className="muted">
                {vendor.contact} · {vendor.phone}
              </p>
              <Detail label="Correo" value={vendor.email} />
              <Detail label="Tarifa" value={vendor.rate} />
              <div className="row-actions">
                <button className="button" type="button">
                  Asignar a {selectedEvent?.type ?? "evento"}
                </button>
                <button
                  className="icon-button"
                  onClick={() => setDraft(vendor)}
                  title="Editar"
                  type="button"
                >
                  <Edit3 size={16} aria-hidden="true" />
                </button>
                <PdfButton
                  filename={`${vendor.name}.pdf`}
                  lines={[
                    `Categoria: ${vendor.category}`,
                    `Contacto: ${vendor.contact}`,
                    `Telefono: ${vendor.phone}`,
                    `Correo: ${vendor.email}`,
                    `Tarifa: ${vendor.rate}`,
                    `Estado: ${vendor.status}`
                  ]}
                  title={`Proveedor - ${vendor.name}`}
                />
                <button
                  className="icon-button danger"
                  onClick={() => onDelete(vendor.id)}
                  title="Eliminar"
                  type="button"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title={draft.id ? "Editar proveedor" : "Nuevo proveedor"}>
        <VendorForm draft={draft} onCancel={() => setDraft(blankVendor)} onChange={setDraft} onSubmit={submit} />
      </Panel>
    </section>
  );
}

function QuotesView({
  onDelete,
  onDuplicate,
  onSave,
  quotes
}: Readonly<{
  onDelete: (id: string) => void;
  onDuplicate: (quote: Quote) => void;
  onSave: (quote: Quote) => void;
  quotes: Quote[];
}>) {
  const [draft, setDraft] = useState<Quote>(blankQuote);
  const [pendingPrintQuoteId, setPendingPrintQuoteId] = useState<string | null>(null);
  const previewQuote = draft.id || draft.client ? draft : quotes[0];

  useEffect(() => {
    if (!pendingPrintQuoteId || previewQuote?.id !== pendingPrintQuoteId) return;

    const timer = window.setTimeout(() => {
      printElement("quote-paper-preview", `Cotizacion-${previewQuote.client}`);
      setPendingPrintQuoteId(null);
    }, 120);

    return () => window.clearTimeout(timer);
  }, [pendingPrintQuoteId, previewQuote]);

  function printQuote(quote: Quote) {
    setDraft(quote);
    setPendingPrintQuoteId(quote.id);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.client.trim()) return;
    onSave(draft);
    setDraft(blankQuote);
  }

  return (
    <section className="module-grid quotes-layout">
      <Panel title="Cotizaciones">
        <DataTable
          headers={["No.", "Cliente", "Evento", "Total", "Fecha del evento", "Estado", "Acciones"]}
          rows={quotes.map((quote) => [
            quote.quoteNumber,
            quote.client,
            quote.event,
            money(quoteTotals(quote).total),
            quote.expires,
            <QuoteStatusSelect
              key="status"
              onChange={(status) => onSave({ ...quote, status })}
              value={quote.status}
            />,
            <QuoteTableActions
              key="actions"
              onDelete={() => onDelete(quote.id)}
              onDuplicate={() => onDuplicate(quote)}
              onEdit={() => setDraft(quote)}
              onPrint={() => printQuote(quote)}
              quote={quote}
            />
          ])}
        />
      </Panel>

      <Panel title={draft.id ? "Editar cotizacion" : "Nueva cotizacion"}>
        <QuoteForm draft={draft} onCancel={() => setDraft(blankQuote)} onChange={setDraft} onSubmit={submit} />
      </Panel>
      {previewQuote && <QuotePreview quote={previewQuote} />}
    </section>
  );
}

function QuoteStatusSelect({
  onChange,
  value
}: Readonly<{
  onChange: (value: string) => void;
  value: string;
}>) {
  return (
    <select
      className={`input status-select ${statusToneFromLabel(value)}`}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    >
      {quoteStatusOptions.map((status) => (
        <option key={status}>{status}</option>
      ))}
    </select>
  );
}

function QuoteTableActions({
  onDelete,
  onDuplicate,
  onEdit,
  onPrint,
  quote
}: Readonly<{
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onPrint: () => void;
  quote: Quote;
}>) {
  const shareText = quoteShareText(quote);
  const encodedText = encodeURIComponent(shareText);
  const mailSubject = encodeURIComponent(`Cotizacion ${quote.quoteNumber || ""}`.trim());

  async function openNativeShare() {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          text: shareText,
          title: `Cotizacion ${quote.quoteNumber || ""}`.trim()
        });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      }
    } catch {
      // Share can be cancelled by the user; no UI state needs to change.
    }
  }

  return (
    <div className="quote-table-actions">
      <button className="button compact-action" onClick={onEdit} type="button">
        <Edit3 size={15} aria-hidden="true" />
        Editar
      </button>

      <details className="action-menu">
        <summary className="button compact-action">
          <Send size={15} aria-hidden="true" />
          Enviar
        </summary>
        <div className="action-menu-panel">
          <button className="menu-action" onClick={openNativeShare} type="button">
            <Send size={15} aria-hidden="true" />
            Compartir
          </button>
          <a
            className="menu-action"
            href={`mailto:${quote.clientEmail}?subject=${mailSubject}&body=${encodedText}`}
          >
            <Mail size={15} aria-hidden="true" />
            Correo
          </a>
          <a
            className="menu-action"
            href={`https://wa.me/?text=${encodedText}`}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle size={15} aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </details>

      <details className="action-menu">
        <summary className="button compact-action secondary">
          <MoreHorizontal size={15} aria-hidden="true" />
          Mas
        </summary>
        <div className="action-menu-panel">
          <button className="menu-action" onClick={onDuplicate} type="button">
            <Copy size={15} aria-hidden="true" />
            Duplicar
          </button>
          <button className="menu-action" onClick={onPrint} type="button">
            <Download size={15} aria-hidden="true" />
            PDF
          </button>
          <button className="menu-action danger" onClick={onDelete} type="button">
            <Trash2 size={15} aria-hidden="true" />
            Eliminar
          </button>
        </div>
      </details>
    </div>
  );
}

function QuotePreview({ quote }: Readonly<{ quote: Quote }>) {
  const quoteNumber = quote.quoteNumber || "Se asigna al guardar";
  const totals = quoteTotals(quote);

  return (
    <div className="quote-preview-wrap">
      <div className="quote-actions no-print">
        <button
          className="button"
          onClick={() => printElement("quote-paper-preview", "Cotizacion")}
          type="button"
        >
          <Download size={17} aria-hidden="true" />
          Imprimir / Guardar PDF
        </button>
      </div>
      <article className="quote-paper" id="quote-paper-preview">
        <header className="quote-header">
          <img alt="Vanessa Escala" src="/logo-vanessa.png" />
          <h2>COTIZACION</h2>
          <table>
            <tbody>
              <tr><th>No. Cotizacion</th><td>{quoteNumber}</td></tr>
              <tr><th>Fecha</th><td>04/07/2026</td></tr>
              <tr><th>Validez</th><td>15 dias</td></tr>
            </tbody>
          </table>
        </header>

        <section className="quote-company">
          <h3>Vanessa Escala Wedding & Events Planner</h3>
          <p><strong>RUC:</strong></p>
          <p><strong>Direccion:</strong> Panama, Panama</p>
          <p><strong>Telefono:</strong> +507 63712318</p>
          <p><strong>Correo:</strong> vanessaescalaplanner@gmail.com</p>
        </section>

        <h3 className="quote-band">DATOS DEL CLIENTE</h3>
        <section className="quote-client">
          <p><strong>Cliente</strong><span>{quote.client}</span></p>
          <p><strong>Cedula/RUC</strong><span>{quote.clientTaxId || "-"}</span></p>
          <p><strong>Evento</strong><span>{quote.event}</span></p>
          <p><strong>Lugar</strong><span>{quote.eventPlace || "-"}</span></p>
          <p><strong>Correo</strong><span>{quote.clientEmail || "-"}</span></p>
        </section>

        <table className="quote-items">
          <thead>
            <tr>
              <th>Referencia</th>
              <th>Descripcion</th>
              <th>Cantidad</th>
              <th>Unidad</th>
              <th>Precio Unit.</th>
              <th>Desc.</th>
              <th>ITBMS</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, index) => (
              <tr key={item.id}>
                <td>{quoteItemReference(index)}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{money(item.unitPrice)}</td>
                <td>{item.discount ? money(item.discount) : "-"}</td>
                <td>{item.tax ? money(item.tax) : "-"}</td>
                <td>{money(quoteItemTotal(item))}</td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 8 - quote.items.length) }).map((_, index) => (
              <tr key={index}><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
            ))}
          </tbody>
        </table>

        <section className="quote-bottom">
          <div>
            <h3 className="quote-band">MEDIOS DE PAGO</h3>
            <p><strong>Tipo:</strong> {quote.paymentMethod}</p>
            <p>
              <strong>Observaciones:</strong> {quote.observations}
            </p>
          </div>
          <table>
            <tbody>
              <tr><th>Subtotal</th><td>{money(totals.subtotal)}</td></tr>
              <tr><th>ITBMS</th><td>{totals.tax ? money(totals.tax) : "-"}</td></tr>
              <tr><th>Descuento</th><td>{totals.discount ? money(totals.discount) : "-"}</td></tr>
              <tr><th>TOTAL</th><td>{money(totals.total)}</td></tr>
            </tbody>
          </table>
        </section>

        <h3 className="quote-band">Informacion comercial general / Terminos y condiciones</h3>
        <ul>
          <li>Validez de la cotizacion: 15 dias.</li>
          <li>Precios sujetos a cambios.</li>
          <li>Gracias por confiar en nosotros.</li>
        </ul>
      </article>
    </div>
  );
}

function ContractsView({
  contracts,
  onDelete,
  onSave
}: Readonly<{
  contracts: Contract[];
  onDelete: (id: string) => void;
  onSave: (contract: Contract) => void;
}>) {
  const [draft, setDraft] = useState<Contract>(blankContract);
  const [selectedId, setSelectedId] = useState(contracts[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [kindFilter, setKindFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("Fecha limite de firma");
  const selectedContract =
    contracts.find((contract) => contract.id === selectedId) ?? contracts[0];

  const filteredContracts = useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    const result = contracts.filter((contract) => {
      const matchesQuery =
        !normalizedQuery ||
        `${contract.contractNumber} ${contract.client} ${contract.event} ${contract.template} ${contract.owner}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "Todos" || contract.status === statusFilter;
      const matchesKind = kindFilter === "Todos" || contract.kind === kindFilter;
      return matchesQuery && matchesStatus && matchesKind;
    });

    return [...result].sort((a, b) => {
      const field = sortBy === "Fecha de creacion" ? "createdAt" : "signatureDeadline";
      return a[field].localeCompare(b[field]);
    });
  }, [contracts, kindFilter, query, sortBy, statusFilter]);

  const summary = [
    { label: "Total", value: contracts.length, tone: "blue" as StatusTone },
    {
      label: "Borrador",
      value: contracts.filter((contract) => contract.status === "Borrador").length,
      tone: "warning" as StatusTone
    },
    {
      label: "Enviados",
      value: contracts.filter((contract) => contract.status.includes("Enviado")).length,
      tone: "blue" as StatusTone
    },
    {
      label: "Pendientes de firma",
      value: contracts.filter((contract) => contract.status === "Pendiente de firma").length,
      tone: "warning" as StatusTone
    },
    {
      label: "Firmados",
      value: contracts.filter((contract) => contract.status === "Firmado").length,
      tone: "success" as StatusTone
    },
    {
      label: "Vencidos",
      value: contracts.filter((contract) => contract.status === "Vencido").length,
      tone: "danger" as StatusTone
    },
    {
      label: "Cancelados",
      value: contracts.filter((contract) => contract.status === "Cancelado").length,
      tone: "neutral" as StatusTone
    },
    {
      label: "Requieren modificacion",
      value: contracts.filter((contract) => contract.status === "Requiere modificacion").length,
      tone: "danger" as StatusTone
    }
  ];

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.client.trim()) return;
    const nextContract = {
      ...draft,
      balance: Math.max(draft.amount - draft.deposit, 0),
      contractNumber: draft.contractNumber || nextContractNumber(contracts),
      history: draft.history.length
        ? draft.history
        : [`${draft.createdAt || "05 jul 2026"} - Contrato creado por ${draft.owner}.`]
    };
    onSave(nextContract);
    setSelectedId(nextContract.id || selectedId);
    setDraft(blankContract);
  }

  function duplicateContract(contract: Contract) {
    onSave({
      ...contract,
      id: "",
      client: `${contract.client} copia`,
      contractNumber: nextContractNumber(contracts),
      signedAt: "",
      status: "Borrador",
      history: [`05 jul 2026 - Contrato duplicado desde ${contract.contractNumber}.`]
    });
  }

  return (
    <section className="contracts-module">
      <div className="contract-summary-grid">
        {summary.map((item) => (
          <article className={`contract-summary-card ${item.tone}`} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>

      <section className="contracts-layout">
        <DataTable
          headers={[
            "No.",
            "Relacion",
            "Cliente / proveedor",
            "Evento",
            "Tipo contrato",
            "Plantilla",
            "Monto",
            "Estado",
            "Creacion",
            "Envio",
            "Limite firma",
            "Firma",
            "Responsable",
            "Acciones"
          ]}
          rows={filteredContracts.map((contract) => [
            contract.contractNumber,
            contract.kind,
            contract.client,
            contract.event,
            contract.contractType,
            contract.template,
            money(contract.amount),
            <ContractStatusSelect
              key="status"
              onChange={(status) =>
                onSave({
                  ...contract,
                  status,
                  history: [
                    `${contract.createdAt} - Estado actualizado a ${status}.`,
                    ...contract.history
                  ]
                })
              }
              value={contract.status}
            />,
            contract.createdAt || "-",
            contract.sentAt || "-",
            contract.signatureDeadline || "-",
            contract.signedAt || "-",
            contract.owner || "-",
            <ContractActions
              contract={contract}
              key="actions"
              onArchive={() => onSave({ ...contract, status: "Archivado" })}
              onDelete={() => onDelete(contract.id)}
              onDuplicate={() => duplicateContract(contract)}
              onEdit={() => setDraft(contract)}
              onMarkSent={() =>
                onSave({
                  ...contract,
                  sentAt: contract.sentAt || "05 jul 2026",
                  status: contract.kind === "Proveedor" ? "Enviado al proveedor" : "Enviado al cliente"
                })
              }
              onMarkSigned={() =>
                onSave({
                  ...contract,
                  signedAt: contract.signedAt || "05 jul 2026",
                  status: "Firmado"
                })
              }
              onPreview={() => setSelectedId(contract.id)}
            />
          ])}
        />
        <div className="contract-filters">
          <label className="search-control">
            <Search size={16} aria-hidden="true" />
            <input
              aria-label="Buscar contratos"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar contrato, cliente, evento o responsable"
              value={query}
            />
          </label>
          <select className="input" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
            <option>Todos</option>
            {contractStatusOptions.map((status) => <option key={status}>{status}</option>)}
          </select>
          <select className="input" onChange={(event) => setKindFilter(event.target.value)} value={kindFilter}>
            <option>Todos</option>
            <option>Cliente</option>
            <option>Proveedor</option>
          </select>
          <select className="input" onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
            <option>Fecha limite de firma</option>
            <option>Fecha de creacion</option>
          </select>
        </div>
      </section>

      <section className="module-grid contract-workspace">
        <Panel title={draft.id ? "Editar contrato legal" : "Nuevo contrato legal"}>
          <ContractForm draft={draft} onCancel={() => setDraft(blankContract)} onChange={setDraft} onSubmit={submit} />
        </Panel>

        <div className="stack">
          {selectedContract && <ContractPreview contract={selectedContract} />}
          {selectedContract && <ContractActivity contract={selectedContract} />}
        </div>
      </section>
    </section>
  );
}

function ContractStatusSelect({
  onChange,
  value
}: Readonly<{
  onChange: (value: string) => void;
  value: string;
}>) {
  return (
    <select
      className={`input status-select ${statusToneFromLabel(value)}`}
      onChange={(event) => onChange(event.target.value)}
      value={value}
    >
      {contractStatusOptions.map((status) => (
        <option key={status}>{status}</option>
      ))}
    </select>
  );
}

function ContractActions({
  contract,
  onArchive,
  onDelete,
  onDuplicate,
  onEdit,
  onMarkSent,
  onMarkSigned,
  onPreview
}: Readonly<{
  contract: Contract;
  onArchive: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onMarkSent: () => void;
  onMarkSigned: () => void;
  onPreview: () => void;
}>) {
  return (
    <div className="quote-table-actions contract-action-group">
      <button className="button compact-action" onClick={onPreview} title="Ver detalle y vista previa" type="button">
        <FileSignature size={15} aria-hidden="true" />
        Ver
      </button>
      <button className="button compact-action" onClick={onEdit} title="Editar contrato" type="button">
        <Edit3 size={15} aria-hidden="true" />
        Editar
      </button>
      <details className="action-menu">
        <summary className="button compact-action secondary" title="Mas acciones del contrato">
          <MoreHorizontal size={15} aria-hidden="true" />
          Acciones
        </summary>
        <div className="action-menu-panel">
          <button className="menu-action" onClick={() => downloadPdf("Contrato legal", contractPdfLines(contract), `contrato-${contract.contractNumber}.pdf`)} title="Generar contrato PDF" type="button">
            <Download size={15} aria-hidden="true" />
            Descargar PDF
          </button>
          <button className="menu-action" onClick={() => downloadDocx(contract.name || contract.template, contractPdfLines(contract).map((line) => `<p>${line}</p>`).join(""), `contrato-${contract.contractNumber}.docx`)} title="Exportar DOCX editable" type="button">
            <FileSignature size={15} aria-hidden="true" />
            Exportar DOCX
          </button>
          <button className="menu-action" onClick={onMarkSent} title="Marcar como enviado" type="button">
            <Send size={15} aria-hidden="true" />
            Marcar enviado
          </button>
          <button className="menu-action" onClick={onMarkSigned} title="Marcar como firmado" type="button">
            <CheckSquare size={15} aria-hidden="true" />
            Marcar firmado
          </button>
          <button className="menu-action" title="Subir contrato firmado" type="button">
            <Upload size={15} aria-hidden="true" />
            Subir firmado
          </button>
          <button className="menu-action" onClick={onDuplicate} title="Duplicar contrato" type="button">
            <Copy size={15} aria-hidden="true" />
            Duplicar
          </button>
          <button className="menu-action" onClick={onDuplicate} title="Crear adenda desde este contrato" type="button">
            <Plus size={15} aria-hidden="true" />
            Crear adenda
          </button>
          <button className="menu-action" onClick={onArchive} title="Archivar contrato" type="button">
            <FolderOpen size={15} aria-hidden="true" />
            Archivar
          </button>
          <button className="menu-action danger" onClick={onDelete} title="Eliminar contrato" type="button">
            <Trash2 size={15} aria-hidden="true" />
            Eliminar
          </button>
        </div>
      </details>
    </div>
  );
}

function ContractPreview({ contract }: Readonly<{ contract: Contract }>) {
  return (
    <Panel title="Vista previa legal">
      <article className="contract-preview">
        <header className="contract-preview-header">
          <img alt="Vanessa Escala" src="/logo-vanessa.png" />
          <div>
            <p className="eyebrow">Documento legal</p>
            <h2>{contract.name || contract.template}</h2>
            <span>{contract.contractNumber || "Numero automatico al guardar"}</span>
          </div>
          <Status label={contract.status} tone={statusToneFromLabel(contract.status)} />
        </header>

        <div className="contract-preview-grid">
          <Detail label="Cliente / proveedor" value={contract.client || "-"} />
          <Detail label="Evento" value={contract.event || "-"} />
          <Detail label="Monto total" value={money(contract.amount)} />
          <Detail label="Fecha limite" value={contract.signatureDeadline || "-"} />
        </div>

        <h3>Servicios contratados</h3>
        <p>{contract.services || "Servicios pendientes de definir."}</p>
        <h3>Condiciones de pago</h3>
        <p>{contract.paymentTerms || contract.terms || "Condiciones pendientes de definir."}</p>
        <h3>Politica de cancelacion</h3>
        <p>{contract.cancellationPolicy || "Politica pendiente de definir."}</p>
        <h3>Clausulas especiales</h3>
        <p>{contract.specialClauses || "Sin clausulas especiales registradas."}</p>

        <div className="signature-grid">
          <span>Firma cliente / proveedor</span>
          <span>Firma Vanessa Escala</span>
        </div>
        <footer>Vanessa Escala Wedding & Events Planner - Panama - Documento confidencial</footer>
      </article>
    </Panel>
  );
}

function ContractActivity({ contract }: Readonly<{ contract: Contract }>) {
  return (
    <Panel title="Documentos e historial">
      <div className="contract-side-section">
        <h3>Documentos relacionados</h3>
        <div className="mini-list">
          {(contract.documents.length ? contract.documents : ["Contrato firmado pendiente", "Cedula del cliente pendiente"]).map((document) => (
            <span key={document}>{document}</span>
          ))}
        </div>
        <button className="button" type="button">
          <Upload size={16} aria-hidden="true" />
          Subir documento
        </button>
      </div>
      <div className="contract-side-section">
        <h3>Historial de actividad</h3>
        <ul className="activity-timeline">
          {(contract.history.length ? contract.history : ["Contrato creado en borrador."]).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}

function DocumentsView({
  documents,
  onDelete,
  onSave
}: Readonly<{
  documents: DocumentItem[];
  onDelete: (id: string) => void;
  onSave: (documentItem: DocumentItem) => void;
}>) {
  const [draft, setDraft] = useState<DocumentItem>(blankDocument);

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    onSave(draft);
    setDraft(blankDocument);
  }

  return (
    <section className="module-grid">
      <Panel title="Biblioteca de archivos">
        <DataTable
          headers={["Archivo", "Relacionado con", "Tipo", "Visibilidad", "Acciones"]}
          rows={documents.map((documentItem) => [
            documentItem.name,
            documentItem.owner,
            documentItem.kind,
            <Status
              key="visibility"
              label={documentItem.visibility}
              tone={documentItem.visibility === "Cliente" ? "blue" : "neutral"}
            />,
            <RowActions
              key="actions"
              onDelete={() => onDelete(documentItem.id)}
              onEdit={() => setDraft(documentItem)}
              pdf={{
                title: `Registro documental - ${documentItem.name}`,
                filename: `${documentItem.name}.pdf`,
                lines: [
                  `Archivo: ${documentItem.name}`,
                  `Relacionado con: ${documentItem.owner}`,
                  `Tipo: ${documentItem.kind}`,
                  `Visibilidad: ${documentItem.visibility}`
                ]
              }}
            />
          ])}
        />
      </Panel>

      <Panel title={draft.id ? "Editar documento" : "Registrar documento"}>
        <div className="upload-box">
          <Upload size={34} aria-hidden="true" />
          <strong>Registro de archivo</strong>
          <p className="muted">
            En este MVP se simula la carga. La subida real se conecta luego a S3,
            R2, Supabase Storage o Google Cloud Storage.
          </p>
        </div>
        <DocumentForm draft={draft} onCancel={() => setDraft(blankDocument)} onChange={setDraft} onSubmit={submit} />
      </Panel>
    </section>
  );
}

function EmailsView({
  history,
  onDelete,
  onSave,
  selectedClient,
  selectedTemplate,
  sendEmail,
  setSelectedTemplateId,
  templates
}: Readonly<{
  history: string[];
  onDelete: (id: string) => void;
  onSave: (template: EmailTemplate) => void;
  selectedClient?: Client;
  selectedTemplate?: EmailTemplate;
  sendEmail: () => void;
  setSelectedTemplateId: (id: string) => void;
  templates: EmailTemplate[];
}>) {
  const [draft, setDraft] = useState<EmailTemplate>(blankTemplate);
  const body = selectedTemplate && selectedClient
    ? selectedTemplate.body
        .replaceAll("{{cliente}}", selectedClient.name)
        .replaceAll("{{evento}}", selectedClient.event)
        .replaceAll("{{fecha}}", selectedClient.date)
    : "";

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    onSave(draft);
    setDraft(blankTemplate);
  }

  return (
    <section className="module-grid">
      <Panel title="Plantillas">
        <div className="card-grid one-col">
          {templates.map((template) => (
            <article
              className={`template-card ${
                selectedTemplate?.id === template.id ? "selected" : ""
              }`}
              key={template.id}
            >
              <button
                className="text-button"
                onClick={() => setSelectedTemplateId(template.id)}
                type="button"
              >
                {template.name}
              </button>
              <span>{template.subject}</span>
              <div className="row-actions">
                <button
                  className="icon-button"
                  onClick={() => setDraft(template)}
                  title="Editar"
                  type="button"
                >
                  <Edit3 size={16} aria-hidden="true" />
                </button>
                <button
                  className="icon-button danger"
                  onClick={() => onDelete(template.id)}
                  title="Eliminar"
                  type="button"
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
        <EmailTemplateForm draft={draft} onCancel={() => setDraft(blankTemplate)} onChange={setDraft} onSubmit={submit} />
      </Panel>

      <Panel
        title="Vista previa"
        action={
          <button className="button primary" onClick={sendEmail} type="button">
            <Send size={17} aria-hidden="true" />
            Enviar
          </button>
        }
      >
        <div className="email-preview">
          <span className="muted">Para: {selectedClient?.email}</span>
          <h3>
            {selectedTemplate?.subject.replaceAll(
              "{{cliente}}",
              selectedClient?.name ?? ""
            )}
          </h3>
          <p>{body}</p>
        </div>
        <h3>Historial</h3>
        <ul className="history-list">
          {history.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      </Panel>
    </section>
  );
}

function ClientForm({
  draft,
  onCancel,
  onChange,
  onSubmit
}: FormProps<Client>) {
  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <Input label="Nombre" value={draft.name} onChange={(name) => onChange({ ...draft, name })} />
      <Input label="Telefono" value={draft.phone} onChange={(phone) => onChange({ ...draft, phone })} />
      <Input label="Correo" value={draft.email} onChange={(email) => onChange({ ...draft, email })} />
      <Input label="Tipo de evento" value={draft.event} onChange={(event) => onChange({ ...draft, event })} />
      <Input label="Fecha" value={draft.date} onChange={(date) => onChange({ ...draft, date })} />
      <Input label="Lugar" value={draft.place} onChange={(place) => onChange({ ...draft, place })} />
      <Input label="Invitados" type="number" value={`${draft.guests}`} onChange={(guests) => onChange({ ...draft, guests: Number(guests) })} />
      <Input label="Presupuesto" value={draft.budget} onChange={(budget) => onChange({ ...draft, budget })} />
      <Input label="Estado" value={draft.status} onChange={(status) => onChange({ ...draft, status })} />
      <Input label="Seguimiento" value={draft.next} onChange={(next) => onChange({ ...draft, next })} />
      <FormActions isEditing={Boolean(draft.id)} onCancel={onCancel} />
    </form>
  );
}

function EventForm({ draft, onCancel, onChange, onSubmit }: FormProps<EventRecord>) {
  return (
    <form className="form-grid contract-form event-form" onSubmit={onSubmit}>
      <div className="form-section full">
        <h3>Informacion general</h3>
        <div className="form-grid">
          <Input label="Codigo automatico" value={draft.eventNumber || "Se genera al guardar"} onChange={(eventNumber) => onChange({ ...draft, eventNumber })} />
          <Input label="Cliente relacionado" value={draft.clientName} onChange={(clientName) => onChange({ ...draft, clientName })} />
          <Input label="Nombre del evento" value={draft.name} onChange={(name) => onChange({ ...draft, name })} />
          <label className="field"><span>Tipo de evento</span><select className="input" onChange={(event) => onChange({ ...draft, type: event.target.value })} value={draft.type}>{eventTypeOptions.map((type) => <option key={type}>{type}</option>)}</select></label>
          <Input label="Fecha del evento" value={draft.date} onChange={(date) => onChange({ ...draft, date })} />
          <label className="field"><span>Estado del evento</span><select className="input" onChange={(event) => onChange({ ...draft, status: event.target.value })} value={draft.status}>{eventStatusOptions.map((status) => <option key={status}>{status}</option>)}</select></label>
          <Input label="Responsable principal" value={draft.owner} onChange={(owner) => onChange({ ...draft, owner })} />
          <Input label="Asistente asignado" value={draft.assistant} onChange={(assistant) => onChange({ ...draft, assistant })} />
          <Input label="Cantidad de invitados" type="number" value={`${draft.guests}`} onChange={(guests) => onChange({ ...draft, guests: Number(guests) })} />
          <Input label="Avance operativo %" type="number" value={`${draft.progress}`} onChange={(progress) => onChange({ ...draft, progress: Number(progress) })} />
        </div>
      </div>

      <div className="form-section full">
        <h3>Horarios</h3>
        <div className="contract-date-grid">
          <Input label="Inicio general" value={draft.time} onChange={(time) => onChange({ ...draft, time })} />
          <Input label="Finalizacion" value={draft.endTime} onChange={(endTime) => onChange({ ...draft, endTime })} />
          <Input label="Ceremonia" value={draft.ceremonyTime} onChange={(ceremonyTime) => onChange({ ...draft, ceremonyTime })} />
          <Input label="Recepcion" value={draft.receptionTime} onChange={(receptionTime) => onChange({ ...draft, receptionTime })} />
          <Input label="Llegada proveedores" value={draft.vendorArrivalTime} onChange={(vendorArrivalTime) => onChange({ ...draft, vendorArrivalTime })} />
          <Input label="Llegada cliente" value={draft.clientArrivalTime} onChange={(clientArrivalTime) => onChange({ ...draft, clientArrivalTime })} />
          <Input label="Montaje" value={draft.setupTime} onChange={(setupTime) => onChange({ ...draft, setupTime })} />
          <Input label="Desmontaje" value={draft.teardownTime} onChange={(teardownTime) => onChange({ ...draft, teardownTime })} />
        </div>
      </div>

      <div className="form-section full">
        <h3>Ubicaciones</h3>
        <div className="form-grid">
          <Input label="Lugar ceremonia" value={draft.ceremony} onChange={(ceremony) => onChange({ ...draft, ceremony })} />
          <Input label="Lugar recepcion" value={draft.venue} onChange={(venue) => onChange({ ...draft, venue })} />
          <Input label="Direccion exacta" value={draft.address} onChange={(address) => onChange({ ...draft, address })} />
          <Input label="Salon / area" value={draft.room} onChange={(room) => onChange({ ...draft, room })} />
          <Input label="Ciudad / provincia" value={draft.city} onChange={(city) => onChange({ ...draft, city })} />
          <Input label="Link ubicacion" value={draft.locationLink} onChange={(locationLink) => onChange({ ...draft, locationLink })} />
          <Input label="Contacto venue" value={draft.venueContact} onChange={(venueContact) => onChange({ ...draft, venueContact })} />
          <Input label="Telefono venue" value={draft.venuePhone} onChange={(venuePhone) => onChange({ ...draft, venuePhone })} />
        </div>
      </div>

      <div className="form-section full">
        <h3>Datos del cliente y detalles</h3>
        <div className="form-grid">
          <Input label="Telefono cliente" value={draft.clientPhone} onChange={(clientPhone) => onChange({ ...draft, clientPhone })} />
          <Input label="Correo cliente" value={draft.clientEmail} onChange={(clientEmail) => onChange({ ...draft, clientEmail })} />
          <Input label="Persona autorizada" value={draft.decisionMaker} onChange={(decisionMaker) => onChange({ ...draft, decisionMaker })} />
          <Input label="Contacto emergencia" value={draft.emergencyContact} onChange={(emergencyContact) => onChange({ ...draft, emergencyContact })} />
          <Input label="Estilo" value={draft.style} onChange={(style) => onChange({ ...draft, style })} />
          <Input label="Paleta de colores" value={draft.colorPalette} onChange={(colorPalette) => onChange({ ...draft, colorPalette })} />
          <Input label="Concepto / tematica" value={draft.concept} onChange={(concept) => onChange({ ...draft, concept })} />
          <Input label="Dress code" value={draft.dressCode} onChange={(dressCode) => onChange({ ...draft, dressCode })} />
        </div>
        <Textarea label="Observaciones del cliente" value={draft.clientNotes} onChange={(clientNotes) => onChange({ ...draft, clientNotes })} />
        <Textarea label="Requerimientos especiales" value={draft.specialRequirements} onChange={(specialRequirements) => onChange({ ...draft, specialRequirements })} />
        <Textarea label="Restricciones del lugar" value={draft.venueRestrictions} onChange={(venueRestrictions) => onChange({ ...draft, venueRestrictions })} />
      </div>

      <div className="form-section full">
        <h3>Informacion economica y equipo</h3>
        <div className="form-grid">
          <Input label="Presupuesto estimado" value={draft.budget} onChange={(budget) => onChange({ ...draft, budget })} />
          <Input label="Monto contratado" value={draft.contractedAmount} onChange={(contractedAmount) => onChange({ ...draft, contractedAmount })} />
          <Input label="Abono inicial" value={draft.deposit} onChange={(deposit) => onChange({ ...draft, deposit })} />
          <Input label="Total pagado" value={draft.paid} onChange={(paid) => onChange({ ...draft, paid })} />
          <Input label="Saldo pendiente" value={draft.pendingBalance} onChange={(pendingBalance) => onChange({ ...draft, pendingBalance })} />
          <Input label="Fecha limite de pago" value={draft.paymentDeadline} onChange={(paymentDeadline) => onChange({ ...draft, paymentDeadline })} />
          <Input label="Forma de pago" value={draft.paymentMethod} onChange={(paymentMethod) => onChange({ ...draft, paymentMethod })} />
          <Input label="Estado de pagos" value={draft.paymentStatus} onChange={(paymentStatus) => onChange({ ...draft, paymentStatus })} />
          <Input label="Equipo protocolo" value={draft.protocolTeam} onChange={(protocolTeam) => onChange({ ...draft, protocolTeam })} />
          <Input label="Coordinador montaje" value={draft.setupCoordinator} onChange={(setupCoordinator) => onChange({ ...draft, setupCoordinator })} />
          <Input label="Coordinador proveedores" value={draft.vendorCoordinator} onChange={(vendorCoordinator) => onChange({ ...draft, vendorCoordinator })} />
          <Input label="Responsable desmontaje" value={draft.teardownOwner} onChange={(teardownOwner) => onChange({ ...draft, teardownOwner })} />
        </div>
        <Textarea label="Notas de pago / notas internas" value={draft.paymentNotes} onChange={(paymentNotes) => onChange({ ...draft, paymentNotes })} />
      </div>

      <div className="form-section full">
        <h3>Archivos y documentos</h3>
        <Input label="Documentos del evento" value={draft.documents.join(", ")} onChange={(documents) => onChange({ ...draft, documents: documents.split(",").map((item) => item.trim()).filter(Boolean) })} />
        <Textarea label="Observaciones importantes" value={draft.importantNotes} onChange={(importantNotes) => onChange({ ...draft, importantNotes })} />
      </div>
      <FormActions isEditing={Boolean(draft.id)} onCancel={onCancel} />
    </form>
  );
}

function VendorForm({ draft, onCancel, onChange, onSubmit }: FormProps<Vendor>) {
  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <Input label="Proveedor" value={draft.name} onChange={(name) => onChange({ ...draft, name })} />
      <Input label="Categoria" value={draft.category} onChange={(category) => onChange({ ...draft, category })} />
      <Input label="Contacto" value={draft.contact} onChange={(contact) => onChange({ ...draft, contact })} />
      <Input label="Telefono" value={draft.phone} onChange={(phone) => onChange({ ...draft, phone })} />
      <Input label="Correo" value={draft.email} onChange={(email) => onChange({ ...draft, email })} />
      <Input label="Tarifa" value={draft.rate} onChange={(rate) => onChange({ ...draft, rate })} />
      <Input label="Estado" value={draft.status} onChange={(status) => onChange({ ...draft, status })} />
      <FormActions isEditing={Boolean(draft.id)} onCancel={onCancel} />
    </form>
  );
}

function QuoteForm({ draft, onCancel, onChange, onSubmit }: FormProps<Quote>) {
  function updateItem(id: string, patch: Partial<QuoteItem>) {
    onChange({
      ...draft,
      items: draft.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      )
    });
  }

  function addItem() {
    onChange({
      ...draft,
      items: [
        ...draft.items,
        {
          id: makeId("qi"),
          description: "",
          quantity: 1,
          unit: "Servicio",
          unitPrice: 0,
          discount: 0,
          tax: 0
        }
      ]
    });
  }

  function removeItem(id: string) {
    onChange({
      ...draft,
      items:
        draft.items.length > 1
          ? draft.items.filter((item) => item.id !== id)
          : draft.items
    });
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <label className="field full">
        <span>No. Cotizacion automatico</span>
        <input
          className="input"
          disabled
          value={draft.quoteNumber || "Se generara al guardar"}
        />
      </label>
      <Input label="Cliente" value={draft.client} onChange={(client) => onChange({ ...draft, client })} />
      <Input label="Cedula o RUC" value={draft.clientTaxId} onChange={(clientTaxId) => onChange({ ...draft, clientTaxId })} />
      <Input label="Correo del cliente" value={draft.clientEmail} onChange={(clientEmail) => onChange({ ...draft, clientEmail })} />
      <Input label="Evento" value={draft.event} onChange={(event) => onChange({ ...draft, event })} />
      <Input label="Lugar del evento" value={draft.eventPlace} onChange={(eventPlace) => onChange({ ...draft, eventPlace })} />
      <Input label="Fecha del evento" value={draft.expires} onChange={(expires) => onChange({ ...draft, expires })} />
      <label className="field">
        <span>Metodo de pago</span>
        <select
          className="input"
          onChange={(event) =>
            onChange({
              ...draft,
              paymentMethod: event.target.value as Quote["paymentMethod"]
            })
          }
          value={draft.paymentMethod}
        >
          <option>Yappy</option>
          <option>Link de pago</option>
          <option>ACH</option>
          <option>Efectivo</option>
        </select>
      </label>
      <label className="field">
        <span>Estado</span>
        <select
          className="input"
          onChange={(event) => onChange({ ...draft, status: event.target.value })}
          value={draft.status}
        >
          {quoteStatusOptions.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
      </label>
      <Textarea label="Observaciones" value={draft.observations} onChange={(observations) => onChange({ ...draft, observations })} />
      <div className="quote-item-editor full">
        <div className="quote-item-editor-header">
          <strong>Servicios / productos</strong>
          <button className="button" onClick={addItem} type="button">
            <Plus size={16} aria-hidden="true" />
            Agregar fila
          </button>
        </div>
        <div className="quote-item-table">
          <div className="quote-item-row quote-item-head">
            <span>Ref.</span>
            <span>Descripcion</span>
            <span>Cantidad</span>
            <span>Unidad</span>
            <span>Precio unitario</span>
            <span>Desc.</span>
            <span>Impuesto</span>
            <span>Total</span>
            <span></span>
          </div>
          {draft.items.map((item, index) => (
            <div className="quote-item-row" key={item.id}>
              <strong>{quoteItemReference(index)}</strong>
              <input
                className="input"
                onChange={(event) =>
                  updateItem(item.id, { description: event.target.value })
                }
                value={item.description}
              />
              <input
                className="input"
                min="0"
                onChange={(event) =>
                  updateItem(item.id, { quantity: Number(event.target.value) })
                }
                type="number"
                value={item.quantity}
              />
              <input
                className="input"
                onChange={(event) =>
                  updateItem(item.id, { unit: event.target.value })
                }
                value={item.unit}
              />
              <input
                className="input"
                min="0"
                onChange={(event) =>
                  updateItem(item.id, { unitPrice: Number(event.target.value) })
                }
                type="number"
                value={item.unitPrice}
              />
              <input
                className="input"
                min="0"
                onChange={(event) =>
                  updateItem(item.id, { discount: Number(event.target.value) })
                }
                type="number"
                value={item.discount}
              />
              <input
                className="input"
                min="0"
                onChange={(event) =>
                  updateItem(item.id, { tax: Number(event.target.value) })
                }
                type="number"
                value={item.tax}
              />
              <strong>{money(quoteItemTotal(item))}</strong>
              <button
                className="icon-button danger"
                onClick={() => removeItem(item.id)}
                title="Eliminar fila"
                type="button"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
        <div className="quote-editor-total">
          Total cotizacion: <strong>{money(quoteTotals(draft).total)}</strong>
        </div>
      </div>
      <FormActions isEditing={Boolean(draft.id)} onCancel={onCancel} />
    </form>
  );
}

function ContractForm({ draft, onCancel, onChange, onSubmit }: FormProps<Contract>) {
  function updateTemplate(template: string) {
    const content = contractTemplateContent[template] ?? {};
    onChange({ ...draft, ...content, template });
  }

  return (
    <form className="form-grid contract-form" onSubmit={onSubmit}>
      <div className="form-section full">
        <h3>Informacion general</h3>
        <div className="form-grid">
          <label className="field">
            <span>Relacion</span>
            <select
              className="input"
              onChange={(event) =>
                onChange({ ...draft, kind: event.target.value as Contract["kind"] })
              }
              value={draft.kind}
            >
              <option>Cliente</option>
              <option>Proveedor</option>
            </select>
          </label>
          <label className="field">
            <span>Tipo de contrato</span>
            <select className="input" onChange={(event) => onChange({ ...draft, contractType: event.target.value })} value={draft.contractType}>
              {contractTypeOptions.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <Input label={draft.kind === "Proveedor" ? "Proveedor relacionado" : "Cliente relacionado"} value={draft.client} onChange={(client) => onChange({ ...draft, client })} />
          <Input label="Evento relacionado" value={draft.event} onChange={(event) => onChange({ ...draft, event })} />
          <label className="field">
            <span>Plantilla legal</span>
            <select className="input" onChange={(event) => updateTemplate(event.target.value)} value={draft.template}>
              {contractTemplateOptions.map((template) => <option key={template}>{template}</option>)}
            </select>
          </label>
          <Input label="Responsable interno" value={draft.owner} onChange={(owner) => onChange({ ...draft, owner })} />
          <Input label="Nombre del contrato" value={draft.name} onChange={(name) => onChange({ ...draft, name })} />
          <label className="field">
            <span>Estado inicial</span>
            <select className="input" onChange={(event) => onChange({ ...draft, status: event.target.value })} value={draft.status}>
              {contractStatusOptions.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="form-section full">
        <h3>Datos economicos</h3>
        <div className="form-grid">
          <Input label="Monto total del servicio" type="number" value={String(draft.amount)} onChange={(amount) => onChange({ ...draft, amount: Number(amount), balance: Math.max(Number(amount) - draft.deposit, 0) })} />
          <Input label="Abono inicial" type="number" value={String(draft.deposit)} onChange={(deposit) => onChange({ ...draft, deposit: Number(deposit), balance: Math.max(draft.amount - Number(deposit), 0) })} />
          <Input label="Saldo pendiente" type="number" value={String(draft.balance)} onChange={(balance) => onChange({ ...draft, balance: Number(balance) })} />
          <Input label="Condiciones de pago" value={draft.paymentTerms} onChange={(paymentTerms) => onChange({ ...draft, paymentTerms, terms: paymentTerms })} />
        </div>
      </div>

      <div className="form-section contract-date-section full">
        <h3>Fechas importantes</h3>
        <div className="contract-date-grid">
          <Input label="Fecha de emision" value={draft.createdAt} onChange={(createdAt) => onChange({ ...draft, createdAt })} />
          <Input label="Fecha limite de firma" value={draft.signatureDeadline} onChange={(signatureDeadline) => onChange({ ...draft, signatureDeadline })} />
          <Input label="Fecha de envio" value={draft.sentAt} onChange={(sentAt) => onChange({ ...draft, sentAt })} />
          <Input label="Fecha de firma" value={draft.signedAt} onChange={(signedAt) => onChange({ ...draft, signedAt })} />
        </div>
      </div>

      <div className="form-section full">
        <h3>Contenido legal</h3>
        <Textarea label="Servicios incluidos" value={draft.services} onChange={(services) => onChange({ ...draft, services })} />
        <Textarea label="Politica de cancelacion" value={draft.cancellationPolicy} onChange={(cancellationPolicy) => onChange({ ...draft, cancellationPolicy })} />
        <Textarea label="Responsabilidades del cliente / proveedor" value={draft.clientResponsibilities} onChange={(clientResponsibilities) => onChange({ ...draft, clientResponsibilities })} />
        <Textarea label="Responsabilidades de la empresa" value={draft.companyResponsibilities} onChange={(companyResponsibilities) => onChange({ ...draft, companyResponsibilities })} />
        <Textarea label="Clausulas especiales" value={draft.specialClauses} onChange={(specialClauses) => onChange({ ...draft, specialClauses })} />
        <Textarea label="Observaciones internas" value={draft.internalNotes} onChange={(internalNotes) => onChange({ ...draft, internalNotes })} />
      </div>

      <div className="form-section full">
        <h3>Firma y documentos</h3>
        <Input label="Archivos relacionados" value={draft.documents.join(", ")} onChange={(documents) => onChange({ ...draft, documents: documents.split(",").map((item) => item.trim()).filter(Boolean) })} />
        <Input label="Historial inicial" value={draft.history.join(" | ")} onChange={(history) => onChange({ ...draft, history: history.split("|").map((item) => item.trim()).filter(Boolean) })} />
      </div>

      <label className="field full check-field">
        <input
          checked={draft.signatureRequired}
          onChange={(event) =>
            onChange({ ...draft, signatureRequired: event.target.checked })
          }
          type="checkbox"
        />
        <span>Incluir espacio para firma digital</span>
      </label>
      <FormActions isEditing={Boolean(draft.id)} onCancel={onCancel} />
    </form>
  );
}

function DocumentForm({ draft, onCancel, onChange, onSubmit }: FormProps<DocumentItem>) {
  return (
    <form className="form-grid" onSubmit={onSubmit}>
      <Input label="Nombre de archivo" value={draft.name} onChange={(name) => onChange({ ...draft, name })} />
      <Input label="Relacionado con" value={draft.owner} onChange={(owner) => onChange({ ...draft, owner })} />
      <Input label="Tipo" value={draft.kind} onChange={(kind) => onChange({ ...draft, kind })} />
      <Input label="Visibilidad" value={draft.visibility} onChange={(visibility) => onChange({ ...draft, visibility })} />
      <FormActions isEditing={Boolean(draft.id)} onCancel={onCancel} />
    </form>
  );
}

function TimelineForm({
  draft,
  events,
  onCancel,
  onChange,
  onSubmit
}: FormProps<TimelineItem> & { events: EventRecord[] }) {
  return (
    <form className="form-grid contract-form timeline-form" onSubmit={onSubmit}>
      <div className="form-section full">
        <h3>Informacion general</h3>
        <div className="form-grid">
          <label className="field">
            <span>Evento / cliente</span>
            <select className="input" onChange={(event) => onChange({ ...draft, eventId: event.target.value })} value={draft.eventId}>
              {events.map((eventItem) => <option key={eventItem.id} value={eventItem.id}>{eventItem.clientName} - {eventItem.name}</option>)}
            </select>
          </label>
          <Input label="Fecha" value={draft.date} onChange={(date) => onChange({ ...draft, date })} />
          <Input label="Hora de inicio" value={draft.time} onChange={(time) => onChange({ ...draft, time })} />
          <Input label="Hora de finalizacion" value={draft.endTime} onChange={(endTime) => onChange({ ...draft, endTime })} />
          <Input label="Nombre de la actividad" value={draft.title} onChange={(title) => onChange({ ...draft, title })} />
          <label className="field">
            <span>Categoria</span>
            <select className="input" onChange={(event) => onChange({ ...draft, category: event.target.value })} value={draft.category}>
              {timelineCategoryOptions.map((category) => <option key={category}>{category}</option>)}
            </select>
          </label>
          <Input label="Lugar / area" value={draft.place} onChange={(place) => onChange({ ...draft, place })} />
          <label className="field">
            <span>Estado</span>
            <select className="input" onChange={(event) => onChange({ ...draft, status: event.target.value })} value={draft.status}>
              {timelineStatusOptions.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Prioridad</span>
            <select className="input" onChange={(event) => onChange({ ...draft, priority: event.target.value as TimelineItem["priority"] })} value={draft.priority}>
              {timelinePriorityOptions.map((priority) => <option key={priority}>{priority}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="form-section full">
        <h3>Responsables</h3>
        <div className="form-grid">
          <Input label="Responsable interno" value={draft.owner} onChange={(owner) => onChange({ ...draft, owner })} />
          <Input label="Equipo asignado" value={draft.team} onChange={(team) => onChange({ ...draft, team })} />
          <Input label="Proveedor relacionado" value={draft.vendor} onChange={(vendor) => onChange({ ...draft, vendor })} />
          <Input label="Contacto proveedor" value={draft.vendorContact} onChange={(vendorContact) => onChange({ ...draft, vendorContact })} />
          <Input label="Telefono proveedor" value={draft.vendorPhone} onChange={(vendorPhone) => onChange({ ...draft, vendorPhone })} />
        </div>
      </div>

      <div className="form-section full">
        <h3>Detalles operativos</h3>
        <Textarea label="Descripcion de la actividad" value={draft.description} onChange={(description) => onChange({ ...draft, description })} />
        <Textarea label="Instrucciones internas" value={draft.internalInstructions} onChange={(internalInstructions) => onChange({ ...draft, internalInstructions })} />
        <Textarea label="Instrucciones para proveedor" value={draft.vendorInstructions} onChange={(vendorInstructions) => onChange({ ...draft, vendorInstructions })} />
        <div className="form-grid">
          <Input label="Dependencia de otra actividad" value={draft.dependsOn} onChange={(dependsOn) => onChange({ ...draft, dependsOn })} />
          <Input label="Tiempo estimado" value={draft.duration} onChange={(duration) => onChange({ ...draft, duration })} />
        </div>
        <label className="field full check-field"><input checked={draft.requiresConfirmation} onChange={(event) => onChange({ ...draft, requiresConfirmation: event.target.checked })} type="checkbox" /><span>Requiere confirmacion</span></label>
        <label className="field full check-field"><input checked={draft.isCritical} onChange={(event) => onChange({ ...draft, isCritical: event.target.checked, priority: event.target.checked ? "Critica" : draft.priority })} type="checkbox" /><span>Actividad critica</span></label>
      </div>

      <div className="form-section full">
        <h3>Confirmacion de proveedor</h3>
        <div className="form-grid">
          <label className="field full check-field"><input checked={draft.vendorConfirmed} onChange={(event) => onChange({ ...draft, vendorConfirmed: event.target.checked })} type="checkbox" /><span>Proveedor confirmado</span></label>
          <Input label="Fecha de confirmacion" value={draft.confirmationDate} onChange={(confirmationDate) => onChange({ ...draft, confirmationDate })} />
          <Input label="Persona que confirmo" value={draft.confirmationBy} onChange={(confirmationBy) => onChange({ ...draft, confirmationBy })} />
          <Input label="Medio de confirmacion" value={draft.confirmationMethod} onChange={(confirmationMethod) => onChange({ ...draft, confirmationMethod })} />
          <Input label="Observaciones" value={draft.confirmationNotes} onChange={(confirmationNotes) => onChange({ ...draft, confirmationNotes })} />
        </div>
      </div>

      <div className="form-section full">
        <h3>Archivos y notas</h3>
        <Input label="Archivos relacionados" value={draft.files.join(", ")} onChange={(files) => onChange({ ...draft, files: files.split(",").map((item) => item.trim()).filter(Boolean) })} />
        <Textarea label="Notas internas" value={draft.internalNotes} onChange={(internalNotes) => onChange({ ...draft, internalNotes })} />
        <Textarea label="Observaciones visibles para cliente" value={draft.clientNotes} onChange={(clientNotes) => onChange({ ...draft, clientNotes })} />
        <Textarea label="Comentarios para el equipo" value={draft.teamComments} onChange={(teamComments) => onChange({ ...draft, teamComments })} />
      </div>
      <FormActions isEditing={Boolean(draft.id)} onCancel={onCancel} />
    </form>
  );
}

function EmailTemplateForm({
  draft,
  onCancel,
  onChange,
  onSubmit
}: FormProps<EmailTemplate>) {
  return (
    <form className="form-grid form-divider" onSubmit={onSubmit}>
      <Input label="Nombre" value={draft.name} onChange={(name) => onChange({ ...draft, name })} />
      <Input label="Asunto" value={draft.subject} onChange={(subject) => onChange({ ...draft, subject })} />
      <Textarea label="Mensaje" value={draft.body} onChange={(body) => onChange({ ...draft, body })} />
      <FormActions isEditing={Boolean(draft.id)} onCancel={onCancel} />
    </form>
  );
}

type FormProps<T> = {
  draft: T;
  onCancel: () => void;
  onChange: (value: T) => void;
  onSubmit: (event: FormEvent) => void;
};

function Input({
  label,
  onChange,
  type = "text",
  value
}: Readonly<{
  label: string;
  onChange: (value: string) => void;
  type?: string;
  value: string;
}>) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        className="input"
        onChange={(event) => onChange(event.target.value)}
        type={type}
        value={value}
      />
    </label>
  );
}

function Textarea({
  label,
  onChange,
  value
}: Readonly<{
  label: string;
  onChange: (value: string) => void;
  value: string;
}>) {
  return (
    <label className="field full">
      <span>{label}</span>
      <textarea
        className="input textarea"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function FormActions({
  isEditing,
  onCancel
}: Readonly<{
  isEditing: boolean;
  onCancel: () => void;
}>) {
  return (
    <div className="form-actions">
      <button className="button primary" type="submit">
        <Save size={17} aria-hidden="true" />
        {isEditing ? "Guardar cambios" : "Crear"}
      </button>
      <button className="button" onClick={onCancel} type="button">
        <X size={17} aria-hidden="true" />
        Limpiar
      </button>
    </div>
  );
}

function DataTable({
  headers,
  rows
}: Readonly<{
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
}>) {
  return (
    <table className="table">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <td key={`cell-${cellIndex}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RowActions({
  onDelete,
  onEdit,
  pdf
}: Readonly<{
  onDelete: () => void;
  onEdit: () => void;
  pdf: { filename: string; lines: string[]; title: string };
}>) {
  return (
    <div className="row-actions">
      <button className="icon-button" onClick={onEdit} title="Editar" type="button">
        <Edit3 size={16} aria-hidden="true" />
      </button>
      <PdfButton filename={pdf.filename} lines={pdf.lines} title={pdf.title} />
      <button
        className="icon-button danger"
        onClick={onDelete}
        title="Eliminar"
        type="button"
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

function PdfButton({
  filename,
  lines,
  title
}: Readonly<{
  filename: string;
  lines: string[];
  title: string;
}>) {
  return (
    <a
      className="icon-button"
      download={filename}
      href={pdfDataUri(title, lines)}
      title="Descargar PDF"
    >
      <Download size={16} aria-hidden="true" />
    </a>
  );
}

function Panel({
  title,
  action,
  children
}: Readonly<{
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{title}</h2>
        {action}
      </div>
      <div className="panel-body">{children}</div>
    </section>
  );
}

function Detail({
  label,
  value
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Status({
  label,
  tone
}: Readonly<{
  label: string;
  tone: StatusTone;
}>) {
  return <span className={`status ${tone}`}>{label}</span>;
}
