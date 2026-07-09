import { Card, StatusPill } from "@living-textbook/ui";
import type {
  LocalDeploymentPreflightPlan,
  LocalDeploymentPreflightStatus,
} from "@/data/sampleLocalDeploymentPreflight";
import { countLocalDeploymentChecks } from "@/data/sampleLocalDeploymentPreflight";

interface LocalDeploymentPreflightPanelProps {
  plan: LocalDeploymentPreflightPlan;
}

const statusTone: Record<LocalDeploymentPreflightStatus, "neutral" | "success" | "warning"> = {
  pass: "success",
  warning: "warning",
  blocked: "warning",
};

export function LocalDeploymentPreflightPanel({ plan }: LocalDeploymentPreflightPanelProps) {
  const passCount = countLocalDeploymentChecks(plan, "pass");
  const warningCount = countLocalDeploymentChecks(plan, "warning");
  const blockedCount = countLocalDeploymentChecks(plan, "blocked");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Local deployment preflight</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label={`${blockedCount} blocked`} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <p className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm leading-6 text-[var(--tenant-text)]">
        {plan.recommendation}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <LocalPreflightMetric label="Passing" value={String(passCount)} tone="success" />
        <LocalPreflightMetric label="Warnings" value={String(warningCount)} tone="warning" />
        <LocalPreflightMetric label="Blocked" value={String(blockedCount)} tone={blockedCount > 0 ? "warning" : "success"} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {plan.checks.map((check) => (
          <section key={check.checkId} className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{check.owner}</p>
                <h3 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{check.label}</h3>
              </div>
              <StatusPill label={check.status} tone={statusTone[check.status]} />
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{check.note}</p>
          </section>
        ))}
      </div>
    </Card>
  );
}

function LocalPreflightMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "success" ? "OK" : tone === "warning" ? "Open" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 text-lg font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}
