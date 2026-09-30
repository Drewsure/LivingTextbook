"use client";

import { useState } from "react";
import { Button, Card, StatusPill } from "@living-textbook/ui";
import type { PublisherSourceToPackageEvidenceBridge } from "@living-textbook/content-model";

type BindingResponse = {
  status?: "review-only" | "not-found" | "unauthorized" | "rejected";
  tenantId?: string;
  quarantineId?: string;
  packageId?: string;
  bridge?: PublisherSourceToPackageEvidenceBridge | null;
  errors?: string[];
  privacy?: string;
};

export function LiveSourcePackageEvidenceBindingPanel({
  tenantId,
  quarantineId,
  packageId,
}: {
  tenantId: string;
  quarantineId: string;
  packageId?: string;
}) {
  const [state, setState] = useState<"idle" | "loading" | "loaded" | "error">("idle");
  const [response, setResponse] = useState<BindingResponse | null>(null);

  async function loadBinding() {
    setState("loading");
    try {
      const query = new URLSearchParams({ tenantId, quarantineId });
      if (packageId) query.set("packageId", packageId);
      const result = await fetch(`/api/teacher/uploads/source-package-evidence-binding?${query.toString()}`, {
        credentials: "same-origin",
        cache: "no-store",
      });
      const payload = (await result.json()) as BindingResponse;
      setResponse(payload);
      setState(result.ok ? "loaded" : "error");
    } catch {
      setResponse({ status: "error" as BindingResponse["status"], errors: ["The live evidence binding could not be loaded. Retry from the authorized review session."] });
      setState("error");
    }
  }

  const bridge = response?.bridge ?? null;
  const statusLabel = state === "loaded" ? "Review metadata loaded" : state === "error" ? "Review read failed" : "Not loaded";
  const statusTone = state === "loaded" ? "success" : "warning";

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Live source-to-package evidence</p>
          <h2 className="mt-1 text-lg font-bold">Load the current quarantine binding</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This reads the authorized, bounded evidence projection for the quarantine record. It is a review aid only: it does not approve the source, assemble a package, print QR codes, activate persistence, or open student access.
          </p>
        </div>
        <StatusPill label={statusLabel} tone={statusTone} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
        <Fact label="Tenant" value={tenantId} />
        <Fact label="Quarantine" value={quarantineId} />
        <Fact label="Package" value={packageId ?? "Derived by server"} />
      </dl>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" onClick={loadBinding} disabled={state === "loading"}>
          {state === "loading" ? "Loading review metadata..." : "Load live binding"}
        </Button>
        <span className="text-sm text-[var(--tenant-muted)]" aria-live="polite">
          {response?.status ? `Response: ${response.status}` : "No live read has been requested."}
        </span>
      </div>

      {response?.errors?.length ? (
        <ul className="mt-4 grid gap-2 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
          {response.errors.map((error, index) => <li key={`${index}-${error}`}>{error}</li>)}
        </ul>
      ) : null}

      {bridge ? (
        <>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Fact label="Unit" value={bridge.unitKey} />
            <Fact label="Source review" value={bridge.sourceReviewId} />
            <Fact label="Source checksum" value={bridge.sourceChecksum} />
            <Fact label="Open evidence gaps" value={String(bridge.missingEvidence.length)} />
          </div>
          {bridge.preflightReference ? (
            <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <h3 className="text-sm font-bold text-[var(--tenant-text)]">Publisher source preflight attached</h3>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                <Fact label="Report" value={bridge.preflightReference.reportId} />
                <Fact label="Manifest" value={bridge.preflightReference.manifestId} />
                <Fact label="Manifest checksum" value={bridge.preflightReference.manifestChecksumSha256} />
                <Fact label="Inventory checksum" value={bridge.preflightReference.inventoryChecksumSha256} />
              </dl>
              <p className="mt-3 text-xs leading-5 text-[var(--tenant-muted)]">This is immutable review evidence only. It does not approve the source or unlock package assembly.</p>
            </section>
          ) : (
            <p className="mt-5 rounded-lg border border-[var(--tenant-border)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">No durable publisher source preflight evidence is attached to this quarantine record yet.</p>
          )}
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {bridge.evidenceLanes.map((lane) => (
              <section key={lane.laneId} className="rounded-lg border border-[var(--tenant-border)] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h3>
                  <StatusPill label={lane.status} tone={lane.status === "present" ? "success" : "warning"} />
                </div>
                <p className="mt-2 break-words font-mono text-xs text-[var(--tenant-muted)]">{lane.identity}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{lane.details}</p>
                <p className="mt-2 text-xs font-semibold leading-5 text-[var(--tenant-muted)]">Next: {lane.nextAction}</p>
              </section>
            ))}
          </div>
          <p className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
            {response?.privacy ?? "Bounded review metadata only. Protected actions remain blocked."}
          </p>
        </>
      ) : null}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <section className="rounded-lg border border-[var(--tenant-border)] p-3"><dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd></section>;
}
