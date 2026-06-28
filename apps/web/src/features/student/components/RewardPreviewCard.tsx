import { Card, StatusPill } from "@living-textbook/ui";
import { getEarnedRewards, getNextReward } from "@/features/rewards/rewardCatalog";
import type { RewardCatalogItem } from "@/features/rewards/rewardCatalog";
import type { TenantConfig } from "@/features/tenant/types";

interface RewardPreviewCardProps {
  tenant: TenantConfig;
  earnedStarDust: number;
  catalog: RewardCatalogItem[];
}

export function RewardPreviewCard({ tenant, earnedStarDust, catalog }: RewardPreviewCardProps) {
  const earnedRewards = getEarnedRewards(catalog, earnedStarDust);
  const nextReward = getNextReward(catalog, earnedStarDust);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Earned Rewards</h3>
          <p className="mt-1 text-sm text-[var(--tenant-muted)]">
            Rewards unlock through mastery and completion. No random pressure loop is used here.
          </p>
        </div>
        <StatusPill label={`${earnedRewards.length} earned`} tone={earnedRewards.length > 0 ? "success" : "neutral"} />
      </div>
      <div className="mt-4 grid gap-3">
        {catalog.map((reward) => {
          const unlocked = earnedStarDust >= reward.requiredStarDust;

          return (
            <article key={reward.id} className="rounded-lg border border-[var(--tenant-border)] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold">{reward.label}</h4>
                  <p className="mt-1 text-sm text-[var(--tenant-muted)]">{reward.description}</p>
                </div>
                <StatusPill label={unlocked ? "Unlocked" : `${reward.requiredStarDust} ${tenant.rewardName}`} tone={unlocked ? "success" : "warning"} />
              </div>
            </article>
          );
        })}
      </div>
      {nextReward && (
        <p className="mt-4 text-sm text-[var(--tenant-muted)]">
          Next: {nextReward.label} at {nextReward.requiredStarDust} {tenant.rewardName}.
        </p>
      )}
    </Card>
  );
}
