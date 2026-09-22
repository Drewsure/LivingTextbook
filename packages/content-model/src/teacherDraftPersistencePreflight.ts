export type TeacherDraftPersistencePreflightStatus = "blocked" | "ready-review";

export interface TeacherDraftPersistenceAdmissionPreflight {
  preflightId: string;
  tenantId: string;
  draftId: string;
  sourcePackageId: string;
  unitKey: string;
  sourceDraftImportPreviewId: string;
  mode: "review-only";
  status: TeacherDraftPersistencePreflightStatus;
  visibility: "private-tenant";
  ownerIdentityRequired: true;
  ownerIdentityBound: boolean;
  sourceLineageBound: boolean;
  providerNeutral: true;
  writeAllowed: false;
  assignmentAllowed: false;
  promotionAllowed: false;
  rawSourceBinaryStorageAllowed: false;
  rawAudioStorageAllowed: false;
  learnerAudioStorageAllowed: false;
  transcriptStorageAllowed: false;
  requiredRecords: string[];
  requiredEvidence: string[];
  blockers: string[];
  blockedActions: string[];
  nextSteps: string[];
}

const REQUIRED_RECORDS = [
  "teacher-draft-package",
  "teacher-draft-review-handoff",
  "source-extraction-review-packet",
  "upload-review",
] as const;

const REQUIRED_BLOCKED_ACTIONS = [
  "No teacher draft persistence write",
  "No direct student assignment",
  "No package promotion",
  "No raw source binary storage in the draft record",
  "No learner audio or transcript storage",
] as const;

export function validateTeacherDraftPersistenceAdmissionPreflight(
  preflight: TeacherDraftPersistenceAdmissionPreflight,
): string[] {
  const errors: string[] = [];
  for (const [field, value] of [
    ["preflightId", preflight.preflightId], ["tenantId", preflight.tenantId],
    ["draftId", preflight.draftId], ["sourcePackageId", preflight.sourcePackageId],
    ["unitKey", preflight.unitKey], ["sourceDraftImportPreviewId", preflight.sourceDraftImportPreviewId],
  ] as const) {
    if (typeof value !== "string" || value.trim().length === 0) errors.push(`Teacher draft persistence preflight ${field} is required.`);
  }
  if (preflight.mode !== "review-only") errors.push("Teacher draft persistence preflight must remain review-only.");
  if (preflight.status !== "blocked" && preflight.status !== "ready-review") errors.push("Teacher draft persistence preflight has an unsupported status.");
  if (preflight.visibility !== "private-tenant") errors.push("Teacher draft persistence preflight must remain private to the tenant.");
  if (preflight.ownerIdentityRequired !== true) errors.push("Teacher draft persistence preflight must require owner identity.");
  if (preflight.providerNeutral !== true) errors.push("Teacher draft persistence preflight must remain provider-neutral.");
  for (const [field, value] of [
    ["ownerIdentityBound", preflight.ownerIdentityBound], ["sourceLineageBound", preflight.sourceLineageBound],
  ] as const) {
    if (typeof value !== "boolean") errors.push(`Teacher draft persistence preflight ${field} must be boolean.`);
  }
  for (const [field, value] of [
    ["writeAllowed", preflight.writeAllowed], ["assignmentAllowed", preflight.assignmentAllowed],
    ["promotionAllowed", preflight.promotionAllowed], ["rawSourceBinaryStorageAllowed", preflight.rawSourceBinaryStorageAllowed],
    ["rawAudioStorageAllowed", preflight.rawAudioStorageAllowed], ["learnerAudioStorageAllowed", preflight.learnerAudioStorageAllowed],
    ["transcriptStorageAllowed", preflight.transcriptStorageAllowed],
  ] as const) {
    if (value !== false) errors.push(`Teacher draft persistence preflight ${field} must remain false.`);
  }
  if (!Array.isArray(preflight.requiredRecords) || preflight.requiredRecords.some((record) => typeof record !== "string" || !record.trim())) {
    errors.push("Teacher draft persistence preflight requiredRecords must contain non-blank strings.");
  } else {
    for (const record of REQUIRED_RECORDS) if (!preflight.requiredRecords.includes(record)) errors.push(`Teacher draft persistence preflight is missing required record ${record}.`);
  }
  for (const [field, values] of [["requiredEvidence", preflight.requiredEvidence], ["blockers", preflight.blockers], ["blockedActions", preflight.blockedActions], ["nextSteps", preflight.nextSteps]] as const) {
    if (!Array.isArray(values) || values.some((value) => typeof value !== "string" || !value.trim())) errors.push(`Teacher draft persistence preflight ${field} must contain non-blank strings.`);
  }
  if (preflight.status === "blocked" && preflight.blockers.length === 0) errors.push("Blocked teacher draft persistence preflight must state at least one blocker.");
  for (const action of REQUIRED_BLOCKED_ACTIONS) if (!preflight.blockedActions.includes(action)) errors.push(`Teacher draft persistence preflight must block: ${action}.`);
  return [...new Set(errors)];
}

export function validateTeacherDraftPersistenceAdmissionBinding(preflight: unknown, draft: unknown, sourceDraftImportPreview: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(preflight)) return ["Teacher draft persistence binding requires a preflight."];
  if (!isRecord(draft)) return ["Teacher draft persistence binding requires a teacher draft preview."];
  if (!isRecord(sourceDraftImportPreview)) return ["Teacher draft persistence binding requires a source draft import preview."];
  for (const [preflightValue, sourceValue, message] of [
    [preflight.tenantId, draft.tenantId, "Preflight tenant must match the teacher draft."],
    [preflight.draftId, draft.draftId, "Preflight draft must match the teacher draft."],
    [preflight.sourcePackageId, draft.sourcePackageId, "Preflight package must match the teacher draft."],
    [preflight.unitKey, draft.unitKey, "Preflight unit must match the teacher draft."],
    [preflight.sourceDraftImportPreviewId, sourceDraftImportPreview.importPreviewId, "Preflight must match the source draft import preview."],
    [preflight.tenantId, sourceDraftImportPreview.tenantId, "Preflight tenant must match the source draft import preview."],
    [preflight.sourcePackageId, sourceDraftImportPreview.targetPackageId, "Preflight package must match the source draft import preview."],
    [preflight.unitKey, sourceDraftImportPreview.candidateUnitKey, "Preflight unit must match the source draft import preview."],
  ] as const) if (!isNonBlankString(preflightValue) || !isNonBlankString(sourceValue) || preflightValue !== sourceValue) errors.push(message);
  if (draft.status !== "teacher-only-draft") errors.push("Teacher draft persistence admission requires a teacher-only draft.");
  if (draft.canAssignToStudents !== false) errors.push("Teacher draft persistence admission requires assignment to remain blocked.");
  if (sourceDraftImportPreview.mode !== "review-only") errors.push("Teacher draft persistence admission requires a review-only source import preview.");
  for (const [field, value] of [["storageWriteAllowed", sourceDraftImportPreview.storageWriteAllowed], ["studentFacingPayloadAllowed", sourceDraftImportPreview.studentFacingPayloadAllowed], ["assignmentAllowed", sourceDraftImportPreview.assignmentAllowed]] as const) if (value !== false) errors.push(`Teacher draft persistence admission requires source import ${field} to remain false.`);
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value && typeof value === "object" && !Array.isArray(value)); }
function isNonBlankString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
