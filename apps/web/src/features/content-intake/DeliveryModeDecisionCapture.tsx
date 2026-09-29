"use client";

import { useState } from "react";
import { StatusPill } from "@living-textbook/ui";
import type { UploadQuarantineDeliveryMode, UploadQuarantineDeliveryModeDecision } from "@living-textbook/content-model";

export function DeliveryModeDecisionCapture({
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
  decision: UploadQuarantineDeliveryModeDecision | null;
  onRecorded: () => void;
}) {
  const [selectedMode, setSelectedMode] = useState<UploadQuarantineDeliveryMode>(decision?.selectedMode ?? "closed-local");
  const [reviewerId, setReviewerId] = useState("");
  const [reviewerNote, setReviewerNote] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "recorded" | "blocked" | "error">("idle");
  const [message, setMessage] = useState("");

  async function recordDecision() {
    setState("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/teacher/uploads/delivery-mode-decision", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, quarantineId, packageId, selectedMode, reviewerId, reviewerNote }),
      });
      const next = (await response.json()) as { status?: string; errors?: string[] };
      if (!response.ok) {
        setState(next.status === "blocked" ? "blocked" : "error");
        setMessage(next.errors?.[0] ?? "The delivery mode decision could not be recorded.");
        return;
      }
      setState("recorded");
      setMessage("Delivery mode recorded for review-only planning. No provider or learner write was enabled.");
      onRecorded();
    } catch {
      setState("error");
      setMessage("The delivery mode decision could not be recorded.");
    }
  }

  return (
    <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Delivery mode decision</p>
          <h3 className="mt-1 text-base font-bold">Choose the pilot shape without activating it</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">This records a publisher or school preference for closed-local, hosted PWA, or hybrid planning. It does not choose a provider, accept policy, write a package, print QR codes, or activate students.</p>
        </div>
        <StatusPill label={decision ? decision.selectedMode : enabled ? "Operator gate" : "Disabled"} tone={decision ? "success" : "warning"} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label className="grid gap-1 text-sm font-semibold text-[var(--tenant-text)]">
          Delivery mode
          <select value={selectedMode} onChange={(event) => setSelectedMode(event.target.value as UploadQuarantineDeliveryMode)} disabled={!enabled || state === "submitting"} className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-normal">
            <option value="closed-local">Closed-local companion</option>
            <option value="hosted-pwa">Hosted PWA</option>
            <option value="hybrid">Hybrid local + hosted</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm font-semibold text-[var(--tenant-text)]">
          Reviewer ID
          <input value={reviewerId} onChange={(event) => setReviewerId(event.target.value)} disabled={!enabled || state === "submitting"} placeholder="publisher-or-school-reviewer" className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-normal" />
        </label>
        <label className="grid gap-1 text-sm font-semibold text-[var(--tenant-text)]">
          Review note
          <input value={reviewerNote} onChange={(event) => setReviewerNote(event.target.value)} disabled={!enabled || state === "submitting"} placeholder="Reason for the selected pilot shape" className="min-h-11 rounded-lg border border-[var(--tenant-border)] bg-white px-3 py-2 text-sm font-normal" />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={recordDecision} disabled={!enabled || !reviewerId.trim() || !reviewerNote.trim() || state === "submitting"} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
          {state === "submitting" ? "Recording mode..." : "Record mode for review"}
        </button>
        <span className="text-sm text-[var(--tenant-muted)]" aria-live="polite">{message || (enabled ? "Explicit local delivery-mode decision gate is enabled." : "Enable LIVING_TEXTBOOOK_DELIVERY_MODE_DECISIONS_ENABLED=true to record this review-only preference.")}</span>
      </div>
      {decision ? <p className="mt-3 text-xs leading-5 text-[var(--tenant-muted)]">Recorded by {decision.reviewerId} on {decision.reviewedAt}. Provider selection, policy acceptance, package assembly, QR print, hosted writes, and student use remain blocked.</p> : null}
    </section>
  );
}
