import { Card, StatusPill } from "@living-textbook/ui";
import type {
  ActivityPathwayCompatibilityItem,
  ActivityPathwayCompatibilityMatrix,
} from "@/data/sampleActivityPathwayCompatibility";

interface AiModeRecommendationPanelProps {
  matrix: ActivityPathwayCompatibilityMatrix;
}

export function AiModeRecommendationPanel({ matrix }: AiModeRecommendationPanelProps) {
  const recommendedItems = matrix.items
    .filter((item) => item.status === "offered")
    .sort((a, b) => (a.recommendedOrder ?? 99) - (b.recommendedOrder ?? 99));
  const blockedItems = matrix.items.filter((item) => item.status === "blocked");

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--tenant-muted)]">AI mode recommendation preview</p>
          <h2 className="mt-1 text-lg font-bold">Recommended generated pathway</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
            Generator suggestions must come from reviewed compatibility rules. The system can recommend a tight pathway, but
            it should not generate a broad switch panel or offer unsupported conversions.
          </p>
        </div>
        <StatusPill label="Do not generate broad switch panel" tone="warning" />
      </div>

      <section className="mt-5 rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
        <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">Teacher promise</p>
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-text)]">{matrix.teacherPromise}</p>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--tenant-text)]">Recommended generated pathway</h3>
            <StatusPill label={`${recommendedItems.length} offered`} tone="success" />
          </div>
          <div className="mt-4 grid gap-3">
            {recommendedItems.map((item) => (
              <RecommendationCard key={item.itemId} item={item} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--tenant-border)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--tenant-text)]">Blocked conversion guardrails</h3>
            <StatusPill label={`${blockedItems.length} blocked`} tone="warning" />
          </div>
          <div className="mt-4 grid gap-3">
            {blockedItems.map((item) => (
              <RecommendationCard key={item.itemId} item={item} compact />
            ))}
          </div>
        </section>
      </div>
    </Card>
  );
}

function RecommendationCard({ item, compact = false }: { item: ActivityPathwayCompatibilityItem; compact?: boolean }) {
  return (
    <article className="rounded-lg border border-[var(--tenant-border)] bg-white/80 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">
            {item.recommendedOrder ? `Step ${item.recommendedOrder}` : item.outputKind}
          </p>
          <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{item.label}</h4>
        </div>
        <StatusPill label={item.status} tone={item.status === "blocked" ? "warning" : "success"} />
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">
        <span className="font-semibold text-[var(--tenant-text)]">Payload fit:</span> {item.sourcePayloadFit}
      </p>
      {!compact ? (
        <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
          <span className="font-semibold text-[var(--tenant-text)]">Target-language trigger:</span>{" "}
          {item.targetLanguageTrigger}
        </p>
      ) : null}
      <p className="mt-2 text-sm leading-6 text-[var(--tenant-muted)]">
        <span className="font-semibold text-[var(--tenant-text)]">Compatibility rule:</span> {item.compatibilityRule}
      </p>
    </article>
  );
}
