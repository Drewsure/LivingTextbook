import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGeneratedPackageAssemblyReadinessCollectionWarnings,
  validateAiGeneratedPackageAssemblyReadinessItems,
  type AiGeneratedPackageAssemblyLane,
  type AiGeneratedPackageAssemblyLaneStatus,
  type AiGeneratedPackageAssemblyReadiness,
  type AiGeneratedPackageAssemblyReadinessStatus,
} from "@living-textbook/content-model/src/aiGeneratedPackageAssemblyReadiness";

interface AiGeneratedPackageAssemblyReadinessPanelProps {
  readiness: AiGeneratedPackageAssemblyReadiness[];
}

const readinessStatusTone: Record<AiGeneratedPackageAssemblyReadinessStatus, "neutral" | "warning"> = {
  "review-only": "neutral",
  blocked: "warning",
};

const laneStatusTone: Record<AiGeneratedPackageAssemblyLaneStatus, "success" | "warning"> = {
  "ready-preview": "success",
  blocked: "warning",
  missing: "warning",
};

export function AiGeneratedPackageAssemblyReadinessPanel({
  readiness,
}: AiGeneratedPackageAssemblyReadinessPanelProps) {
  const blockedLaneCount = readiness.reduce(
    (total, item) => total + item.lanes.filter((lane) => lane.status !== "ready-preview").length,
    0,
  );
  const guardBlocks = validateAiGeneratedPackageAssemblyReadinessItems(readiness);
  const guardWarnings = getAiGeneratedPackageAssemblyReadinessCollectionWarnings(readiness);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generated package assembly readiness</p>
          <h2 className="mt-1 text-lg font-bold">Assembly decision before package write</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This panel combines manifest, promotion, publish-readiness, and release-candidate evidence into one
            review-only package assembly decision. It does not assemble, publish, route, bundle, or assign a generated
            package.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Assembly readiness guard active" tone="warning" />
          <StatusPill label={`${guardBlocks.length} guard block(s)`} tone={guardBlocks.length > 0 ? "warning" : "success"} />
          <StatusPill label="Package assembly blocked" tone="warning" />
          <StatusPill label={`${blockedLaneCount} blocked lane(s)`} tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <AssemblyList
          title="Assembly readiness guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No assembly readiness guard blocks"]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <AssemblyList
          title="Assembly readiness guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No assembly readiness guard warnings"]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="mt-5 grid gap-4">
        {readiness.map((item) => (
          <article key={item.readinessId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{item.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{item.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{item.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={item.status} tone={readinessStatusTone[item.status]} />
                <StatusPill label={item.readinessState} tone="warning" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <AssemblyFact label="Package target" value={item.packageAssemblyTarget} />
              <AssemblyFact label="Route target" value={item.routeWriteTarget} />
              <AssemblyFact label="Local bundle target" value={item.localBundleTarget} />
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Assembly readiness lanes</h4>
                <StatusPill label={String(item.lanes.length)} tone="warning" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {item.lanes.map((lane) => (
                  <AssemblyLaneCard key={lane.laneId} lane={lane} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <AssemblyList title="Allowed review actions" items={item.allowedReviewActions} />
              <AssemblyList title="Next required records" items={item.nextRequiredRecords} />
              <AssemblyList title="Blocked assembly actions" items={item.blockedAssemblyActions} tone="warning" />
              <AssemblyList title="Support-language boundary" items={item.supportLanguageBoundary} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function AssemblyFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
      <p className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </div>
  );
}

function AssemblyLaneCard({ lane }: { lane: AiGeneratedPackageAssemblyLane }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{lane.requiredRecord}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{lane.label}</h5>
        </div>
        <StatusPill label={lane.status} tone={laneStatusTone[lane.status]} />
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Evidence</dt>
          <dd>{lane.evidence}</dd>
        </div>
        <div>
          <dt className="font-semibold text-[var(--tenant-text)]">Assembly effect</dt>
          <dd>{lane.assemblyEffect}</dd>
        </div>
      </dl>
    </article>
  );
}

function AssemblyList({
  title,
  items,
  tone = "neutral",
}: {
  title: string;
  items: string[];
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
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
