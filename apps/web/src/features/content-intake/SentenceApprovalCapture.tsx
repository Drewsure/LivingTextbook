"use client";

import { useState, type FormEvent } from "react";
import { StatusPill } from "@living-textbook/ui";
import type { PublisherSentenceApprovalRecord, UploadQuarantineReviewDecisionRecord } from "@living-textbook/content-model";

export function SentenceApprovalCapture({
  tenantId,
  quarantineId,
  packageId,
  enabled,
  approval,
  sourceDecision,
  onRecorded,
}: {
  tenantId: string;
  quarantineId: string;
  packageId: string;
  enabled: boolean;
  approval: PublisherSentenceApprovalRecord | null;
  sourceDecision: UploadQuarantineReviewDecisionRecord | null;
  onRecorded: () => void;
}) {
  const [reviewerId, setReviewerId] = useState(approval?.reviewerId ?? "");
  const [reviewerNote, setReviewerNote] = useState(approval?.reviewerNote ?? "");
  const [sentences, setSentences] = useState<[string, string]>(approval?.targetSentences ?? ["", ""]);
  const [state, setState] = useState<"idle" | "submitting" | "recorded" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/teacher/uploads/sentence-approval", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, quarantineId, packageId, targetSentences: sentences, reviewerId, reviewerNote, decision: "approved" }),
      });
      const payload = (await response.json()) as { errors?: string[]; sentenceApprovalRecorded?: boolean };
      if (!response.ok) throw new Error(payload.errors?.[0] ?? "The sentence approval could not be recorded.");
      setState("recorded");
      setMessage(payload.sentenceApprovalRecorded ? "Two English target sentences are recorded; release gates remain separate." : "Sentence review recorded; approval remains incomplete.");
      onRecorded();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "The sentence approval could not be recorded.");
    }
  }

  return (
    <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">English sentence approval</p>
          <h2 className="mt-1 text-lg font-bold">Confirm exactly two target sentence structures</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">These are English learning targets, not extracted source text. Support-language glosses are reviewed separately and can never trigger progression.</p>
        </div>
        <StatusPill label={!enabled ? "Operator gate" : sourceDecision?.decision !== "accepted-for-package-review" ? "Source gate" : approval?.decision === "approved" ? "Approved" : "Human action"} tone={approval?.decision === "approved" ? "success" : "warning"} />
      </div>

      {!enabled ? (
        <p className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">Sentence approval is disabled by default. Enable <code>LIVING_TEXTBOOOK_SENTENCE_APPROVALS_ENABLED=true</code> only in the controlled review environment.</p>
      ) : sourceDecision?.decision !== "accepted-for-package-review" ? (
        <p className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-muted)]">An accepted-for-package-review source decision is required before English sentence approval can be recorded.</p>
      ) : (
        <form className="mt-5 grid gap-4" onSubmit={submit}>
          <fieldset className="grid gap-3">
            <legend className="text-sm font-semibold text-[var(--tenant-text)]">Two English target sentences</legend>
            {[0, 1].map((index) => (
              <label key={index} className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">Target sentence {index + 1}<input required value={sentences[index]} onChange={(event) => setSentences((current) => { const next: [string, string] = [...current]; next[index] = event.target.value; return next; })} maxLength={500} placeholder={index === 0 ? "Hello, teacher." : "Thank you, friend."} className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-normal" /></label>
            ))}
          </fieldset>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">Reviewer ID<input required value={reviewerId} onChange={(event) => setReviewerId(event.target.value)} maxLength={160} placeholder="publisher-or-school-reviewer" className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-normal" /></label>
            <label className="grid gap-2 text-sm font-semibold text-[var(--tenant-text)]">Approval note<textarea required value={reviewerNote} onChange={(event) => setReviewerNote(event.target.value)} maxLength={2000} placeholder="Explain why these English structures fit the reviewed vocabulary and level." className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-normal" /></label>
          </div>
          <div className="flex flex-wrap items-center gap-3"><button type="submit" disabled={state === "submitting"} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60">{state === "submitting" ? "Recording sentence approval..." : "Approve two English sentences"}</button><span className="text-sm text-[var(--tenant-muted)]" aria-live="polite">{message || "Approval records exactly two English targets and remains review-only."}</span></div>
        </form>
      )}
      {approval ? <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">Recorded by {approval.reviewerId} on {approval.capturedAt}. Assembly, promotion, QR printing, and student use remain blocked.</p> : null}
    </section>
  );
}
