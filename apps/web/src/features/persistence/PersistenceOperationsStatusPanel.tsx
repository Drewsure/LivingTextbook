"use client";

import { useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import { readPersistenceStatus, type PersistenceStatusResult } from "./persistenceStatusClient";

export function PersistenceOperationsStatusPanel() {
  const [result, setResult] = useState<PersistenceStatusResult>();
  const [checking, setChecking] = useState(false);

  async function handleCheck() {
    setChecking(true);
    setResult(await readPersistenceStatus());
    setChecking(false);
  }

  const tone = result?.status === "healthy" ? "success" : result?.status === "blocked" || result?.status === "error" ? "warning" : "neutral";
  const label = checking ? "Checking" : result?.status === "healthy" ? "Healthy" : result?.status === "blocked" ? "Blocked" : result?.status === "rehearsal" ? "Rehearsal" : result ? "Unavailable" : "Not checked";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Closed-pilot operations</p>
          <h2 className="mt-1 text-lg font-bold">Teacher-safe persistence status</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This status check confirms the storage boundary and policy gates without showing learner records or enabling backup, restore, deletion, or export controls in the browser.
          </p>
        </div>
        <StatusPill label={label} tone={tone} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Provider" value={result?.provider ?? "Not checked"} />
        <Fact label="Durability" value={result?.durability ?? "Not checked"} />
        <Fact label="Session boundary" value={result ? (result.studentSessionBoundaryConfigured ? "Configured" : "Missing") : "Not checked"} />
        <Fact label="Retention" value={result?.operations?.retentionDays ? `${result.operations.retentionDays} days` : "Policy required"} />
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCheck}
          disabled={checking}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
        >
          {checking ? "Checking status" : "Check storage status"}
        </button>
        <span className="text-xs font-semibold text-[var(--tenant-muted)]">GET /api/persistence/status</span>
      </div>

      {result ? (
        <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm" aria-live="polite">
          <p className="font-bold">{result.status === "healthy" ? "The pilot storage boundary is healthy." : result.status === "rehearsal" ? "The deployment is using non-durable rehearsal storage." : "The pilot storage boundary is not ready for operations."}</p>
          {result.operations?.ready ? <p className="mt-1 text-[var(--tenant-muted)]">Backup, restore, and deletion evidence may run only through the gated server-side operations procedure.</p> : null}
          {result.errors.length > 0 ? <p className="mt-1 text-[var(--tenant-muted)]">{result.errors[0]}</p> : null}
          {result.operations?.errors.length ? <p className="mt-1 text-[var(--tenant-muted)]">{result.operations.errors[0]}</p> : null}
          <p className="mt-2 text-xs font-semibold text-[var(--tenant-muted)]">No learner records or sensitive media are returned by this check.</p>
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
