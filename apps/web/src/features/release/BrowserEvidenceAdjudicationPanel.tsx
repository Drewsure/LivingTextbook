"use client";

import { useEffect, useState } from "react";
import { Button, Card, StatusPill } from "@living-textbook/ui";
import {
  createBrowserRehearsalObservationAdjudication,
  createBrowserRehearsalObservationHandoff,
  type BrowserRehearsalObservation,
  type BrowserRehearsalObservationAdjudication,
  type BrowserRehearsalObservationAdjudicationDecision,
  type BrowserRehearsalObservationHandoff,
} from "@living-textbook/content-model";
import { readBrowserRehearsalObservation, subscribeToBrowserRehearsalObservation } from "@/features/persistence/browserRehearsalObservationStore";
import {
  readBrowserRehearsalObservationAdjudication,
  saveBrowserRehearsalObservationAdjudication,
  subscribeToBrowserRehearsalObservationAdjudication,
} from "@/features/persistence/browserRehearsalObservationAdjudicationStore";

interface BrowserEvidenceAdjudicationPanelProps {
  tenantId: string;
  packageId: string;
  launchCode: string;
  unitKey: string;
  studentSessionId: string;
  teacherSessionPath: string;
}

export function BrowserEvidenceAdjudicationPanel({
  tenantId,
  packageId,
  launchCode,
  unitKey,
  studentSessionId,
  teacherSessionPath,
}: BrowserEvidenceAdjudicationPanelProps) {
  const [observation, setObservation] = useState<BrowserRehearsalObservation>();
  const [adjudication, setAdjudication] = useState<BrowserRehearsalObservationAdjudication>();
  const [reviewerRef, setReviewerRef] = useState(`release-review:${launchCode}`);
  const [reviewerNote, setReviewerNote] = useState("");
  const [adjudicationError, setAdjudicationError] = useState<string>();
  const [isSavingAdjudication, setIsSavingAdjudication] = useState(false);

  useEffect(() => {
    const lookup = { tenantId, packageId, launchCode, unitKey, studentSessionId };
    setObservation(readBrowserRehearsalObservation(lookup));
    return subscribeToBrowserRehearsalObservation(lookup, setObservation);
  }, [launchCode, packageId, studentSessionId, tenantId, unitKey]);

  const handoff: BrowserRehearsalObservationHandoff | undefined = observation
    ? createBrowserRehearsalObservationHandoff(observation)
    : undefined;

  useEffect(() => {
    if (!handoff) {
      setAdjudication(undefined);
      return;
    }
    const lookup = {
      tenantId,
      packageId,
      launchCode,
      unitKey,
      studentSessionId,
      handoffId: handoff.handoffId,
    };
    setAdjudication(readBrowserRehearsalObservationAdjudication(lookup, handoff));
    return subscribeToBrowserRehearsalObservationAdjudication(lookup, handoff, setAdjudication);
  }, [handoff?.handoffId, launchCode, packageId, studentSessionId, tenantId, unitKey]);

  function recordAdjudication(decision: BrowserRehearsalObservationAdjudicationDecision) {
    if (!handoff) return;
    const note = reviewerNote.trim();
    if (!reviewerRef.trim() || !note) {
      setAdjudicationError("Add a reviewer reference and a short note before recording the decision.");
      return;
    }
    setIsSavingAdjudication(true);
    setAdjudicationError(undefined);
    const result = saveBrowserRehearsalObservationAdjudication(
      createBrowserRehearsalObservationAdjudication(handoff, {
        reviewerRole: "teacher",
        reviewerRef,
        decision,
        reviewerNote: note,
      }),
      handoff,
    );
    setIsSavingAdjudication(false);
    if (result.errors.length > 0) {
      setAdjudicationError(result.errors.join(" "));
      return;
    }
    setAdjudication(result.adjudication);
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Browser evidence adjudication</p>
          <h2 className="mt-1 text-lg font-bold">Release review can inspect the teacher observation lane</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This panel reads only the exact local receipt for this tenant, package, launch, unit, and student session. It never changes release readiness and never creates hosted persistence.
          </p>
        </div>
        <StatusPill label={handoff ? "Handoff available" : "Awaiting observation"} tone={handoff ? "warning" : "neutral"} />
      </div>

      {handoff ? (
        <>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
            <Fact label="Tenant" value={handoff.tenantId} />
            <Fact label="Package" value={handoff.packageId} />
            <Fact label="Observation" value={handoff.sourceObservationId} />
            <Fact label="Routes" value={String(handoff.routePaths.length)} />
            <Fact label="Checks" value={String(handoff.checkIds.length)} />
          </dl>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <List title="Blocked actions" values={handoff.blockedActions} />
            <List title="Next adjudication gate" values={handoff.nextGate} />
          </div>
          <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4" data-browser-adjudication="review-only">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Adult adjudication record</p>
                <h3 className="mt-1 text-base font-bold">Record the next review decision</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
                  This local record says whether the evidence may proceed to the next review gate. It is not release approval, does not write hosted persistence, and cannot launch students.
                </p>
              </div>
              <StatusPill label={adjudication ? adjudication.decision : "Not recorded"} tone={adjudication?.decision === "accepted-for-next-gate" ? "success" : adjudication ? "warning" : "neutral"} />
            </div>
            {adjudication ? (
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <Fact label="Reviewer" value={adjudication.reviewerRef} />
                <Fact label="Decision time" value={new Date(adjudication.adjudicatedAt).toLocaleString()} />
                <div className="rounded-lg border border-[var(--tenant-border)] p-3 sm:col-span-2">
                  <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Reviewer note</dt>
                  <dd className="mt-1 text-sm text-[var(--tenant-text)]">{adjudication.reviewerNote}</dd>
                </div>
              </div>
            ) : null}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold text-[var(--tenant-text)]">
                Reviewer reference
                <input value={reviewerRef} onChange={(event) => setReviewerRef(event.target.value)} className="mt-1 w-full rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 font-normal" maxLength={160} />
              </label>
              <label className="text-sm font-semibold text-[var(--tenant-text)] sm:col-span-2">
                Reviewer note
                <textarea value={reviewerNote} onChange={(event) => setReviewerNote(event.target.value)} className="mt-1 min-h-24 w-full rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] px-3 py-2 font-normal" maxLength={1000} placeholder="Record what was observed and what must happen next." />
              </label>
            </div>
            {adjudicationError ? <p className="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950" role="alert">{adjudicationError}</p> : null}
            <div className="mt-4 flex flex-wrap gap-3">
              <Button type="button" variant="primary" onClick={() => recordAdjudication("accepted-for-next-gate")} disabled={isSavingAdjudication}>
                {isSavingAdjudication ? "Recording decision..." : "Accept for next review gate"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => recordAdjudication("blocked")} disabled={isSavingAdjudication}>
                Record blocked decision
              </Button>
            </div>
          </section>
        </>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-[var(--tenant-border)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
          <p>No local teacher observation is available for this exact release-review scope.</p>
          <a href={teacherSessionPath} className="mt-2 inline-block font-semibold text-[var(--tenant-primary)] underline decoration-[var(--tenant-accent)] decoration-2 underline-offset-4">
            Open the teacher session observation surface
          </a>
        </div>
      )}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>;
}

function List({ title, values }: { title: string; values: string[] }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3><ul className="mt-2 grid gap-1 text-xs leading-5 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
