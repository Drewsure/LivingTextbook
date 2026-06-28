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
          <p className="mt-1 text-sm text-slate-600">{tenant.rewardName} is earned through mastery and completion.</p>
        </div>
        <StatusPill label="Earned collection" tone="success" />
      </div>
      <dl className="mt-5 grid gap-3 text-sm">
        <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
          <dt className="text-slate-600">Unit capacity</dt>
          <dd className="font-semibold">1,000 {tenant.rewardName}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
          <dt className="text-slate-600">Vocabulary terms</dt>
          <dd className="font-semibold">{unit.pedagogicalPayload.vocabularyTerms.length}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
          <dt className="text-slate-600">Current sample score</dt>
          <dd className="font-semibold">{sampleDust.total}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-600">Module mastery</dt>
          <dd className="font-semibold">3,000 / 4,000</dd>
        </div>
      </dl>
    </Card>
  );
}
