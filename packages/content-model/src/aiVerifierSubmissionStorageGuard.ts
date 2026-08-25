export type AiVerifierSubmissionStorageGuardStatus = "review-only" | "storage-required" | "blocked";
export type AiVerifierSubmissionStorageAdapterType = "hosted" | "local-companion";

export interface AiVerifierSubmissionStorageAdapterRequirement {
  adapterType: AiVerifierSubmissionStorageAdapterType;
  label: string;
  requiredRecords: string[];
  blockedWrites: string[];
  note: string;
}

export interface AiVerifierSubmissionStorageGuard {
  guardId: string;
  tenantId: string;
  requestId: string;
  verifierPacketId: string;
  label: string;
  status: AiVerifierSubmissionStorageGuardStatus;
  summary: string;
  storageRecordType: "teacher_draft_verifier_submission";
  requiredRecordIds: string[];
  visibleFields: string[];
  requiredBeforeVerifierSubmission: string[];
  blockedActions: string[];
  adapterRequirements: AiVerifierSubmissionStorageAdapterRequirement[];
  reviewerNotes: string[];
  verifierSubmissionAllowed: false;
  packageApprovalAllowed: false;
  routeWriteAllowed: false;
  playlistWriteAllowed: false;
  assignmentWriteAllowed: false;
  studentReadyMarkerAllowed: false;
  supportLanguageProgressAllowed: false;
}

export const AI_VERIFIER_STORAGE_REQUIRED_RECORDS = [
  "teacher_draft_verifier_submission",
  "ai_verifier_submission_packet",
  "ai_draft_repair_evidence_packet",
  "reviewer_identity",
  "evidence_attachment",
  "target_language_audio_approval",
  "media_rights_evidence_attachment",
  "teacher_approval_ledger",
  "release_control_binding",
] as const;

export const AI_VERIFIER_STORAGE_REQUIRED_BLOCKED_ACTIONS = [
  "No live verifier submission",
  "No package approval from verifier storage",
  "No route write from verifier storage",
  "No playlist write from verifier storage",
  "No student assignment from verifier storage",
  "No student-ready marker from verifier storage",
  "No support-language progress from verifier storage",
] as const;

const requiredBeforeVerifierTopics = [
  "Durable verifier submission storage",
  "Reviewer identity",
  "Media rights evidence",
  "Audio cue approval",
  "Approval ledger",
  "Release-control binding",
] as const;

