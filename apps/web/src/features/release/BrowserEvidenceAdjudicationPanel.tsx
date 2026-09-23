"use client";

import { useEffect, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import { createBrowserRehearsalObservationHandoff, type BrowserRehearsalObservation, type BrowserRehearsalObservationHandoff } from "@living-textbook/content-model";
import { readBrowserRehearsalObservation, subscribeToBrowserRehearsalObservation } from "@/features/persistence/browserRehearsalObservationStore";

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

  useEffect(() => {
    const lookup = { tenantId, packageId, launchCode, unitKey, studentSessionId };
    setObservation(readBrowserRehearsalObservation(lookup));
    return subscribeToBrowserRehearsalObservation(lookup, setObservation);
  }, [launchCode, packageId, studentSessionId, tenantId, unitKey]);

  const handoff: BrowserRehearsalObservationHandoff | undefined = observation
    ? createBrowserRehearsalObservationHandoff(observation)
    : undefined;

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
