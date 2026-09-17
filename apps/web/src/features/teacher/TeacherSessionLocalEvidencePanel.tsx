"use client";

import { useEffect, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import { readLocalSessionEvidence, subscribeToLocalSessionEvidence } from "@/features/persistence/localSessionEvidenceStore";
import type { LocalSessionEvidence } from "@/features/persistence/localSessionEvidenceStore";

interface TeacherSessionLocalEvidencePanelProps {
  launchCode: string;
}

export function TeacherSessionLocalEvidencePanel({ launchCode }: TeacherSessionLocalEvidencePanelProps) {
  const [evidence, setEvidence] = useState<LocalSessionEvidence>();

  useEffect(() => {
    setEvidence(readLocalSessionEvidence(launchCode));
    return subscribeToLocalSessionEvidence(launchCode, setEvidence);
  }, [launchCode]);

  const completed = evidence?.progression.completedGameModes.length ?? 0;
  const latestEvent = evidence?.events[evidence.events.length - 1];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Browser rehearsal evidence</p>
          <h2 className="mt-1 text-lg font-bold">Actual student slice from this browser</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This local companion proves the teacher view can receive the student event stream. It contains coded progress only and is not hosted persistence, export, or a classroom record.
          </p>
        </div>
        <StatusPill label={evidence ? "Rehearsal captured" : "Waiting for student"} tone={evidence ? "success" : "neutral"} />
      </div>

      {evidence ? (
        <>
          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-5">
            <EvidenceMetric label="Package" value={evidence.packageId} />
            <EvidenceMetric label="Tenant" value={evidence.tenantId} />
            <EvidenceMetric label="Events" value={String(evidence.events.length)} />
            <EvidenceMetric label="Games complete" value={String(completed)} />
            <EvidenceMetric label="Star Dust" value={String(evidence.progression.earnedStarDust)} />
          </dl>
          <div className="mt-4 grid gap-2 text-sm text-[var(--tenant-muted)] sm:grid-cols-2">
            <p className="rounded-lg border border-[var(--tenant-border)] p-3">
              <span className="font-semibold text-[var(--tenant-text)]">Student session:</span> {evidence.studentSessionId}
            </p>
            <p className="rounded-lg border border-[var(--tenant-border)] p-3">
              <span className="font-semibold text-[var(--tenant-text)]">Latest event:</span> {latestEvent?.type ?? "none"}
            </p>
          </div>
          <p className="mt-4 text-xs leading-5 text-[var(--tenant-muted)]">
            Saved locally at {new Date(evidence.savedAt).toLocaleString()}. A future hosted or packaged adapter must preserve this same shape and pass school policy, privacy, retention, and release gates first.
          </p>
        </>
      ) : (
        <p className="mt-5 rounded-lg border border-dashed border-[var(--tenant-border)] p-4 text-sm text-[var(--tenant-muted)]">
          Complete Flashcard entry practice on the student route, then return here to inspect the captured rehearsal evidence.
        </p>
      )}
    </Card>
  );
}

function EvidenceMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
