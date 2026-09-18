import type { LocalBundleHandoffPersistencePreview } from "@living-textbook/content-model";
import { Card, StatusPill } from "@living-textbook/ui";

interface LocalBundleHandoffPersistencePanelProps {
  preview: LocalBundleHandoffPersistencePreview;
  errors: string[];
}

const blockedActions = [
  ["Package write", "packageWriteAllowed"],
  ["Offline activation", "offlineActivationAllowed"],
  ["Student promotion", "studentPromotionAllowed"],
  ["Hosted redirect mutation", "hostedRedirectMutationAllowed"],
] as const;

export function LocalBundleHandoffPersistencePanel({ preview, errors }: LocalBundleHandoffPersistencePanelProps) {
  const valid = errors.length === 0;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Persistence admission preview</p>
          <h3 className="mt-1 text-lg font-bold">Local handoff maps to the shared storage contract</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This is a typed review bridge between local package evidence and future hosted/local persistence. It proves the record shape without selecting a provider or enabling a side effect.
          </p>
        </div>
        <StatusPill label={valid ? "Review-only" : "Blocked"} tone={valid ? "warning" : "warning"} />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Packet" value={preview.packetId} />
        <Fact label="Record" value={preview.recordCategory} />
        <Fact label="Provider" value="Unselected" />
        <Fact label="Durable write" value={preview.durableWriteAllowed ? "Allowed" : "Blocked"} />
      </dl>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {blockedActions.map(([label, field]) => (
          <section key={field} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--tenant-text)]">{label}</p>
              <StatusPill label={preview[field] ? "Open" : "Blocked"} tone="warning" />
            </div>
          </section>
        ))}
      </div>

      {errors.length > 0 ? (
        <ul className="mt-5 grid gap-2 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
          {errors.map((error, index) => <li key={`local-handoff-persistence-error-${index}-${error}`}>{error}</li>)}
        </ul>
      ) : (
        <p className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-muted)]">
          Shared record coverage is present. Package writing, offline activation, student promotion, and hosted redirect mutation remain blocked.
        </p>
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
