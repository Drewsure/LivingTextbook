export type RewardRuntimeMode = "review-only" | "hosted-managed" | "local-classroom" | "hybrid";
export type RewardKind = "avatar" | "outfit" | "room-decoration" | "title" | "palette" | "pet-evolution" | "spin-wheel-ticket";

export interface RewardRuntimeRequest {
  tenantId: string;
  packageId: string;
  learnerSlotId: string;
  rewardId: string;
  rewardKind: RewardKind;
  sourceEventId: string;
  sourceEventType: "game_completed" | "mastery_updated" | "entry_practice_completed";
  earnedByMastery: boolean;
  deterministicRuleId: string;
  ownershipProvenanceReady: boolean;
  policyAccepted: boolean;
  persistenceReady: boolean;
  releaseApprovalAccepted: boolean;
  randomRewardRequested: boolean;
  gachaPressureRequested: boolean;
  purchaseRequired: boolean;
  spinWheelTicketRequested: boolean;
}

export interface RewardRuntimeDecision {
  allowed: boolean;
  mode: RewardRuntimeMode;
  reasonCode: string;
  reasons: string[];
  rewardKind: RewardKind;
}

export interface RewardRuntimeResult {
  request: RewardRuntimeRequest;
  decision: RewardRuntimeDecision;
  sideEffect: "none" | "read-only";
}

export interface RewardRuntimeAdapter {
  readonly mode: RewardRuntimeMode;
  evaluate(request: RewardRuntimeRequest): RewardRuntimeDecision;
  execute(request: RewardRuntimeRequest): RewardRuntimeResult;
}

export const reviewOnlyRewardBlockedActions = [
  "No collection inventory write",
  "No reward ownership mutation",
  "No Spin Wheel ticket issuance",
  "No random reward generation",
  "No gacha or purchase pressure",
  "No reward-driven progression bypass",
] as const;

export function validateRewardRuntimeRequest(request: RewardRuntimeRequest): string[] {
  const errors: string[] = [];
  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.packageId.trim()) errors.push("packageId is required");
  if (!request.learnerSlotId.trim()) errors.push("pseudonymous learnerSlotId is required");
  if (!request.rewardId.trim()) errors.push("rewardId is required");
  if (!request.sourceEventId.trim()) errors.push("sourceEventId is required");
  if (!request.deterministicRuleId.trim()) errors.push("deterministic reward rule is required");
  if (!request.earnedByMastery) errors.push("earned mastery evidence is required");
  if (!request.ownershipProvenanceReady) errors.push("ownership provenance readiness is required");
  if (!request.policyAccepted) errors.push("reward policy acceptance is required");
  if (!request.persistenceReady) errors.push("reward persistence readiness is required");
  if (!request.releaseApprovalAccepted) errors.push("reward release approval is required");
  if (request.randomRewardRequested) errors.push("random reward generation must remain disabled");
  if (request.gachaPressureRequested) errors.push("gacha pressure must remain disabled");
  if (request.purchaseRequired) errors.push("purchase-required rewards must remain disabled");
  if (request.spinWheelTicketRequested || request.rewardKind === "spin-wheel-ticket") {
    errors.push("Spin Wheel ticket issuance requires a separately approved reward policy");
  }
  return [...new Set(errors)];
}

export function createReviewOnlyRewardRuntimeAdapter(): RewardRuntimeAdapter {
  return {
    mode: "review-only",
    evaluate(request) {
      const validationErrors = validateRewardRuntimeRequest(request);
      const reasons = [
        ...validationErrors,
        ...reviewOnlyRewardBlockedActions,
        "No reward runtime adapter has been selected for live use",
      ];
      return {
        allowed: false,
        mode: "review-only",
        reasonCode: validationErrors.length > 0 ? "invalid-reward-runtime-request" : "review-only-reward-runtime",
        reasons: [...new Set(reasons)],
        rewardKind: request.rewardKind,
      };
    },
    execute(request) {
      return { request, decision: this.evaluate(request), sideEffect: "none" };
    },
  };
}
