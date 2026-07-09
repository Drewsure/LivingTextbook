import { Card, StatusPill } from "@living-textbook/ui";
import type {
  BackendMigrationCandidate,
  BackendMigrationCandidateRisk,
  BackendMigrationCandidateStatus,
  BackendMigrationCandidateTrack,
  BackendMigrationPlan,
} from "@/data/sampleBackendMigrationCandidates";

interface BackendMigrationPlanPanelProps {
  plan: BackendMigrationPlan;
}

const statusTone: Record<BackendMigrationCandidateStatus, "neutral" | "success" | "warning"> = {
  "ready-to-design": "success",
  "needs-policy": "warning",
  defer: "neutral",
};

const statusLabel: Record<BackendMigrationCandidateStatus, string> = {
  "ready-to-design": "Ready to design",
  "needs-policy": "Needs policy",
  defer: "Defer",
};

const trackTone: Record<BackendMigrationCandidateTrack, "neutral" | "success" | "warning"> = {
  "hosted-pilot": "success",
  "local-classroom": "warning",
  shared: "neutral",
};

const trackLabel: Record<BackendMigrationCandidateTrack, string> = {
  "hosted-pilot": "Hosted pilot",
  "local-classroom": "Local classroom",
  shared: "Shared",
};

const riskTone: Record<BackendMigrationCandidateRisk, "neutral" | "success" | "warning"> = {
  low: "success",
  medium: "neutral",
  high: "warning",
};

export function BackendMigrationPlanPanel({ plan }: BackendMigrationPlanPanelProps) {
  const readyCount = plan.candidates.filter((candidate) => candidate.status === "ready-to-design").length;
  const policyCount = plan.candidates.filter((candidate) => candidate.status === "needs-policy").length;
  const deferredCount = plan.candidates.filter((candidate) => candidate.status === "defer").length;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Backend migration candidates</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label="Vendor neutral" tone="success" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MigrationMetric label="Candidates" value={String(plan.candidates.length)} tone="neutral" />
        <MigrationMetric label="Ready" value={String(readyCount)} tone="success" />
        <MigrationMetric label="Needs policy" value={String(policyCount)} tone="warning" />
        <MigrationMetric label="Deferred" value={String(deferredCount)} tone="neutral" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Sequencing rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.sequencingRule}</p>
      </section>

      <div className="mt-5 grid gap-4">
        {plan.candidates.map((candidate) => (
          <MigrationCandidateCard key={candidate.migrationId} candidate={candidate} />
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Standing migration rules</p>
            <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">What implementation cannot skip</h3>
          </div>
          <StatusPill label="Required" tone="success" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {plan.standingRules.map((rule) => (
            <li key={rule} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function MigrationMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function MigrationCandidateCard({ candidate }: { candidate: BackendMigrationCandidate }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{candidate.migrationId}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{candidate.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{candidate.purpose}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={statusLabel[candidate.status]} tone={statusTone[candidate.status]} />
          <StatusPill label={trackLabel[candidate.track]} tone={trackTone[candidate.track]} />
          <StatusPill label={`${candidate.risk} risk`} tone={riskTone[candidate.risk]} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
        <MigrationList title="Targets" items={candidate.targetEntities} tone="neutral" />
        <MigrationList title="Prerequisites" items={candidate.prerequisites} tone="warning" />
        <MigrationList title="Implementation" items={candidate.implementationNotes} tone="success" />
        <MigrationList title="Not allowed yet" items={candidate.notAllowedYet} tone="warning" />
      </div>

      <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-[var(--tenant-text)]">Rollback or export needs</h4>
          <StatusPill label={String(candidate.rollbackOrExportNeeds.length)} tone="neutral" />
        </div>
        <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
          {candidate.rollbackOrExportNeeds.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}

function MigrationList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h4>
        <StatusPill label={String(items.length)} tone={tone} />
      </div>
      <ul className="mt-2 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
