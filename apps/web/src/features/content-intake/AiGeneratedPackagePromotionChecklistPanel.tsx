import { Card, StatusPill } from "@living-textbook/ui";
import {
  getAiGeneratedPackagePromotionChecklistCollectionWarnings,
  validateAiGeneratedPackagePromotionChecklists,
  type AiGeneratedPackagePromotionChecklist,
  type AiGeneratedPackagePromotionStatus,
  type AiGeneratedPackagePromotionStep,
  type AiGeneratedPackagePromotionStepStatus,
} from "@living-textbook/content-model/src/aiGeneratedPackagePromotionChecklist";

interface AiGeneratedPackagePromotionChecklistPanelProps {
  checklists: AiGeneratedPackagePromotionChecklist[];
}

const checklistStatusTone: Record<AiGeneratedPackagePromotionStatus, "success" | "warning"> = {
  blocked: "warning",
  "ready-for-review": "success",
};

const stepStatusTone: Record<AiGeneratedPackagePromotionStepStatus, "success" | "warning"> = {
  "ready-preview": "success",
  blocked: "warning",
  missing: "warning",
};

export function AiGeneratedPackagePromotionChecklistPanel({
  checklists,
}: AiGeneratedPackagePromotionChecklistPanelProps) {
  const blockedStepCount = checklists.reduce(
    (total, checklist) => total + checklist.steps.filter((step) => step.status !== "ready-preview").length,
    0,
  );
  const guardBlocks = validateAiGeneratedPackagePromotionChecklists(checklists);
  const guardWarnings = getAiGeneratedPackagePromotionChecklistCollectionWarnings(checklists);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI generated package promotion checklist</p>
          <h2 className="mt-1 text-lg font-bold">Draft-to-playable package pathway</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            This checklist shows the evidence and records needed before a generated draft can be promoted into a real
            playable package. It is a planning surface only; it does not create routes, playlists, assignments, local
            bundles, or student-ready state.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusPill label="Promotion guard active" tone="warning" />
          <StatusPill label={`${guardBlocks.length} guard block(s)`} tone={guardBlocks.length > 0 ? "warning" : "success"} />
          <StatusPill label="Promotion review only" tone="neutral" />
          <StatusPill label={`${blockedStepCount} promotion blocker(s)`} tone={blockedStepCount > 0 ? "warning" : "success"} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <PromotionList
          title="Promotion guard blocks"
          items={guardBlocks.length > 0 ? guardBlocks : ["No promotion guard blocks"]}
          tone={guardBlocks.length > 0 ? "warning" : "neutral"}
        />
        <PromotionList
          title="Promotion guard warnings"
          items={guardWarnings.length > 0 ? guardWarnings : ["No promotion guard warnings"]}
          tone={guardWarnings.length > 0 ? "warning" : "neutral"}
        />
      </div>

      <div className="mt-5 grid gap-4">
        {checklists.map((checklist) => (
          <article key={checklist.checklistId} className="rounded-lg border border-[var(--tenant-border)] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{checklist.requestId}</p>
                <h3 className="mt-1 text-base font-bold text-[var(--tenant-text)]">{checklist.label}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">{checklist.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={checklist.status} tone={checklistStatusTone[checklist.status]} />
                <StatusPill label={checklist.currentPackageState} tone="warning" />
              </div>
            </div>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Future promotion target</p>
                  <p className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">
                    {checklist.futurePromotionTarget}
                  </p>
                </div>
                <StatusPill label="Promotion blocked" tone="warning" />
              </div>
            </section>

            <section className="mt-4 rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-[var(--tenant-text)]">Promotion checklist steps</h4>
                <StatusPill label={String(checklist.steps.length)} tone="warning" />
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-2">
                {checklist.steps.map((step) => (
                  <PromotionStepCard key={step.stepId} step={step} />
                ))}
              </div>
            </section>

            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <PromotionList title="Allowed promotion review" items={checklist.allowedNow} />
              <PromotionList title="Blocked promotion actions" items={checklist.blockedActions} tone="warning" />
              <PromotionList title="Next promotion records" items={checklist.nextRecords} />
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function PromotionStepCard({ step }: { step: AiGeneratedPackagePromotionStep }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h5 className="text-sm font-bold text-[var(--tenant-text)]">{step.label}</h5>
          <p className="mt-1 break-words font-mono text-xs text-[var(--tenant-muted)]">{step.requiredRecord}</p>
        </div>
        <StatusPill label={step.status} tone={stepStatusTone[step.status]} />
      </div>
      <dl className="mt-3 grid gap-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <PromotionFact label="Evidence" value={step.evidence} />
        <PromotionFact label="Release boundary" value={step.releaseBoundary} />
      </dl>
    </article>
  );
}

function PromotionFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-[var(--tenant-text)]">{label}</dt>
      <dd className="mt-1 break-words">{value}</dd>
    </div>
  );
}

function PromotionList({
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
        {items.map((item, index) => (
          <li key={`${title}-${index}-${item}`}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
