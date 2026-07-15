export type PersistenceRecordCategory =
  | "tenant-config"
  | "content-package"
  | "teacher-draft-package"
  | "teacher-draft-review-handoff"
  | "teacher-draft-review-decision"
  | "teacher-draft-review-evidence"
  | "teacher-draft-review-audit"
  | "teacher-draft-verifier-submission"
  | "upload-intake"
  | "upload-review"
  | "upload-promotion"
  | "evidence-packet"
  | "evidence-attachment"
  | "game-asset-manifest"
  | "label-anchor-record"
  | "activity-compatibility-snapshot"
  | "template-rendering-profile"
  | "font-accessibility-profile"
  | "tenant-library-item"
  | "route-registry"
  | "launch-session"
  | "progress-event-stream"
  | "collection-inventory"
  | "media-manifest"
  | "media-playlist-binding"
  | "background-media-policy-binding"
  | "local-media-bundle-entry"
  | "deployment-profile"
  | "report-export-policy"
  | "teacher-report-package"
  | "publisher-maintenance-change"
  | "local-companion-handoff"
  | "local-companion-release-gate"
  | "package-release-candidate"
  | "package-publish-gate"
  | "package-approval-ledger"
  | "pilot-evidence-packet"
  | "teacher-dry-run-rehearsal"
  | "classroom-launch-gate";

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
  preservesUploadSourceLineage?: boolean;
  blocksStudentFacingUploadUse?: boolean;
  preservesUploadReviewPackets?: boolean;
  preservesUploadTargetMappingPacket?: boolean;
  blocksUploadReviewPromotion?: boolean;
  preservesUploadPromotionTargets?: boolean;
  blocksStudentFacingPromotion?: boolean;
  preservesEvidencePacketFlow?: boolean;
  blocksEvidencePacketPromotion?: boolean;
  preservesEvidenceAttachmentMetadata?: boolean;
  blocksAttachmentUpload?: boolean;
  blocksAttachmentDownload?: boolean;
  blocksStorageWrite?: boolean;
  blocksStudentFacingAttachment?: boolean;
  preservesGameAssetManifest?: boolean;
  blocksStudentFacingGameAssetUse?: boolean;
  preservesLabelAnchorRecords?: boolean;
  requiresLabelAudioCoverage?: boolean;
  blocksSupportLanguageProgress?: boolean;
  preservesActivityCompatibilitySnapshot?: boolean;
  blocksUncheckedActivityConversion?: boolean;
  preservesTemplateRenderingProfile?: boolean;
  blocksUnsafeTemplateRendering?: boolean;
  preservesFontAccessibilityProfile?: boolean;
  blocksUnapprovedFontUse?: boolean;
  preservesMediaPlaylistBinding?: boolean;
  blocksMediaOnlyProgress?: boolean;
  preservesBackgroundMediaPolicy?: boolean;
  requiresLearningAudioPriority?: boolean;
  preservesLocalMediaBundleEntry?: boolean;
  blocksLocalFolderActivation?: boolean;
  preservesLibrarySourceLineage?: boolean;
  blocksStudentDataCopy?: boolean;
  blocksPublicCommunityPublishing?: boolean;
  preservesPilotEvidencePacket?: boolean;
  blocksSignedApprovalCapture?: boolean;
  preservesTeacherDryRunRehearsal?: boolean;
  blocksStudentLaunchAction?: boolean;
  blocksRealLearnerDataCollection?: boolean;
  blocksLiveReportExport?: boolean;
  preservesClassroomLaunchGate?: boolean;
  blocksLiveClassroomLaunch?: boolean;
  blocksLaunchWithoutPolicy?: boolean;
  blocksLaunchWithoutPersistence?: boolean;
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

    if (record.category === "upload-intake" && !record.preservesUploadSourceLineage) {
      errors.push(`Upload intake record ${record.recordId} must preserve upload source lineage.`);
    }

    if (record.category === "upload-intake" && !record.blocksStudentFacingUploadUse) {
      errors.push(`Upload intake record ${record.recordId} must block student-facing upload use.`);
    }

    if (record.category === "upload-review" && !record.preservesUploadReviewPackets) {
      errors.push(`Upload review record ${record.recordId} must preserve upload review packets.`);
    }

    if (record.category === "upload-review" && !record.preservesUploadTargetMappingPacket) {
      errors.push(`Upload review record ${record.recordId} must preserve upload target mapping packets.`);
    }

    if (record.category === "upload-review" && !record.blocksUploadReviewPromotion) {
      errors.push(`Upload review record ${record.recordId} must block upload promotion.`);
    }

    if (record.category === "upload-review" && !record.blocksStudentFacingUploadUse) {
      errors.push(`Upload review record ${record.recordId} must block student-facing upload use.`);
    }

    if (record.category === "upload-promotion" && !record.preservesUploadPromotionTargets) {
      errors.push(`Upload promotion record ${record.recordId} must preserve upload promotion targets.`);
    }

    if (record.category === "upload-promotion" && !record.preservesUploadTargetMappingPacket) {
      errors.push(`Upload promotion record ${record.recordId} must preserve upload target mapping packets.`);
    }

    if (record.category === "upload-promotion" && !record.blocksStudentFacingPromotion) {
      errors.push(`Upload promotion record ${record.recordId} must block student-facing promotion.`);
    }

    if (record.category === "evidence-packet" && !record.preservesEvidencePacketFlow) {
      errors.push(`Evidence packet record ${record.recordId} must preserve evidence packet flow state.`);
    }

    if (record.category === "evidence-packet" && !record.blocksEvidenceUpload) {
      errors.push(`Evidence packet record ${record.recordId} must block live evidence uploads.`);
    }

    if (record.category === "evidence-packet" && !record.blocksSignedApprovalCapture) {
      errors.push(`Evidence packet record ${record.recordId} must block signed approval capture.`);
    }

    if (record.category === "evidence-packet" && !record.blocksEvidencePacketPromotion) {
      errors.push(`Evidence packet record ${record.recordId} must block evidence-driven promotion.`);
    }

    if (record.category === "evidence-packet" && !record.blocksStudentFacingUploadUse) {
      errors.push(`Evidence packet record ${record.recordId} must block student-facing upload use.`);
    }

    if (record.category === "evidence-attachment" && !record.preservesEvidenceAttachmentMetadata) {
      errors.push(`Evidence attachment record ${record.recordId} must preserve evidence attachment metadata.`);
    }

    if (record.category === "evidence-attachment" && !record.blocksAttachmentUpload) {
      errors.push(`Evidence attachment record ${record.recordId} must block attachment upload.`);
    }

    if (record.category === "evidence-attachment" && !record.blocksAttachmentDownload) {
      errors.push(`Evidence attachment record ${record.recordId} must block attachment download.`);
    }

    if (record.category === "evidence-attachment" && !record.blocksStorageWrite) {
      errors.push(`Evidence attachment record ${record.recordId} must block storage writes.`);
    }

    if (record.category === "evidence-attachment" && !record.blocksStudentFacingAttachment) {
      errors.push(`Evidence attachment record ${record.recordId} must block student-facing attachments.`);
    }

    if (record.category === "game-asset-manifest" && !record.preservesGameAssetManifest) {
      errors.push(`Game asset manifest record ${record.recordId} must preserve reviewed game asset metadata.`);
    }

    if (record.category === "game-asset-manifest" && !record.blocksStudentFacingGameAssetUse) {
      errors.push(`Game asset manifest record ${record.recordId} must block student-facing asset use.`);
    }

    if (record.category === "label-anchor-record" && !record.preservesLabelAnchorRecords) {
      errors.push(`Label anchor record ${record.recordId} must preserve reviewed label anchors.`);
    }

    if (record.category === "label-anchor-record" && !record.requiresLabelAudioCoverage) {
      errors.push(`Label anchor record ${record.recordId} must require label audio coverage.`);
    }

    if (record.category === "label-anchor-record" && !record.blocksSupportLanguageProgress) {
      errors.push(`Label anchor record ${record.recordId} must block support-language progress triggers.`);
    }

    if (record.category === "activity-compatibility-snapshot" && !record.preservesActivityCompatibilitySnapshot) {
      errors.push(`Activity compatibility snapshot record ${record.recordId} must preserve curated compatibility outcomes.`);
    }

    if (record.category === "activity-compatibility-snapshot" && !record.blocksUncheckedActivityConversion) {
      errors.push(`Activity compatibility snapshot record ${record.recordId} must block unchecked activity conversion.`);
    }

    if (record.category === "activity-compatibility-snapshot" && !record.blocksSupportLanguageProgress) {
      errors.push(`Activity compatibility snapshot record ${record.recordId} must block support-language progress triggers.`);
    }

    if (record.category === "template-rendering-profile" && !record.preservesTemplateRenderingProfile) {
      errors.push(`Template rendering profile record ${record.recordId} must preserve template rendering controls.`);
    }

    if (record.category === "template-rendering-profile" && !record.blocksUnsafeTemplateRendering) {
      errors.push(`Template rendering profile record ${record.recordId} must block unsafe template rendering.`);
    }

    if (record.category === "font-accessibility-profile" && !record.preservesFontAccessibilityProfile) {
      errors.push(`Font accessibility profile record ${record.recordId} must preserve font accessibility controls.`);
    }

    if (record.category === "font-accessibility-profile" && !record.blocksUnapprovedFontUse) {
      errors.push(`Font accessibility profile record ${record.recordId} must block unapproved font use.`);
    }

    if (record.category === "media-playlist-binding" && !record.preservesMediaPlaylistBinding) {
      errors.push(`Media playlist binding record ${record.recordId} must preserve media playlist bindings.`);
    }

    if (record.category === "media-playlist-binding" && !record.blocksMediaOnlyProgress) {
      errors.push(`Media playlist binding record ${record.recordId} must block media-only progress.`);
    }

    if (record.category === "background-media-policy-binding" && !record.preservesBackgroundMediaPolicy) {
      errors.push(`Background media policy binding record ${record.recordId} must preserve background media policy.`);
    }

    if (record.category === "background-media-policy-binding" && !record.requiresLearningAudioPriority) {
      errors.push(`Background media policy binding record ${record.recordId} must require learning-audio priority.`);
    }

    if (record.category === "local-media-bundle-entry" && !record.preservesLocalMediaBundleEntry) {
      errors.push(`Local media bundle entry record ${record.recordId} must preserve local media bundle entries.`);
    }

    if (record.category === "local-media-bundle-entry" && !record.blocksLocalFolderActivation) {
      errors.push(`Local media bundle entry record ${record.recordId} must block local folder activation.`);
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

    if (record.category === "pilot-evidence-packet" && !record.preservesPilotEvidencePacket) {
      errors.push(`Pilot evidence packet record ${record.recordId} must preserve release evidence packet metadata.`);
    }

    if (record.category === "pilot-evidence-packet" && !record.blocksEvidenceUpload) {
      errors.push(`Pilot evidence packet record ${record.recordId} must block live evidence uploads until storage policy exists.`);
    }

    if (record.category === "pilot-evidence-packet" && !record.blocksSignedApprovalCapture) {
      errors.push(`Pilot evidence packet record ${record.recordId} must block signed approval capture until identity and policy exist.`);
    }

    if (record.category === "teacher-dry-run-rehearsal" && !record.preservesTeacherDryRunRehearsal) {
      errors.push(`Teacher dry-run rehearsal record ${record.recordId} must preserve rehearsal route, game, media, report, and local fallback checks.`);
    }

    if (record.category === "teacher-dry-run-rehearsal" && !record.blocksStudentLaunchAction) {
      errors.push(`Teacher dry-run rehearsal record ${record.recordId} must block live student launch actions.`);
    }

    if (record.category === "teacher-dry-run-rehearsal" && !record.blocksRealLearnerDataCollection) {
      errors.push(`Teacher dry-run rehearsal record ${record.recordId} must block real learner data collection.`);
    }

    if (record.category === "teacher-dry-run-rehearsal" && !record.blocksLiveReportExport) {
      errors.push(`Teacher dry-run rehearsal record ${record.recordId} must block live report export.`);
    }

    if (record.category === "classroom-launch-gate" && !record.preservesClassroomLaunchGate) {
      errors.push(`Classroom launch gate record ${record.recordId} must preserve launch gate status, blockers, and source references.`);
    }

    if (record.category === "classroom-launch-gate" && !record.blocksLiveClassroomLaunch) {
      errors.push(`Classroom launch gate record ${record.recordId} must block live classroom launch.`);
    }

    if (record.category === "classroom-launch-gate" && !record.blocksLaunchWithoutPolicy) {
      errors.push(`Classroom launch gate record ${record.recordId} must block launch without school policy.`);
    }

    if (record.category === "classroom-launch-gate" && !record.blocksLaunchWithoutPersistence) {
      errors.push(`Classroom launch gate record ${record.recordId} must block launch without accepted persistence.`);
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
