import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AiGeneratedPackageWriterRollbackDrill,
  AiGeneratedPackageWriterRollbackDrillStatus,
  AiGeneratedPackageWriterRollbackStep,
  AiGeneratedPackageWriterRollbackStepStatus,
} from "@/data/sampleAiGeneratedPackageWriterRollbackDrill";

interface AiGeneratedPackageWriterRollbackDrillPanelProps {
  drills: AiGeneratedPackageWriterRollbackDrill[];
}

const drillStatusTone: Record<AiGeneratedPackageWriterRollbackDrillStatus, "neutral" | "warning"> = {
  "review-only": "neutral",
  blocked: "warning",
};

const stepStatusTone: Record<AiGeneratedPackageWriterRollbackStepStatus, "neutral" | "warning"> = {
  "needs-evidence": "neutral",
  blocked: "warning",
};

export function AiGeneratedPackageWriterRollbackDrillPanel({
  drills,
}: AiGeneratedPackageWriterRollbackDrillPanelProps) {
  const stepCount = drills.reduce((total, drill) => total + drill.rollbackSteps.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">
            AI generated package writer rollback drill
          </p>
          <h2 className="mt-1 text-lg font-bold">Package writer rollback drill</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This review surface proves a future writer can be rehearsed safely before it exists. It names pre-write
            snapshots, post-write verification, and rollback rehearsal steps while keeping every rollback and writer
            action blocked.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Rollback drill blocked" tone="warning" />
          <StatusPill label={`${stepCount} rollback step(s)`} tone="neutral" />
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        {drills.map((drill) => (
          <article key={drill.drillId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{drill.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{drill.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{drill.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={drill.status} tone={drillStatusTone[drill.status]} />
                <StatusPill label={drill.drillState} tone="warning" />
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Package writer rollback drill</h4>
                <StatusPill label={drill.packageIdPreview} tone="neutral" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {drill.rollbackSteps.map((step) => (
                  <RollbackStepCard key={step.stepId} step={step} />
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <DrillList title="Pre-write snapshot" items={drill.preWriteSnapshots} />
              <DrillList title="Post-write verification" items={drill.postWriteVerification} />
              <DrillList title="Allowed review actions" items={drill.allowedReviewActions} />
              <DrillList title="Next required records" items={drill.nextRequiredRecords} />
              <DrillList title="Blocked rollback actions" items={drill.blockedRollbackActions} tone="warning" />
              <DrillList title="Support-language boundary" items={drill.supportLanguageBoundary} tone="warning" />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function RollbackStepCard({ step }: { step: AiGeneratedPackageWriterRollbackStep }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{step.scope}</p>
          <h5 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{step.label}</h5>
        </div>
        <StatusPill label={step.status} tone={stepStatusTone[step.status]} />
      </div>
      <div className="mt-3 grid gap-3">
        <DrillList title="Required snapshot" items={[step.requiredSnapshot]} />
        <DrillList title="Verification check" items={[step.verificationCheck]} />
        <DrillList title="Blocked step actions" items={step.blockedActions} tone="warning" />
      </div>
    </article>
  );
}

function DrillList({
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
