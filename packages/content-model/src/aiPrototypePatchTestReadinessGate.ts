export type AiPrototypePatchTestReadinessGateStatus = "blocked" | "review-only" | "ready-for-test-planning";
export type AiPrototypePatchTestLaneStatus = "missing" | "blocked" | "pending-review" | "planned";

export interface AiPrototypePatchTestLane {
  laneId: string;
  label: string;
  status: AiPrototypePatchTestLaneStatus;
  requiredRecord: string;
  evidenceNeeded: string;
}

export interface AiPrototypePatchTestReadinessGate {
  gateId: string;
  tenantId: string;
  requestId: string;
  proposalId: string;
  label: string;
  status: AiPrototypePatchTestReadinessGateStatus;
  summary: string;
  sourceRecords: string[];
  testLanes: AiPrototypePatchTestLane[];
  rollbackRequirements: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const AI_PROTOTYPE_PATCH_TEST_READINESS_REQUIRED_SOURCE_RECORDS = [
  "ai_prototype_patch_test_readiness_gate",
  "ai_prototype_app_patch_proposal",
  "codex_integration_review_decision",
  "ai_prototype_integration_readiness_gate",
  "reviewer_identity_signature_gate",
  "package_publish_gate",
] as const;

export const AI_PROTOTYPE_PATCH_TEST_REQUIRED_LANES = [
  {
    laneId: "fixture-replay",
    requiredRecord: "ai_prototype_fixture_replay_report",
  },
  {
    laneId: "event-replay",
    requiredRecord: "ai_prototype_event_replay_report",
  },
  {
    laneId: "audio-coverage",
    requiredRecord: "ai_prototype_audio_coverage_report",
  },
  {
    laneId: "mobile-accessibility",
    requiredRecord: "ai_prototype_mobile_accessibility_report",
  },
  {
    laneId: "scoring-replay",
    requiredRecord: "ai_prototype_scoring_replay_report",
  },
  {
    laneId: "route-safety",
    requiredRecord: "route_registry_release_gate",
  },
  {
    laneId: "storage-contract",
    requiredRecord: "ai_prototype_app_patch_proposal",
  },
  {
    laneId: "rollback-drill",
    requiredRecord: "package_publish_gate",
  },
] as const;

export const AI_PROTOTYPE_PATCH_TEST_REQUIRED_ROLLBACK_REQUIREMENTS = [
  "Named Codex rollback owner",
  "Revert scope before file work",
  "Feature flag or route flag before exposure",
  "Package version snapshot before promotion",
  "Release-control audit entry before any student route",
] as const;

export const AI_PROTOTYPE_PATCH_TEST_BLOCKED_ACTIONS = [
  "No test execution from this panel",
  "No app file write",
  "No generated route write",
  "No route alias mutation",
  "No scoring or reward mutation",
  "No audio manifest mutation",
  "No package promotion",
  "No assignment",
  "No support-language progress trigger",
] as const;

export const AI_PROTOTYPE_PATCH_TEST_NEXT_RECORDS = [
  "Patch test harness plan",
  "Route safety release gate",
  "Rollback drill record",
  "Storage contract verification",
  "Codex patch approval decision",
] as const;

export function validateAiPrototypePatchTestReadinessGate(gate: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(gate)) {
    return ["AI prototype patch test readiness gate must be a JSON object."];
  }

  const gateId = readString(gate, "gateId");
  const tenantId = readString(gate, "tenantId");
  const requestId = readString(gate, "requestId");
  const proposalId = readString(gate, "proposalId");
  const label = readString(gate, "label");
  const status = readString(gate, "status");
  const summary = readString(gate, "summary");
  const sourceRecords = readStringArray(gate, "sourceRecords");
  const testLanes = readPatchTestLanes(gate);
  const rollbackRequirements = readStringArray(gate, "rollbackRequirements");
  const blockedActions = readStringArray(gate, "blockedActions");
  const nextRequiredRecords = readStringArray(gate, "nextRequiredRecords");

  if (!gateId || !tenantId || !requestId || !proposalId) {
    errors.push("AI prototype patch test readiness gate must include gateId, tenantId, requestId, and proposalId.");
  }

  if (!label.includes("patch test readiness gate")) {
    errors.push("AI prototype patch test readiness gate label must name the patch test readiness gate.");
  }

  if (status !== "blocked" && status !== "review-only" && status !== "ready-for-test-planning") {
    errors.push("AI prototype patch test readiness gate must use a supported review-only status.");
  }

  if (!summary.includes("Patch testing remains blocked") && !summary.includes("patch testing remains blocked")) {
    errors.push("AI prototype patch test readiness gate summary must keep patch testing blocked.");
  }

