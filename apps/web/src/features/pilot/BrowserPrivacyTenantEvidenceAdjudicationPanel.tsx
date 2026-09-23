"use client";

import { useEffect, useState } from "react";
import { Button, StatusPill } from "@living-textbook/ui";
import { createBrowserPrivacyTenantEvidenceAdjudication, type BrowserPrivacyTenantEvidenceAdjudication, type BrowserPrivacyTenantEvidenceAdjudicationDecision, type BrowserPrivacyTenantEvidencePacket } from "@living-textbook/content-model";
import { readBrowserPrivacyTenantEvidenceAdjudication, saveBrowserPrivacyTenantEvidenceAdjudication, subscribeToBrowserPrivacyTenantEvidenceAdjudication } from "@/features/persistence/browserPrivacyTenantEvidenceAdjudicationStore";

export function BrowserPrivacyTenantEvidenceAdjudicationPanel({ packet, embedded = false }: { packet: BrowserPrivacyTenantEvidencePacket; embedded?: boolean }) {
  const [adjudication, setAdjudication] = useState<BrowserPrivacyTenantEvidenceAdjudication>();
  const [reviewerRef, setReviewerRef] = useState(`evidence-review:${packet.launchCode}`);
  const [reviewerNote, setReviewerNote] = useState("");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const lookup = { tenantId: packet.tenantId, packageId: packet.packageId, launchCode: packet.launchCode, unitKey: packet.unitKey, studentSessionId: packet.studentSessionId, packetId: packet.packetId, observationId: packet.observationId };

  useEffect(() => {
    setAdjudication(readBrowserPrivacyTenantEvidenceAdjudication(lookup, packet));
    return subscribeToBrowserPrivacyTenantEvidenceAdjudication(lookup, packet, setAdjudication);
  }, [packet.packetId, packet.observationId, packet.tenantId, packet.packageId, packet.launchCode, packet.unitKey, packet.studentSessionId]);

  function record(decision: BrowserPrivacyTenantEvidenceAdjudicationDecision) {
    const note = reviewerNote.trim();
    if (!reviewerRef.trim() || !note) { setError("Add a reviewer reference and a short note before recording the decision."); return; }
    setSaving(true); setError(undefined);
    const result = saveBrowserPrivacyTenantEvidenceAdjudication(createBrowserPrivacyTenantEvidenceAdjudication(packet, { reviewerRole: "teacher", reviewerRef, decision, reviewerNote: note }), packet);
    setSaving(false);
    if (result.errors.length > 0) { setError(result.errors.join(" ")); return; }
    setAdjudication(result.adjudication);
  }

  const allLanesPassed = packet.lanes.every((lane) => lane.status === "passed");
  return (
    <section className={embedded ? "mt-4 border-t border-[var(--tenant-border)] pt-4" : "rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-5"} data-evidence-adjudication="review-only">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Adult packet adjudication</p><h3 className="mt-1 text-base font-bold">Record whether this evidence can proceed</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">Acceptance is available only when all three evidence lanes pass. The decision remains local review evidence and never approves release or student launch.</p></div><StatusPill label={adjudication ? adjudication.decision : allLanesPassed ? "Ready for decision" : "Waiting on lanes"} tone={adjudication?.decision === "accepted-for-next-gate" || allLanesPassed ? "success" : "warning"} /></div>
      {adjudication ? <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><Fact label="Reviewer" value={adjudication.reviewerRef} /><Fact label="Decision time" value={new Date(adjudication.adjudicatedAt).toLocaleString()} /><div className="rounded-lg border border-[var(--tenant-border)] p-3 sm:col-span-2"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Reviewer note</dt><dd className="mt-1 text-sm text-[var(--tenant-text)]">{adjudication.reviewerNote}</dd></div></div> : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold text-[var(--tenant-text)]">Reviewer reference<input value={reviewerRef} onChange={(event) => setReviewerRef(event.target.value)} className="mt-1 w-full rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 font-normal" maxLength={160} /></label><label className="text-sm font-semibold text-[var(--tenant-text)] sm:col-span-2">Reviewer note<textarea value={reviewerNote} onChange={(event) => setReviewerNote(event.target.value)} className="mt-1 min-h-24 w-full rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 font-normal" maxLength={1000} placeholder="Record the evidence decision and the next control gate." /></label></div>
      {error ? <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950" role="alert">{error}</p> : null}
      <div className="mt-4 flex flex-wrap gap-3"><Button type="button" variant="primary" onClick={() => record("accepted-for-next-gate")} disabled={saving || !allLanesPassed}>{saving ? "Recording decision..." : "Accept for next review gate"}</Button><Button type="button" variant="secondary" onClick={() => record("blocked")} disabled={saving}>{saving ? "Recording decision..." : "Record blocked decision"}</Button></div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>; }
