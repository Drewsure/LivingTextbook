export type PersistenceRecordCategory =
  | "tenant-config"
  | "content-package"
  | "teacher-draft-package"
  | "teacher-draft-review-handoff"
  | "teacher-draft-review-decision"
  | "teacher-draft-review-evidence"
  | "teacher-draft-review-audit"
  | "teacher-draft-verifier-submission"
  | "tenant-library-item"
  | "route-registry"
  | "launch-session"
  | "progress-event-stream"
  | "collection-inventory"
  | "media-manifest"
  | "deployment-profile"
  | "report-export-policy"
  | "teacher-report-package"
  | "publisher-maintenance-change"
  | "local-companion-handoff"
  | "local-companion-release-gate"
  | "package-release-candidate"
  | "package-publish-gate"
  | "package-approval-ledger";

export type PersistenceRecordReadiness =
  | "static-demo"
  | "durable-required"
  | "policy-required"
  | "pilot-ready"
  | "not-stored";

export type PersistenceStorageTier =
  | "source-control-demo"
  | "hosted-database"
  | "hosted-object-storage"
  | "local-classroom-store"
  | "school-policy";

export interface DurableRecordContract {
  recordId: string;
  category: PersistenceRecordCategory;
  label: string;
  readiness: PersistenceRecordReadiness;
  sourceOfTruth: string;
  requiredBeforePilot: boolean;
  containsStudentData: boolean;
  containsMediaRights: boolean;
  supportsLocalDeployment: boolean;
  storesRawAudio: boolean;
  storesTranscript: boolean;
  ownsTeacherSessionSettings?: boolean;
  preservesEventEffectTaxonomy?: boolean;
  requiresEventAcceptanceGate?: boolean;
  preservesReportEventAcceptanceSummary?: boolean;
  preservesEarnedCollectionRules?: boolean;
  rejectsRandomRewardPressure?: boolean;
  preservesDraftReviewGate?: boolean;
  blocksDirectStudentAssignment?: boolean;
  preservesReviewPacketSections?: boolean;
  blocksLiveReviewSubmission?: boolean;
  preservesReviewerEvidenceRequirements?: boolean;
  blocksReviewerStateChange?: boolean;
  preservesReviewEvidencePacket?: boolean;
  blocksEvidenceUpload?: boolean;
  preservesReviewAuditTrail?: boolean;
  blocksReviewAuditStateChange?: boolean;
  preservesVerifierPreflightChecks?: boolean;
  blocksAutomaticVerifierSubmit?: boolean;
  preservesLibrarySourceLineage?: boolean;
  blocksStudentDataCopy?: boolean;
  blocksPublicCommunityPublishing?: boolean;
  recommendedFirstPilotStore: PersistenceStorageTier[];
  note: string;
}

