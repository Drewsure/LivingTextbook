export type RewardKind = "badge" | "title" | "cosmetic" | "power-up";

export interface RewardCatalogItem {
  id: string;
  label: string;
  kind: RewardKind;
  description: string;
  requiredStarDust: number;
}

export const starterRewardCatalog: RewardCatalogItem[] = [
  {
    id: "first-practice-spark",
    label: "First Practice Spark",
    kind: "badge",
    description: "Earned by completing the first flashcard entry practice.",
    requiredStarDust: 300,
  },
  {
    id: "memory-ready-title",
    label: "Memory Ready",
    kind: "title",
    description: "Earned after opening the first reinforcement game path.",
    requiredStarDust: 600,
  },
  {
    id: "starter-focus-boost",
    label: "Starter Focus Boost",
    kind: "power-up",
    description: "A future classroom-safe helper reward for early review sessions.",
    requiredStarDust: 900,
  },
];

export function getEarnedRewards(catalog: RewardCatalogItem[], earnedStarDust: number): RewardCatalogItem[] {
  return catalog.filter((reward) => earnedStarDust >= reward.requiredStarDust);
}

export function getNextReward(catalog: RewardCatalogItem[], earnedStarDust: number): RewardCatalogItem | undefined {
  return catalog.find((reward) => earnedStarDust < reward.requiredStarDust);
}
