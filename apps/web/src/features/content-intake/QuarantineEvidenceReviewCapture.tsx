"use client";

import { useState, type FormEvent } from "react";
import { StatusPill } from "@living-textbook/ui";
import type { ReactNode } from "react";

const reviewedFields = [
  "Security scan evidence",
  "Publisher rights evidence",
  "Source and unit mapping",
  "Accessibility and transcript evidence",
  "Package readiness evidence",
  "Release-control evidence",
] as const;

interface QuarantineEvidenceReviewCaptureProps {
  tenantId: string;
  quarantineId: string;
  packageId?: string;
  enabled: boolean;
  onRecorded: () => void;
}

export function QuarantineEvidenceReviewCapture({ tenantId, quarantineId, packageId, enabled, onRecorded }: QuarantineEvidenceReviewCaptureProps) {
  const [reviewerId, setReviewerId] = useState("");
  const [reviewerNote, setReviewerNote] = useState("");
  const [scanStatus, setScanStatus] = useState("pending");
  const [rightsStatus, setRightsStatus] = useState("unknown");
  const [sourceReviewStatus, setSourceReviewStatus] = useState("unreviewed");
  const [targetMappingReviewed, setTargetMappingReviewed] = useState(false);
  const [accessibilityReviewed, setAccessibilityReviewed] = useState(false);
  const [releaseApproved, setReleaseApproved] = useState(false);
  const [state, setState] = useState<"idle" | "submitting" | "recorded" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/teacher/uploads/evidence-review", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          quarantineId,
          packageId,
          reviewerId,
          reviewerNote,
          reviewedFields: [...reviewedFields],
          scanStatus,
          rightsStatus,
          sourceReviewStatus,
          targetMappingReviewed,
          accessibilityReviewed,
          releaseApproved,
        }),
      });
      const payload = (await response.json()) as { errors?: string[]; evidenceReady?: boolean };
      if (!response.ok) throw new Error(payload.errors?.[0] ?? "The evidence review could not be recorded.");
      setState("recorded");
      setMessage(payload.evidenceReady ? "Evidence is ready for the package-review gate; assembly and student use remain blocked." : "Evidence review recorded with blockers; complete the remaining evidence before package review.");
      onRecorded();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "The evidence review could not be recorded.");
    }
  }

  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Human evidence adjudication</p>
          <h2 className="mt-1 text-lg font-bold">Record the evidence that can advance this source</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This writes one immutable metadata record beside the quarantine payload. It does not mutate the intake record, promote files, create games, print QR codes, enable hosted persistence, or activate students.
          </p>
        </div>
        <StatusPill label={!enabled ? "Operator gate" : state === "recorded" ? "Recorded" : "Human action"} tone={state === "recorded" ? "success" : "warning"} />
      </div>

      {!enabled ? (
        <p className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
          Evidence adjudication is disabled by default. Enable <code>LIVING_TEXTBOOOK_EVIDENCE_REVIEWS_ENABLED=true</code> only in the controlled review environment.
        </p>
      ) : (
        <form className="mt-5 grid gap-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Reviewer ID"><input required value={reviewerId} onChange={(event) => setReviewerId(event.target.value)} maxLength={160} placeholder="teacher-or-operator-id" /></Field>
            <Field label="Security scan"><select value={scanStatus} onChange={(event) => setScanStatus(event.target.value)}><option value="pending">Pending</option><option value="passed">Passed evidence</option><option value="failed">Failed</option></select></Field>
            <Field label="Rights status"><select value={rightsStatus} onChange={(event) => setRightsStatus(event.target.value)}><option value="unknown">Unknown</option><option value="partner-provided">Partner provided</option><option value="licensed">Licensed</option><option value="owned">Owned</option></select></Field>
          </div>
          <Field label="Source review"><select value={sourceReviewStatus} onChange={(event) => setSourceReviewStatus(event.target.value)}><option value="unreviewed">Unreviewed</option><option value="reviewed">Reviewed</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></Field>
          <fieldset className="grid gap-2">
            <legend className="text-sm font-semibold text-[var(--tenant-text)]">Review confirmations</legend>
            <Check label="Target unit and game mapping reviewed" checked={targetMappingReviewed} onChange={setTargetMappingReviewed} />
            <Check label="Accessibility, transcript, and alt-text evidence reviewed" checked={accessibilityReviewed} onChange={setAccessibilityReviewed} />
            <Check label="Release-control evidence reviewed" checked={releaseApproved} onChange={setReleaseApproved} />
          </fieldset>
          <Field label="Reviewer note"><textarea required value={reviewerNote} onChange={(event) => setReviewerNote(event.target.value)} maxLength={2000} placeholder="Record the evidence references and remaining caveats." /></Field>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={state === "submitting"} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
              {state === "submitting" ? "Recording evidence review..." : "Record evidence review"}
            </button>
            <span className="text-sm text-[var(--tenant-muted)]" aria-live="polite">{message || `Quarantine: ${quarantineId}`}</span>
          </div>
        </form>
      )}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">{label}{children}</label>;
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex items-start gap-2 rounded-lg border border-[var(--tenant-border)] p-3 text-sm leading-6 text-[var(--tenant-muted)]"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1" /><span>{label}</span></label>;
}
