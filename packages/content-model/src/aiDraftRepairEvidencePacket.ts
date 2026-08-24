export type AiDraftRepairEvidencePacketStatus = "evidence-only" | "blocked";
export type AiDraftRepairEvidenceItemStatus = "missing" | "review-required" | "attached";

export interface AiDraftRepairEvidenceItem {
  evidenceId: string;
  label: string;
  sourceQueueItemId: string;
  repairLane: string;
  status: AiDraftRepairEvidenceItemStatus;
  owner: string;
  requiredRecord: string;
  evidenceNote: string;
  blocksVerifierSubmission: boolean;
}

export interface AiDraftRepairEvidencePacket {
  packetId: string;
  tenantId: string;
  requestId: string;
  draftPreviewId: string;
  correctionQueueId: string;
  label: string;
  summary: string;
  status: AiDraftRepairEvidencePacketStatus;
  targetLanguageProgressTrigger: "target-language-only";
  supportLanguageProgressAllowed: boolean;
  mediaOnlyProgressAllowed: boolean;
  autoFixAllowed: boolean;
  liveAiRegenerationAllowed: boolean;
  verifierSubmissionAllowed: boolean;
  packageAssemblyAllowed: boolean;
  routeWriteAllowed: boolean;
  playlistWriteAllowed: boolean;
  studentAssignmentAllowed: boolean;
  studentReadyMarkerAllowed: boolean;
  evidenceItems: AiDraftRepairEvidenceItem[];
  requiredBeforeVerifier: string[];
  blockedActions: string[];
  reviewerNotes: string[];
}

export const AI_DRAFT_REPAIR_EVIDENCE_REQUIRED_RECORDS = [
  "ai_generated_draft_payload_preview",
  "ai_draft_correction_queue",
  "schema_validation_packet",
  "package_game_audio_coverage",
  "media_rights_manifest",
  "teacher_draft_verifier_submission",
] as const;

export const AI_DRAFT_REPAIR_EVIDENCE_REQUIRED_BLOCKED_ACTIONS = [
  "No auto-fix from repair evidence",
  "No live AI regeneration from repair evidence",
  "No verifier submission from repair evidence",
  "No package assembly from repair evidence",
  "No route write from repair evidence",
  "No playlist write from repair evidence",
  "No student assignment from repair evidence",
  "No support-language progress from repair evidence",
] as const;

export function validateAiDraftRepairEvidencePacket(packet: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(packet)) {
    return ["AI draft repair evidence packet must be a JSON object."];
  }

  const packetId = readString(packet, "packetId");
  const tenantId = readString(packet, "tenantId");
  const requestId = readString(packet, "requestId");
  const draftPreviewId = readString(packet, "draftPreviewId");
  const correctionQueueId = readString(packet, "correctionQueueId");
  const status = readString(packet, "status");
  const evidenceItems = readEvidenceItems(packet);
  const requiredBeforeVerifier = readStringArray(packet, "requiredBeforeVerifier");
  const blockedActions = readStringArray(packet, "blockedActions");
  const representedRecords = [
    draftPreviewId ? "ai_generated_draft_payload_preview" : "",
    correctionQueueId ? "ai_draft_correction_queue" : "",
    ...evidenceItems.map((item) => item.requiredRecord),
    ...requiredBeforeVerifier,
  ];

  if (!packetId || !tenantId || !requestId || !draftPreviewId || !correctionQueueId) {
    errors.push(
      "AI draft repair evidence packet must include packetId, tenantId, requestId, draftPreviewId, and correctionQueueId.",
    );
  }

  if (status !== "evidence-only" && status !== "blocked") {
    errors.push("AI draft repair evidence packet must remain evidence-only or blocked.");
  }

  if (readString(packet, "targetLanguageProgressTrigger") !== "target-language-only") {
    errors.push("AI draft repair evidence packet must keep targetLanguageProgressTrigger as target-language-only.");
  }

  for (const key of [
    "supportLanguageProgressAllowed",
    "mediaOnlyProgressAllowed",
    "autoFixAllowed",
    "liveAiRegenerationAllowed",
    "verifierSubmissionAllowed",
    "packageAssemblyAllowed",
    "routeWriteAllowed",
    "playlistWriteAllowed",
    "studentAssignmentAllowed",
    "studentReadyMarkerAllowed",
  ]) {
    if (readBoolean(packet, key) !== false) {
      errors.push(`AI draft repair evidence packet must keep ${key}: false.`);
    }
  }

  for (const recordType of AI_DRAFT_REPAIR_EVIDENCE_REQUIRED_RECORDS) {
    if (!representedRecords.includes(recordType)) {
      errors.push(`AI draft repair evidence packet must represent required record: ${recordType}.`);
    }
  }

  for (const blockedAction of AI_DRAFT_REPAIR_EVIDENCE_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(blockedAction)) {
      errors.push(`AI draft repair evidence packet must include blocked action: ${blockedAction}.`);
    }
  }

  if (!evidenceItems.some((item) => item.blocksVerifierSubmission)) {
    errors.push("AI draft repair evidence packet must include at least one verifier-submission blocking item.");
  }

  for (const item of evidenceItems) {
    if (
      !item.evidenceId ||
      !item.label ||
      !item.sourceQueueItemId ||
      !item.repairLane ||
      !item.owner ||
      !item.requiredRecord ||
      !item.evidenceNote
    ) {
      errors.push("AI draft repair evidence items must include ids, lane, owner, required record, and evidence note.");
    }

    if (!["missing", "review-required", "attached"].includes(item.status)) {
      errors.push(`AI draft repair evidence item has unknown status: ${item.status}.`);
    }
  }

  return errors;
}

