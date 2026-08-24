export type AiVerifierCheckStatus = "ready-for-review" | "blocked" | "draft-only";

export interface AiVerifierSubmissionCheck {
  checkId: string;
  label: string;
  status: AiVerifierCheckStatus;
  evidence: string;
  rejectionRule: string;
}

export interface AiVerifierSubmissionPacket {
  packetId: string;
  tenantId: string;
  requestId: string;
  label: string;
  summary: string;
  verifierVersion: string;
  submissionState: string;
  requiredPackets: string[];
  checks: AiVerifierSubmissionCheck[];
  blockedActions: string[];
  nextRequirements: string[];
}

export const AI_VERIFIER_SUBMISSION_REQUIRED_PACKETS = [
  "ai_verifier_submission_packet",
  "ai_draft_repair_evidence_packet",
  "schema_validation_packet",
  "pedagogical_lock_packet",
  "audio_coverage_packet",
  "engine_binding_packet",
  "gamification_mapping_packet",
  "activity_compatibility_snapshot",
  "media_rights_manifest",
  "teacher_approval_packet",
] as const;

export const AI_VERIFIER_SUBMISSION_REQUIRED_BLOCKED_ACTIONS = [
  "Submit verifier packet blocked",
  "Approve generated package blocked",
  "Create route from verifier packet blocked",
  "Create playlist from verifier packet blocked",
  "Create student assignment from verifier packet blocked",
  "Mark package student-ready blocked",
] as const;

const requiredNextTopics = [
  "Durable verifier submission storage",
  "Reviewer identity",
  "media rights",
  "audio",
  "Package approval ledger",
  "Release-control binding",
] as const;

export function validateAiVerifierSubmissionPacket(packet: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(packet)) {
    return ["AI verifier submission packet must be a JSON object."];
  }

  const packetId = readString(packet, "packetId");
  const tenantId = readString(packet, "tenantId");
  const requestId = readString(packet, "requestId");
  const label = readString(packet, "label");
  const summary = readString(packet, "summary");
  const verifierVersion = readString(packet, "verifierVersion");
  const submissionState = readString(packet, "submissionState");
  const requiredPackets = readStringArray(packet, "requiredPackets");
  const checks = readChecks(packet);
  const blockedActions = readStringArray(packet, "blockedActions");
  const nextRequirements = readStringArray(packet, "nextRequirements");

  if (!packetId || !tenantId || !requestId || !label) {
    errors.push("AI verifier submission packet must include packetId, tenantId, requestId, and label.");
  }

  if (!label.toLowerCase().includes("verifier")) {
    errors.push("AI verifier submission packet label must name verifier review.");
  }

  if (!summary.toLowerCase().includes("review-only")) {
    errors.push("AI verifier submission packet summary must preserve a review-only boundary.");
  }

  if (!verifierVersion) {
    errors.push("AI verifier submission packet must include a verifierVersion.");
  }

  if (submissionState !== "Submit verifier packet blocked") {
    errors.push("AI verifier submission packet must keep submissionState: Submit verifier packet blocked.");
  }

  for (const requiredPacket of AI_VERIFIER_SUBMISSION_REQUIRED_PACKETS) {
    if (!requiredPackets.includes(requiredPacket)) {
      errors.push(`AI verifier submission packet must include required packet: ${requiredPacket}.`);
    }
  }

  for (const blockedAction of AI_VERIFIER_SUBMISSION_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(blockedAction)) {
      errors.push(`AI verifier submission packet must include blocked action: ${blockedAction}.`);
    }
  }

  for (const topic of requiredNextTopics) {
    if (!textListIncludes(nextRequirements, topic)) {
      errors.push(`AI verifier submission packet must include next requirement topic: ${topic}.`);
    }
  }

  if (checks.length < 8) {
    errors.push("AI verifier submission packet must include at least eight verifier checks.");
  }

  if (!checks.some((check) => check.status === "blocked")) {
    errors.push("AI verifier submission packet must include at least one blocked verifier check.");
  }

  if (!checks.some((check) => check.label.toLowerCase().includes("repair"))) {
    errors.push("AI verifier submission packet must include draft repair evidence check.");
  }

  for (const check of checks) {
    if (!check.checkId || !check.label || !check.evidence || !check.rejectionRule) {
      errors.push("AI verifier submission checks must include id, label, evidence, and rejection rule.");
    }

    if (!["ready-for-review", "blocked", "draft-only"].includes(check.status)) {
      errors.push(`AI verifier submission check has unknown status: ${check.status}.`);
    }

    if (!check.rejectionRule.toLowerCase().includes("reject")) {
      errors.push(`AI verifier submission check must state a rejection rule: ${check.checkId}.`);
    }
  }

  if (!checks.some((check) => check.label.toLowerCase().includes("target-language"))) {
    errors.push("AI verifier submission packet must include a target-language progression check.");
  }

  if (tenantId === "ministar") {
    const searchableText = [summary, ...requiredPackets, ...blockedActions, ...nextRequirements]
      .concat(checks.flatMap((check) => [check.label, check.evidence, check.rejectionRule]))
      .join(" ");

    if (
      !searchableText.includes("hiragana") ||
      !searchableText.includes("Japanese") ||
      !searchableText.includes("support-language")
    ) {
      errors.push("MiniStar AI verifier submission packet must preserve hiragana support-language boundaries.");
    }
  }

  return errors;
}

export function validateAiVerifierSubmissionPackets(packets: unknown[]): string[] {
  return packets.flatMap((packet) => validateAiVerifierSubmissionPacket(packet));
}

export function getAiVerifierSubmissionPacketWarnings(packet: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(packet)) {
    return warnings;
  }

  const checks = readChecks(packet);
  const blockedActions = readStringArray(packet, "blockedActions");

  if (!checks.some((check) => check.label.toLowerCase().includes("audio"))) {
    warnings.push("AI verifier submission packet should include target-language audio checks.");
  }

  if (!checks.some((check) => check.label.toLowerCase().includes("rights"))) {
    warnings.push("AI verifier submission packet should include media-rights checks.");
  }

  if (!textListIncludes(blockedActions, "student-ready")) {
    warnings.push("AI verifier submission packet should block student-ready markers explicitly.");
  }

  return warnings;
}

export function getAiVerifierSubmissionPacketCollectionWarnings(packets: unknown[]): string[] {
  return packets.flatMap((packet) => getAiVerifierSubmissionPacketWarnings(packet));
}

function readChecks(source: Record<string, unknown>): AiVerifierSubmissionCheck[] {
  const value = source.checks;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((check) => ({
    checkId: readString(check, "checkId"),
    label: readString(check, "label"),
    status: readString(check, "status") as AiVerifierCheckStatus,
    evidence: readString(check, "evidence"),
    rejectionRule: readString(check, "rejectionRule"),
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
  const normalizedExpected = expected.toLowerCase();
  return items.some((item) => item.toLowerCase().includes(normalizedExpected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
