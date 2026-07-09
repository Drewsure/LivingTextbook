import { Card, StatusPill } from "@living-textbook/ui";
import type {
  QrPrintGateStatus,
  QrPrintReadinessRecord,
  QrPrintReadinessStatus,
} from "@/data/sampleQrPrintReadiness";
import { countQrPrintGates } from "@/data/sampleQrPrintReadiness";

interface QrPrintReadinessPanelProps {
  records: QrPrintReadinessRecord[];
}

const statusTone: Record<QrPrintReadinessStatus, "neutral" | "success" | "warning"> = {
  "print-ready": "success",
  "draft-only": "warning",
  blocked: "warning",
};

const gateTone: Record<QrPrintGateStatus, "neutral" | "success" | "warning"> = {
  pass: "success",
  warning: "warning",
  blocked: "warning",
};

export function QrPrintReadinessPanel({ records }: QrPrintReadinessPanelProps) {
  const printReadyCount = records.filter((record) => record.status === "print-ready").length;
  const blockedCount = records.filter((record) => record.status === "blocked").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">QR print readiness</p>
          <h2 className="mt-1 text-lg font-bold">Printed textbook QR gate</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Printed QR codes are expensive to fix after a book is produced. This gate keeps demo aliases, draft partner routes, local fallback paths, and media-file shortcuts from being mistaken for print-ready links.
          </p>
        </div>
        <StatusPill label={`${printReadyCount} print-ready`} tone={printReadyCount > 0 ? "success" : "warning"} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <QrPrintMetric label="Records" value={String(records.length)} tone="neutral" />
        <QrPrintMetric label="Print-ready" value={String(printReadyCount)} tone={printReadyCount > 0 ? "success" : "warning"} />
        <QrPrintMetric label="Blocked" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-4">
        {records.map((record) => (
          <article key={record.recordId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{record.printedQrId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{record.label}</h3>
                <p className="mt-1 break-words text-sm text-[var(--tenant-muted)]">Alias: {record.aliasId}</p>
              </div>
              <StatusPill label={record.status} tone={statusTone[record.status]} />
            </div>

            <p className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-text)]">
              {record.printDecision}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <QrPrintMetric label="Passing gates" value={String(countQrPrintGates(record, "pass"))} tone="success" />
              <QrPrintMetric label="Warnings" value={String(countQrPrintGates(record, "warning"))} tone="warning" />
              <QrPrintMetric label="Blocked" value={String(countQrPrintGates(record, "blocked"))} tone={countQrPrintGates(record, "blocked") > 0 ? "warning" : "success"} />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {record.gates.map((gate) => (
                <section key={gate.gateId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{gate.owner}</p>
                      <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{gate.label}</h4>
                    </div>
                    <StatusPill label={gate.status} tone={gateTone[gate.status]} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{gate.note}</p>
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function QrPrintMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 text-lg font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
