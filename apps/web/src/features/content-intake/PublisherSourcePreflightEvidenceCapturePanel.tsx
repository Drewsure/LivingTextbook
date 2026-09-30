"use client";

import { useState, type ChangeEvent } from "react";
import { Button, Card, StatusPill } from "@living-textbook/ui";

type EvidenceResponse = {
  status?: string;
  record?: {
    evidenceId?: string;
    reportId?: string;
    manifestId?: string;
    sourceUnitKey?: string;
    sourceChecksumSha256?: string;
  } | null;
  errors?: string[];
};

type ReportPreview = {
  reportId: string;
  manifestId: string;
  packageId: string;
  version: string;
  sourceCount: number;
  verifiedCount: number;
  inventoryStatus: string;
};

export function PublisherSourcePreflightEvidenceCapturePanel({ tenantId }: { tenantId: string }) {
  const [quarantineId, setQuarantineId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [report, setReport] = useState<unknown | null>(null);
  const [reportPreview, setReportPreview] = useState<ReportPreview | null>(null);
  const [fileName, setFileName] = useState("");
  const [state, setState] = useState<"idle" | "reading" | "submitting" | "recorded" | "error">("idle");
  const [response, setResponse] = useState<EvidenceResponse | null>(null);

  async function selectReport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setResponse(null);
    setReport(null);
    setReportPreview(null);
    setFileName(file?.name ?? "");
    if (!file) return;
    setState("reading");
    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      const preview = summarizeReport(parsed);
      if (!preview) throw new Error("The selected file is not a valid publisher source preflight report.");
      setReport(parsed);
      setReportPreview(preview);
      setState("idle");
    } catch (error) {
      setState("error");
      setResponse({ errors: [error instanceof Error ? error.message : "The preflight report could not be read."] });
    }
  }

  async function submitReport() {
    if (!report || !reportPreview || !quarantineId.trim()) {
      setState("error");
      setResponse({ errors: ["Choose a valid preflight report and enter the quarantine ID before attaching evidence."] });
      return;
    }
    setState("submitting");
    setResponse(null);
    try {
      const result = await fetch("/api/teacher/uploads/source-preflight-evidence", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, quarantineId: quarantineId.trim(), packageId: packageId.trim() || undefined, report }),
      });
      const payload = (await result.json()) as EvidenceResponse;
      setResponse(payload);
      setState(result.ok ? "recorded" : "error");
    } catch {
      setState("error");
      setResponse({ errors: ["The source preflight evidence request could not be completed."] });
    }
  }

  const statusLabel = state === "recorded" ? "Review evidence recorded" : state === "error" ? "Evidence not recorded" : state === "submitting" ? "Submitting review evidence" : "Awaiting report";
  const statusTone = state === "recorded" ? "success" : "warning";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Publisher source preflight</p>
          <h2 className="mt-1 text-lg font-bold">Attach a reviewed source report to quarantine</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Choose the JSON report produced by the local publisher preflight and bind it to one quarantine record. Only bounded report metadata is sent; textbook, image, audio, video, and game payloads are never copied by this control.
          </p>
        </div>
        <StatusPill label={statusLabel} tone={statusTone} />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
          Quarantine ID
          <input className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 font-normal" value={quarantineId} onChange={(event) => setQuarantineId(event.target.value)} maxLength={80} placeholder="q-..." />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
          Package ID (optional)
          <input className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 font-normal" value={packageId} onChange={(event) => setPackageId(event.target.value)} maxLength={240} placeholder="Derived from the quarantined unit when blank" />
        </label>
      </div>

      <label className="mt-4 grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">
        Preflight report JSON
        <input className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 font-normal" type="file" accept="application/json,.json" onChange={selectReport} />
        <span className="text-xs font-normal text-[var(--tenant-muted)]">{fileName || "No report selected"}</span>
      </label>

      {reportPreview ? (
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact label="Report" value={reportPreview.reportId} />
          <Fact label="Manifest" value={reportPreview.manifestId} />
          <Fact label="Declared / verified" value={`${reportPreview.sourceCount} / ${reportPreview.verifiedCount}`} />
          <Fact label="Inventory" value={reportPreview.inventoryStatus} />
        </dl>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" onClick={submitReport} disabled={!report || state === "reading" || state === "submitting"}>
          {state === "submitting" ? "Attaching review evidence..." : "Attach review evidence"}
        </Button>
        <span className="text-sm text-[var(--tenant-muted)]" aria-live="polite">{state === "reading" ? "Reading report metadata..." : reportPreview ? "Report is ready for the tenant-scoped gate." : "No report has been selected."}</span>
      </div>

      {response?.errors?.length ? <ul className="mt-4 grid gap-2 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">{response.errors.map((error, index) => <li key={`${index}-${error}`}>{error}</li>)}</ul> : null}
      {response?.record ? <p className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">Attached evidence: <span className="font-semibold">{response.record.evidenceId}</span>. This remains review-only and does not approve package assembly or student use.</p> : null}
    </Card>
  );
}

function summarizeReport(value: unknown): ReportPreview | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  const counts = candidate.counts;
  if (typeof candidate.reportId !== "string" || typeof candidate.manifestId !== "string" || typeof candidate.packageId !== "string" || typeof candidate.version !== "string" || typeof candidate.inventoryStatus !== "string" || !counts || typeof counts !== "object" || Array.isArray(counts)) return null;
  const countRecord = counts as Record<string, unknown>;
  if (typeof countRecord.declared !== "number" || typeof countRecord.verified !== "number") return null;
  return { reportId: candidate.reportId, manifestId: candidate.manifestId, packageId: candidate.packageId, version: candidate.version, sourceCount: countRecord.declared, verifiedCount: countRecord.verified, inventoryStatus: candidate.inventoryStatus };
}

function Fact({ label, value }: { label: string; value: string }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></section>;
}
