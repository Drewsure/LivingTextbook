"use client";

import { useEffect, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import {
  createBrowserRehearsalObservationHandoff,
  createBrowserRehearsalObservationPilotBinding,
  type BrowserRehearsalObservation,
  type BrowserRehearsalObservationAdjudication,
  type BrowserRehearsalObservationPilotBinding,
  type PilotReviewDecision,
} from "@living-textbook/content-model";
import { readBrowserRehearsalObservation, subscribeToBrowserRehearsalObservation } from "@/features/persistence/browserRehearsalObservationStore";
import {
  readBrowserRehearsalObservationAdjudication,
  subscribeToBrowserRehearsalObservationAdjudication,
} from "@/features/persistence/browserRehearsalObservationAdjudicationStore";

interface BrowserObservationPilotBindingPanelProps {
  pilotDecision: PilotReviewDecision;
  tenantId: string;
  packageId: string;
  launchCode: string;
  unitKey: string;
  studentSessionId: string;
}

export function BrowserObservationPilotBindingPanel({
  pilotDecision,
  tenantId,
  packageId,
  launchCode,
  unitKey,
  studentSessionId,
}: BrowserObservationPilotBindingPanelProps) {
  const [observation, setObservation] = useState<BrowserRehearsalObservation>();
  const [adjudication, setAdjudication] = useState<BrowserRehearsalObservationAdjudication>();

  useEffect(() => {
    const lookup = { tenantId, packageId, launchCode, unitKey, studentSessionId };
    setObservation(readBrowserRehearsalObservation(lookup));
    return subscribeToBrowserRehearsalObservation(lookup, setObservation);
  }, [launchCode, packageId, studentSessionId, tenantId, unitKey]);

  const handoff = observation ? createBrowserRehearsalObservationHandoff(observation) : undefined;

  useEffect(() => {
    if (!handoff) {
      setAdjudication(undefined);
      return;
    }
    const lookup = { tenantId, packageId, launchCode, unitKey, studentSessionId, handoffId: handoff.handoffId };
    setAdjudication(readBrowserRehearsalObservationAdjudication(lookup, handoff));
    return subscribeToBrowserRehearsalObservationAdjudication(lookup, handoff, setAdjudication);
  }, [handoff?.handoffId, launchCode, packageId, studentSessionId, tenantId, unitKey]);

  const binding: BrowserRehearsalObservationPilotBinding = createBrowserRehearsalObservationPilotBinding(
    handoff ?? createPendingHandoff(tenantId, packageId, launchCode, unitKey, studentSessionId),
    pilotDecision,
    adjudication,
  );

  const tone = binding.status === "accepted-for-pilot-review" ? "success" : "warning";
  const label = binding.status === "accepted-for-pilot-review"
    ? "Evidence accepted for pilot review"
    : binding.status === "blocked-by-adjudication"
      ? "Evidence blocked"
      : "Awaiting adult adjudication";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Observation-to-pilot decision binding</p>
          <h2 className="mt-1 text-xl font-bold">Pilot review sees the same evidence decision</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-[var(--tenant-muted)]">
            This panel reconciles the exact browser handoff with the canonical pilot decision. It can clarify the next review gate, but it never turns an observation into pilot approval or classroom launch.
          </p>
        </div>
        <StatusPill label={label} tone={tone} />
      </div>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Binding" value={binding.bindingId} />
        <Fact label="Pilot decision" value={binding.pilotDecisionId} />
        <Fact label="Adjudication" value={binding.adjudicationId} />
        <Fact label="Pilot launch" value="Blocked" />
      </dl>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <List title="Pilot blockers" values={binding.blockedReasons} />
        <List title="Next gate" values={binding.nextGate} />
      </div>
    </Card>
  );
}

function createPendingHandoff(tenantId: string, packageId: string, launchCode: string, unitKey: string, studentSessionId: string) {
  return {
    version: 1 as const,
    handoffId: "pending-browser-observation-handoff",
    handoffKind: "browser-observation-review" as const,
    sourceObservationId: "pending-browser-observation",
    tenantId,
    packageId,
    launchCode,
    unitKey,
    studentSessionId,
    routePaths: ["/teacher/pilot"],
    checkIds: ["browser-observation-pending"],
    status: "review-only" as const,
    reviewDestination: "adult-evidence-review" as const,
    exportAllowed: false as const,
    releasePromotionAllowed: false as const,
    studentProductionLaunchAllowed: false as const,
    blockedActions: ["No evidence export"],
    nextGate: ["Record adult observation adjudication"],
  };
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></div>;
}

function List({ title, values }: { title: string; values: string[] }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3"><h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3><ul className="mt-2 grid gap-1 text-xs leading-5 text-[var(--tenant-muted)]">{values.map((value, index) => <li key={`${title}-${index}-${value}`}>{value}</li>)}</ul></section>;
}