  for (const sourceRecord of AI_PROTOTYPE_PATCH_TEST_READINESS_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(sourceRecord)) {
      errors.push(`AI prototype patch test readiness gate must include source record: ${sourceRecord}.`);
    }
  }

  for (const requiredLane of AI_PROTOTYPE_PATCH_TEST_REQUIRED_LANES) {
    const matchingLane = testLanes.find((lane) => lane.laneId === requiredLane.laneId);

    if (!matchingLane) {
      errors.push(`AI prototype patch test readiness gate must include lane: ${requiredLane.laneId}.`);
      continue;
    }

    if (matchingLane.requiredRecord !== requiredLane.requiredRecord) {
      errors.push(
        `AI prototype patch test readiness gate lane ${requiredLane.laneId} must require record: ${requiredLane.requiredRecord}.`,
      );
    }

    if (!matchingLane.evidenceNeeded) {
      errors.push(`AI prototype patch test readiness gate lane ${requiredLane.laneId} must include evidence needed.`);
    }
  }

  for (const requirement of AI_PROTOTYPE_PATCH_TEST_REQUIRED_ROLLBACK_REQUIREMENTS) {
    if (!rollbackRequirements.includes(requirement)) {
      errors.push(`AI prototype patch test readiness gate must include rollback requirement: ${requirement}.`);
    }
  }

  for (const blockedAction of AI_PROTOTYPE_PATCH_TEST_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI prototype patch test readiness gate must block action: ${blockedAction}.`);
    }
  }

  for (const nextRecord of AI_PROTOTYPE_PATCH_TEST_NEXT_RECORDS) {
    if (!nextRequiredRecords.includes(nextRecord)) {
      errors.push(`AI prototype patch test readiness gate must include next required record: ${nextRecord}.`);
    }
  }

  if (!testLanes.some((lane) => lane.status === "blocked")) {
    errors.push("AI prototype patch test readiness gate must keep at least one test lane blocked until review completes.");
  }

  if (tenantId === "ministar") {
    const hiraganaLane = testLanes.find((lane) => lane.laneId === "hiragana-support-boundary");

    if (!hiraganaLane) {
      errors.push("MiniStar AI prototype patch test readiness gate must include hiragana support boundary lane.");
    } else if (!hiraganaLane.evidenceNeeded.includes("hiragana-only") || !hiraganaLane.evidenceNeeded.includes("cannot unlock English progress")) {
      errors.push("MiniStar AI prototype patch test readiness gate must keep Japanese support hiragana-only and support-only.");
    }
  }

  return errors;
}

export function getAiPrototypePatchTestReadinessGateWarnings(gate: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(gate)) {
    return warnings;
  }

  const status = readString(gate, "status");
  const testLanes = readPatchTestLanes(gate);
  const blockedActions = readStringArray(gate, "blockedActions");

  if (status === "ready-for-test-planning" && !testLanes.every((lane) => lane.status === "planned")) {
    warnings.push("A ready-for-test-planning gate should have every test lane planned.");
  }

  if (!testLanes.every((lane) => lane.evidenceNeeded.includes("No") || lane.evidenceNeeded.includes("must") || lane.evidenceNeeded.includes("remain") || lane.evidenceNeeded.includes("stays"))) {
    warnings.push("Every patch test lane should describe a concrete acceptance boundary.");
  }

  if (!textListIncludes(blockedActions, "No support-language progress trigger")) {
    warnings.push("Patch test readiness gates should block support-language progress triggers.");
  }

  return warnings;
}

export function validateAiPrototypePatchTestReadinessGates(gates: unknown[]): string[] {
  return gates.flatMap((gate) => validateAiPrototypePatchTestReadinessGate(gate));
}

export function getAiPrototypePatchTestReadinessGateCollectionWarnings(gates: unknown[]): string[] {
  return gates.flatMap((gate) => getAiPrototypePatchTestReadinessGateWarnings(gate));
}

function readPatchTestLanes(source: Record<string, unknown>): AiPrototypePatchTestLane[] {
  const value = source.testLanes;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((lane) => ({
    laneId: readString(lane, "laneId"),
    label: readString(lane, "label"),
    status: readString(lane, "status") as AiPrototypePatchTestLaneStatus,
    requiredRecord: readString(lane, "requiredRecord"),
    evidenceNeeded: readString(lane, "evidenceNeeded"),
  }));
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readStringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim());
}

function textListIncludes(items: string[], expected: string): boolean {
  return items.some((item) => item.includes(expected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
