"use client";

import { useState } from "react";
import { Card, StatusPill } from "@living-textbook/ui";
import { readPersistenceOperationsEvidence, type PersistenceOperationsEvidenceResult } from "./persistenceOperationsEvidenceClient";

export function PersistenceOperationsEvidencePanel() {
  const [result, setResult] = useState<PersistenceOperationsEvidenceResult>();
  const [checking, setChecking] = useState(false);

  async function handleCheck() {
    setChecking(true);
    setResult(await readPersistenceOperationsEvidence());
    setChecking(false);
  }

  const label = checking ? "Checking" : result?.status === "available" ? "Available" : result?.status === "rehearsal" ? "Rehearsal" : result ? "Unavailable" : "Not checked";
  const tone = result?.status === "available" ? "success" : result?.status === "unavailable" || result?.status === "error" ? "warning" : "neutral";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Operations evidence</p>
          <h2 className="mt-1 text-lg font-bold">Read-only recovery history</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Review metadata receipts for backup, restore, and retention deletion procedures. This surface cannot start an operation or reveal learner identity.
          </p>
        </div>
        <StatusPill label={label} tone={tone} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCheck}
          disabled={checking}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--tenant-primary)] px-4 py-2 text-sm font-bold text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
        >
          {checking ? "Checking evidence" : "Check operation history"}
        </button>
        <span className="text-xs font-semibold text-[var(--tenant-muted)]">GET /api/persistence/operations</span>
      </div>

      {result ? (
        <div className="mt-4" aria-live="polite">
          {result.records.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-[var(--tenant-border)]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[var(--tenant-primary-soft)] text-xs uppercase text-[var(--tenant-muted)]">
                  <tr>
                    <th className="px-3 py-2">Operation</th>
                    <th className="px-3 py-2">Completed</th>
                    <th className="px-3 py-2">Artifact</th>
                    <th className="px-3 py-2">Scope</th>
                    <th className="px-3 py-2">Deleted</th>
                  </tr>
                </thead>
                <tbody>
                  {result.records.map((record) => (
                    <tr key={record.evidenceId} className="border-t border-[var(--tenant-border)]">
                      <td className="px-3 py-2 font-bold">{record.operation}</td>
                      <td className="px-3 py-2">{record.occurredAt}</td>
                      <td className="px-3 py-2 font-mono text-xs">{record.artifactSha256 ? `${record.artifactSha256.slice(0, 12)}…` : "Metadata only"}</td>
                      <td className="px-3 py-2 font-mono text-xs">{record.scopeDigest ? `${record.scopeDigest.slice(0, 12)}…` : "Database"}</td>
                      <td className="px-3 py-2">{record.deletedRecords ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm font-semibold">No operation receipts are available for this deployment.</p>
          )}
          {result.errors.length > 0 ? <p className="mt-2 text-sm text-[var(--tenant-muted)]">{result.errors[0]}</p> : null}
          <p className="mt-2 text-xs font-semibold text-[var(--tenant-muted)]">No learner records or student identifiers are returned.</p>
        </div>
      ) : null}
    </Card>
  );
}
