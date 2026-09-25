import type { PilotReviewDecisionPersistenceSnapshot } from "./pilotReviewDecisionPersistence";

export type AssistLanguageAudioCatalogReleaseDecisionSnapshotBindingStatus =
  | "blocked-preview"
  | "linked-review-only";

export interface AssistLanguageAudioCatalogReleaseDecisionSnapshotBinding {
  recordVersion: 1;
  bindingId: string;
  releaseReviewBindingId: string;
  reconciliationId: string;
  reviewerGateBindingId: string;
  humanReviewPacketId: string;
  snapshotId: string;
  decisionId: string;
  tenantId: string;
  packageId: string;
  unitKey: string;
  persistenceMode: PilotReviewDecisionPersistenceSnapshot["persistenceMode"];
  decisionFingerprint: string;
  releaseReadinessId: string;
  releaseControlGateId: string;
  approvalLedgerId: string;
  status: AssistLanguageAudioCatalogReleaseDecisionSnapshotBindingStatus;
  linkedRecords: string[];
  scopeDrift: string[];
  blockingReasons: string[];
  blockedActions: string[];
  nextGate: string[];
  snapshotWriteAllowed: false;
  snapshotRestoreAllowed: false;
  snapshotExportAllowed: false;
  approvalCaptureAllowed: false;
  productionApprovalAllowed: false;
  packagePromotionAllowed: false;
  studentProductionLaunchAllowed: false;
  activationAllowed: false;
  mode: "review-only";
  sideEffect: "none";
}

export const ASSIST_LANGUAGE_AUDIO_RELEASE_DECISION_SNAPSHOT_REQUIRED_RECORDS = [
  "assist_language_audio_catalog_release_review_binding",
  "assist_language_audio_catalog_approval_reconciliation",
  "assist_language_audio_reviewer_gate_binding",
  "pilot_review_decision_snapshot",
  "white_label_release_readiness",
  "package_publish_gate",
  "package_approval_ledger",
  "controlled_pilot_human_review_packet",
] as const;

export const ASSIST_LANGUAGE_AUDIO_RELEASE_DECISION_SNAPSHOT_BLOCKED_ACTIONS = [
  "No decision snapshot write",
  "No decision snapshot restore",
  "No decision snapshot export",
  "No approval capture",
  "No production approval",
  "No package promotion",
  "No student production launch",
  "No release activation",
] as const;

export function createReviewOnlyAssistLanguageAudioCatalogReleaseDecisionSnapshotBinding(
  input: Omit<AssistLanguageAudioCatalogReleaseDecisionSnapshotBinding, "recordVersion" | "bindingId" | "mode" | "sideEffect" | "snapshotWriteAllowed" | "snapshotRestoreAllowed" | "snapshotExportAllowed" | "approvalCaptureAllowed" | "productionApprovalAllowed" | "packagePromotionAllowed" | "studentProductionLaunchAllowed" | "activationAllowed">,
): AssistLanguageAudioCatalogReleaseDecisionSnapshotBinding {
  const binding: AssistLanguageAudioCatalogReleaseDecisionSnapshotBinding = {
    ...input,
    recordVersion: 1,
    bindingId: `assist-language-audio-release-decision-snapshot-binding-v1:${input.releaseReviewBindingId}:${input.snapshotId}`,
    snapshotWriteAllowed: false,
    snapshotRestoreAllowed: false,
    snapshotExportAllowed: false,
    approvalCaptureAllowed: false,
    productionApprovalAllowed: false,
    packagePromotionAllowed: false,
    studentProductionLaunchAllowed: false,
    activationAllowed: false,
    mode: "review-only",
    sideEffect: "none",
  };

  const errors = validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBinding(binding);
  if (errors.length > 0) throw new Error(errors.join(" "));
  return binding;
}

