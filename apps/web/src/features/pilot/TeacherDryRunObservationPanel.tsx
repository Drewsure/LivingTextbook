"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, StatusPill } from "@living-textbook/ui";
import {
  createBrowserRehearsalObservationHandoff,
  type BrowserRehearsalObservation,
  type BrowserRehearsalObservationHandoff,
} from "@living-textbook/content-model";
import {
  createHumanObservedBrowserRehearsalObservation,
  readBrowserRehearsalObservation,
  saveBrowserRehearsalObservation,
  subscribeToBrowserRehearsalObservation,
} from "@/features/persistence/browserRehearsalObservationStore";
import { formatStableTimestamp } from "@/lib/formatStableTimestamp";
import type { TeacherDryRunRehearsal } from "@/data/sampleTeacherDryRunRehearsal";

interface TeacherDryRunObservationPanelProps {
  rehearsal: TeacherDryRunRehearsal;
}

export function TeacherDryRunObservationPanel({ rehearsal }: TeacherDryRunObservationPanelProps) {
  const lookup = useMemo(() => ({
    tenantId: rehearsal.tenantId,
    packageId: rehearsal.packageId,
    launchCode: rehearsal.launchCode,
    unitKey: rehearsal.unitKey,
    studentSessionId: rehearsal.syntheticStudentSessionId,
  }), [rehearsal.launchCode, rehearsal.packageId, rehearsal.syntheticStudentSessionId, rehearsal.tenantId, rehearsal.unitKey]);
  const [observation, setObservation] = useState<BrowserRehearsalObservation>();
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>();
  const observationHandoff: BrowserRehearsalObservationHandoff | undefined = observation
    ? createBrowserRehearsalObservationHandoff(observation)
    : undefined;

  useEffect(() => {
    setObservation(readBrowserRehearsalObservation(lookup));
    return subscribeToBrowserRehearsalObservation(lookup, setObservation);
  }, [lookup]);

  function recordDryRunObservation() {
    if (typeof window === "undefined") return;
    setIsRecording(true);
    setError(undefined);
    const result = saveBrowserRehearsalObservation(createHumanObservedBrowserRehearsalObservation({
      ...lookup,
      reviewerRef: `teacher-dry-run:${rehearsal.rehearsalId}`,
      routePaths: ["/teacher/dry-run/" + rehearsal.rehearsalId, ...rehearsal.stages.map((stage) => stage.routePath)],
      checkIds: [
        "teacher-dry-run-scope",
        "synthetic-session-only",
        "no-learner-data",
        "no-hosted-persistence",
        "no-report-export",
        ...rehearsal.stages.map((stage) => `dry-run-stage:${stage.stageId}`),
      ],
    }));
    setIsRecording(false);
    if (result.errors.length > 0) {
      setError(result.errors.join(" "));
      return;
    }
    setObservation(result.observation);
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Local teacher evidence</p>
          <h2 className="mt-1 text-lg font-bold">Record the dry-run handoff</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This receipt records that a teacher reviewed the rehearsal routes in this browser. It uses a synthetic session identity and never represents a learner, classroom record, hosted write, export, or approval.
          </p>
        </div>
        <StatusPill label={observation ? "Recorded locally" : "Not recorded"} tone={observation ? "success" : "neutral"} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <EvidenceMetric label="Tenant" value={rehearsal.tenantId} />
        <EvidenceMetric label="Package" value={rehearsal.packageId} />
        <EvidenceMetric label="Session" value={rehearsal.syntheticStudentSessionId} />
        <EvidenceMetric label="Routes" value={String(rehearsal.stages.length + 1)} />
      </dl>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <BoundaryFact label="Storage" value="Browser-local only" />
        <BoundaryFact label="Learner data" value="Explicitly excluded" />
        <BoundaryFact label="Next gate" value="Adult review" />
      </div>

      {observation ? (
        <div className="mt-4 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-950" data-dry-run-observation="recorded">
          <p className="font-bold">Teacher observation receipt recorded</p>
          <p className="mt-1">Observed {formatStableTimestamp(observation.observedAt)} across {observation.routePaths.length} routes and {observation.checkIds.length} review checks.</p>
          <p className="mt-1 font-semibold">Release promotion and student production launch remain disabled.</p>
        </div>
      ) : null}
      {observationHandoff ? (
        <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4" data-dry-run-observation-handoff="review-only">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Adult evidence handoff</p>
              <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">Receipt prepared for adjudication</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
                This handoff carries the exact dry-run scope to adult review. It is not an export, approval, release mutation, or student launch action.
              </p>
            </div>
            <StatusPill label={observationHandoff.reviewDestination} tone="warning" />
          </div>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <EvidenceMetric label="Handoff" value={observationHandoff.handoffId} />
            <EvidenceMetric label="Routes" value={String(observationHandoff.routePaths.length)} />
            <EvidenceMetric label="Checks" value={String(observationHandoff.checkIds.length)} />
          </dl>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <BoundaryList title="Blocked actions" items={observationHandoff.blockedActions} />
            <BoundaryList title="Next gate" items={observationHandoff.nextGate} />
          </div>
        </section>
      ) : null}
      {error ? <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950" role="alert">{error}</p> : null}

      <Button type="button" variant={observation ? "secondary" : "primary"} className="mt-4" onClick={recordDryRunObservation} disabled={isRecording}>
        {isRecording ? "Recording dry-run receipt..." : observation ? "Record updated dry-run receipt" : "Record teacher dry-run receipt"}
      </Button>
    </Card>
  );
}

function EvidenceMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 break-words font-semibold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}

function BoundaryFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 font-semibold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}

function BoundaryList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone="warning" />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}
      </ul>
    </section>
  );
}
