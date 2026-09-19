"use client";

import { useEffect, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import type { GameModeId } from "@living-textbook/content-model";
import { readLocalSessionEvidence, subscribeToLocalSessionEvidence } from "@/features/persistence/localSessionEvidenceStore";
import type { LocalSessionEvidence } from "@/features/persistence/localSessionEvidenceStore";
import { formatMode } from "@/lib/formatLabels";
import { createPilotSessionEvidenceEnvelope } from "@/features/persistence/pilotSessionEvidenceEnvelope";
import { evaluatePilotSessionPreflight } from "@/features/persistence/pilotSessionPreflight";
import { readPersistenceStatus, type PersistenceStatusResult } from "@/features/persistence/persistenceStatusClient";

interface TeacherSessionLocalEvidencePanelProps {
  launchCode: string;
  expectedTenantId: string;
  expectedPackageId: string;
  expectedStudentSessionId: string;
  targetLanguage: string;
}

export function TeacherSessionLocalEvidencePanel({
  launchCode,
  expectedTenantId,
  expectedPackageId,
  expectedStudentSessionId,
  targetLanguage,
}: TeacherSessionLocalEvidencePanelProps) {
  const [evidence, setEvidence] = useState<LocalSessionEvidence>();
  const [bindingErrors, setBindingErrors] = useState<string[]>([]);
  const [persistenceReadiness, setPersistenceReadiness] = useState<PersistenceStatusResult>();

  useEffect(() => {
    function readBoundEvidence() {
      const nextEvidence = readLocalSessionEvidence(launchCode);
      if (!nextEvidence) {
        setEvidence(undefined);
        setBindingErrors([]);
        return;
      }

      const errors = [
        nextEvidence.tenantId === expectedTenantId ? undefined : "Tenant identity does not match this teacher session.",
        nextEvidence.packageId === expectedPackageId ? undefined : "Content package does not match this teacher session.",
        nextEvidence.studentSessionId === expectedStudentSessionId ? undefined : "Student session identity does not match this teacher session.",
      ].filter((error): error is string => Boolean(error));
      setBindingErrors(errors);
      setEvidence(errors.length === 0 ? nextEvidence : undefined);
    }

    readBoundEvidence();
    return subscribeToLocalSessionEvidence(launchCode, readBoundEvidence);
  }, [expectedPackageId, expectedStudentSessionId, expectedTenantId, launchCode]);

  useEffect(() => {
    let active = true;
    setPersistenceReadiness(undefined);
    const refreshPersistenceReadiness = () => {
      void readPersistenceStatus(expectedTenantId).then((result) => {
        if (active) setPersistenceReadiness(result);
      });
    };
    refreshPersistenceReadiness();
    const refreshHandle = window.setInterval(refreshPersistenceReadiness, 60_000);
    return () => {
      active = false;
      window.clearInterval(refreshHandle);
    };
  }, [expectedTenantId]);

  const completed = evidence?.progression.completedGameModes.length ?? 0;
  const latestEvent = evidence?.events[evidence.events.length - 1];
  const activityModes = evidence ? getObservedActivityModes(evidence) : [];
  const evidenceEnvelope = evidence ? createPilotSessionEvidenceEnvelope({ evidence, targetLanguage }) : undefined;
  const pilotPreflight = evidenceEnvelope ? evaluatePilotSessionPreflight(evidenceEnvelope, persistenceReadiness) : undefined;

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

      {bindingErrors.length > 0 ? (
        <aside className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950" aria-live="polite">
          <p className="font-bold">Evidence is not bound to this session</p>
          <p className="mt-1">The local record is hidden until its tenant, package, and student-session identities match.</p>
          <ul className="mt-2 grid gap-1">
            {bindingErrors.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </aside>
      ) : evidence ? (
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
          {evidenceEnvelope ? (
            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4" data-evidence-envelope="pilot-session">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Pilot evidence envelope</p>
                  <h3 className="mt-1 text-base font-bold">One coherent session packet</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
                    This provider-neutral summary is derived from the validated browser record. It is safe for rehearsal review and excludes raw learner audio, transcripts, support-language progress, durable writes, and live classroom status.
                  </p>
                </div>
                <StatusPill label={evidenceEnvelope.journeyStatus === "complete" ? "Journey complete" : "Journey in progress"} tone={evidenceEnvelope.journeyStatus === "complete" ? "success" : "warning"} />
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                <EvidenceMetric label="Target language" value={evidenceEnvelope.targetLanguage} />
                <EvidenceMetric label="Envelope events" value={String(evidenceEnvelope.eventCount)} />
                <EvidenceMetric label="Journey stages" value={`${evidenceEnvelope.stages.filter((stage) => stage.status === "complete").length}/${evidenceEnvelope.stages.length}`} />
              </dl>
              {pilotPreflight ? (
                <div className="mt-4 border-t border-[var(--tenant-border)] pt-4" data-pilot-preflight="review-only">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Controlled pilot preflight</p>
                      <h4 className="mt-1 text-sm font-bold">Review readiness, not launch approval</h4>
                    </div>
                    <StatusPill label={pilotPreflight.status === "ready-for-review" ? "Ready for review" : pilotPreflight.status === "invalid" ? "Invalid evidence" : "Incomplete"} tone={pilotPreflight.status === "ready-for-review" ? "success" : "warning"} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{pilotPreflight.summary}</p>
                  <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                    {pilotPreflight.checks.map((check) => (
                      <li key={check.checkId} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold text-[var(--tenant-text)]">{check.label}</span>
                          <StatusPill label={check.status} tone={check.status === "pass" ? "success" : "warning"} />
                        </div>
                        <p className="mt-1 text-xs leading-5 text-[var(--tenant-muted)]">{check.detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}
          <section className="mt-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[var(--tenant-muted)]">Cross-route journey</p>
                <h3 className="mt-1 text-lg font-bold">Observed canonical activity evidence</h3>
              </div>
              <StatusPill label={`${activityModes.length} route${activityModes.length === 1 ? "" : "s"}`} tone={activityModes.length > 0 ? "success" : "neutral"} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
              {activityModes.length > 0
                ? activityModes.map((mode) => formatMode(mode)).join(" / ")
                : "No canonical activity events have been captured yet."}
            </p>
            {activityModes.length > 0 ? (
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {activityModes.map((mode) => (
                  <ActivityEvidenceCard key={mode} mode={mode} evidence={evidence} />
                ))}
              </div>
            ) : null}
          </section>
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

function getObservedActivityModes(evidence: LocalSessionEvidence): string[] {
  const modes = new Set<string>();
  for (const event of evidence.events) modes.add(event.gameMode);
  for (const mode of evidence.progression.completedGameModes) modes.add(mode);
  return [...modes];
}

function ActivityEvidenceCard({ mode, evidence }: { mode: string; evidence: LocalSessionEvidence }) {
  const events = evidence.events.filter((event) => event.gameMode === mode);
  const started = events.filter((event) => event.type === "game_started").length;
  const completed = events.filter((event) => event.type === "game_completed").length;
  const mastery = events.filter((event) => event.type === "mastery_updated").length;
  const answers = events.filter((event) => event.type === "answer_result").length;
  const audio = events.filter((event) => event.type === "audio_requested").length;
  const progressionComplete = evidence.progression.completedGameModes.includes(mode as GameModeId);

  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="text-sm font-bold">{formatMode(mode)}</h4>
        <StatusPill label={progressionComplete || completed > 0 ? "Complete" : "Observed"} tone={progressionComplete || completed > 0 ? "success" : "neutral"} />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--tenant-muted)]">
        <EvidenceFact label="Started" value={String(started)} />
        <EvidenceFact label="Answers" value={String(answers)} />
        <EvidenceFact label="Complete" value={String(completed)} />
        <EvidenceFact label="Mastery" value={String(mastery)} />
      </dl>
      <p className="mt-3 text-xs leading-5 text-[var(--tenant-muted)]">Learning audio requests: {audio}. Audio is support evidence only.</p>
    </section>
  );
}

function EvidenceFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
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
