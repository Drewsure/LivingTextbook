"use client";

import { useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import { readHostedProgressionContinuity, type HostedProgressionReadRequest, type HostedProgressionReadResult } from "./hostedProgressionPersistenceClient";

interface HostedProgressionAdapterPanelProps {
  request: HostedProgressionReadRequest;
}

export function HostedProgressionAdapterPanel({ request }: HostedProgressionAdapterPanelProps) {
  const [result, setResult] = useState<HostedProgressionReadResult>();
  const [checking, setChecking] = useState(false);

  async function handleCheck() {
    setChecking(true);
    setResult(await readHostedProgressionContinuity(request));
    setChecking(false);
  }

  const tone = result?.status === "available" ? "success" : result?.status === "error" || result?.status === "unauthorized" ? "warning" : "neutral";
  const label = checking ? "Checking" : result?.status === "available" ? "Available" : result?.status === "not-found" ? "No record" : result?.status === "unauthorized" ? "Protected" : result?.status === "error" ? "Unavailable" : "Not checked";

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
          onClick={handleCheck}
          disabled={checking}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
        >
          {checking ? "Checking adapter" : "Check read path"}
        </button>
        <span className="text-xs font-semibold text-[var(--tenant-muted)]">GET /api/persistence/progression</span>
      </div>

      {result ? (
        <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm" aria-live="polite">
          <p className="font-bold">{result.status === "available" ? "A progression record is available." : result.status === "not-found" ? "No record is available for this coded identity." : result.status === "unauthorized" ? "Tenant-scoped review authorization is required." : "The adapter did not respond."}</p>
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
