import { Card, StatusPill } from "@living-textbook/ui";
import type {
  AuthoringVerifierPlan,
  AuthoringVerifierStage,
  AuthoringVerifierStageOwner,
  AuthoringVerifierStageStatus,
} from "@/data/sampleAuthoringVerifierPlan";
import { countAuthoringVerifierStagesByStatus } from "@/data/sampleAuthoringVerifierPlan";

interface AuthoringVerifierPlanPanelProps {
  plan: AuthoringVerifierPlan;
}

const statusTone: Record<AuthoringVerifierStageStatus, "neutral" | "success" | "warning"> = {
  ready: "success",
  "needs-review": "warning",
  blocked: "warning",
  deferred: "neutral",
};

const ownerLabel: Record<AuthoringVerifierStageOwner, string> = {
  "ai-draft": "AI draft",
  "schema-verifier": "Verifier",
  teacher: "Teacher",
  "rights-review": "Rights",
  platform: "Platform",
};

export function AuthoringVerifierPlanPanel({ plan }: AuthoringVerifierPlanPanelProps) {
  const readyCount = countAuthoringVerifierStagesByStatus(plan, "ready");
  const reviewCount = countAuthoringVerifierStagesByStatus(plan, "needs-review");
  const blockedCount = countAuthoringVerifierStagesByStatus(plan, "blocked");
  const deferredCount = countAuthoringVerifierStagesByStatus(plan, "deferred");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI authoring verifier</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <StatusPill label="Teacher controlled" tone="success" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <VerifierMetric label="Ready" value={String(readyCount)} tone="success" />
        <VerifierMetric label="Needs review" value={String(reviewCount)} tone="warning" />
        <VerifierMetric label="Blocked" value={String(blockedCount)} tone="warning" />
        <VerifierMetric label="Deferred" value={String(deferredCount)} tone="neutral" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Release rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.releaseRule}</p>
      </section>

      <div className="mt-5 grid gap-4">
        {plan.stages.map((stage) => (
          <AuthoringVerifierStageCard key={stage.stageId} stage={stage} />
        ))}
      </div>
    </Card>
  );
}

function VerifierMetric({
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

function AuthoringVerifierStageCard({ stage }: { stage: AuthoringVerifierStage }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{stage.stageId}</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{stage.label}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{stage.purpose}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label={stage.status} tone={statusTone[stage.status]} />
          <StatusPill label={ownerLabel[stage.owner]} tone={stage.owner === "rights-review" ? "warning" : "neutral"} />
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <VerifierList title="Accepts" items={stage.accepts} tone="success" />
        <VerifierList title="Rejects" items={stage.rejects} tone="warning" />
        <section className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Output</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{stage.output}</p>
        </section>
      </div>
    </article>
  );
}

function VerifierList({
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
