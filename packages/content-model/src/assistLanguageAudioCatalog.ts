import type { MediaRightsStatus } from "./index";

export type AssistLanguageAudioCatalogKind = "term" | "sentence" | "instruction";
export type AssistLanguageAudioCatalogDecision = "blocked" | "needs-review" | "admission-ready";
export type AssistLanguageAudioCatalogEvidenceStatus = "missing" | "captured" | "reviewed";

export interface AssistLanguageAudioCatalogRecord {
  catalogRecordId: string;
  tenantId: string;
  packageId: string;
  unitKey: string;
  itemId: string;
  kind: AssistLanguageAudioCatalogKind;
  sourceText: string;
  glossText: string;
  language: string;
  audioCueId?: string;
  mediaAssetId?: string;
  checksum?: string;
  transcript?: string;
  rightsStatus?: MediaRightsStatus;
  sourceLineageRef: string;
  accessibility: {
    transcript: AssistLanguageAudioCatalogEvidenceStatus;
    spokenTextMatch: AssistLanguageAudioCatalogEvidenceStatus;
    fallback: AssistLanguageAudioCatalogEvidenceStatus;
  };
  delivery: {
    hostedReference?: string;
    localBundlePath?: string;
  };
  decision: AssistLanguageAudioCatalogDecision;
  blockers: string[];
  blockedActions: string[];
  promotionAllowed: false;
  studentFacingAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

const safeIdentifierPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/;
const supportedKinds = new Set<AssistLanguageAudioCatalogKind>(["term", "sentence", "instruction"]);
const supportedDecisions = new Set<AssistLanguageAudioCatalogDecision>(["blocked", "needs-review", "admission-ready"]);
const supportedEvidenceStatuses = new Set<AssistLanguageAudioCatalogEvidenceStatus>(["missing", "captured", "reviewed"]);
const requiredBlockedActions = [
  "No catalog admission",
  "No hosted media promotion",
  "No local bundle activation",
  "No student-facing assist audio",
  "No speech API billing",
] as const;

export function validateAssistLanguageAudioCatalogRecord(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["assist-language audio catalog record must be an object"];

  for (const field of ["catalogRecordId", "tenantId", "packageId", "unitKey", "itemId", "sourceText", "glossText", "language", "sourceLineageRef"] as const) {
    const fieldValue = value[field];
    if (typeof fieldValue !== "string" || fieldValue.trim().length === 0 || fieldValue.length > 240) {
      errors.push(`assist-language audio catalog ${field} must be bounded`);
    }
  }
  for (const field of ["catalogRecordId", "tenantId", "packageId", "unitKey", "itemId"] as const) {
    const fieldValue = value[field];
    if (typeof fieldValue === "string" && !safeIdentifierPattern.test(fieldValue.trim())) {
      errors.push(`assist-language audio catalog ${field} must be a safe identifier`);
    }
  }
  if (!supportedKinds.has(value.kind as AssistLanguageAudioCatalogKind)) errors.push("assist-language audio catalog kind is unsupported");
  if (!supportedDecisions.has(value.decision as AssistLanguageAudioCatalogDecision)) errors.push("assist-language audio catalog decision is unsupported");
  if (!isRecord(value.accessibility)) errors.push("assist-language audio catalog must include accessibility evidence");
  else {
    for (const field of ["transcript", "spokenTextMatch", "fallback"] as const) {
      if (!supportedEvidenceStatuses.has(value.accessibility[field] as AssistLanguageAudioCatalogEvidenceStatus)) {
        errors.push(`assist-language audio catalog accessibility ${field} status is unsupported`);
      }
    }
  }
  if (!isRecord(value.delivery)) errors.push("assist-language audio catalog must include delivery evidence");
  if (!Array.isArray(value.blockers) || value.blockers.length === 0) errors.push("assist-language audio catalog must expose blockers");
  if (!Array.isArray(value.blockedActions)) errors.push("assist-language audio catalog must expose blocked actions");
  else for (const action of requiredBlockedActions) if (!value.blockedActions.includes(action)) errors.push(`assist-language audio catalog must block ${action}`);
  if (value.promotionAllowed !== false || value.studentFacingAllowed !== false) errors.push("assist-language audio catalog must block promotion and student-facing use");
  if (value.mode !== "review-only" || value.sideEffect !== "none") errors.push("assist-language audio catalog must remain review-only with no side effect");

  return [...new Set(errors)];
}

export function createReviewOnlyAssistLanguageAudioCatalogRecord(record: AssistLanguageAudioCatalogRecord): AssistLanguageAudioCatalogRecord {
  return {
    ...record,
    promotionAllowed: false,
    studentFacingAllowed: false,
    mode: "review-only",
    sideEffect: "none",
    blockedActions: [...new Set([...record.blockedActions, ...requiredBlockedActions])],
  };
}

export const ASSIST_LANGUAGE_AUDIO_CATALOG_BLOCKED_ACTIONS = requiredBlockedActions;

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
