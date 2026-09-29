"use client";

import { useState } from "react";
import { StatusPill } from "@living-textbook/ui";
import type { UploadQuarantinePromotionAdapter, UploadQuarantinePromotionAdapterDecision } from "@living-textbook/content-model";

export function PromotionAdapterDecisionCapture({
  tenantId,
  quarantineId,
  packageId,
  enabled,
  decision,
  onRecorded,
}: {
  tenantId: string;
  quarantineId: string;
  packageId: string;
  enabled: boolean;
  decision: UploadQuarantinePromotionAdapterDecision | null;
  onRecorded: () => void;
}) {
  const [selectedAdapter, setSelectedAdapter] = useState<UploadQuarantinePromotionAdapter>(decision?.selectedAdapter ?? "closed-local-package");
  const [reviewerId, setReviewerId] = useState("");
  const [reviewerNote, setReviewerNote] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "recorded" | "blocked" | "error">("idle");
  const [message, setMessage] = useState("");

  async function recordDecision() {
    setState("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/teacher/uploads/promotion-adapter-decision", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, quarantineId, packageId, selectedAdapter, reviewerId, reviewerNote }),
      });
      const next = (await response.json()) as { status?: string; errors?: string[] };
      if (!response.ok) {
        setState(next.status === "blocked" ? "blocked" : "error");
        setMessage(next.errors?.[0] ?? "The promotion adapter decision could not be recorded.");
        return;
      }
      setState("recorded");
      setMessage("Promotion adapter recorded for review-only planning. Assembly and activation remain blocked.");
      onRecorded();
    } catch {
      setState("error");
      setMessage("The promotion adapter decision could not be recorded.");
    }
  }

  return (
    <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Promotion adapter decision</p>
          <h3 className="mt-1 text-base font-bold">Choose the reviewed package pathway</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">This records the intended local, hosted, or hybrid package adapter. It does not assemble a package, select a provider, print QR codes, activate persistence, or enable student use.</p>
        </div>
        <StatusPill label={decision ? decision.selectedAdapter : enabled ? "Operator gate" : "Disabled"} tone={decision ? "success" : "warning"} />
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-sm font-semibold text-[var(--tenant-text)]">
          Package adapter
          <select value={selectedAdapter} onChange={(event) => setSelectedAdapter(event.target.value as UploadQuarantinePromotionAdapter)} disabled={!enabled || state === "submitting"} className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-normal">
            <option value="closed-local-package">Closed-local package</option>
            <option value="hosted-pwa-package">Hosted PWA package</option>
            <option value="hybrid-package">Hybrid local + hosted package</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold text-[var(--tenant-text)]">
          Reviewer ID
          <input value={reviewerId} onChange={(event) => setReviewerId(event.target.value)} disabled={!enabled || state === "submitting"} placeholder="publisher-or-school-reviewer" className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-normal" />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-[var(--tenant-text)]">
          Review note
          <input value={reviewerNote} onChange={(event) => setReviewerNote(event.target.value)} disabled={!enabled || state === "submitting"} placeholder="Why this adapter fits the pilot" className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-normal" />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={recordDecision} disabled={!enabled || !reviewerId.trim() || !reviewerNote.trim() || state === "submitting"} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
          {state === "submitting" ? "Recording adapter..." : "Record adapter for review"}
        </button>
        <span className="text-sm text-[var(--tenant-muted)]" aria-live="polite">{message || (enabled ? "Explicit local promotion-adapter decision gate is enabled." : "Enable LIVING_TEXTBOOOK_PROMOTION_ADAPTER_DECISIONS_ENABLED=true to record this review-only selection.")}</span>
      </div>
      {decision ? <p className="mt-3 text-xs leading-5 text-[var(--tenant-muted)]">Recorded by {decision.reviewerId} on {decision.reviewedAt}. Release, QR print, policy, rollback, hosted writes, and student use remain blocked.</p> : null}
    </section>
  );
}
