import { Card, StatusPill } from "@living-textbook/ui";
import { calculateStarDust } from "@living-textbook/content-model";
import type { UnitPayload } from "@living-textbook/content-model";
import type { TenantConfig } from "@/features/tenant/types";

interface ProgressionSummaryProps {
  tenant: TenantConfig;
  unit: UnitPayload;
}

export function ProgressionSummary({ tenant, unit }: ProgressionSummaryProps) {
  const sampleDust = calculateStarDust({
    masteredTerms: 0,
    totalTerms: unit.pedagogicalPayload.vocabularyTerms.length,
    masteredSyntaxChecks: 0,
    totalSyntaxChecks: 2,
    bonusRatio: 0,
  });

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Progression Contract</h2>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">{tenant.rewardName} is earned through mastery and completion.</p>
        </div>
        <StatusPill label="Earned collection" tone="success" />
      </div>
      <dl className="mt-5 grid gap-3 text-sm">
        <ProgressionRow label="Unit capacity" value={`1,000 ${tenant.rewardName}`} />
        <ProgressionRow label="Vocabulary terms" value={String(unit.pedagogicalPayload.vocabularyTerms.length)} />
        <ProgressionRow label="Current sample score" value={String(sampleDust.total)} />
        <ProgressionRow label="Module mastery" value="3,000 / 4,000" terminal />
      </dl>
    </Card>
  );
}

function ProgressionRow({ label, value, terminal = false }: { label: string; value: string; terminal?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${terminal ? "" : "border-b border-[var(--tenant-border)] pb-2"}`}>
      <dt className="text-[var(--tenant-muted)]">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
