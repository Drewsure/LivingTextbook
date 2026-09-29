"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { StatusPill } from "@living-textbook/ui";
import type { UploadQuarantineReviewDecisionRecord } from "@living-textbook/content-model";

const reviewFields = [
  "Source identity and checksum",
  "Publisher ownership and rights basis",
  "Unit and activity mapping",
  "Audio, video, image, and accessibility evidence",
  "Package review prerequisites",
] as const;

interface QuarantineReviewDecisionCaptureProps {
  tenantId: string;
  quarantineId: string;
  packageId?: string;
  enabled: boolean;
  decision: UploadQuarantineReviewDecisionRecord | null;
  onRecorded: () => void;
}

export function QuarantineReviewDecisionCapture({ tenantId, quarantineId, packageId, enabled, decision, onRecorded }: QuarantineReviewDecisionCaptureProps) {
  const [reviewerId, setReviewerId] = useState("");
  const [decisionValue, setDecisionValue] = useState<"accepted-for-package-review" | "changes-required">("accepted-for-package-review");
  const [reviewerNote, setReviewerNote] = useState("");
  const [reviewedFields, setReviewedFields] = useState<string[]>([]);
  const [unresolvedBlockers, setUnresolvedBlockers] = useState("Release approval, package assembly, QR printing, and student use remain separate gates.");
  const [state, setState] = useState<"idle" | "submitting" | "recorded" | "error">("idle");
  const [message, setMessage] = useState("");

  function toggleReviewedField(field: string) {
    setReviewedFields((current) => current.includes(field) ? current.filter((item) => item !== field) : [...current, field]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/teacher/uploads/review-decision", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId,
          quarantineId,
          packageId,
          reviewerId,
          decision: decisionValue,
          reviewerNote,
          reviewedFields,
          unresolvedBlockers: unresolvedBlockers.split("\n").map((item) => item.trim()).filter(Boolean),
        }),
      });
      const payload = (await response.json()) as { errors?: string[]; status?: string };
      if (!response.ok) throw new Error(payload.errors?.[0] ?? "The review decision could not be recorded.");
      setState("recorded");
      setMessage("Source review decision recorded. Release approval and package activation remain blocked.");
      onRecorded();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "The review decision could not be recorded.");
    }
  }

  return (
    <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Source review decision capture</p>
          <h3 className="mt-1 text-base font-bold">Record one immutable package-review outcome</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This is a human review checkpoint for the quarantined source. It is not release approval and cannot assemble, promote, print QR codes, enable hosted persistence, or activate students.
          </p>
        </div>
        <StatusPill label={decision ? decision.decision : !enabled ? "Operator gate" : state === "recorded" ? "Recorded" : "Human action"} tone={state === "recorded" ? "success" : "warning"} />
      </div>

      {decision ? (
        <p className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
          An immutable decision is already recorded for this quarantine. Conflicting replacements are rejected; use the displayed decision and its blockers for the next review gate.
        </p>
      ) : !enabled ? (
        <p className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">
          Decision capture is disabled by default. Enable <code>LIVING_TEXTBOOOK_REVIEW_DECISIONS_ENABLED=true</code> only in the controlled review environment.
        </p>
      ) : (
        <form className="mt-5 grid gap-4" onSubmit={submit}>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Reviewer ID"><input required value={reviewerId} onChange={(event) => setReviewerId(event.target.value)} maxLength={160} placeholder="teacher-or-operator-id" /></Field>
            <Field label="Review outcome"><select value={decisionValue} onChange={(event) => setDecisionValue(event.target.value as typeof decisionValue)}><option value="accepted-for-package-review">Accepted for package review</option><option value="changes-required">Changes required</option></select></Field>
            <Field label="Package"><input value={packageId ?? "Derived by server"} readOnly /></Field>
          </div>
          <fieldset className="grid gap-2">
            <legend className="text-sm font-semibold text-[var(--tenant-text)]">Reviewed fields</legend>
            {reviewFields.map((field) => <label key={field} className="flex items-start gap-2 rounded-lg border border-[var(--tenant-border)] p-3 text-sm leading-6 text-[var(--tenant-muted)]"><input type="checkbox" checked={reviewedFields.includes(field)} onChange={() => toggleReviewedField(field)} className="mt-1" /><span>{field}</span></label>)}
          </fieldset>
          <Field label="Reviewer note"><textarea required value={reviewerNote} onChange={(event) => setReviewerNote(event.target.value)} maxLength={2000} placeholder="Record what was checked and what remains unresolved." /></Field>
          <Field label="Unresolved blockers, one per line"><textarea required value={unresolvedBlockers} onChange={(event) => setUnresolvedBlockers(event.target.value)} maxLength={4000} /></Field>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={state === "submitting" || reviewedFields.length === 0} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">
              {state === "submitting" ? "Recording decision..." : "Record source review decision"}
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
