export type AiGeneratedPackageTeacherReviewPacketStatus =
  | "blocked"
  | "review-only"
  | "ready-for-teacher-review";

export type AiGeneratedPackageTeacherReviewLaneStatus =
  | "blocked"
  | "needs-evidence"
  | "review-ready"
  | "accepted-preview";

export interface AiGeneratedPackageTeacherReviewLane {
  label: string;
  status: AiGeneratedPackageTeacherReviewLaneStatus;
  sourceRecord: string;
  evidence: string;
  teacherQuestion: string;
  blocker: string;
}

export interface AiGeneratedPackageTeacherReviewPacket {
  packetId: string;
  tenantId: string;
  requestId: string;
  label: string;
  status: AiGeneratedPackageTeacherReviewPacketStatus;
  summary: string;
  decisionLanes: AiGeneratedPackageTeacherReviewLane[];
  readySignals: string[];
  missingEvidence: string[];
  blockedActions: string[];
  nextRequiredRecords: string[];
}

export const AI_GENERATED_PACKAGE_TEACHER_REVIEW_REQUIRED_LANE_TOPICS = [
  "content fit",
  "target-language audio",
  "activity pathway",
  "media",
  "reward",
  "verifier",
] as const;

export const AI_GENERATED_PACKAGE_TEACHER_REVIEW_REQUIRED_RECORDS = [
  "ai_verifier_result_evidence_packet",
  "teacher_approval_ledger",
  "media_rights_evidence_attachment",
  "target_language_audio_approval",
  "release_control_binding",
  "assignment_rollout_gate",
] as const;

export const AI_GENERATED_PACKAGE_TEACHER_REVIEW_MISSING_EVIDENCE_TOPICS = [
  "teacher approval",
  "verifier result evidence",
  "target-language audio approval",
  "media",
  "release-control binding",
  "assignment rollout gate",
] as const;

export const AI_GENERATED_PACKAGE_TEACHER_REVIEW_BLOCKED_ACTIONS = [
  "No teacher approval capture",
  "No teacher approval from verifier result",
  "No package assembly from teacher packet",
  "No route creation from teacher packet",
  "No playlist creation from teacher packet",
  "No assignment creation from teacher packet",
  "No student-ready marker from teacher packet",
  "support-language progress trigger",
] as const;

export function validateAiGeneratedPackageTeacherReviewPacket(packet: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(packet)) {
    return ["AI generated package teacher review packet must be a JSON object."];
  }

  const packetId = readString(packet, "packetId");
  const tenantId = readString(packet, "tenantId");
  const requestId = readString(packet, "requestId");
  const label = readString(packet, "label");
  const status = readString(packet, "status");
  const summary = readString(packet, "summary");
  const decisionLanes = readLanes(packet, "decisionLanes");
  const readySignals = readStringArray(packet, "readySignals");
  const missingEvidence = readStringArray(packet, "missingEvidence");
  const blockedActions = readStringArray(packet, "blockedActions");
  const nextRequiredRecords = readStringArray(packet, "nextRequiredRecords");

  if (!packetId || !tenantId || !requestId || !label) {
    errors.push("AI generated package teacher review packet must include packetId, tenantId, requestId, and label.");
  }

  if (!label.toLowerCase().includes("generated package teacher review packet")) {
    errors.push("AI generated package teacher review packet label must name the teacher review packet.");
  }

  if (status !== "blocked" && status !== "review-only" && status !== "ready-for-teacher-review") {
    errors.push("AI generated package teacher review packet must use a supported review-only status.");
  }

  if (!summary.toLowerCase().includes("review")) {
    errors.push("AI generated package teacher review packet summary must describe the review surface.");
  }

  for (const topic of AI_GENERATED_PACKAGE_TEACHER_REVIEW_REQUIRED_LANE_TOPICS) {
    if (!decisionLanes.some((lane) => lane.label.toLowerCase().includes(topic))) {
      errors.push(`AI generated package teacher review packet must include decision lane topic: ${topic}.`);
    }
  }

  for (const lane of decisionLanes) {
    if (!lane.sourceRecord || !lane.evidence || !lane.teacherQuestion || !lane.blocker) {
      errors.push(`AI generated package teacher review lane must include full review evidence: ${lane.label}.`);
    }
  }

  if (!decisionLanes.some((lane) => lane.sourceRecord.includes("ai_verifier_result_evidence_packet"))) {
    errors.push("AI generated package teacher review packet must depend on verifier result evidence.");
  }

  if (!textListIncludes(readySignals, "JSON-first") && !textListIncludes(readySignals, "reviewable")) {
    errors.push("AI generated package teacher review packet must show a reviewable JSON-first ready signal.");
  }

  for (const record of AI_GENERATED_PACKAGE_TEACHER_REVIEW_REQUIRED_RECORDS) {
    if (!nextRequiredRecords.includes(record)) {
      errors.push(`AI generated package teacher review packet must include next required record: ${record}.`);
    }
  }

  for (const topic of AI_GENERATED_PACKAGE_TEACHER_REVIEW_MISSING_EVIDENCE_TOPICS) {
    if (!textListIncludes(missingEvidence, topic)) {
      errors.push(`AI generated package teacher review packet must keep missing evidence visible: ${topic}.`);
    }
  }

  for (const blockedAction of AI_GENERATED_PACKAGE_TEACHER_REVIEW_BLOCKED_ACTIONS) {
    if (!textListIncludes(blockedActions, blockedAction)) {
      errors.push(`AI generated package teacher review packet must block action: ${blockedAction}.`);
    }
  }

  if (tenantId === "ministar") {
    if (
      !textListIncludes(readySignals, "English target-language trigger") ||
      !textListIncludes(readySignals, "hiragana-only") ||
      !textListIncludes(readySignals, "support-only") ||
      !textListIncludes(blockedActions, "No Japanese support-language progress trigger")
    ) {
      errors.push("MiniStar generated package teacher review packet must preserve English and hiragana support boundaries.");
    }
  }

  return errors;
}

export function getAiGeneratedPackageTeacherReviewPacketWarnings(packet: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(packet)) {
    return warnings;
  }

  const decisionLanes = readLanes(packet, "decisionLanes");
  const blockedActions = readStringArray(packet, "blockedActions");

  if (!decisionLanes.some((lane) => lane.status === "blocked")) {
    warnings.push("Teacher review packets should keep release-control or verifier blockers visible until production gates exist.");
  }

  if (!textListIncludes(blockedActions, "No support-language progress trigger")) {
    warnings.push("Teacher review packets should block support-language progress triggers explicitly.");
  }

  return warnings;
}

export function validateAiGeneratedPackageTeacherReviewPackets(packets: unknown[]): string[] {
  return packets.flatMap((packet) => validateAiGeneratedPackageTeacherReviewPacket(packet));
}

export function getAiGeneratedPackageTeacherReviewPacketCollectionWarnings(packets: unknown[]): string[] {
  return packets.flatMap((packet) => getAiGeneratedPackageTeacherReviewPacketWarnings(packet));
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

function readLanes(source: Record<string, unknown>, key: string): AiGeneratedPackageTeacherReviewLane[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    label: readString(item, "label"),
    status: readString(item, "status") as AiGeneratedPackageTeacherReviewLaneStatus,
    sourceRecord: readString(item, "sourceRecord"),
    evidence: readString(item, "evidence"),
    teacherQuestion: readString(item, "teacherQuestion"),
    blocker: readString(item, "blocker"),
  }));
}

function textListIncludes(items: string[], expected: string): boolean {
  const normalizedExpected = expected.toLowerCase();
  return items.some((item) => item.toLowerCase().includes(normalizedExpected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
