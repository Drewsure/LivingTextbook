export type AiGenerationRequestPacketStatus = "review-only" | "storage-required" | "blocked";
export type AiGenerationRequestPacketLinkStatus = "present" | "required" | "blocked";

export interface AiGenerationRequestPacketEvidenceLink {
  linkId: string;
  label: string;
  recordType: string;
  recordId: string;
  status: AiGenerationRequestPacketLinkStatus;
  note: string;
}

export interface AiGenerationRequestPacketPreview {
  packetId: string;
  storageRecordType: "ai_generation_request_packet";
  tenantId: string;
  requestId: string;
  label: string;
  status: AiGenerationRequestPacketStatus;
  summary: string;
  targetLanguage: string;
  supportLanguagePolicy: string;
  targetLanguageProgressTrigger: "target-language-only";
  supportLanguageProgressAllowed: false;
  mediaOnlyProgressAllowed: false;
  liveModelDispatchAllowed: false;
  modelBillingAllowed: false;
  draftGenerationAllowed: false;
  verifierSubmissionAllowed: false;
  packageAssemblyAllowed: false;
  routeWriteAllowed: false;
  playlistWriteAllowed: false;
  assignmentWriteAllowed: false;
  studentReadyMarkerAllowed: false;
  evidenceLinks: AiGenerationRequestPacketEvidenceLink[];
  requiredBeforeLiveRequest: string[];
  blockedActions: string[];
  reviewerNotes: string[];
}

export const AI_GENERATION_REQUEST_PACKET_REQUIRED_RECORD_TYPES = [
  "request_builder_review_packet",
  "source_evidence_packet",
  "premium_ai_cost_gate",
  "audio_coverage_requirement",
  "activity_compatibility_snapshot",
  "media_rights_manifest",
  "teacher_draft_package",
  "teacher_draft_verifier_submission",
] as const;

export const AI_GENERATION_REQUEST_PACKET_REQUIRED_BLOCKED_ACTIONS = [
  "No live model dispatch",
  "No model billing",
  "No draft generation",
  "No verifier submission",
  "No package assembly",
  "No route write",
  "No playlist write",
  "No student assignment",
  "No support-language progress trigger",
] as const;

export function validateAiGenerationRequestPacketPreview(packet: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(packet)) {
    return ["AI generation request packet preview must be a JSON object."];
  }

  const packetId = readString(packet, "packetId");
  const storageRecordType = readString(packet, "storageRecordType");
  const tenantId = readString(packet, "tenantId");
  const requestId = readString(packet, "requestId");
  const status = readString(packet, "status");
  const evidenceLinks = readArray(packet, "evidenceLinks");
  const blockedActions = readStringArray(packet, "blockedActions");
  const requiredBeforeLiveRequest = readStringArray(packet, "requiredBeforeLiveRequest");
  const reviewerNotes = readStringArray(packet, "reviewerNotes");

  if (!packetId || !tenantId || !requestId) {
    errors.push("AI generation request packet preview must include packetId, tenantId, and requestId.");
  }

  if (storageRecordType !== "ai_generation_request_packet") {
    errors.push("AI generation request packet preview must name storageRecordType: ai_generation_request_packet.");
  }

  if (status !== "review-only" && status !== "storage-required" && status !== "blocked") {
    errors.push("AI generation request packet preview must remain review-only, storage-required, or blocked.");
  }

  if (readString(packet, "targetLanguageProgressTrigger") !== "target-language-only") {
    errors.push("AI generation request packet preview must keep targetLanguageProgressTrigger as target-language-only.");
  }

  for (const [field, expected] of [
    ["supportLanguageProgressAllowed", false],
    ["mediaOnlyProgressAllowed", false],
    ["liveModelDispatchAllowed", false],
    ["modelBillingAllowed", false],
    ["draftGenerationAllowed", false],
    ["verifierSubmissionAllowed", false],
    ["packageAssemblyAllowed", false],
    ["routeWriteAllowed", false],
    ["playlistWriteAllowed", false],
    ["assignmentWriteAllowed", false],
    ["studentReadyMarkerAllowed", false],
  ] as const) {
    if (readBoolean(packet, field) !== expected) {
      errors.push(`AI generation request packet preview must keep ${field}: false.`);
    }
  }

  const recordTypes = new Set<string>();

  for (const link of evidenceLinks) {
    if (!isRecord(link)) {
      errors.push("AI generation request packet evidence links must be objects.");
      continue;
    }

    const linkId = readString(link, "linkId");
    const recordType = readString(link, "recordType");
    const linkStatus = readString(link, "status");

    if (!linkId || !recordType) {
      errors.push("AI generation request packet evidence links must include linkId and recordType.");
    }

    if (recordType) {
      recordTypes.add(recordType);
    }

    if (linkStatus !== "present" && linkStatus !== "required" && linkStatus !== "blocked") {
      errors.push(`AI generation request packet evidence link ${linkId ?? "unknown"} must have present, required, or blocked status.`);
    }
  }

  for (const recordType of AI_GENERATION_REQUEST_PACKET_REQUIRED_RECORD_TYPES) {
    if (!recordTypes.has(recordType)) {
      errors.push(`AI generation request packet preview must include evidence link record type: ${recordType}.`);
    }
  }

  for (const action of AI_GENERATION_REQUEST_PACKET_REQUIRED_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(action)) {
      errors.push(`AI generation request packet preview must include blocked action: ${action}.`);
    }
  }

  if (requiredBeforeLiveRequest.length === 0) {
    errors.push("AI generation request packet preview must list required-before-live-request items.");
  }

  if (reviewerNotes.length === 0) {
    errors.push("AI generation request packet preview must include reviewer notes.");
  }

  return errors;
}

export function validateAiGenerationRequestPacketPreviews(packets: unknown[]): string[] {
  return packets.flatMap((packet) => validateAiGenerationRequestPacketPreview(packet));
}

export function getAiGenerationRequestPacketPreviewWarnings(packet: unknown): string[] {
  const warnings: string[] = [];

  if (!isRecord(packet)) {
    return warnings;
  }

  const evidenceLinks = readArray(packet, "evidenceLinks");
  const missingLinks = evidenceLinks.filter((link) => isRecord(link) && link.status !== "present").length;

  if (missingLinks > 0) {
    warnings.push(`${missingLinks} request packet evidence link(s) still require durable review.`);
  }

  const supportLanguagePolicy = readString(packet, "supportLanguagePolicy") ?? "";

  if (supportLanguagePolicy.toLowerCase().includes("support-only") === false) {
    warnings.push("Support-language policy should explicitly say support-only.");
  }

  return warnings;
}

export function isAiGenerationRequestPacketLiveBlocked(packet: unknown): boolean {
  if (!isRecord(packet)) {
    return true;
  }

  return (
    packet.status !== "review-only" ||
    validateAiGenerationRequestPacketPreview(packet).length > 0 ||
    readStringArray(packet, "blockedActions").length > 0
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string): string | undefined {
  const value = record[key];
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function readBoolean(record: Record<string, unknown>, key: string): boolean | undefined {
  const value = record[key];
  return typeof value === "boolean" ? value : undefined;
}

function readArray(record: Record<string, unknown>, key: string): unknown[] {
  const value = record[key];
  return Array.isArray(value) ? value : [];
}

function readStringArray(record: Record<string, unknown>, key: string): string[] {
  return readArray(record, key).filter((value): value is string => typeof value === "string" && value.trim().length > 0);
}
