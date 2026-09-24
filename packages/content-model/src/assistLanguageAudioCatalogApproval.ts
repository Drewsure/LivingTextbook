export type AssistLanguageAudioCatalogApprovalStatus = "blocked" | "ready-for-review" | "not-recorded";

export interface AssistLanguageAudioCatalogApprovalPacket {
  approvalPacketId: string;
  tenantId: string;
  packageId: string;
  unitKey: string;
  catalogRecordIds: string[];
  storageRecordName: "assist_language_audio_catalog_admission";
  status: AssistLanguageAudioCatalogApprovalStatus;
  reviewerRole: "teacher-or-publisher-audio-owner";
  requiredEvidence: string[];
  unresolvedEvidence: string[];
  decision: "not-recorded";
  decisionCaptured: false;
  approvalAllowed: false;
  catalogAdmissionAllowed: false;
  studentFacingAllowed: false;
  blockedActions: string[];
  nextRequiredRecords: string[];
  mode: "review-only";
  sideEffect: "none";
}

const requiredBlockedActions = [
  "No approval capture",
  "No catalog admission",
  "No hosted media promotion",
  "No local bundle activation",
  "No student-facing assist audio",
  "No speech API billing",
] as const;

export const ASSIST_LANGUAGE_AUDIO_CATALOG_APPROVAL_REQUIRED_EVIDENCE = [
  "Gloss-bound audio cue and media-asset binding",
  "Checksum and source-lineage evidence",
  "Transcript and spoken-text match review",
  "Rights owner and permitted-use review",
  "Accessibility fallback and delivery review",
  "Tenant/package/unit scope reconciliation",
] as const;

export function validateAssistLanguageAudioCatalogApprovalPacket(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["assist-language audio catalog approval packet must be an object"];

  for (const field of ["approvalPacketId", "tenantId", "packageId", "unitKey", "storageRecordName", "reviewerRole", "decision", "mode", "sideEffect"] as const) {
    if (typeof value[field] !== "string" || value[field].trim().length === 0) errors.push(`assist-language audio catalog approval ${field} is required`);
  }
  if (value.storageRecordName !== "assist_language_audio_catalog_admission") errors.push("assist-language audio catalog approval must name its storage record");
  if (value.status !== "blocked" && value.status !== "ready-for-review" && value.status !== "not-recorded") errors.push("assist-language audio catalog approval status is unsupported");
  if (value.reviewerRole !== "teacher-or-publisher-audio-owner") errors.push("assist-language audio catalog approval reviewer role is unsupported");
  if (value.decision !== "not-recorded") errors.push("assist-language audio catalog approval decision must remain not-recorded");
  if (value.decisionCaptured !== false || value.approvalAllowed !== false || value.catalogAdmissionAllowed !== false || value.studentFacingAllowed !== false) {
    errors.push("assist-language audio catalog approval must keep capture, admission, and student use blocked");
  }
  for (const field of ["catalogRecordIds", "requiredEvidence", "unresolvedEvidence", "blockedActions", "nextRequiredRecords"] as const) {
    if (!Array.isArray(value[field]) || value[field].length === 0) errors.push(`assist-language audio catalog approval ${field} must be non-empty`);
  }
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("assist-language audio catalog approval must remain review-only with no side effect");
  const blockedActions = Array.isArray(value.blockedActions) ? value.blockedActions : [];
  for (const action of requiredBlockedActions) if (!blockedActions.includes(action)) errors.push(`assist-language audio catalog approval must block ${action}`);
  const requiredEvidence = Array.isArray(value.requiredEvidence) ? value.requiredEvidence : [];
  for (const evidence of ASSIST_LANGUAGE_AUDIO_CATALOG_APPROVAL_REQUIRED_EVIDENCE) if (!requiredEvidence.includes(evidence)) errors.push(`assist-language audio catalog approval must require ${evidence}`);

  return [...new Set(errors)];
}

export function createReviewOnlyAssistLanguageAudioCatalogApprovalPacket(packet: AssistLanguageAudioCatalogApprovalPacket): AssistLanguageAudioCatalogApprovalPacket {
  return {
    ...packet,
    decision: "not-recorded",
    decisionCaptured: false,
    approvalAllowed: false,
    catalogAdmissionAllowed: false,
    studentFacingAllowed: false,
    mode: "review-only",
    sideEffect: "none",
    blockedActions: [...new Set([...packet.blockedActions, ...requiredBlockedActions])],
    requiredEvidence: [...new Set([...packet.requiredEvidence, ...ASSIST_LANGUAGE_AUDIO_CATALOG_APPROVAL_REQUIRED_EVIDENCE])],
  };
}

export const ASSIST_LANGUAGE_AUDIO_CATALOG_APPROVAL_BLOCKED_ACTIONS = requiredBlockedActions;

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
