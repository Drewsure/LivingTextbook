export type AiVerifierResultEvidencePacketStatus = "review-only" | "blocked";
export type AiVerifierResultEvidenceCheckStatus =
  | "passed-preview"
  | "failed-preview"
  | "needs-evidence"
  | "blocked";

export interface AiVerifierResultEvidenceCheck {
  checkId: string;
  label: string;
  sourceRecord: string;
  status: AiVerifierResultEvidenceCheckStatus;
  evidence: string;
  blocksTeacherApproval: boolean;
  requiredRepair: string;
}

export interface AiVerifierResultEvidencePacket {
  packetId: string;
  tenantId: string;
  requestId: string;
  verifierPacketId: string;
  storageGuardId: string;
  label: string;
  status: AiVerifierResultEvidencePacketStatus;
  summary: string;
  verifierMode: "offline-review-preview";
  resultState: "verifier-result-not-submitted";
  checks: AiVerifierResultEvidenceCheck[];
  requiredBeforeTeacherReview: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
  reviewerNotes: string[];
  liveVerifierCallAllowed: false;
  teacherReviewAllowed: false;
  packageApprovalAllowed: false;
  routeWriteAllowed: false;
  playlistWriteAllowed: false;
  assignmentWriteAllowed: false;
  studentReadyMarkerAllowed: false;
  supportLanguageProgressAllowed: false;
}

export const AI_VERIFIER_RESULT_REQUIRED_SOURCE_RECORDS = [
  "ai_verifier_submission_packet",
  "teacher_draft_verifier_submission",
  "ai_draft_repair_evidence_packet",
  "schema_validation_packet",
  "pedagogical_lock_packet",
  "target_language_audio_approval",
  "media_rights_evidence_attachment",
  "activity_compatibility_snapshot",
  "ai_gamification_mapping_plan",
] as const;

export const AI_VERIFIER_RESULT_REQUIRED_BLOCKED_ACTIONS = [
  "No live verifier call",
  "No verifier pass/fail finalization",
  "No teacher approval from verifier result",
  "No package approval from verifier result",
  "No route write from verifier result",
  "No playlist write from verifier result",
  "No student assignment from verifier result",
  "No student-ready marker from verifier result",
  "No support-language progress from verifier result",
] as const;

const nextRequiredRecords = [
  "teacher_approval_ledger",
  "package_approval_ledger",
  "release_control_binding",
  "assignment_rollout_gate",
] as const;

