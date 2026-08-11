export type AiGeneratedPackageWriterTestEvidencePacketStatus = "blocked" | "review-only";

export interface AiGeneratedPackageWriterTestEvidenceLane {
  laneId: string;
  label: string;
  sourceRecords: string[];
  requiredEvidence: string[];
  acceptanceChecks: string[];
  blockedGaps: string[];
}

export interface AiGeneratedPackageWriterTestEvidencePacket {
  evidencePacketId: string;
  tenantId: string;
  requestId: string;
  moduleTestPlanId: string;
  implementationReadinessId: string;
  rollbackDrillId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageWriterTestEvidencePacketStatus;
  evidenceState: string;
  packageIdPreview: string;
  evidenceLanes: AiGeneratedPackageWriterTestEvidenceLane[];
  missingEvidence: string[];
  blockedEvidenceActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const AI_PACKAGE_WRITER_TEST_EVIDENCE_REQUIRED_LANE_LABELS = [
  "Fixture evidence lane",
  "Route and QR evidence lane",
  "Audio and media evidence lane",
  "Local and assignment evidence lane",
  "Rollback and support-language evidence lane",
] as const;

export const AI_PACKAGE_WRITER_TEST_EVIDENCE_REQUIRED_ITEMS = [
  "Reviewed JSON fixture replay",
  "Tap-to-speak audio coverage report",
  "Rollback drill replay result",
  "Support-language boundary proof",
] as const;

export const AI_PACKAGE_WRITER_TEST_EVIDENCE_REQUIRED_BLOCKED_ACTIONS = [
  "No automated writer test execution",
  "No writer mutation browser run",
  "No evidence upload or signed approval capture",
  "No app file patch",
  "No generated package JSON write",
  "No route registry write",
  "No media playlist write",
  "No local bundle packaging",
  "No assignment activation",
  "No production QR redirect mutation",
  "No support-language-only evidence pass",
] as const;

export function validateAiGeneratedPackageWriterTestEvidencePacket(packet: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(packet)) {
    return ["AI generated package writer test evidence packet must be a JSON object."];
  }

  const evidencePacketId = readString(packet, "evidencePacketId");
  const tenantId = readString(packet, "tenantId");
  const requestId = readString(packet, "requestId");
  const moduleTestPlanId = readString(packet, "moduleTestPlanId");
  const implementationReadinessId = readString(packet, "implementationReadinessId");
  const rollbackDrillId = readString(packet, "rollbackDrillId");
  const status = readString(packet, "status");
  const evidenceState = readString(packet, "evidenceState");
  const packageIdPreview = readString(packet, "packageIdPreview");
  const evidenceLanes = readArray(packet, "evidenceLanes");
  const missingEvidence = readStringArray(packet, "missingEvidence");
  const blockedEvidenceActions = readStringArray(packet, "blockedEvidenceActions");
  const supportLanguageBoundary = readStringArray(packet, "supportLanguageBoundary");

  if (
    !evidencePacketId ||
    !tenantId ||
    !requestId ||
    !moduleTestPlanId ||
    !implementationReadinessId ||
    !rollbackDrillId
  ) {
    errors.push(
      "AI generated package writer test evidence packet must include evidencePacketId, tenantId, requestId, moduleTestPlanId, implementationReadinessId, and rollbackDrillId.",
    );
  }

  if (status !== "blocked") {
    errors.push("AI generated package writer test evidence packet status must stay blocked in the foundation.");
  }

  if (!evidenceState.toLowerCase().includes("blocked")) {
    errors.push("AI generated package writer test evidence packet must state that evidence use is blocked.");
  }

  if (!packageIdPreview) {
    errors.push("AI generated package writer test evidence packet must include packageIdPreview.");
  }

  const laneLabels = evidenceLanes.flatMap((lane) => (isRecord(lane) ? [readString(lane, "label")] : []));