export function validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBinding(value: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(value)) return ["assist-language audio release decision snapshot binding must be an object"];

  if (value.recordVersion !== 1) errors.push("assist-language audio release decision snapshot binding recordVersion must be 1");
  for (const field of [
    "bindingId",
    "releaseReviewBindingId",
    "reconciliationId",
    "reviewerGateBindingId",
    "humanReviewPacketId",
    "snapshotId",
    "decisionId",
    "tenantId",
    "packageId",
    "unitKey",
    "persistenceMode",
    "decisionFingerprint",
    "releaseReadinessId",
    "releaseControlGateId",
    "approvalLedgerId",
  ] as const) {
    if (!isNonEmptyString(value[field])) errors.push(`assist-language audio release decision snapshot binding ${field} is required`);
  }
  if (value.status !== "blocked-preview" && value.status !== "linked-review-only") {
    errors.push("assist-language audio release decision snapshot binding status is unsupported");
  }
  if (value.persistenceMode !== "hosted-managed" && value.persistenceMode !== "local-classroom") {
    errors.push("assist-language audio release decision snapshot binding persistenceMode is unsupported");
  }
  if (value.mode !== "review-only" || value.sideEffect !== "none") {
    errors.push("assist-language audio release decision snapshot binding must remain review-only with no side effect");
  }

  for (const field of ["linkedRecords", "scopeDrift", "blockingReasons", "blockedActions", "nextGate"] as const) {
    const items = value[field];
    if (!Array.isArray(items) || items.some((item) => !isNonEmptyString(item)) || new Set(items).size !== items.length) {
      errors.push(`assist-language audio release decision snapshot binding ${field} must be a unique string array`);
    }
  }
  const linkedRecords = readStringArray(value, "linkedRecords");
  for (const record of ASSIST_LANGUAGE_AUDIO_RELEASE_DECISION_SNAPSHOT_REQUIRED_RECORDS) {
    if (!linkedRecords.includes(record)) errors.push(`assist-language audio release decision snapshot binding must link ${record}`);
  }
  const blockedActions = readStringArray(value, "blockedActions");
  for (const action of ASSIST_LANGUAGE_AUDIO_RELEASE_DECISION_SNAPSHOT_BLOCKED_ACTIONS) {
    if (!blockedActions.includes(action)) errors.push(`assist-language audio release decision snapshot binding must block ${action}`);
  }
  for (const field of [
    "snapshotWriteAllowed",
    "snapshotRestoreAllowed",
    "snapshotExportAllowed",
    "approvalCaptureAllowed",
    "productionApprovalAllowed",
    "packagePromotionAllowed",
    "studentProductionLaunchAllowed",
    "activationAllowed",
  ] as const) {
    if (value[field] !== false) errors.push(`assist-language audio release decision snapshot binding ${field} must remain false`);
  }
  return [...new Set(errors)];
}

export function validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBindingAgainstSnapshot(
  bindingValue: unknown,
  snapshotValue: unknown,
): string[] {
  const errors = validateAssistLanguageAudioCatalogReleaseDecisionSnapshotBinding(bindingValue);
  const binding = isRecord(bindingValue) ? bindingValue : undefined;
  if (!isRecord(snapshotValue)) return [...new Set([...errors, "decision snapshot must be an object"])];

  for (const field of ["snapshotId", "tenantId", "packageId", "persistenceMode", "decisionFingerprint"] as const) {
    if (!isNonEmptyString(snapshotValue[field])) {
      errors.push(`decision snapshot ${field} is required for identity comparison`);
    }
  }
  const decision = snapshotValue.decision;
  if (!isRecord(decision) || !isNonEmptyString(decision.decisionId)) {
    errors.push("decision snapshot decisionId is required for identity comparison");
  }

  if (binding && isNonEmptyString(binding.snapshotId) && binding.snapshotId !== snapshotValue.snapshotId) {
    errors.push("decision snapshot binding snapshotId does not match the source snapshot");
  }
  if (binding && isNonEmptyString(binding.decisionId) && isRecord(decision) && isNonEmptyString(decision.decisionId) && binding.decisionId !== decision.decisionId) {
    errors.push("decision snapshot binding decisionId does not match the source decision");
  }
  for (const field of ["tenantId", "packageId", "persistenceMode", "decisionFingerprint"] as const) {
    if (binding && isNonEmptyString(binding[field]) && binding[field] !== snapshotValue[field]) {
      errors.push(`decision snapshot binding ${field} does not match the source snapshot`);
    }
  }
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function readStringArray(value: Record<string, unknown>, key: string): string[] {
  return Array.isArray(value[key]) ? value[key].filter(isNonEmptyString) : [];
}
