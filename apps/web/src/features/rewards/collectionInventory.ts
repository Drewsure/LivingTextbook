import type { GameProgressEvent, StudentProgressionState } from "@living-textbook/content-model";
import type { RewardCatalogItem } from "./rewardCatalog";

export type CollectionOwnershipStatus = "owned-preview" | "locked-preview";

export interface CollectionInventoryPreviewItem {
  collectionItemId: string;
  rewardId: string;
  rewardLabel: string;
  rewardKind: RewardCatalogItem["kind"];
  ownershipStatus: CollectionOwnershipStatus;
  unlockSourceEventId: string;
  unlockSourceEventType: GameProgressEvent["type"];
  masteryRuleSnapshot: string;
  earnedAt: string;
  storageReadiness: "policy-gated";
}

export function createCollectionInventoryPreview(args: {
  catalog: RewardCatalogItem[];
  progression: StudentProgressionState;
  launchCode: string;
}): CollectionInventoryPreviewItem[] {
  return args.catalog
    .filter((reward) => args.progression.earnedStarDust >= reward.requiredStarDust)
    .map((reward) => {
      const source = getUnlockSource(reward.requiredStarDust);

      return {
        collectionItemId: `preview:${args.launchCode}:${reward.id}`,
        rewardId: reward.id,
        rewardLabel: reward.label,
        rewardKind: reward.kind,
        ownershipStatus: "owned-preview",
        unlockSourceEventId: `${args.launchCode}:${source.type}:${reward.id}`,
        unlockSourceEventType: source.type,
        masteryRuleSnapshot: `${reward.requiredStarDust} Star Dust required from accepted target-language mastery or completion events.`,
        earnedAt: args.progression.lastEventAt ?? "preview-only",
        storageReadiness: "policy-gated",
      };
    });
}

function getUnlockSource(requiredStarDust: number): { type: GameProgressEvent["type"] } {
  if (requiredStarDust <= 300) {
    return { type: "entry_practice_completed" };
  }

  if (requiredStarDust <= 600) {
    return { type: "game_unlocked" };
  }

  if (requiredStarDust <= 900) {
    return { type: "mastery_updated" };
  }

  return { type: "game_completed" };
}
