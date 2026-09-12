import { Card, StatusPill } from "@living-textbook/ui";
import type { CanonicalGameReportEvidence } from "@living-textbook/content-model";

interface TeacherCanonicalGameEvidenceCardProps {
  evidence: CanonicalGameReportEvidence;
}

export function TeacherCanonicalGameEvidenceCard({ evidence }: TeacherCanonicalGameEvidenceCardProps) {
  const readyGroups = evidence.groups.filter((group) => group.status === "ready").length;
  const blockedGroups = evidence.groups.length - readyGroups;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Canonical game evidence</p>
          <h3 className="mt-1 text-lg font-bold">Report integrity by game attempt</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Only complete, tenant-bound game event sequences can support authoritative learning summaries. Incomplete sample rows remain visible for review but cannot be treated as verified completion.
          </p>
        </div>
        <StatusPill label={evidence.status} tone={evidence.status === "ready" ? "success" : "warning"} />
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <Metric label="Game groups" value={String(evidence.groups.length)} />
        <Metric label="Ready" value={String(readyGroups)} />
        <Metric label="Blocked" value={String(blockedGroups)} />
      </dl>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        {evidence.groups.map((group) => (
          <section key={group.evidenceId} className="rounded-lg border border-[var(--tenant-border)] p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{group.gameMode}</p>
                <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">Attempt {group.attemptNumber}: {group.eventCount} event(s)</h4>
              </div>
              <StatusPill label={group.status} tone={group.status === "ready" ? "success" : "warning"} />
            </div>
            <p className="mt-2 break-words text-xs leading-5 text-[var(--tenant-muted)]">
              Launch: {group.launchCode || "Missing"} / learner: {group.studentSessionId || "Missing"}
            </p>
            {group.errors.length > 0 ? (
              <ul className="mt-3 grid gap-2 text-xs leading-5 text-[var(--tenant-muted)]">
                {group.errors.slice(0, 3).map((error, index) => <li key={`${group.evidenceId}-error-${index}`}>{error}</li>)}
              </ul>
            ) : (
              <p className="mt-3 text-xs leading-5 text-[var(--tenant-muted)]">Sequence, replay evidence, identity, and completion boundary passed.</p>
            )}
          </section>
        ))}
      </div>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