export function validateAiDraftRepairEvidencePackets(packets: unknown[]): string[] {
  return packets.flatMap((packet) => validateAiDraftRepairEvidencePacket(packet));
}

export function getAiDraftRepairEvidencePacketWarnings(packet: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(packet)) {
    return warnings;
  }

  const tenantId = readString(packet, "tenantId");
  const searchableText = [
    readString(packet, "summary"),
    readStringArray(packet, "requiredBeforeVerifier").join(" "),
    readStringArray(packet, "blockedActions").join(" "),
    readStringArray(packet, "reviewerNotes").join(" "),
    readEvidenceItems(packet)
      .map((item) => `${item.repairLane} ${item.evidenceNote}`)
      .join(" "),
  ]
    .join(" ")
    .toLowerCase();

  if (!searchableText.includes("evidence")) {
    warnings.push("AI draft repair evidence packet should describe evidence requirements.");
  }

  if (!searchableText.includes("before verifier submission")) {
    warnings.push("AI draft repair evidence packet should state that repair evidence comes before verifier submission.");
  }

  if (!searchableText.includes("target-language")) {
    warnings.push("AI draft repair evidence packet should restate target-language progress rules.");
  }

  if (tenantId === "ministar" && !searchableText.includes("hiragana")) {
    warnings.push("MiniStar draft repair evidence should preserve hiragana-only Japanese support rules.");
  }

  if (tenantId === "ministar" && !searchableText.includes("japanese support-language unlock")) {
    warnings.push("MiniStar draft repair evidence should block Japanese support-language unlocks.");
  }

  return warnings;
}

export function getAiDraftRepairEvidencePacketCollectionWarnings(packets: unknown[]): string[] {
  return packets.flatMap((packet) => getAiDraftRepairEvidencePacketWarnings(packet));
}

export function isAiDraftRepairEvidencePacketLiveBlocked(packet: unknown): boolean {
  return validateAiDraftRepairEvidencePacket(packet).length > 0 || !isRecord(packet)
    ? true
    : readBoolean(packet, "autoFixAllowed") === false &&
        readBoolean(packet, "liveAiRegenerationAllowed") === false &&
        readBoolean(packet, "verifierSubmissionAllowed") === false &&
        readBoolean(packet, "studentAssignmentAllowed") === false;
}

function readEvidenceItems(source: Record<string, unknown>): AiDraftRepairEvidenceItem[] {
  const value = source.evidenceItems;

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isRecord).map((item) => ({
    evidenceId: readString(item, "evidenceId"),
    label: readString(item, "label"),
    sourceQueueItemId: readString(item, "sourceQueueItemId"),
    repairLane: readString(item, "repairLane"),
    status: readString(item, "status") as AiDraftRepairEvidenceItemStatus,
    owner: readString(item, "owner"),
    requiredRecord: readString(item, "requiredRecord"),
    evidenceNote: readString(item, "evidenceNote"),
    blocksVerifierSubmission: readBoolean(item, "blocksVerifierSubmission") === true,
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