export function validateAiVerifierSubmissionStorageGuard(guard: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(guard)) {
    return ["AI verifier submission storage guard must be a JSON object."];
  }

  const guardId = readString(guard, "guardId");
  const tenantId = readString(guard, "tenantId");
  const requestId = readString(guard, "requestId");
  const verifierPacketId = readString(guard, "verifierPacketId");
  const label = readString(guard, "label");
  const summary = readString(guard, "summary");
  const status = readString(guard, "status");
  const storageRecordType = readString(guard, "storageRecordType");
  const requiredRecordIds = readStringArray(guard, "requiredRecordIds");
  const blockedActions = readStringArray(guard, "blockedActions");
  const requiredBeforeVerifierSubmission = readStringArray(guard, "requiredBeforeVerifierSubmission");
  const adapterRequirements = readAdapterRequirements(guard);
  const reviewerNotes = readStringArray(guard, "reviewerNotes");

  if (!guardId || !tenantId || !requestId || !verifierPacketId || !label) {
    errors.push("AI verifier submission storage guard must include guardId, tenantId, requestId, verifierPacketId, and label.");
  }

  if (!summary.toLowerCase().includes("review-only")) {
    errors.push("AI verifier submission storage guard summary must preserve a review-only boundary.");
  }

  if (status !== "review-only" && status !== "storage-required" && status !== "blocked") {
    errors.push("AI verifier submission storage guard must remain review-only, storage-required, or blocked.");
  }

  if (storageRecordType !== "teacher_draft_verifier_submission") {
    errors.push("AI verifier submission storage guard must use storageRecordType: teacher_draft_verifier_submission.");
  }

  for (const recordId of AI_VERIFIER_STORAGE_REQUIRED_RECORDS) {
    if (!requiredRecordIds.includes(recordId)) {
      errors.push(`AI verifier submission storage guard must include required record: ${recordId}.`);
    }
  }

  for (const blockedAction of AI_VERIFIER_STORAGE_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(blockedAction)) {
      errors.push(`AI verifier submission storage guard must include blocked action: ${blockedAction}.`);
    }
  }

  for (const topic of requiredBeforeVerifierTopics) {
    if (!textListIncludes(requiredBeforeVerifierSubmission, topic)) {
      errors.push(`AI verifier submission storage guard must include verifier prerequisite topic: ${topic}.`);
    }
  }

  for (const key of [
    "verifierSubmissionAllowed",
    "packageApprovalAllowed",
    "routeWriteAllowed",
    "playlistWriteAllowed",
    "assignmentWriteAllowed",
    "studentReadyMarkerAllowed",
    "supportLanguageProgressAllowed",
  ]) {
    if (readBoolean(guard, key) !== false) {
      errors.push(`AI verifier submission storage guard must keep ${key}: false.`);
    }
  }

  if (!adapterRequirements.some((requirement) => requirement.adapterType === "hosted")) {
    errors.push("AI verifier submission storage guard must include hosted adapter requirements.");
  }

  if (!adapterRequirements.some((requirement) => requirement.adapterType === "local-companion")) {
    errors.push("AI verifier submission storage guard must include local companion adapter requirements.");
  }

  for (const requirement of adapterRequirements) {
    if (
      !requirement.label ||
      requirement.requiredRecords.length === 0 ||
      requirement.blockedWrites.length === 0 ||
      !requirement.note
    ) {
      errors.push("AI verifier submission storage adapter requirements must include label, records, blocked writes, and note.");
    }
  }

  if (reviewerNotes.length === 0) {
    errors.push("AI verifier submission storage guard must include reviewer notes.");
  }

  if (tenantId === "ministar") {
    const searchableText = [
      summary,
      ...requiredRecordIds,
      ...blockedActions,
      ...requiredBeforeVerifierSubmission,
      ...reviewerNotes,
      ...adapterRequirements.flatMap((requirement) => [
        requirement.label,
        requirement.note,
        ...requirement.requiredRecords,
        ...requirement.blockedWrites,
      ]),
    ].join(" ");

    if (
      !searchableText.includes("English") ||
      !searchableText.includes("hiragana") ||
      !searchableText.includes("Japanese") ||
      !searchableText.includes("support-language")
    ) {
      errors.push("MiniStar verifier storage guard must preserve English progress and hiragana Japanese support-language boundaries.");
    }
  }

  return errors;
}

export function validateAiVerifierSubmissionStorageGuards(guards: unknown[]): string[] {
  return guards.flatMap((guard) => validateAiVerifierSubmissionStorageGuard(guard));
}

export function getAiVerifierSubmissionStorageGuardWarnings(guard: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(guard)) {
    return warnings;
  }

  const searchableText = [
    readString(guard, "summary"),
    ...readStringArray(guard, "visibleFields"),
    ...readStringArray(guard, "requiredBeforeVerifierSubmission"),
    ...readStringArray(guard, "reviewerNotes"),
  ]
    .join(" ")
    .toLowerCase();

  if (!searchableText.includes("retention")) {
    warnings.push("AI verifier submission storage guard should name retention policy before live storage.");
  }

  if (!searchableText.includes("audit")) {
    warnings.push("AI verifier submission storage guard should name audit trail needs before live storage.");
  }

  if (!searchableText.includes("evidence")) {
    warnings.push("AI verifier submission storage guard should keep evidence attachment needs visible.");
  }

  return warnings;
}

export function getAiVerifierSubmissionStorageGuardCollectionWarnings(guards: unknown[]): string[] {
  return guards.flatMap((guard) => getAiVerifierSubmissionStorageGuardWarnings(guard));
}

function readAdapterRequirements(source: Record<string, unknown>): AiVerifierSubmissionStorageAdapterRequirement[] {
  const value = source.adapterRequirements;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((requirement) => ({
    adapterType: readString(requirement, "adapterType") as AiVerifierSubmissionStorageAdapterType,
    label: readString(requirement, "label"),
    requiredRecords: readStringArray(requirement, "requiredRecords"),
    blockedWrites: readStringArray(requirement, "blockedWrites"),
    note: readString(requirement, "note"),
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

function textListIncludes(items: string[], expected: string): boolean {
  const normalizedExpected = expected.toLowerCase();
  return items.some((item) => item.toLowerCase().includes(normalizedExpected));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
