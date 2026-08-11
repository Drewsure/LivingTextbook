import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGeneratedPackageWriterImplementationReadinessCollectionWarnings,
  validateAiGeneratedPackageWriterImplementationReadinessCollection,
} from "@living-textbook/content-model/src/aiPackageWriterImplementationReadiness";
import type {
  AiGeneratedPackageWriterImplementationReadiness,
  AiGeneratedPackageWriterImplementationReadinessStatus,
  AiGeneratedPackageWriterModule,
  AiGeneratedPackageWriterModuleStatus,
} from "@/data/sampleAiGeneratedPackageWriterImplementationReadiness";

interface AiGeneratedPackageWriterImplementationReadinessPanelProps {
  readiness: AiGeneratedPackageWriterImplementationReadiness[];
}

const readinessStatusTone: Record<AiGeneratedPackageWriterImplementationReadinessStatus, "neutral" | "warning"> = {
  "review-only": "neutral",
  blocked: "warning",
};

const moduleStatusTone: Record<AiGeneratedPackageWriterModuleStatus, "neutral" | "warning"> = {
  "needs-design": "neutral",
  blocked: "warning",
};

export function AiGeneratedPackageWriterImplementationReadinessPanel({
  readiness,
}: AiGeneratedPackageWriterImplementationReadinessPanelProps) {
  const moduleCount = readiness.reduce((total, item) => total + item.modulePlan.length, 0);
  const guardBlocks = validateAiGeneratedPackageWriterImplementationReadinessCollection(readiness);
  const guardWarnings = getAiGeneratedPackageWriterImplementationReadinessCollectionWarnings(readiness);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI generated package writer implementation readiness
          </p>
          <h2 className="mt-1 text-lg font-bold">Package writer module plan</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This gate names the future writer modules, required tests, and release controls before implementation work
            can begin. It remains blocked and cannot write app files, routes, playlists, local bundles, assignments, or
            rollback state.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Implementation readiness guard active" tone="neutral" />
          <StatusPill
            label={`${guardBlocks.length} guard block(s)`}
            tone={guardBlocks.length > 0 ? "warning" : "neutral"}
          />
          <StatusPill label="Implementation blocked" tone="warning" />
          <StatusPill label={`${moduleCount} module plan(s)`} tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <ReadinessList
          title="Implementation readiness guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No shared implementation readiness guard blockers."]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <ReadinessList
          title="Implementation readiness guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No shared implementation readiness guard warnings."]}
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

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Package writer module plan</h4>
                <StatusPill label={item.packageIdPreview} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {item.modulePlan.map((module) => (
                  <ModulePlanCard key={module.moduleId} module={module} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <ReadinessList title="Required test gates" items={item.requiredTestGates} />
              <ReadinessList title="Release controls" items={item.releaseControls} />
              <ReadinessList title="Next required records" items={item.nextRequiredRecords} />
              <ReadinessList
                title="Blocked implementation actions"
                items={item.blockedImplementationActions}
                tone="warning"
              />
              <ReadinessList title="Support-language boundary" items={item.supportLanguageBoundary} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function ModulePlanCard({ module }: { module: AiGeneratedPackageWriterModule }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Writer module</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{module.label}</h5>
          <p className="mt-1 text-xs leading-5 text-[var(--tenant-muted)]">{module.implementationBoundary}</p>
        </div>
        <StatusPill label={module.status} tone={moduleStatusTone[module.status]} />
      </div>
      <div className="mt-3 grid gap-3">
        <ReadinessList title="Required inputs" items={module.requiredInputs} />
        <ReadinessList title="Blocked module actions" items={module.blockedActions} tone="warning" />
      </div>
    </article>
  );
}

function ReadinessList({
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
