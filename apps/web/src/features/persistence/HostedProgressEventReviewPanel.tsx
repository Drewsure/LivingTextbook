"use client";

import { useCallback, useEffect, useState } from "react";
import type { TeacherLaunchReportAggregation } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";
import { readHostedProgressEventStreams, type HostedProgressEventReviewRequest, type HostedProgressEventReviewResult } from "./hostedProgressionPersistenceClient";
import { isTeacherOperationsSessionChangeForTenant, TEACHER_OPERATIONS_SESSION_CHANGED } from "./teacherOperationsSessionEvents";

interface HostedProgressEventReviewPanelProps {
  request: HostedProgressEventReviewRequest;
}

export function HostedProgressEventReviewPanel({ request }: HostedProgressEventReviewPanelProps) {
  const [result, setResult] = useState<HostedProgressEventReviewResult>();
  const [checking, setChecking] = useState(false);

  const checkReviewPath = useCallback(async () => {
    setChecking(true);
    setResult(await readHostedProgressEventStreams(request));
    setChecking(false);
  }, [request]);

  useEffect(() => {
    function handleSessionChange(event: Event) {
      if (isTeacherOperationsSessionChangeForTenant(event, request.tenantId)) void checkReviewPath();
    }
    window.addEventListener(TEACHER_OPERATIONS_SESSION_CHANGED, handleSessionChange);
    return () => window.removeEventListener(TEACHER_OPERATIONS_SESSION_CHANGED, handleSessionChange);
  }, [checkReviewPath, request.tenantId]);

  const tone = result?.status === "available" && result.report && result.report.streamCount > 0
    ? "success"
    : result && result.status !== "available"
      ? "warning"
      : "neutral";
  const label = checking
    ? "Checking"
    : result?.status === "available"
      ? `${result.report?.learnerCount ?? 0} learner${result.report?.learnerCount === 1 ? "" : "s"}`
      : result?.status === "unauthorized"
        ? "Protected"
        : result?.status === "blocked"
          ? "Blocked"
          : result?.status === "unavailable"
            ? "Unavailable"
            : result?.status === "error"
              ? "Error"
              : "Not checked";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Hosted event review boundary</p>
          <h2 className="mt-1 text-lg font-bold">Launch-scoped class evidence</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Read-only teacher review for this launch. Only validated pseudonymous stream summaries are shown; raw audio, transcripts, and unrestricted tenant queries are excluded.
          </p>
        </div>
        <StatusPill label={label} tone={tone} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Scope" value={request.launchCode} />
        <Fact label="Provider" value={result?.provider ?? "Not checked"} />
        <Fact label="Durability" value={result?.durability ?? "Not checked"} />
        <Fact label="Learners" value={result?.report ? String(result.report.learnerCount) : "Not checked"} />
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={checkReviewPath}
          disabled={checking}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
        >
          {checking ? "Checking review" : "Check launch review"}
        </button>
        <span className="text-xs font-semibold text-[var(--tenant-muted)]">GET /api/persistence/events</span>
      </div>

      {result ? (
        <div className="mt-4" aria-live="polite">
          {result.status !== "available" ? (
            <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm">
              <p className="font-bold">{result.status === "unauthorized" ? "Teacher review authorization is required." : result.status === "blocked" ? "Deployment policy blocks this review path." : result.status === "unavailable" ? "The event review provider is temporarily unavailable." : "The review response could not be interpreted."}</p>
              {result.errors[0] ? <p className="mt-1 text-[var(--tenant-muted)]">{result.errors[0]}</p> : null}
            </div>
          ) : !result.report || result.report.streamCount === 0 ? (
            <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm">
              <p className="font-bold">No validated event streams are stored for this launch.</p>
              <p className="mt-1 text-[var(--tenant-muted)]">This is an empty review result, not evidence that a learner failed to participate.</p>
            </div>
          ) : (
            <LaunchReportSummary report={result.report} />
          )}
        </div>
      ) : null}
    </Card>
  );
}

function LaunchReportSummary({ report }: { report: TeacherLaunchReportAggregation }) {
  return (
    <div className="space-y-4">
      <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <Fact label="Evidence events" value={String(report.eventCount)} />
        <Fact label="Learning evidence" value={String(report.progressEventCount)} />
        <Fact label="Support-only" value={String(report.supportEventCount)} />
        <Fact label="Completions" value={String(report.completedGames)} />
        <Fact label="Mastery updates" value={String(report.masteryUpdates)} />
        <Fact label="Star Dust" value={String(report.earnedStarDust)} />
      </dl>
      <div className="grid gap-3 lg:grid-cols-2">
        {report.learnerSummaries.map((learner) => (
          <section key={learner.learnerSlot} className="rounded-lg border border-[var(--tenant-border)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Pseudonymous learner slot</p>
                <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{learner.learnerSlot}</h3>
              </div>
              <StatusPill label={learner.completedGames > 0 ? "Completion evidence" : "In progress evidence"} tone={learner.completedGames > 0 ? "success" : "neutral"} />
            </div>
            <dl className="mt-3 grid gap-2 text-xs text-[var(--tenant-muted)] sm:grid-cols-3">
              <Fact label="Streams" value={String(learner.streamCount)} />
              <Fact label="Events" value={String(learner.eventCount)} />
              <Fact label="Star Dust" value={String(learner.earnedStarDust)} />
            </dl>
            <p className="mt-3 text-xs leading-5 text-[var(--tenant-muted)]">Modes: {learner.gameModes.join(", ") || "None reported"}</p>
          </section>
        ))}
      </div>
      <p className="text-xs leading-5 text-[var(--tenant-muted)]">Report-only aggregation. Excludes {report.excludedFields.join(", ")} and does not authorize export or live classroom use.</p>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
