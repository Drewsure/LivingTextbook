import { Card, StatusPill } from "@living-textbook/ui";
import type { DeploymentDecisionGuide, DeploymentDecisionStatus } from "@/data/sampleDeploymentDecisionGuide";
import { countDeploymentDecisionOptions } from "@/data/sampleDeploymentDecisionGuide";

interface DeploymentDecisionGuidePanelProps {
  guide: DeploymentDecisionGuide;
}

const statusTone: Record<DeploymentDecisionStatus, "neutral" | "success" | "warning"> = {
  recommended: "success",
  guarded: "neutral",
  blocked: "warning",
};

export function DeploymentDecisionGuidePanel({ guide }: DeploymentDecisionGuidePanelProps) {
  const recommendedCount = countDeploymentDecisionOptions(guide, "recommended");
  const guardedCount = countDeploymentDecisionOptions(guide, "guarded");
  const blockedCount = countDeploymentDecisionOptions(guide, "blocked");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">Deployment decision guide</p>
          <h2 className="mt-1 text-lg font-bold">{guide.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{guide.summary}</p>
        </div>
        <StatusPill label="Cost controlled" tone="success" />
      </div>

      <p className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4 text-sm leading-6 text-[var(--tenant-text)]">
        {guide.standingRecommendation}
      </p>

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <DecisionMetric label="Recommended" value={String(recommendedCount)} tone="success" />
        <DecisionMetric label="Guarded" value={String(guardedCount)} tone="neutral" />
        <DecisionMetric label="Blocked" value={String(blockedCount)} tone="warning" />
      </dl>

      <div className="mt-5 grid gap-4">
        {guide.options.map((option) => (
          <article key={option.optionId} className="rounded-lg border border-[var(--tenant-border)] bg-white/85 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{option.channel}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{option.label}</h3>
              </div>
              <StatusPill label={option.status} tone={statusTone[option.status]} />
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <DecisionText title="Commercial fit" value={option.commercialFit} />
              <DecisionText title="Cost profile" value={option.costProfile} />
              <DecisionText title="Why now" value={option.whyNow} />
            </div>

            <p className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3 text-sm font-semibold leading-6 text-[var(--tenant-text)]">
              {option.nextDecision}
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <DecisionList guideId={guide.guideId} optionId={option.optionId} title="Required evidence" items={option.requiredEvidence} />
              <DecisionList guideId={guide.guideId} optionId={option.optionId} title="Blocked actions" items={option.blockedActions} />
            </div>
          </article>
        ))}
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Global blocks</p>
          <StatusPill label="Foundation guard" tone="warning" />
        </div>
        <ul className="mt-3 grid gap-2 text-sm leading-5 text-[var(--tenant-muted)] sm:grid-cols-2 lg:grid-cols-3">
          {guide.globalBlocks.map((block, index) => (
            <li key={`${guide.guideId}-global-block-${index}`} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-surface)] p-3">
              {block}
            </li>
          ))}
        </ul>
      </section>
    </Card>
  );
}

function DecisionMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 flex items-center justify-between gap-3 text-lg font-bold text-[var(--tenant-text)]">
        {value}
        <StatusPill label={tone === "success" ? "Pilot path" : tone === "warning" ? "Not ready" : "Needs decision"} tone={tone} />
      </dd>
    </div>
  );
}

function DecisionText({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function DecisionList({
  guideId,
  optionId,
  title,
  items,
}: {
  guideId: string;
  optionId: string;
  title: string;
  items: string[];
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <ul className="mt-2 grid gap-1 text-sm leading-5 text-[var(--tenant-muted)]">
        {items.map((item, index) => (
          <li key={`${guideId}-${optionId}-${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