export function validateDurableRecordContracts(records: DurableRecordContract[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const record of records) {
    if (record.recordId.trim().length === 0) {
      errors.push("Durable record contract must include a record id.");
    }

    if (ids.has(record.recordId)) {
      errors.push(`Duplicate durable record id: ${record.recordId}.`);
    }

    ids.add(record.recordId);

    if (record.label.trim().length === 0) {
      errors.push(`Durable record ${record.recordId} must include a label.`);
    }

    if (record.sourceOfTruth.trim().length === 0) {
      errors.push(`Durable record ${record.recordId} must identify a source of truth.`);
    }

    if (record.storesRawAudio) {
      errors.push(`Durable record ${record.recordId} must not store raw learner audio in the core persistence scaffold.`);
    }

    if (record.storesTranscript) {
      errors.push(`Durable record ${record.recordId} must not store learner transcripts in the core persistence scaffold.`);
    }

    if (record.containsStudentData && record.readiness === "static-demo") {
      errors.push(`Student-data record ${record.recordId} cannot remain static-demo for pilot use.`);
    }

    if (record.ownsTeacherSessionSettings && record.category !== "launch-session") {
      errors.push(`Teacher session settings must belong to a launch-session record, not ${record.category}.`);
    }

    if (record.category === "progress-event-stream" && !record.preservesEventEffectTaxonomy) {
      errors.push(`Progress event durable record ${record.recordId} must preserve event effect taxonomy.`);
    }

    if (record.category === "progress-event-stream" && record.containsStudentData && !record.requiresEventAcceptanceGate) {
      errors.push(`Progress event durable record ${record.recordId} must require a passed event acceptance gate.`);
    }

    if (record.category === "teacher-report-package" && !record.preservesReportEventAcceptanceSummary) {
      errors.push(`Teacher report package durable record ${record.recordId} must preserve event acceptance summaries.`);
    }

    if (record.category === "collection-inventory" && !record.preservesEarnedCollectionRules) {
      errors.push(`Collection inventory durable record ${record.recordId} must preserve earned collection rules.`);
    }

    if (record.category === "collection-inventory" && !record.rejectsRandomRewardPressure) {
      errors.push(`Collection inventory durable record ${record.recordId} must reject random reward pressure.`);
    }

    if (record.category === "teacher-draft-package" && !record.preservesDraftReviewGate) {
      errors.push(`Teacher draft durable record ${record.recordId} must preserve review gates.`);
    }

    if (record.category === "teacher-draft-package" && !record.blocksDirectStudentAssignment) {
      errors.push(`Teacher draft durable record ${record.recordId} must block direct student assignment.`);
    }

    if (record.category === "teacher-draft-review-handoff" && !record.preservesReviewPacketSections) {
      errors.push(`Teacher draft review handoff record ${record.recordId} must preserve review packet sections.`);
    }

    if (record.category === "teacher-draft-review-handoff" && !record.blocksLiveReviewSubmission) {
      errors.push(`Teacher draft review handoff record ${record.recordId} must block live review submission.`);
    }

    if (record.category === "teacher-draft-review-handoff" && !record.blocksDirectStudentAssignment) {
      errors.push(`Teacher draft review handoff record ${record.recordId} must block direct student assignment.`);
    }

    if (record.category === "teacher-draft-review-decision" && !record.preservesReviewerEvidenceRequirements) {
      errors.push(`Teacher draft reviewer decision record ${record.recordId} must preserve reviewer evidence requirements.`);
    }

    if (record.category === "teacher-draft-review-decision" && !record.blocksReviewerStateChange) {
      errors.push(`Teacher draft reviewer decision record ${record.recordId} must block reviewer state changes.`);
    }

    if (record.category === "teacher-draft-review-decision" && !record.blocksDirectStudentAssignment) {
      errors.push(`Teacher draft reviewer decision record ${record.recordId} must block direct student assignment.`);
    }

    if (record.category === "teacher-draft-review-evidence" && !record.preservesReviewEvidencePacket) {
      errors.push(`Teacher draft review evidence record ${record.recordId} must preserve review evidence packets.`);
    }

    if (record.category === "teacher-draft-review-evidence" && !record.blocksEvidenceUpload) {
      errors.push(`Teacher draft review evidence record ${record.recordId} must block evidence uploads.`);
    }

    if (record.category === "teacher-draft-review-audit" && !record.preservesReviewAuditTrail) {
      errors.push(`Teacher draft review audit record ${record.recordId} must preserve review audit trails.`);
    }

    if (record.category === "teacher-draft-review-audit" && !record.blocksReviewAuditStateChange) {
      errors.push(`Teacher draft review audit record ${record.recordId} must block audit-driven state changes.`);
    }

    if (record.category === "teacher-draft-verifier-submission" && !record.preservesVerifierPreflightChecks) {
      errors.push(`Teacher draft verifier submission record ${record.recordId} must preserve verifier preflight checks.`);
    }

    if (record.category === "teacher-draft-verifier-submission" && !record.blocksAutomaticVerifierSubmit) {
      errors.push(`Teacher draft verifier submission record ${record.recordId} must block automatic verifier submission.`);
    }

    if (record.category === "tenant-library-item" && !record.preservesLibrarySourceLineage) {
      errors.push(`Tenant library durable record ${record.recordId} must preserve source lineage.`);
    }

    if (record.category === "tenant-library-item" && !record.blocksStudentDataCopy) {
      errors.push(`Tenant library durable record ${record.recordId} must block student data copies.`);
    }

    if (record.category === "tenant-library-item" && !record.blocksPublicCommunityPublishing) {
      errors.push(`Tenant library durable record ${record.recordId} must block public community publishing.`);
    }

    if (record.supportsLocalDeployment && !record.recommendedFirstPilotStore.includes("local-classroom-store")) {
      errors.push(`Local-capable record ${record.recordId} must name the local classroom store path.`);
    }
  }

  return errors;
}

export function getDurableRecordReadinessWarnings(records: DurableRecordContract[]): string[] {
  const warnings: string[] = [];

  for (const record of records) {
    if (record.requiredBeforePilot && record.readiness !== "pilot-ready") {
      warnings.push(`${record.label} must be resolved before a real pilot. Current readiness: ${record.readiness}.`);
    }

    if (record.containsStudentData && !record.recommendedFirstPilotStore.includes("school-policy")) {
      warnings.push(`${record.label} contains student data and must include a school-policy decision.`);
    }

    if (record.containsMediaRights && !record.recommendedFirstPilotStore.includes("hosted-object-storage")) {
      warnings.push(`${record.label} contains media rights data and should include an object-storage or bundle manifest decision.`);
    }
  }

  return warnings;
}
