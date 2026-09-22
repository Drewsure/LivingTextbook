export type TeacherDraftAcceptanceReadinessStatus = "blocked" | "ready-review";

export interface TeacherDraftAcceptanceReadiness {
  readinessId: string;
  tenantId: string;
  draftId: string;
  sourcePackageId: string;
  releaseCandidate: string;
  ownerPolicyBindingId: string;
  acceptanceRecordPreviewId: string;
  retentionPolicyId: string;
  persistenceActivationPreflightId: string;
  exportRetentionDryRunId: string;
  recoveryPacketId: string;
  mode: "review-only";
  status: TeacherDraftAcceptanceReadinessStatus;
  policyAcceptanceStatus: "not-accepted";
  providerNeutral: true;
  retentionAccepted: false;
  exportAllowed: false;
  rollbackAllowed: false;
  persistenceActivationAllowed: false;
  assignmentAllowed: false;
  signatureCaptureAllowed: false;
  requiredEvidence: string[];
  blockers: string[];
  blockedActions: string[];
  nextSteps: string[];
}

const REQUIRED_BLOCKED_ACTIONS = [
  "No accepted terms stored",
  "No storage activation",
  "No learner data export",
  "No retention deletion execution",
  "No rollback execution",
  "No signature capture",
  "No direct student assignment",
] as const;

export function validateTeacherDraftAcceptanceReadiness(readiness: TeacherDraftAcceptanceReadiness): string[] {
  const errors: string[] = [];
  for (const [field, value] of [
    ["readinessId", readiness.readinessId], ["tenantId", readiness.tenantId], ["draftId", readiness.draftId],
    ["sourcePackageId", readiness.sourcePackageId], ["releaseCandidate", readiness.releaseCandidate],
    ["ownerPolicyBindingId", readiness.ownerPolicyBindingId], ["acceptanceRecordPreviewId", readiness.acceptanceRecordPreviewId],
    ["retentionPolicyId", readiness.retentionPolicyId], ["persistenceActivationPreflightId", readiness.persistenceActivationPreflightId],
    ["exportRetentionDryRunId", readiness.exportRetentionDryRunId], ["recoveryPacketId", readiness.recoveryPacketId],
  ] as const) if (typeof value !== "string" || value.trim().length === 0) errors.push(`Teacher draft acceptance readiness ${field} is required.`);
  if (readiness.mode !== "review-only") errors.push("Teacher draft acceptance readiness must remain review-only.");
  if (readiness.status !== "blocked" && readiness.status !== "ready-review") errors.push("Teacher draft acceptance readiness has an unsupported status.");
  if (readiness.policyAcceptanceStatus !== "not-accepted") errors.push("Teacher draft acceptance readiness policy status must remain not-accepted.");
  if (readiness.providerNeutral !== true) errors.push("Teacher draft acceptance readiness must remain provider-neutral.");
  for (const [field, value] of [
    ["retentionAccepted", readiness.retentionAccepted], ["exportAllowed", readiness.exportAllowed], ["rollbackAllowed", readiness.rollbackAllowed],
    ["persistenceActivationAllowed", readiness.persistenceActivationAllowed], ["assignmentAllowed", readiness.assignmentAllowed], ["signatureCaptureAllowed", readiness.signatureCaptureAllowed],
  ] as const) if (value !== false) errors.push(`Teacher draft acceptance readiness ${field} must remain false.`);
  for (const [field, values] of [["requiredEvidence", readiness.requiredEvidence], ["blockers", readiness.blockers], ["blockedActions", readiness.blockedActions], ["nextSteps", readiness.nextSteps]] as const) {
    if (!Array.isArray(values) || values.some((value) => typeof value !== "string" || !value.trim())) errors.push(`Teacher draft acceptance readiness ${field} must contain non-blank strings.`);
  }
  for (const action of REQUIRED_BLOCKED_ACTIONS) if (!readiness.blockedActions.includes(action)) errors.push(`Teacher draft acceptance readiness must block: ${action}.`);
  if (readiness.status === "blocked" && readiness.blockers.length === 0) errors.push("Blocked teacher draft acceptance readiness must state at least one blocker.");
  return [...new Set(errors)];
}

