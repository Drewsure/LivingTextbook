import { Card, StatusPill } from "@living-textbook/ui";
import type { AiGameGeneratorPlan, AiGameGeneratorRequest, AiGameGeneratorStatus } from "@/data/sampleAiGameGeneratorPlan";
import {
  countAiGameGeneratorRequestsByStatus,
  filterAiGameGeneratorRequestsByTenant,
} from "@/data/sampleAiGameGeneratorPlan";

interface AiGameGeneratorPlanPanelProps {
  plan: AiGameGeneratorPlan;
  tenantId?: string;
}

const statusTone: Record<AiGameGeneratorStatus, "neutral" | "warning"> = {
  "draft-only": "neutral",
  blocked: "warning",
  "premium-gated": "warning",
};

export function AiGameGeneratorPlanPanel({ plan, tenantId }: AiGameGeneratorPlanPanelProps) {
  const visibleRequests = tenantId ? filterAiGameGeneratorRequestsByTenant(plan, tenantId) : plan.requests;
  const draftOnlyCount = countAiGameGeneratorRequestsByStatus(plan, "draft-only");
  const premiumGatedCount = countAiGameGeneratorRequestsByStatus(plan, "premium-gated");
  const blockedCount = countAiGameGeneratorRequestsByStatus(plan, "blocked");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI teaching game generator</p>
          <h2 className="mt-1 text-lg font-bold">{plan.label}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{plan.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Draft only" tone="warning" />
          <StatusPill label="No live model call" tone="warning" />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <GeneratorMetric label="Requests" value={String(visibleRequests.length)} />
        <GeneratorMetric label="Draft-only requests" value={String(draftOnlyCount)} />
        <GeneratorMetric label="Premium-gated requests" value={String(premiumGatedCount)} tone="warning" />
        <GeneratorMetric label="Blocked requests" value={String(blockedCount)} tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Release rule</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{plan.releaseRule}</p>
        <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{plan.modelUseRule}</p>
      </section>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Game settings contract</p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-text)]">{plan.settingsContractRule}</p>
          </div>
          <StatusPill label="Backend map required" tone="warning" />
        </div>
        <div className="mt-3">
          <GeneratorList title="Settings backend records" items={plan.settingsBackendRecords} tone="neutral" />
        </div>
      </section>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <GeneratorList title="Accepted inputs" items={plan.acceptedInputs} tone="neutral" />
        <GeneratorList title="Required output rules" items={plan.requiredOutputRules} tone="success" />
        <GeneratorList title="Blocked actions" items={plan.blockedActions} tone="warning" />
      </div>

      <div className="mt-5 grid gap-4">
        {visibleRequests.map((request) => (
          <GeneratorRequestCard key={request.requestId} request={request} />
        ))}
      </div>
    </Card>
  );
}

function GeneratorRequestCard({ request }: { request: AiGameGeneratorRequest }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Generator request preview</p>
          <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{request.label}</h3>
          <p className="mt-2 break-words font-mono text-xs text-[var(--tenant-muted)]">{request.requestId}</p>
        </div>
        <StatusPill label={request.status} tone={statusTone[request.status]} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <GeneratorMetric label="Tenant" value={request.tenantId} />
        <GeneratorMetric label="Level" value={`Level ${request.targetLevel}`} />
        <GeneratorMetric label="Theme" value={request.unitTheme} />
        <GeneratorMetric label="Target language" value={request.targetLanguage} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <GeneratorList title="Requested modes" items={request.requestedModes} tone="success" />
        <GeneratorList title="Generator inputs" items={request.generatorInputs} tone="neutral" />
        <GeneratorList title="Output draft records" items={request.outputDraftRecords} tone="neutral" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <GeneratorList title="Settings profile refs" items={request.settingsProfileRefs} tone="neutral" />
        <GeneratorList title="Settings backend gates" items={request.settingsBackendGates} tone="warning" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <GeneratorList title="Verifier checks" items={request.verifierChecks} tone="success" />
        <GeneratorList title="Blocked request actions" items={request.blockedActions} tone="warning" />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <GeneratorText title="API cost package gate" body={request.costGate} />
        <GeneratorText title="Curated activity pathway" body={request.pathwayRule} />
        <GeneratorText title="Target-language audio rule" body={request.audioRule} />
      </div>

      <section className="mt-3 rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Assist language policy</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{request.assistLanguagePolicy}</p>
      </section>
    </article>
  );
}

function GeneratorMetric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "warning";
}) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</p>
        <StatusPill label={tone === "warning" ? "Gate" : "Info"} tone={tone} />
      </div>
      <p className="mt-2 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</p>
    </section>
  );
}

function GeneratorText({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{body}</p>
    </section>
  );
}

function GeneratorList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "neutral" | "success" | "warning";
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
