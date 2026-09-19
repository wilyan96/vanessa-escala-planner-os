"use client";
/* eslint-disable @next/next/no-img-element */

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Copy,
  Download,
  Edit3,
  FileSpreadsheet,
  Plus,
  Printer,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X
} from "lucide-react";

export type AccountStatementPayment = {
  amount: number;
  date: string;
  description: string;
  id: string;
  receiptNumber: string;
};

export type AccountStatementSection = {
  id: string;
  payments: AccountStatementPayment[];
  title: string;
  total: number;
};

export type AccountStatement = {
  client: string;
  clientEmail: string;
  eventName: string;
  id: string;
  issueDate: string;
  notes: string;
  sections: AccountStatementSection[];
  statementNumber: string;
  status: string;
};

type StatementReceipt = {
  client: string;
  eventName: string;
  issueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  receiptNumber: string;
  status: string;
};

type StatementClient = {
  email: string;
  event: string;
  name: string;
};

type SyncStatus = "demo" | "error" | "loading" | "synced";

const blankSections = (): AccountStatementSection[] => [
  {
    id: makeStatementId("section"),
    payments: [],
    title: "Decoración",
    total: 0
  },
  {
    id: makeStatementId("section"),
    payments: [],
    title: "Planificación",
    total: 0
  }
];

function createBlankStatement(): AccountStatement {
  return {
    client: "",
    clientEmail: "",
    eventName: "",
    id: "",
    issueDate: new Date().toISOString().slice(0, 10),
    notes: "",
    sections: blankSections(),
    statementNumber: "",
    status: "Borrador"
  };
}

function makeStatementId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    minimumFractionDigits: 2,
    style: "currency"
  }).format(Number.isFinite(value) ? value : 0);
}