  for (const requiredLane of AI_PACKAGE_WRITER_TEST_EVIDENCE_REQUIRED_LANE_LABELS) {
    if (!laneLabels.includes(requiredLane)) {
      errors.push(`AI generated package writer test evidence packet must include lane: ${requiredLane}.`);
    }
  }

  const laneEvidence = evidenceLanes.flatMap((lane) =>
    isRecord(lane) ? readStringArray(lane, "requiredEvidence") : [],
  );

  for (const requiredEvidence of AI_PACKAGE_WRITER_TEST_EVIDENCE_REQUIRED_ITEMS) {
    if (!laneEvidence.includes(requiredEvidence)) {
      errors.push(`AI generated package writer test evidence packet must require evidence: ${requiredEvidence}.`);
    }
  }

  for (const requiredAction of AI_PACKAGE_WRITER_TEST_EVIDENCE_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedEvidenceActions.includes(requiredAction)) {
      errors.push(`AI generated package writer test evidence packet must block: ${requiredAction}.`);
    }
  }

  if (missingEvidence.length === 0) {
    errors.push("AI generated package writer test evidence packet must list missingEvidence while blocked.");
  }

  if (supportLanguageBoundary.length === 0 || !supportLanguageBoundary.join(" ").toLowerCase().includes("support")) {
    errors.push("AI generated package writer test evidence packet must preserve a support-language boundary.");
  }

  for (const lane of evidenceLanes) {
    if (!isRecord(lane)) {
      errors.push("AI generated package writer test evidence lanes must be objects.");
      continue;
    }

    const laneId = readString(lane, "laneId");
    const sourceRecords = readStringArray(lane, "sourceRecords");
    const requiredEvidence = readStringArray(lane, "requiredEvidence");
    const acceptanceChecks = readStringArray(lane, "acceptanceChecks");
    const blockedGaps = readStringArray(lane, "blockedGaps");

    if (!laneId) {
      errors.push("AI generated package writer test evidence lanes must include laneId.");
    }

    if (
      sourceRecords.length === 0 ||
      requiredEvidence.length === 0 ||
      acceptanceChecks.length === 0 ||
      blockedGaps.length === 0
    ) {
      errors.push(
        `AI generated package writer test evidence lane ${laneId || "(missing)"} must include sourceRecords, requiredEvidence, acceptanceChecks, and blockedGaps.`,
      );
    }

    if (!blockedGaps.every((blockedGap) => blockedGap.startsWith("No "))) {
      errors.push(
        `AI generated package writer test evidence lane ${laneId || "(missing)"} blockedGaps must be explicit No rules.`,
      );
    }
  }

  return errors;
}

export function getAiGeneratedPackageWriterTestEvidencePacketWarnings(packet: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(packet)) {
    return warnings;
  }

  const nextRequiredRecords = readStringArray(packet, "nextRequiredRecords");

  if (!nextRequiredRecords.includes("codex_test_harness_decision")) {
    warnings.push("AI generated package writer test evidence packet should require codex_test_harness_decision.");
  }

  if (!nextRequiredRecords.includes("school_policy_acceptance_record_preview")) {
    warnings.push(
      "AI generated package writer test evidence packet should require school_policy_acceptance_record_preview.",
    );
  }

  if (!nextRequiredRecords.includes("package_writer_test_evidence_packet storage contract")) {
    warnings.push(
      "AI generated package writer test evidence packet should require package_writer_test_evidence_packet storage contract.",
    );
  }

  return warnings;
}

export function validateAiGeneratedPackageWriterTestEvidencePackets(packets: unknown[]): string[] {
  return packets.flatMap((packet) => validateAiGeneratedPackageWriterTestEvidencePacket(packet));
}

export function getAiGeneratedPackageWriterTestEvidencePacketCollectionWarnings(packets: unknown[]): string[] {
  return packets.flatMap((packet) => getAiGeneratedPackageWriterTestEvidencePacketWarnings(packet));
}

function readArray(source: Record<string, unknown>, key: string): unknown[] {
  const value = source[key];
  return Array.isArray(value) ? value : [];
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
