import { Card, StatusPill } from "@living-textbook/ui";
import { getEarnedRewards, getNextReward } from "./rewardCatalog";
import type { RewardCatalogItem, RewardKind } from "./rewardCatalog";
import type { StudentProgressionState } from "@living-textbook/content-model";
import type { TenantConfig } from "@/features/tenant/types";

interface CollectionGalleryPanelProps {
  tenant: TenantConfig;
  progression: StudentProgressionState;
  catalog: RewardCatalogItem[];
  launchCode: string;
}

const kindLabels: Record<RewardKind, string> = {
  avatar: "Avatar",
  badge: "Badge",
  title: "Title",
  cosmetic: "Cosmetic",
  "room-item": "Room item",
  "pet-evolution": "Companion",
  palette: "Palette",
  "power-up": "Power-up",
};

const kindTone: Record<RewardKind, "neutral" | "success" | "warning"> = {
  avatar: "success",
  badge: "success",
  title: "neutral",
  cosmetic: "neutral",
  "room-item": "success",
  "pet-evolution": "success",
  palette: "neutral",
  "power-up": "warning",
};

export function CollectionGalleryPanel({ tenant, progression, catalog, launchCode }: CollectionGalleryPanelProps) {
  const earnedRewards = getEarnedRewards(catalog, progression.earnedStarDust);
  const nextReward = getNextReward(catalog, progression.earnedStarDust);
  const categories = Array.from(new Set(catalog.map((reward) => reward.kind)));

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Earned collection</p>
            <h2 className="mt-1 text-2xl font-bold">Collection room preview</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--tenant-muted)]">
              Students unlock collection items through mastery and completion. This is a deterministic ownership loop, not a random pressure loop or paid gacha system.
            </p>
          </div>
          <StatusPill label={`${earnedRewards.length}/${catalog.length} earned`} tone={earnedRewards.length > 0 ? "success" : "neutral"} />
        </div>

        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <CollectionMetric label="Tenant reward" value={tenant.rewardName} />
          <CollectionMetric label="Launch code" value={launchCode} />
          <CollectionMetric label="Current total" value={`${progression.earnedStarDust} ${tenant.rewardName}`} />
          <CollectionMetric label="Categories" value={String(categories.length)} />
        </dl>
      </Card>

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--tenant-muted)]">Collection map</p>
            <h3 className="mt-1 text-lg font-bold">Mastery unlocks only</h3>
          </div>
          <StatusPill label="No random rewards" tone="success" />
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {catalog.map((reward) => {
            const unlocked = progression.earnedStarDust >= reward.requiredStarDust;

            return (
              <article key={reward.id} className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{kindLabels[reward.kind]}</p>
                    <h4 className="mt-1 text-sm font-bold text-[var(--tenant-text)]">{reward.label}</h4>
                  </div>
                  <StatusPill
                    label={unlocked ? "Unlocked" : `${reward.requiredStarDust} ${tenant.rewardName}`}
                    tone={unlocked ? "success" : kindTone[reward.kind]}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--tenant-muted)]">{reward.description}</p>
              </article>
            );
          })}
        </div>

        {nextReward ? (
          <p className="mt-4 rounded-lg border border-[var(--tenant-border)] p-3 text-sm font-semibold leading-6 text-[var(--tenant-text)]">
            Next collection unlock: {nextReward.label} at {nextReward.requiredStarDust} {tenant.rewardName}.
          </p>
        ) : (
          <p className="mt-4 rounded-lg border border-[var(--tenant-border)] p-3 text-sm font-semibold leading-6 text-[var(--tenant-text)]">
            All current collection preview items are unlocked.
          </p>
        )}
      </Card>
    </div>
  );
}

function CollectionMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--tenant-border)] bg-[var(--tenant-primary-soft)] p-3">
      <dt className="text-xs font-semibold uppercase text-[var(--tenant-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-[var(--tenant-text)]">{value}</dd>
    </div>
  );
}