function displayDate(value: string) {
  if (!value) return "-";
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("es-PA", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function nextStatementNumber(statements: AccountStatement[]) {
  const maxSequence = statements.reduce((max, statement) => {
    const match = statement.statementNumber.match(/EDC-(\d+)/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `EDC-${String(maxSequence + 1).padStart(3, "0")}`;
}

function sectionPaid(section: AccountStatementSection) {
  return section.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function statementTotals(statement: AccountStatement) {
  const total = statement.sections.reduce((sum, section) => sum + Number(section.total || 0), 0);
  const paid = statement.sections.reduce((sum, section) => sum + sectionPaid(section), 0);
  return { paid, pending: Math.max(total - paid, 0), total };
}

function sectionTitleFromDescription(description: string) {
  const value = normalize(description);
  if (value.includes("decor")) return "Decoración";
  if (value.includes("plan") || value.includes("coordin")) return "Planificación";
  return "Otros servicios";
}

function importReceiptSections(
  statement: AccountStatement,
  receipts: StatementReceipt[]
) {
  const matching = receipts.filter((receipt) => {
    const sameClient = normalize(receipt.client) === normalize(statement.client);
    const sameEvent =
      !statement.eventName || normalize(receipt.eventName) === normalize(statement.eventName);
    return sameClient && sameEvent && ["pagado", "emitido"].includes(normalize(receipt.status));
  });
  const totalsByTitle = new Map(
    statement.sections.map((section) => [normalize(section.title), section.total])
  );
  const sections = new Map<string, AccountStatementSection>();

  matching.forEach((receipt) => {
    receipt.items.forEach((item) => {
      const title = sectionTitleFromDescription(item.description);
      const key = normalize(title);
      const section = sections.get(key) ?? {
        id: makeStatementId("section"),
        payments: [],
        title,
        total: totalsByTitle.get(key) ?? 0
      };
      section.payments.push({
        amount: Number(item.quantity || 1) * Number(item.unitPrice || 0),
        date: receipt.issueDate,
        description: item.description || "Abono",
        id: makeStatementId("payment"),
        receiptNumber: receipt.receiptNumber
      });
      sections.set(key, section);
    });
  });

  const imported = [...sections.values()];
  statement.sections.forEach((section) => {
    if (!sections.has(normalize(section.title))) imported.push({ ...section, payments: [] });
  });
  return {
    count: matching.length,
    sections: imported.slice(0, 3)
  };
}

function safeFilename(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function dataUrlToBytes(dataUrl: string) {
  const binary = atob(dataUrl.split(",")[1] ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function bytesFromAscii(value: string) {
  return new TextEncoder().encode(value);
}

function concatBytes(chunks: Uint8Array[]) {
  const output = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0;
  chunks.forEach((chunk) => {
    output.set(chunk, offset);
    offset += chunk.length;
  });
  return output;
}

function createLandscapeJpegPdf(jpegBytes: Uint8Array) {
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0];
  let byteLength = 0;
  let objectCount = 0;

  function write(chunk: string | Uint8Array) {
    const bytes = typeof chunk === "string" ? bytesFromAscii(chunk) : chunk;
    chunks.push(bytes);
    byteLength += bytes.length;
  }

  function addObject(parts: Array<string | Uint8Array>) {
    objectCount += 1;
    offsets.push(byteLength);
    write(`${objectCount} 0 obj\n`);
    parts.forEach(write);
    write("\nendobj\n");
  }

  const pageContent = "q\n792 0 0 612 0 0 cm\n/Im1 Do\nQ";
  write("%PDF-1.4\n");
  addObject(["<< /Type /Catalog /Pages 2 0 R >>"]);
  addObject(["<< /Type /Pages /Kids [3 0 R] /Count 1 >>"]);
  addObject([
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 792 612] /Resources << /XObject << /Im1 5 0 R >> >> /Contents 4 0 R >>"
  ]);
  addObject([`<< /Length ${pageContent.length} >>\nstream\n${pageContent}\nendstream`]);
  addObject([
    `<< /Type /XObject /Subtype /Image /Width 1650 /Height 1275 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`,
    jpegBytes,
    "\nendstream"
  ]);
  const xrefOffset = byteLength;
  write(`xref\n0 ${objectCount + 1}\n0000000000 65535 f \n`);
  offsets.slice(1).forEach((offset) => {
    write(`${offset.toString().padStart(10, "0")} 00000 n \n`);
  });
  write(`trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);
  return new Blob([concatBytes(chunks)], { type: "application/pdf" });
}

function loadLogo() {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = "/logo-vanessa.png";
  });
}

function compactPayments(payments: AccountStatementPayment[]) {
  if (payments.length <= 5) return payments;
  const visible = payments.slice(0, 4);
  const hidden = payments.slice(4);
  return [
    ...visible,
    {
      amount: hidden.reduce((sum, payment) => sum + payment.amount, 0),
      date: "Varias fechas",
      description: `Otros ${hidden.length} abonos`,
      id: "other-payments",
      receiptNumber: ""
    }
  ];
}

async function createStatementPdf(statement: AccountStatement) {
  const canvas = document.createElement("canvas");
  canvas.width = 1650;
  canvas.height = 1275;
  const context = canvas.getContext("2d");
  if (!context) return null;

  const logo = await loadLogo();
  const totals = statementTotals(statement);
  const sections = statement.sections.slice(0, 3);
  const gap = 26;
  const contentWidth = 1490;
  const sectionWidth = (contentWidth - gap * (sections.length - 1)) / Math.max(sections.length, 1);

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#111111";
  context.font = "bold 48px Arial";
  context.fillText("Estado de Cuenta", 82, 105);
  context.fillStyle = "#b8872b";
  context.font = "bold 26px Arial";
  context.fillText(statement.statementNumber || "EDC-001", 84, 145);
  context.fillStyle = "#555555";
  context.font = "24px Arial";
  context.fillText(statement.eventName || "Decoración y Planificación", 84, 181);

  if (logo) context.drawImage(logo, 1410, 55, 128, 128);
  context.textAlign = "right";
  context.fillStyle = "#111111";
  context.font = "bold 23px Arial";
  context.fillText("Vanessa Escala", 1390, 103);
  context.fillStyle = "#b8872b";
  context.fillText("Wedding & Events Planner", 1390, 137);
  context.textAlign = "left";

  context.fillStyle = "#f7f5f0";
  context.fillRect(80, 210, 1490, 86);
  context.fillStyle = "#6b7280";
  context.font = "bold 18px Arial";
  context.fillText("CLIENTE", 105, 242);
  context.fillText("EVENTO", 650, 242);
  context.fillText("FECHA", 1260, 242);
  context.fillStyle = "#111111";
  context.font = "bold 25px Arial";
  context.fillText(statement.client || "Cliente", 105, 276);
  context.fillText(statement.eventName || "-", 650, 276);
  context.fillText(displayDate(statement.issueDate), 1260, 276);

  sections.forEach((section, sectionIndex) => {
    const x = 80 + sectionIndex * (sectionWidth + gap);
    const paid = sectionPaid(section);
    const pending = Math.max(section.total - paid, 0);
    context.strokeStyle = "#d6d3cd";
    context.lineWidth = 2;
    context.strokeRect(x, 330, sectionWidth, 500);
    context.fillStyle = "#111111";
    context.font = "bold 28px Arial";
    context.fillText(`${sectionIndex + 1}. ${section.title}`, x + 20, 374);
    context.fillStyle = "#555555";
    context.font = "22px Arial";
    context.fillText(`Costo total: ${money(section.total)}`, x + 20, 410);

    context.fillStyle = "#b8872b";
    context.fillRect(x, 435, sectionWidth, 48);
    context.fillStyle = "#111111";
    context.font = "bold 19px Arial";
    context.fillText("Fecha", x + 16, 466);
    context.fillText("Concepto / Recibo", x + 145, 466);
    context.textAlign = "right";
    context.fillText("Abono", x + sectionWidth - 16, 466);
    context.textAlign = "left";

    const payments = compactPayments(section.payments);
    payments.forEach((payment, paymentIndex) => {
      const rowY = 483 + paymentIndex * 52;
      context.fillStyle = paymentIndex % 2 === 0 ? "#fafafa" : "#ffffff";
      context.fillRect(x, rowY, sectionWidth, 52);
      context.fillStyle = "#333333";
      context.font = "17px Arial";
      context.fillText(payment.date || "-", x + 16, rowY + 32);
      const description = `${payment.description}${payment.receiptNumber ? ` (${payment.receiptNumber})` : ""}`;
      context.fillText(description.slice(0, 32), x + 145, rowY + 32);
      context.textAlign = "right";
      context.fillText(money(payment.amount), x + sectionWidth - 16, rowY + 32);
      context.textAlign = "left";
    });

    context.fillStyle = "#f3f3f3";
    context.fillRect(x, 743, sectionWidth, 43);
    context.fillRect(x, 787, sectionWidth, 43);
    context.fillStyle = "#222222";
    context.font = "bold 19px Arial";
    context.fillText("Total abonado", x + 16, 771);
    context.fillText("Saldo pendiente", x + 16, 815);
    context.textAlign = "right";
    context.fillText(money(paid), x + sectionWidth - 16, 771);
    context.fillText(money(pending), x + sectionWidth - 16, 815);
    context.textAlign = "left";
  });

  context.fillStyle = "#111111";
  context.font = "bold 28px Arial";
  context.fillText("Resumen general", 80, 884);
  context.fillStyle = "#f3f3f3";
  context.fillRect(80, 906, 1490, 46);
  context.fillStyle = "#555555";
  context.font = "bold 18px Arial";
  context.fillText("Concepto", 100, 936);
  context.textAlign = "right";
  context.fillText("Contratado", 1120, 936);
  context.fillText("Abonado", 1330, 936);
  context.fillText("Pendiente", 1550, 936);
  context.textAlign = "left";

  sections.forEach((section, index) => {
    const y = 952 + index * 42;
    const paid = sectionPaid(section);
    context.fillStyle = index % 2 === 0 ? "#ffffff" : "#fafafa";
    context.fillRect(80, y, 1490, 42);
    context.fillStyle = "#222222";
    context.font = "19px Arial";
    context.fillText(section.title, 100, y + 28);
    context.textAlign = "right";
    context.fillText(money(section.total), 1120, y + 28);
    context.fillText(money(paid), 1330, y + 28);
    context.fillText(money(Math.max(section.total - paid, 0)), 1550, y + 28);
    context.textAlign = "left";
  });

  const summaryY = 970 + sections.length * 42;
  context.fillStyle = "#111111";
  context.fillRect(80, summaryY, 1490, 74);
  context.fillStyle = "#ffffff";
  context.font = "bold 30px Arial";
  context.fillText("Saldo total pendiente a la fecha", 105, summaryY + 47);
  context.textAlign = "right";
  context.fillStyle = "#d9ad3b";
  context.font = "bold 36px Arial";
  context.fillText(money(totals.pending), 1540, summaryY + 49);
  context.textAlign = "left";

  context.fillStyle = "#6b7280";
  context.font = "17px Arial";
  context.fillText((statement.notes || "Estado de cuenta generado con pagos registrados en Vanessa Escala Planner OS").slice(0, 125), 82, 1215);
  context.textAlign = "right";
  context.fillText("+507 6371-2318 | vanessaescalaplanner@gmail.com", 1568, 1215);

  const jpegBytes = dataUrlToBytes(canvas.toDataURL("image/jpeg", 0.96));
  return createLandscapeJpegPdf(jpegBytes);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
}

async function downloadStatementPdf(statement: AccountStatement) {
  const pdf = await createStatementPdf(statement);
  if (!pdf) return;
  downloadBlob(
    pdf,
    `${safeFilename(statement.statementNumber || "estado-de-cuenta")}-${safeFilename(statement.client || "cliente")}.pdf`
  );
}

async function printStatementPdf(statement: AccountStatement) {
  const pdf = await createStatementPdf(statement);
  if (!pdf) return;
  const url = URL.createObjectURL(pdf);
  window.open(url, "_blank", "noopener,noreferrer");
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export function AccountStatementsView({
  clients,
  onDelete,
  onSave,
  receipts,
  statements,
  syncStatus
}: Readonly<{
  clients: StatementClient[];
  onDelete: (id: string) => Promise<void> | void;
  onSave: (statement: AccountStatement) => Promise<void> | void;
  receipts: StatementReceipt[];
  statements: AccountStatement[];
  syncStatus: SyncStatus;
}>) {
  const [viewMode, setViewMode] = useState<"history" | "form">("history");
  const [draft, setDraft] = useState<AccountStatement>(createBlankStatement);
  const [selectedId, setSelectedId] = useState(statements[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [importMessage, setImportMessage] = useState("");

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query);
    return statements.filter((statement) => {
      const matchesQuery =
        !normalizedQuery ||
        normalize(
          `${statement.statementNumber} ${statement.client} ${statement.eventName} ${statement.issueDate}`
        ).includes(normalizedQuery);
      const matchesStatus = statusFilter === "Todos" || statement.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statements, statusFilter]);

  const selected = statements.find((statement) => statement.id === selectedId) ?? filtered[0];
  const preview = viewMode === "form" && (draft.client || draft.id) ? draft : selected;

  useEffect(() => {
    if (!selectedId && statements[0]) setSelectedId(statements[0].id);
  }, [selectedId, statements]);

  function startNew() {
    setDraft({
      ...createBlankStatement(),
      statementNumber: nextStatementNumber(statements)
    });
    setImportMessage("");
    setViewMode("form");
  }

  function edit(statement: AccountStatement) {
    setDraft(statement);
    setImportMessage("");
    setViewMode("form");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft.client.trim()) return;
    onSave({
      ...draft,
      statementNumber: draft.statementNumber || nextStatementNumber(statements)
    });
    setDraft(createBlankStatement());
    setViewMode("history");
  }

  function chooseClient(name: string) {
    const client = clients.find((item) => normalize(item.name) === normalize(name));
    const receipt = receipts.find((item) => normalize(item.client) === normalize(name));
    setDraft((current) => ({
      ...current,
      client: name,
      clientEmail: client?.email || current.clientEmail,
      eventName: receipt?.eventName || client?.event || current.eventName
    }));
  }

  function loadReceipts() {
    if (!draft.client.trim()) {
      setImportMessage("Selecciona primero el cliente.");
      return;
    }
    const result = importReceiptSections(draft, receipts);
    if (result.count === 0) {
      setImportMessage("No se encontraron recibos pagados o emitidos para ese cliente y evento.");
      return;
    }
    setDraft((current) => ({ ...current, sections: result.sections }));
    setImportMessage(`${result.count} recibo${result.count === 1 ? "" : "s"} cargado${result.count === 1 ? "" : "s"}. Revisa los totales contratados.`);
  }

  function updateSection(sectionId: string, patch: Partial<AccountStatementSection>) {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId ? { ...section, ...patch } : section
      )
    }));
  }

  function updatePayment(
    sectionId: string,
    paymentId: string,
    patch: Partial<AccountStatementPayment>
  ) {
    setDraft((current) => ({
      ...current,
      sections: current.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              payments: section.payments.map((payment) =>
                payment.id === paymentId ? { ...payment, ...patch } : payment
              )
            }
          : section
      )
    }));
  }

  const totals = preview ? statementTotals(preview) : null;

  return (
    <section className="statements-workspace">
      <div className="receipt-mode-bar">
        <button
          className={`button ${viewMode === "history" ? "primary" : ""}`}
          onClick={() => setViewMode("history")}
          type="button"
        >
          <FileSpreadsheet size={17} aria-hidden="true" />
          Historial
        </button>
        <button
          className={`button ${viewMode === "form" ? "primary" : ""}`}
          onClick={startNew}
          type="button"
        >
          <Plus size={17} aria-hidden="true" />
          Nuevo estado de cuenta
        </button>
      </div>

      {viewMode === "history" && (
        <section className="panel">
          <div className="panel-header">
            <h2>Estados de cuenta guardados</h2>
            <button className="button primary" onClick={startNew} type="button">
              <Plus size={17} aria-hidden="true" />
              Crear
            </button>
          </div>
          <div className="panel-body">
            <div className="sync-banner">
              <strong>
                {syncStatus === "synced"
                  ? "Conectados a Prisma"
                  : syncStatus === "loading"
                    ? "Cargando estados de cuenta"
                    : syncStatus === "error"
                      ? "No se pudo sincronizar"
                      : "Preparando sincronizacion"}
              </strong>
              <span>Los estados se guardan en la base de datos y usan los recibos reales del cliente.</span>
            </div>
            <div className="statement-summary-grid">
              <div><span>Registrados</span><strong>{statements.length}</strong></div>
              <div><span>Saldo pendiente visible</span><strong>{money(filtered.reduce((sum, item) => sum + statementTotals(item).pending, 0))}</strong></div>
              <div><span>Actualizados</span><strong>{filtered.filter((item) => item.status === "Actualizado").length}</strong></div>
            </div>
            <div className="statement-toolbar">
              <label className="receipt-search-control">
                <Search size={17} aria-hidden="true" />
                <input
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar cliente, evento o numero"
                  value={query}
                />
              </label>
              <select
                className="input compact"
                onChange={(event) => setStatusFilter(event.target.value)}
                value={statusFilter}
              >
                {["Todos", "Borrador", "Actualizado", "Enviado", "Cerrado"].map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="statement-table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th><th>Cliente</th><th>Evento</th><th>Fecha</th><th>Total</th><th>Abonado</th><th>Saldo</th><th>Estado</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((statement) => {
                    const rowTotals = statementTotals(statement);
                    return (
                      <tr key={statement.id}>
                        <td><button className="text-button" onClick={() => setSelectedId(statement.id)} type="button">{statement.statementNumber}</button></td>
                        <td>{statement.client}</td>
                        <td>{statement.eventName || "-"}</td>
                        <td>{displayDate(statement.issueDate)}</td>
                        <td>{money(rowTotals.total)}</td>
                        <td>{money(rowTotals.paid)}</td>
                        <td><strong>{money(rowTotals.pending)}</strong></td>
                        <td><span className={`status ${statement.status === "Cerrado" ? "success" : statement.status === "Borrador" ? "warning" : "blue"}`}>{statement.status}</span></td>
                        <td>
                          <div className="statement-actions">
                            <button className="button compact-action" onClick={() => edit(statement)} title="Editar" type="button"><Edit3 size={15} aria-hidden="true" /></button>
                            <button className="button compact-action" onClick={() => void downloadStatementPdf(statement)} title="Descargar PDF" type="button"><Download size={15} aria-hidden="true" /></button>
                            <button className="button compact-action" onClick={() => onSave({ ...statement, id: "", statementNumber: "", status: "Borrador" })} title="Duplicar" type="button"><Copy size={15} aria-hidden="true" /></button>
                            <button className="button compact-action danger" onClick={() => window.confirm(`Eliminar ${statement.statementNumber}?`) && onDelete(statement.id)} title="Eliminar" type="button"><Trash2 size={15} aria-hidden="true" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="empty-state">No hay estados de cuenta que coincidan con la busqueda.</div>}
            </div>
          </div>
        </section>
      )}

      {viewMode === "form" && (
        <form className="panel" onSubmit={submit}>
          <div className="panel-header">
            <h2>{draft.id ? "Editar estado de cuenta" : "Nuevo estado de cuenta"}</h2>
            <button className="button" onClick={() => setViewMode("history")} type="button"><X size={17} aria-hidden="true" />Cerrar</button>
          </div>
          <div className="panel-body">
            <div className="statement-form-head">
              <label className="field"><span>No. automatico</span><input className="input" readOnly value={draft.statementNumber || nextStatementNumber(statements)} /></label>
              <label className="field"><span>Cliente</span><input className="input" list="statement-clients" onChange={(event) => chooseClient(event.target.value)} required value={draft.client} /></label>
              <datalist id="statement-clients">{[...new Set([...clients.map((client) => client.name), ...receipts.map((receipt) => receipt.client)])].map((name) => <option key={name} value={name} />)}</datalist>
              <label className="field"><span>Correo</span><input className="input" onChange={(event) => setDraft((current) => ({ ...current, clientEmail: event.target.value }))} type="email" value={draft.clientEmail} /></label>
              <label className="field"><span>Evento</span><input className="input" onChange={(event) => setDraft((current) => ({ ...current, eventName: event.target.value }))} value={draft.eventName} /></label>
              <label className="field"><span>Fecha</span><input className="input" onChange={(event) => setDraft((current) => ({ ...current, issueDate: event.target.value }))} type="date" value={draft.issueDate} /></label>
              <label className="field"><span>Estado</span><select className="input" onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))} value={draft.status}>{["Borrador", "Actualizado", "Enviado", "Cerrado"].map((status) => <option key={status}>{status}</option>)}</select></label>
            </div>

            <div className="statement-import-bar">
              <div><strong>Pagos desde recibos</strong><span>Importa automaticamente los abonos pagados o emitidos del cliente.</span></div>
              <button className="button" onClick={loadReceipts} type="button"><RefreshCw size={17} aria-hidden="true" />Cargar recibos</button>
            </div>
            {importMessage && <p className="statement-import-message">{importMessage}</p>}

            <div className="statement-sections-editor">
              {draft.sections.map((section, sectionIndex) => (
                <article className="statement-section-editor" key={section.id}>
                  <div className="statement-section-heading">
                    <strong>Servicio {sectionIndex + 1}</strong>
                    {draft.sections.length > 1 && <button className="icon-button danger" onClick={() => setDraft((current) => ({ ...current, sections: current.sections.filter((item) => item.id !== section.id) }))} title="Eliminar servicio" type="button"><Trash2 size={16} aria-hidden="true" /></button>}
                  </div>
                  <div className="form-grid">
                    <label className="field"><span>Concepto</span><input className="input" onChange={(event) => updateSection(section.id, { title: event.target.value })} value={section.title} /></label>
                    <label className="field"><span>Total contratado</span><input className="input" min="0" onChange={(event) => updateSection(section.id, { total: Number(event.target.value) })} step="0.01" type="number" value={section.total} /></label>
                  </div>
                  <div className="statement-payment-list">
                    <div className="statement-payment-head"><span>Fecha</span><span>Concepto</span><span>Recibo</span><span>Abono</span><span></span></div>
                    {section.payments.map((payment) => (
                      <div className="statement-payment-row" key={payment.id}>
                        <input className="input" onChange={(event) => updatePayment(section.id, payment.id, { date: event.target.value })} value={payment.date} />
                        <input className="input" onChange={(event) => updatePayment(section.id, payment.id, { description: event.target.value })} value={payment.description} />
                        <input className="input" onChange={(event) => updatePayment(section.id, payment.id, { receiptNumber: event.target.value })} value={payment.receiptNumber} />
                        <input className="input" min="0" onChange={(event) => updatePayment(section.id, payment.id, { amount: Number(event.target.value) })} step="0.01" type="number" value={payment.amount} />
                        <button className="icon-button danger" onClick={() => updateSection(section.id, { payments: section.payments.filter((item) => item.id !== payment.id) })} title="Eliminar abono" type="button"><Trash2 size={15} aria-hidden="true" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="statement-section-footer">
                    <button className="button" onClick={() => updateSection(section.id, { payments: [...section.payments, { amount: 0, date: "", description: "Abono", id: makeStatementId("payment"), receiptNumber: "" }] })} type="button"><Plus size={16} aria-hidden="true" />Agregar abono</button>
                    <span>Abonado: <strong>{money(sectionPaid(section))}</strong></span>
                    <span>Saldo: <strong>{money(Math.max(section.total - sectionPaid(section), 0))}</strong></span>
                  </div>
                </article>
              ))}
            </div>
            {draft.sections.length < 3 && <button className="button" onClick={() => setDraft((current) => ({ ...current, sections: [...current.sections, { id: makeStatementId("section"), payments: [], title: "Otro servicio", total: 0 }] }))} type="button"><Plus size={16} aria-hidden="true" />Agregar servicio</button>}

            <label className="field statement-notes"><span>Nota</span><textarea className="input textarea" onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} value={draft.notes} /></label>
            <div className="statement-form-total"><span>Total contratado <strong>{money(statementTotals(draft).total)}</strong></span><span>Total abonado <strong>{money(statementTotals(draft).paid)}</strong></span><span>Saldo pendiente <strong>{money(statementTotals(draft).pending)}</strong></span></div>
            <div className="form-actions">
              <button className="button primary" type="submit"><Save size={17} aria-hidden="true" />Guardar estado</button>
              <button className="button" onClick={() => setDraft(createBlankStatement())} type="button"><X size={17} aria-hidden="true" />Limpiar</button>
            </div>
          </div>
        </form>
      )}

      {preview && (
        <section className="statement-preview-wrap">
          <div className="quote-actions">
            <button className="button" onClick={() => void downloadStatementPdf(preview)} type="button"><Download size={17} aria-hidden="true" />Descargar PDF</button>
            <button className="button" onClick={() => void printStatementPdf(preview)} type="button"><Printer size={17} aria-hidden="true" />Imprimir</button>
          </div>
          <article className="statement-paper">
            <header className="statement-paper-header">
              <div><h2>Estado de Cuenta</h2><p>{preview.statementNumber || "Se asigna al guardar"}</p><span>{preview.eventName || "Decoración y Planificación"}</span></div>
              <div className="statement-paper-brand"><img alt="Vanessa Escala" src="/logo-vanessa.png" /><strong>Vanessa Escala</strong><span>Wedding & Events Planner</span></div>
            </header>
            <div className="statement-paper-meta"><div><span>Cliente</span><strong>{preview.client || "Cliente"}</strong></div><div><span>Evento</span><strong>{preview.eventName || "-"}</strong></div><div><span>Fecha</span><strong>{displayDate(preview.issueDate)}</strong></div></div>
            <div className={`statement-paper-sections count-${Math.min(preview.sections.length, 3)}`}>
              {preview.sections.slice(0, 3).map((section, index) => {
                const paid = sectionPaid(section);
                return <section className="statement-paper-section" key={section.id}><h3>{index + 1}. {section.title}</h3><p>Costo total: <strong>{money(section.total)}</strong></p><table><thead><tr><th>Fecha</th><th>Concepto / Recibo</th><th>Abono</th></tr></thead><tbody>{compactPayments(section.payments).map((payment) => <tr key={payment.id}><td>{payment.date || "-"}</td><td>{payment.description}{payment.receiptNumber ? ` (${payment.receiptNumber})` : ""}</td><td>{money(payment.amount)}</td></tr>)}</tbody><tfoot><tr><th colSpan={2}>Total abonado</th><th>{money(paid)}</th></tr><tr><th colSpan={2}>Saldo pendiente</th><th>{money(Math.max(section.total - paid, 0))}</th></tr></tfoot></table></section>;
              })}
            </div>
            <section className="statement-paper-summary"><h3>Resumen general</h3><table><thead><tr><th>Concepto</th><th>Contratado</th><th>Abonado</th><th>Pendiente</th></tr></thead><tbody>{preview.sections.map((section) => { const paid = sectionPaid(section); return <tr key={section.id}><td>{section.title}</td><td>{money(section.total)}</td><td>{money(paid)}</td><td>{money(Math.max(section.total - paid, 0))}</td></tr>; })}</tbody></table></section>
            <div className="statement-paper-balance"><span>Saldo total pendiente a la fecha</span><strong>{money(totals?.pending ?? 0)}</strong></div>
            <footer><span>{preview.notes || "Estado de cuenta generado con pagos registrados en Vanessa Escala Planner OS."}</span><span>+507 6371-2318 | vanessaescalaplanner@gmail.com</span></footer>
          </article>
        </section>
      )}
    </section>
  );
}
