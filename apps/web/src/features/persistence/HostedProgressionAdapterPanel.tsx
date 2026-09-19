"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import { readHostedProgressionContinuity, type HostedProgressionReadRequest, type HostedProgressionReadResult } from "./hostedProgressionPersistenceClient";
import { isTeacherOperationsSessionChangeForTenant, TEACHER_OPERATIONS_SESSION_CHANGED } from "./teacherOperationsSessionEvents";

interface HostedProgressionAdapterPanelProps {
  request: HostedProgressionReadRequest;
}

export function HostedProgressionAdapterPanel({ request }: HostedProgressionAdapterPanelProps) {
  const [result, setResult] = useState<HostedProgressionReadResult>();
  const [checking, setChecking] = useState(false);

  const checkReadPath = useCallback(async () => {
    setChecking(true);
    setResult(await readHostedProgressionContinuity(request));
    setChecking(false);
  }, [request]);

  useEffect(() => {
    function handleSessionChange(event: Event) {
      if (isTeacherOperationsSessionChangeForTenant(event, request.tenantId)) void checkReadPath();
    }
    window.addEventListener(TEACHER_OPERATIONS_SESSION_CHANGED, handleSessionChange);
    return () => window.removeEventListener(TEACHER_OPERATIONS_SESSION_CHANGED, handleSessionChange);
  }, [checkReadPath, request.tenantId]);

  const tone = result?.status === "available" ? "success" : result && result.status !== "not-found" ? "warning" : "neutral";
  const label = checking
    ? "Checking"
    : result?.status === "available"
      ? "Available"
      : result?.status === "not-found"
        ? "No record"
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
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Hosted adapter boundary</p>
          <h2 className="mt-1 text-lg font-bold">Read-path rehearsal probe</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Check that the hosted progression endpoint is reachable without writing learner data. This probe is read-only and uses a coded sample identity.
          </p>
        </div>
        <StatusPill label={label} tone={tone} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Provider" value={result?.provider ?? "Not checked"} />
        <Fact label="Durability" value={result?.durability ?? "Non-durable rehearsal"} />
        <Fact label="Write default" value="Blocked" />
        <Fact label="Identity" value={`${request.tenantId} / ${request.launchCode}`} />
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={checkReadPath}
          disabled={checking}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
        >
          {checking ? "Checking adapter" : "Check read path"}
        </button>
        <span className="text-xs font-semibold text-[var(--tenant-muted)]">GET /api/persistence/progression</span>
      </div>

      {result ? (
        <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm" aria-live="polite">
          <p className="font-bold">{result.status === "available" ? "A progression record is available." : result.status === "not-found" ? "No record is available for this coded identity." : result.status === "unauthorized" ? "Tenant-scoped review authorization is required." : result.status === "blocked" ? "Deployment policy blocks this adapter path." : result.status === "unavailable" ? "The persistence provider is temporarily unavailable." : "The adapter response could not be interpreted."}</p>
          {result.durability ? <p className="mt-1 text-[var(--tenant-muted)]">Durability: {result.durability}.</p> : null}
          {result.errors.length > 0 ? <p className="mt-1 text-[var(--tenant-muted)]">{result.errors[0]}</p> : null}
        </div>
      ) : null}
    </Card>
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
