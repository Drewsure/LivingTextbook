import type { FeaturePackageTier, GameFamily, GameModeId, ParentEngine } from "@living-textbook/content-model";

export type UnitGameOfferAvailability = "required" | "optional" | "premium" | "teacher-only" | "hidden" | "blocked";
export type UnitGameOfferReadiness = "ready" | "needs-review" | "blocked";

export interface UnitGameOffer {
  offerId: string;
  unitKey: string;
  unitLabel: string;
  gameMode: GameModeId;
  label: string;
  family: GameFamily;
  engineId: ParentEngine;
  availability: UnitGameOfferAvailability;
  readiness: UnitGameOfferReadiness;
  recommendedOrder?: number;
  packageTier: FeaturePackageTier;
  launchRoute?: string;
  audioRequirement: string;
  mediaRequirement: string;
  reportingRequirement: string;
  teacherControls: string[];
  evidence: string;
  nextStep: string;
  notAllowedYet: string[];
}

export interface UnitGameOfferMap {
  mapId: string;
  tenantId: string;
  contentPackageId: string;
  level: number;
  label: string;
  summary: string;
  decisionRule: string;
  offers: UnitGameOffer[];
}
