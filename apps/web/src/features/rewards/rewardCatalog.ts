export type RewardKind = "avatar" | "badge" | "title" | "cosmetic" | "room-item" | "pet-evolution" | "palette" | "power-up";

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
    id: "starter-room-star-mat",
    label: "Starter Room Mat",
    kind: "room-item",
    description: "A first learning-space decoration earned through target-language practice.",
    requiredStarDust: 450,
  },
  {
    id: "memory-ready-title",
    label: "Memory Ready",
    kind: "title",
    description: "Earned after opening the first reinforcement game path.",
    requiredStarDust: 600,
  },
  {
    id: "avatar-bright-scarf",
    label: "Bright Avatar Scarf",
    kind: "cosmetic",
    description: "A simple avatar accessory earned through early mastery.",
    requiredStarDust: 750,
  },
  {
    id: "starter-focus-boost",
    label: "Starter Focus Boost",
    kind: "power-up",
    description: "A future classroom-safe helper reward for early review sessions.",
    requiredStarDust: 900,
  },
  {
    id: "companion-step-one",
    label: "Companion Step One",
    kind: "pet-evolution",
    description: "A future mascot or pet growth marker. Tenant-specific art comes later.",
    requiredStarDust: 1200,
  },
];

export function getEarnedRewards(catalog: RewardCatalogItem[], earnedStarDust: number): RewardCatalogItem[] {
  return catalog.filter((reward) => earnedStarDust >= reward.requiredStarDust);
}

export function getNextReward(catalog: RewardCatalogItem[], earnedStarDust: number): RewardCatalogItem | undefined {
  return catalog.find((reward) => earnedStarDust < reward.requiredStarDust);
}
