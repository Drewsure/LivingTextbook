import type { LocalBundleProviderApprovalPacket } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

interface LocalBundleProviderApprovalPanelProps {
  packet: LocalBundleProviderApprovalPacket;
  errors: string[];
}

const checkTone = { passed: "success", open: "warning", blocked: "warning" } as const;

export function LocalBundleProviderApprovalPanel({ packet, errors }: LocalBundleProviderApprovalPanelProps) {
  const valid = errors.length === 0;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Provider approval evidence</p>
          <h2 className="mt-1 text-lg font-bold">Local storage candidate remains review-only</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This packet records the controls a real provider must satisfy before a closed companion can store, export,
            restore, or activate anything. It is evidence planning, not provider selection.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={valid ? "Review-only" : "Contract error"} tone="warning" />
          <StatusPill label="Provider unselected" tone="warning" />
          <StatusPill label="Student-facing blocked" tone="warning" />
        </div>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Candidate" value={packet.candidateId} />
        <Fact label="Channel" value={packet.deploymentChannel} />
        <Fact label="Tenant" value={packet.tenantId} />
        <Fact label="Bundle" value={packet.bundleId} />
      </dl>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <h3 className="text-sm font-bold">Required evidence lanes</h3>
          <ul className="mt-3 grid gap-2">
            {packet.checks.map((check) => (
              <li key={check.checkId} className="rounded-md border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[var(--tenant-text)]">{check.label}</span>
                  <StatusPill label={check.status} tone={checkTone[check.status]} />
                </div>
                <p className="mt-1 text-xs leading-5 text-[var(--tenant-muted)]">{check.detail}</p>
                <p className="mt-1 break-words text-xs font-semibold text-[var(--tenant-muted)]">Evidence: {check.evidenceRef}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
          <h3 className="text-sm font-bold">Control references</h3>
          <dl className="mt-3 grid gap-3 text-sm">
            {Object.entries(packet.controls).map(([label, value]) => (
              <div key={label}>
                <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
                <dd className="mt-1 break-words text-xs text-[var(--tenant-muted)]">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm leading-6 text-[var(--tenant-muted)]">
            Core storage excludes raw learner audio and transcripts. Learner-data export, provider activation, package
            writes, and student promotion remain blocked.
          </p>
        </section>
      </div>

      {errors.length > 0 && (
        <ul className="mt-5 grid gap-2 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
          {errors.map((error, index) => <li key={`provider-approval-error-${index}-${error}`}>{error}</li>)}
        </ul>
      )}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
