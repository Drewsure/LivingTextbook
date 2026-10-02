export type PhaserCandidateWrapperBridgeStatus = "blocked" | "review-only" | "ready-for-codex-decision";
export type PhaserCandidateWrapperBridgeCheckStatus = "passed" | "pending" | "blocked";

export interface PhaserCandidateWrapperBridgeCheck {
  checkId: string;
  label: string;
  status: PhaserCandidateWrapperBridgeCheckStatus;
  evidence: string;
  requiredCorrection?: string;
}

export interface PhaserCandidateWrapperBridge {
  bridgeId: string;
  candidatePackageId: string;
  tenantId: string;
  gameMode: "memory-match";
  parentEngine: "pairing";
  status: PhaserCandidateWrapperBridgeStatus;
  summary: string;
  source: {
    repository: string;
    snapshotId: string;
    commitSha: string;
  };
  canonicalSurface: {
    component: string;
    route: string;
    scoringProfile: string;
  };
  normalizationPlan: string[];
  checks: PhaserCandidateWrapperBridgeCheck[];
  blockedActions: string[];
  nextAction: string;
}

export const PHASER_CANDIDATE_WRAPPER_BRIDGE_BLOCKED_ACTIONS = [
  "No direct source import",
  "No canonical route replacement",
  "No wrapper approval",
  "No scene-owned scoring, mastery, Star Dust, rewards, persistence, or reporting",
  "No audio manifest mutation",
  "No package promotion or student assignment",
] as const;

export const PHASER_CANDIDATE_WRAPPER_BRIDGE_REQUIRED_CHECKS = [
  "source-identity",
  "fixture-normalization",
  "canonical-event-sequence",
  "canonical-scoring-profile",
  "target-language-audio",
  "state-ownership",
  "accessibility",
  "codex-decision",
] as const;

export function validatePhaserCandidateWrapperBridge(
  bridge: unknown,
): string[] {
  const errors: string[] = [];
  if (!isRecord(bridge)) return ["Phaser candidate wrapper bridge must be a JSON object."];

  if (readString(bridge, "gameMode") !== "memory-match") errors.push("Phaser candidate wrapper bridge must bind memory-match.");
  if (readString(bridge, "parentEngine") !== "pairing") errors.push("Phaser candidate wrapper bridge must bind the pairing parent engine.");
  if (!["blocked", "review-only", "ready-for-codex-decision"].includes(readString(bridge, "status"))) {
    errors.push("Phaser candidate wrapper bridge must use a non-promoting review status.");
  }
  if (readString(bridge, "status") === "ready-for-codex-decision") {
    errors.push("Phaser candidate wrapper bridge must not imply approval before the Codex decision.");
  }

  const source = isRecord(bridge.source) ? bridge.source : {};
  if (readString(source, "repository") !== "Drewsure/ministar-lab") errors.push("Phaser candidate wrapper bridge must preserve the source repository.");
  if (readString(source, "snapshotId") !== "frozen-2026-09-12-aaa-stable") errors.push("Phaser candidate wrapper bridge must preserve the frozen source snapshot.");
  if (readString(source, "commitSha") !== "eb79ddf5940ab47cc3c45c119c67ee1b6b958e55") errors.push("Phaser candidate wrapper bridge must preserve the frozen source commit.");

  const canonicalSurface = isRecord(bridge.canonicalSurface) ? bridge.canonicalSurface : {};
  if (!readString(canonicalSurface, "component").includes("PairingMemoryMatchGame")) errors.push("Phaser candidate wrapper bridge must name PairingMemoryMatchGame as the canonical surface.");
  if (!readString(canonicalSurface, "route").includes("memory/[code]")) errors.push("Phaser candidate wrapper bridge must name the canonical memory route.");
  if (readString(canonicalSurface, "scoringProfile") !== "pairing-reinforcement-v1") errors.push("Phaser candidate wrapper bridge must name pairing-reinforcement-v1 as canonical scoring authority.");

  const checks = Array.isArray(bridge.checks) ? bridge.checks : [];
  const checkIds = new Set(checks.map((check) => isRecord(check) ? readString(check, "checkId") : ""));
  for (const checkId of PHASER_CANDIDATE_WRAPPER_BRIDGE_REQUIRED_CHECKS) {
    if (!checkIds.has(checkId)) errors.push(`Phaser candidate wrapper bridge is missing check ${checkId}.`);
  }
  if (!checks.some((check) => isRecord(check) && readString(check, "status") === "blocked")) {
    errors.push("Phaser candidate wrapper bridge must expose at least one blocked check until promotion evidence is complete.");
  }

  const normalizationPlan = Array.isArray(bridge.normalizationPlan) ? bridge.normalizationPlan : [];
  if (normalizationPlan.length < 4) errors.push("Phaser candidate wrapper bridge must include a concrete normalization plan.");

  const blockedActions = readStringArray(bridge, "blockedActions");
  for (const action of PHASER_CANDIDATE_WRAPPER_BRIDGE_BLOCKED_ACTIONS) {
    if (!blockedActions.some((item) => item.includes(action))) errors.push(`Phaser candidate wrapper bridge must block: ${action}.`);
  }
  if (!readString(bridge, "nextAction")) errors.push("Phaser candidate wrapper bridge must state the next action.");
  return errors;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}