export function validateTeacherDraftAcceptanceReadinessSources(readiness: unknown, ownerPolicyBinding: unknown, acceptancePreview: unknown, retentionPolicy: unknown, activationPreflight: unknown, exportDryRun: unknown, recoveryReconciliation: unknown): string[] {
  const errors: string[] = [];
  if (!isRecord(readiness)) return ["Teacher draft acceptance readiness source binding requires readiness."];
  for (const [value, label] of [[ownerPolicyBinding, "owner-policy binding"], [acceptancePreview, "acceptance preview"], [retentionPolicy, "retention policy"], [activationPreflight, "activation preflight"], [exportDryRun, "export/retention dry run"], [recoveryReconciliation, "recovery reconciliation"]] as const) if (!isRecord(value)) return [`Teacher draft acceptance readiness requires a ${label}.`];
  const owner = ownerPolicyBinding as Record<string, unknown>;
  const acceptance = acceptancePreview as Record<string, unknown>;
  const retention = retentionPolicy as Record<string, unknown>;
  const activation = activationPreflight as Record<string, unknown>;
  const exportRun = exportDryRun as Record<string, unknown>;
  const recovery = recoveryReconciliation as Record<string, unknown>;
  for (const [left, right, message] of [
    [readiness.tenantId, owner.tenantId, "Readiness tenant must match owner-policy binding."],
    [readiness.draftId, owner.draftId, "Readiness draft must match owner-policy binding."],
    [readiness.sourcePackageId, owner.sourcePackageId, "Readiness package must match owner-policy binding."],
    [readiness.ownerPolicyBindingId, owner.bindingId, "Readiness must match owner-policy binding id."],
    [readiness.acceptanceRecordPreviewId, acceptance.previewId, "Readiness must match acceptance preview id."],
    [readiness.retentionPolicyId, retention.policyId, "Readiness must match retention policy id."],
    [readiness.persistenceActivationPreflightId, activation.packetId, "Readiness must match activation preflight id."],
    [readiness.exportRetentionDryRunId, exportRun.dryRunId, "Readiness must match export/retention dry run id."],
    [readiness.recoveryPacketId, recovery.recoveryPacketId, "Readiness must match recovery packet id."],
  ] as const) if (!isNonBlankString(left) || !isNonBlankString(right) || left !== right) errors.push(message);
  for (const [label, source] of [["acceptance preview", acceptance], ["retention policy", retention], ["activation preflight", activation], ["export/retention dry run", exportRun], ["recovery reconciliation", recovery]] as const) {
    if (source.tenantId !== readiness.tenantId) errors.push(`Readiness tenant must match ${label}.`);
    if (source.packageId !== readiness.sourcePackageId) errors.push(`Readiness package must match ${label}.`);
  }
  if (acceptance.releaseCandidate !== readiness.releaseCandidate) errors.push("Readiness release candidate must match acceptance preview.");
  if (acceptance.statusLabel !== "Acceptance record blocked") errors.push("Acceptance preview must remain blocked.");
  if (retention.retentionPolicyAccepted !== false || retention.auditPolicyAccepted !== false || retention.schoolPolicyAccepted !== false) errors.push("Retention and audit acceptance must remain false.");
  if (retention.snapshotWriteAllowed !== false || retention.restoreAllowed !== false || retention.exportAllowed !== false || retention.activationAllowed !== false) errors.push("Retention policy side effects must remain false.");
  if (activation.canActivate !== false) errors.push("Persistence activation preflight must remain inactive.");
  for (const [field, value] of [["exportExecutionAllowed", exportRun.exportExecutionAllowed], ["retentionDeletionAllowed", exportRun.retentionDeletionAllowed], ["learnerDataExportAllowed", exportRun.learnerDataExportAllowed], ["packageWriteAllowed", exportRun.packageWriteAllowed], ["routeMutationAllowed", exportRun.routeMutationAllowed]] as const) if (value !== false) errors.push(`Export/retention dry run ${field} must remain false.`);
  if (recovery.executionAllowed !== false) errors.push("Recovery reconciliation execution must remain false.");
  return [...new Set(errors)];
}

function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value && typeof value === "object" && !Array.isArray(value)); }
function isNonBlankString(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0; }
