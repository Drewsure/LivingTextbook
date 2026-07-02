import { Card, StatusPill } from "@living-textbook/ui";
import type {
  BackendCostPosture,
  BackendDecisionMatrix,
  BackendDecisionOption,
  BackendDecisionStatus,
  BackendDeploymentFit,
} from "@/data/sampleBackendDecisionMatrix";

interface BackendDecisionMatrixPanelProps {
  matrix: BackendDecisionMatrix;
}

const statusTone: Record<BackendDecisionStatus, "neutral" | "success" | "warning"> = {
  "recommended-first": "success",
  candidate: "neutral",
  defer: "warning",
  "avoid-for-now": "warning",
};

const statusLabel: Record<BackendDecisionStatus, string> = {
  "recommended-first": "Recommended first",
  candidate: "Candidate",
  defer: "Defer",
  "avoid-for-now": "Avoid now",
};

const costTone: Record<BackendCostPosture, "neutral" | "success" | "warning"> = {
  lowest: "success",
  controlled: "neutral",
  higher: "warning",
};

const fitLabel: Record<BackendDeploymentFit, string> = {
  "hosted-first": "Hosted first",
  "local-first": "Local first",
  hybrid: "Hybrid",
};

export function BackendDecisionMatrixPanel({ matrix }: BackendDecisionMatrixPanelProps) {
  const recommended = matrix.options.find((option) => option.status === "recommended-first");
  const pilotBlockerCount = matrix.options.reduce((total, option) => total + option.requiredBeforePilot.length, 0);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Backend decision matrix</p>
          <h2 className="mt-1 text-lg font-bold">{matrix.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{matrix.currentRecommendation}</p>
        </div>
        <StatusPill label={recommended?.label ?? "No recommendation"} tone={recommended ? "success" : "warning"} />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <MatrixMetric label="Options compared" value={String(matrix.options.length)} tone="neutral" />
        <MatrixMetric label="Pilot blockers named" value={String(pilotBlockerCount)} tone={pilotBlockerCount > 0 ? "warning" : "success"} />
        <MatrixMetric label="Vendor lock" value="Not chosen" tone="success" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Decision rule</p>
            <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{matrix.decisionRule}</p>
          </div>
          <StatusPill label="Cost aware" tone="success" />
        </div>
      </section>

      <div className="mt-5 grid gap-4">
        {matrix.options.map((option) => (
          <BackendOptionCard key={option.optionId} option={option} />
        ))}
      </div>
    </Card>
  );
}

function BackendOptionCard({ option }: { option: BackendDecisionOption }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{fitLabel[option.deploymentFit]}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{option.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{option.whiteLabelFit}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={statusLabel[option.status]} tone={statusTone[option.status]} />
          <StatusPill label={option.costPosture} tone={costTone[option.costPosture]} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-4">
        <BackendListBlock title="Best for" items={option.bestFor} tone="success" />
        <BackendListBlock title="Risks" items={option.risks} tone="warning" />
        <BackendListBlock title="Before pilot" items={option.requiredBeforePilot} tone="warning" />
        <BackendListBlock title="Not allowed yet" items={option.notAllowedYet} tone="neutral" />
      </div>
    </article>
  );
}

function MatrixMetric({
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
      <p className="mt-2 break-words text-lg font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function BackendListBlock({
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
