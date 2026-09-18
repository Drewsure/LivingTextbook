import { Card, StatusPill } from "@living-textbook/ui";
import type {
  PersistenceHandoffCheck,
  PersistenceHandoffCheckStatus,
  PersistenceHandoffPacket,
} from "@/data/samplePersistenceHandoffPacket";

interface PersistenceHandoffPacketPanelProps {
  packet: PersistenceHandoffPacket;
  errors: string[];
}

const statusTone: Record<PersistenceHandoffCheckStatus, "neutral" | "success" | "warning"> = {
  passed: "success",
  open: "neutral",
  blocked: "warning",
};

export function PersistenceHandoffPacketPanel({ packet, errors }: PersistenceHandoffPacketPanelProps) {
  const passedCount = packet.checks.filter((check) => check.status === "passed").length;
  const blockedCount = packet.checks.filter((check) => check.status === "blocked").length;
  const coveredCount = packet.categoryCoverage.filter((coverage) => coverage.durableRecord && coverage.hostedIntent && coverage.localIntent).length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Implementation handoff packet</p>
          <h2 className="mt-1 text-lg font-bold">{packet.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{packet.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Review-only" tone="warning" />
          <StatusPill label={errors.length === 0 ? "Packet valid" : "Packet review"} tone={errors.length === 0 ? "success" : "warning"} />
          <StatusPill label="Provider unselected" tone="success" />
          <StatusPill label="Writes blocked" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Summary label="Checks passed" value={`${passedCount}/${packet.checks.length}`} tone="success" />
        <Summary label="Tenant-bound categories" value={`${coveredCount}/${packet.categoryCoverage.length}`} tone={coveredCount === packet.categoryCoverage.length ? "success" : "warning"} />
        <Summary label="Implementation blockers" value={`${blockedCount}`} tone={blockedCount === 0 ? "success" : "warning"} />
      </div>

      {errors.length > 0 && (
        <section className="mt-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <h3 className="font-bold">Shared contract validator findings</h3>
          <ul className="mt-2 grid gap-1">
            {errors.map((error, index) => (
              <li key={`handoff-validator-${index}-${error}`}>{error}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {packet.checks.map((check) => (
          <HandoffCheck key={check.checkId} check={check} />
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold">Required category coverage</h3>
            <p className="mt-1 text-sm leading-6 text-[var(--tenant-muted)]">
              A future adapter must implement the same categories for hosted and local deployment channels. This is a review map, not a migration command.
            </p>
          </div>
          <StatusPill label="No provider activation" tone="warning" />
        </div>
        <div className="mt-4 grid gap-2">
          {packet.categoryCoverage.map((coverage) => (
            <div key={coverage.category} className="grid gap-2 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3 text-xs sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center">
              <span className="font-semibold text-[var(--tenant-text)]">{coverage.category}</span>
              <Coverage label="Record" ready={coverage.durableRecord} />
              <Coverage label="Hosted" ready={coverage.hostedIntent} />
              <Coverage label="Local" ready={coverage.localIntent} />
            </div>
          ))}
        </div>
      </section>
    </Card>
  );
}

function Summary({ label, value, tone }: { label: string; value: string; tone: "neutral" | "success" | "warning" }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</p>
      <StatusPill label={tone === "success" ? "Ready for review" : tone === "warning" ? "Needs decision" : "Open"} tone={tone} />
    </section>
  );
}

function HandoffCheck({ check }: { check: PersistenceHandoffCheck }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-bold">{check.label}</h3>
        <StatusPill label={check.status} tone={statusTone[check.status]} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{check.detail}</p>
    </article>
  );
}

function Coverage({ label, ready }: { label: string; ready: boolean }) {
  return <span className={ready ? "font-semibold text-emerald-700" : "font-semibold text-amber-700"}>{label}: {ready ? "mapped" : "open"}</span>;
}
