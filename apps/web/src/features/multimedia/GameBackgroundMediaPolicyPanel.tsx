import { Card, StatusPill } from "@living-textbook/ui";
import type {
  BackgroundMediaPolicyRule,
  BackgroundMediaRuleStatus,
  GameBackgroundMediaPolicy,
} from "@/data/sampleGameBackgroundMediaPolicy";

interface GameBackgroundMediaPolicyPanelProps {
  policy: GameBackgroundMediaPolicy;
}

const statusTone: Record<BackgroundMediaRuleStatus, "neutral" | "success" | "warning"> = {
  required: "warning",
  recommended: "success",
  blocked: "warning",
};

const statusLabel: Record<BackgroundMediaRuleStatus, string> = {
  required: "Required",
  recommended: "Recommended",
  blocked: "Blocked",
};

export function GameBackgroundMediaPolicyPanel({ policy }: GameBackgroundMediaPolicyPanelProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Background media policy</p>
          <h2 className="mt-1 text-lg font-bold">{policy.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{policy.decision}</p>
        </div>
        <StatusPill label="Teacher controlled" tone="success" />
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <PolicyBlock title="Audio priority" value={policy.priorityRule} tone="warning" />
        <PolicyBlock title="Reporting" value={policy.reportingRule} tone="neutral" />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {policy.rules.map((rule) => (
          <RuleCard key={rule.ruleId} rule={rule} />
        ))}
      </div>
    </Card>
  );
}

function PolicyBlock({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{title}</h3>
        <StatusPill label={tone === "warning" ? "Hard rule" : "Report only"} tone={tone} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">{value}</p>
    </section>
  );
}

function RuleCard({ rule }: { rule: BackgroundMediaPolicyRule }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-[var(--tenant-text)]">{rule.label}</h3>
        <StatusPill label={statusLabel[rule.status]} tone={statusTone[rule.status]} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{rule.summary}</p>
    </article>
  );
}