export function validateAiVerifierResultEvidencePacket(packet: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(packet)) {
    return ["AI verifier result evidence packet must be a JSON object."];
  }

  const packetId = readString(packet, "packetId");
  const tenantId = readString(packet, "tenantId");
  const requestId = readString(packet, "requestId");
  const verifierPacketId = readString(packet, "verifierPacketId");
  const storageGuardId = readString(packet, "storageGuardId");
  const label = readString(packet, "label");
  const status = readString(packet, "status");
  const summary = readString(packet, "summary");
  const verifierMode = readString(packet, "verifierMode");
  const resultState = readString(packet, "resultState");
  const checks = readChecks(packet);
  const sourceRecords = checks.map((check) => check.sourceRecord);
  const requiredBeforeTeacherReview = readStringArray(packet, "requiredBeforeTeacherReview");
  const blockedActions = readStringArray(packet, "blockedActions");
  const packetNextRequiredRecords = readStringArray(packet, "nextRequiredRecords");
  const reviewerNotes = readStringArray(packet, "reviewerNotes");

  if (!packetId || !tenantId || !requestId || !verifierPacketId || !storageGuardId || !label) {
    errors.push(
      "AI verifier result evidence packet must include packetId, tenantId, requestId, verifierPacketId, storageGuardId, and label.",
    );
  }

  if (!label.toLowerCase().includes("verifier result")) {
    errors.push("AI verifier result evidence packet label must name verifier result evidence.");
  }

  if (status !== "review-only" && status !== "blocked") {
    errors.push("AI verifier result evidence packet must remain review-only or blocked.");
  }

  if (!summary.toLowerCase().includes("review-only")) {
    errors.push("AI verifier result evidence packet summary must preserve a review-only boundary.");
  }

  if (verifierMode !== "offline-review-preview") {
    errors.push("AI verifier result evidence packet must use verifierMode: offline-review-preview.");
  }

  if (resultState !== "verifier-result-not-submitted") {
    errors.push("AI verifier result evidence packet must keep resultState: verifier-result-not-submitted.");
  }

  for (const sourceRecord of AI_VERIFIER_RESULT_REQUIRED_SOURCE_RECORDS) {
    if (!sourceRecords.includes(sourceRecord)) {
      errors.push(`AI verifier result evidence packet must include source record: ${sourceRecord}.`);
    }
  }

  if (checks.length < AI_VERIFIER_RESULT_REQUIRED_SOURCE_RECORDS.length) {
    errors.push("AI verifier result evidence packet must include one check per required source record.");
  }

  if (!checks.some((check) => check.blocksTeacherApproval)) {
    errors.push("AI verifier result evidence packet must include at least one teacher-approval blocking check.");
  }

  for (const check of checks) {
    if (!check.checkId || !check.label || !check.sourceRecord || !check.evidence || !check.requiredRepair) {
      errors.push("AI verifier result checks must include id, label, source record, evidence, and required repair.");
    }

    if (!["passed-preview", "failed-preview", "needs-evidence", "blocked"].includes(check.status)) {
      errors.push(`AI verifier result check has unknown status: ${check.status}.`);
    }
  }

  for (const blockedAction of AI_VERIFIER_RESULT_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(blockedAction)) {
      errors.push(`AI verifier result evidence packet must include blocked action: ${blockedAction}.`);
    }
  }

  for (const record of nextRequiredRecords) {
    if (!packetNextRequiredRecords.includes(record)) {
      errors.push(`AI verifier result evidence packet must include next required record: ${record}.`);
    }
  }

  if (requiredBeforeTeacherReview.length === 0) {
    errors.push("AI verifier result evidence packet must list required-before-teacher-review items.");
  }

  if (reviewerNotes.length === 0) {
    errors.push("AI verifier result evidence packet must include reviewer notes.");
  }

  for (const key of [
    "liveVerifierCallAllowed",
    "teacherReviewAllowed",
    "packageApprovalAllowed",
    "routeWriteAllowed",
    "playlistWriteAllowed",
    "assignmentWriteAllowed",
    "studentReadyMarkerAllowed",
    "supportLanguageProgressAllowed",
  ]) {
    if (readBoolean(packet, key) !== false) {
      errors.push(`AI verifier result evidence packet must keep ${key}: false.`);
    }
  }

  if (tenantId === "ministar") {
    const searchableText = [
      summary,
      ...requiredBeforeTeacherReview,
      ...blockedActions,
      ...packetNextRequiredRecords,
      ...reviewerNotes,
      ...checks.flatMap((check) => [check.label, check.evidence, check.requiredRepair]),
    ].join(" ");

    if (
      !searchableText.includes("English") ||
      !searchableText.includes("hiragana") ||
      !searchableText.includes("Japanese") ||
      !searchableText.includes("support-language")
    ) {
      errors.push("MiniStar verifier result evidence must preserve English progress and hiragana Japanese support-language boundaries.");
    }
  }

  return errors;
}

export function validateAiVerifierResultEvidencePackets(packets: unknown[]): string[] {
  return packets.flatMap((packet) => validateAiVerifierResultEvidencePacket(packet));
}

export function getAiVerifierResultEvidencePacketWarnings(packet: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(packet)) {
    return warnings;
  }

  const checks = readChecks(packet);

  if (!checks.some((check) => check.status === "needs-evidence" || check.status === "blocked")) {
    warnings.push("AI verifier result evidence should keep unresolved checks visible until live verification exists.");
  }

  if (!checks.some((check) => check.sourceRecord.includes("audio"))) {
    warnings.push("AI verifier result evidence should include target-language audio evidence.");
  }

  if (!checks.some((check) => check.sourceRecord.includes("media_rights"))) {
    warnings.push("AI verifier result evidence should include media-rights evidence.");
  }

  return warnings;
}

export function getAiVerifierResultEvidencePacketCollectionWarnings(packets: unknown[]): string[] {
  return packets.flatMap((packet) => getAiVerifierResultEvidencePacketWarnings(packet));
}

function readChecks(source: Record<string, unknown>): AiVerifierResultEvidenceCheck[] {
  const value = source.checks;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((check) => ({
    checkId: readString(check, "checkId"),
    label: readString(check, "label"),
    sourceRecord: readString(check, "sourceRecord"),
    status: readString(check, "status") as AiVerifierResultEvidenceCheckStatus,
    evidence: readString(check, "evidence"),
    blocksTeacherApproval: readBoolean(check, "blocksTeacherApproval") === true,
    requiredRepair: readString(check, "requiredRepair"),
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

function readBoolean(source: Record<string, unknown>, key: string): boolean | undefined {
  const value = source[key];
  return typeof value === "boolean" ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
