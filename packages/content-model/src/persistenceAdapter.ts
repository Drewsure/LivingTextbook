import type { DeploymentChannel } from "./index";
import type { PersistenceRecordCategory, PersistenceStorageTier } from "./persistenceRecords";

export type PersistenceAdapterMode = "static-demo" | "hosted-managed" | "local-classroom";
export type PersistenceWriteReadiness = "demo-only" | "requires-backend" | "requires-policy" | "pilot-ready";

export interface PersistenceWriteIntent {
  intentId: string;
  category: PersistenceRecordCategory;
  label: string;
  readiness: PersistenceWriteReadiness;
  targetStore: PersistenceStorageTier[];
  deploymentChannels: DeploymentChannel[];
  requiredBeforePilot: boolean;
  containsStudentData: boolean;
  requiresSchoolPolicy: boolean;
  canRunOffline: boolean;
  allowsExport: boolean;
  rejectsRawAudio: boolean;
  rejectsTranscripts: boolean;
  preservesEventEffectTaxonomy?: boolean;
  requiresEventAcceptanceGate?: boolean;
  preservesReportEventAcceptanceSummary?: boolean;
  preservesGameAudioCoverageSnapshot?: boolean;
  preservesTeacherSessionSettingsSnapshot?: boolean;
  preservesTeacherSessionEventAcceptanceGate?: boolean;
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
  preservesReviewerIdentitySignatureGate?: boolean;
  blocksApprovalCapture?: boolean;
  blocksSignatureAttachmentUpload?: boolean;
  blocksApprovalDrivenAssignment?: boolean;
  preservesTeacherDryRunRehearsal?: boolean;
  blocksStudentLaunchAction?: boolean;
  blocksRealLearnerDataCollection?: boolean;
  blocksLiveReportExport?: boolean;
  preservesClassroomLaunchGate?: boolean;
  blocksLiveClassroomLaunch?: boolean;
  blocksLaunchWithoutPolicy?: boolean;
  blocksLaunchWithoutPersistence?: boolean;
  note: string;
}

export interface PersistenceAdapterPlan {
  planId: string;
  label: string;
  mode: PersistenceAdapterMode;
  recommendedForFirstPilot: boolean;
  costPosture: "lowest" | "controlled" | "higher";
  deploymentChannels: DeploymentChannel[];
  writeIntents: PersistenceWriteIntent[];
  handoffSteps: string[];
  note: string;
}

export function validatePersistenceAdapterPlan(plan: PersistenceAdapterPlan): string[] {
  const errors: string[] = [];
  const intentIds = new Set<string>();

  if (plan.planId.trim().length === 0) {
    errors.push("Persistence adapter plan must include a plan id.");
  }

  if (plan.label.trim().length === 0) {
    errors.push(`Persistence adapter plan ${plan.planId} must include a label.`);
  }

  if (plan.writeIntents.length === 0) {
    errors.push(`Persistence adapter plan ${plan.planId} must list write intents.`);
  }

  if (plan.handoffSteps.length === 0) {
    errors.push(`Persistence adapter plan ${plan.planId} must list handoff steps.`);
  }

  for (const intent of plan.writeIntents) {
    if (intent.intentId.trim().length === 0) {
      errors.push(`Persistence adapter plan ${plan.planId} includes an intent without an id.`);
    }

    if (intentIds.has(intent.intentId)) {
      errors.push(`Duplicate persistence write intent id: ${intent.intentId}.`);
    }

    intentIds.add(intent.intentId);

    if (intent.label.trim().length === 0) {
      errors.push(`Persistence write intent ${intent.intentId} must include a label.`);
    }

    if (intent.targetStore.length === 0) {
      errors.push(`Persistence write intent ${intent.intentId} must name at least one target store.`);
    }

    if (intent.deploymentChannels.length === 0) {
      errors.push(`Persistence write intent ${intent.intentId} must name at least one deployment channel.`);
    }

    if (intent.note.trim().length === 0) {
      errors.push(`Persistence write intent ${intent.intentId} must include a note.`);
    }

    if (intent.containsStudentData && !intent.requiresSchoolPolicy) {
      errors.push(`Student-data write intent ${intent.intentId} must require school or tenant policy.`);
    }

    if (!intent.rejectsRawAudio) {
      errors.push(`Core persistence write intent ${intent.intentId} must reject raw learner audio.`);
    }

    if (!intent.rejectsTranscripts) {
      errors.push(`Core persistence write intent ${intent.intentId} must reject learner transcripts.`);
    }

    if (intent.readiness === "pilot-ready" && intent.requiredBeforePilot && intent.containsStudentData && !intent.requiresSchoolPolicy) {
      errors.push(`Pilot-ready student-data write intent ${intent.intentId} must include policy readiness.`);
    }

    if (intent.category === "progress-event-stream" && !intent.preservesEventEffectTaxonomy) {
      errors.push(`Progress event write intent ${intent.intentId} must preserve event effect taxonomy.`);
    }

    if (intent.category === "progress-event-stream" && intent.containsStudentData && !intent.requiresEventAcceptanceGate) {
      errors.push(`Progress event write intent ${intent.intentId} must require a passed teacher session event acceptance gate.`);
    }

    if (intent.category === "teacher-report-package" && !intent.preservesReportEventAcceptanceSummary) {
      errors.push(`Teacher report package write intent ${intent.intentId} must preserve event acceptance summaries.`);
    }

    if (intent.category === "collection-inventory" && !intent.preservesEarnedCollectionRules) {
      errors.push(`Collection inventory write intent ${intent.intentId} must preserve earned collection rules.`);
    }

    if (intent.category === "collection-inventory" && !intent.rejectsRandomRewardPressure) {
      errors.push(`Collection inventory write intent ${intent.intentId} must reject random reward pressure.`);
    }

    if (intent.category === "teacher-draft-package" && !intent.preservesDraftReviewGate) {
      errors.push(`Teacher draft package write intent ${intent.intentId} must preserve review gates.`);
    }

    if (intent.category === "teacher-draft-package" && !intent.blocksDirectStudentAssignment) {
      errors.push(`Teacher draft package write intent ${intent.intentId} must block direct student assignment.`);
    }

    if (intent.category === "teacher-draft-review-handoff" && !intent.preservesReviewPacketSections) {
      errors.push(`Teacher draft review handoff write intent ${intent.intentId} must preserve review packet sections.`);
    }

    if (intent.category === "teacher-draft-review-handoff" && !intent.blocksLiveReviewSubmission) {
      errors.push(`Teacher draft review handoff write intent ${intent.intentId} must block live review submission.`);
    }

    if (intent.category === "teacher-draft-review-handoff" && !intent.blocksDirectStudentAssignment) {
      errors.push(`Teacher draft review handoff write intent ${intent.intentId} must block direct student assignment.`);
    }

    if (intent.category === "teacher-draft-review-decision" && !intent.preservesReviewerEvidenceRequirements) {
      errors.push(`Teacher draft reviewer decision write intent ${intent.intentId} must preserve reviewer evidence requirements.`);
    }

    if (intent.category === "teacher-draft-review-decision" && !intent.blocksReviewerStateChange) {
      errors.push(`Teacher draft reviewer decision write intent ${intent.intentId} must block reviewer state changes.`);
    }

    if (intent.category === "teacher-draft-review-decision" && !intent.blocksDirectStudentAssignment) {
      errors.push(`Teacher draft reviewer decision write intent ${intent.intentId} must block direct student assignment.`);
    }

    if (intent.category === "teacher-draft-review-evidence" && !intent.preservesReviewEvidencePacket) {
      errors.push(`Teacher draft review evidence write intent ${intent.intentId} must preserve review evidence packets.`);
    }

    if (intent.category === "teacher-draft-review-evidence" && !intent.blocksEvidenceUpload) {
      errors.push(`Teacher draft review evidence write intent ${intent.intentId} must block evidence uploads.`);
    }

    if (intent.category === "teacher-draft-review-audit" && !intent.preservesReviewAuditTrail) {
      errors.push(`Teacher draft review audit write intent ${intent.intentId} must preserve review audit trails.`);
    }

    if (intent.category === "teacher-draft-review-audit" && !intent.blocksReviewAuditStateChange) {
      errors.push(`Teacher draft review audit write intent ${intent.intentId} must block audit-driven state changes.`);
    }

    if (intent.category === "teacher-draft-verifier-submission" && !intent.preservesVerifierPreflightChecks) {
      errors.push(`Teacher draft verifier submission write intent ${intent.intentId} must preserve verifier preflight checks.`);
    }

    if (intent.category === "teacher-draft-verifier-submission" && !intent.blocksAutomaticVerifierSubmit) {
      errors.push(`Teacher draft verifier submission write intent ${intent.intentId} must block automatic verifier submission.`);
    }

    if (intent.category === "upload-intake" && !intent.preservesUploadSourceLineage) {
      errors.push(`Upload intake write intent ${intent.intentId} must preserve upload source lineage.`);
    }

    if (intent.category === "upload-intake" && !intent.blocksStudentFacingUploadUse) {
      errors.push(`Upload intake write intent ${intent.intentId} must block student-facing upload use.`);
    }

    if (intent.category === "upload-review" && !intent.preservesUploadReviewPackets) {
      errors.push(`Upload review write intent ${intent.intentId} must preserve upload review packets.`);
    }

    if (intent.category === "upload-review" && !intent.preservesUploadTargetMappingPacket) {
      errors.push(`Upload review write intent ${intent.intentId} must preserve upload target mapping packets.`);
    }

    if (intent.category === "upload-review" && !intent.blocksUploadReviewPromotion) {
      errors.push(`Upload review write intent ${intent.intentId} must block upload promotion.`);
    }

    if (intent.category === "upload-review" && !intent.blocksStudentFacingUploadUse) {
      errors.push(`Upload review write intent ${intent.intentId} must block student-facing upload use.`);
    }

    if (intent.category === "upload-promotion" && !intent.preservesUploadPromotionTargets) {
      errors.push(`Upload promotion write intent ${intent.intentId} must preserve upload promotion targets.`);
    }

    if (intent.category === "upload-promotion" && !intent.preservesUploadTargetMappingPacket) {
      errors.push(`Upload promotion write intent ${intent.intentId} must preserve upload target mapping packets.`);
    }

    if (intent.category === "upload-promotion" && !intent.blocksStudentFacingPromotion) {
      errors.push(`Upload promotion write intent ${intent.intentId} must block student-facing promotion.`);
    }

    if (intent.category === "evidence-packet" && !intent.preservesEvidencePacketFlow) {
      errors.push(`Evidence packet write intent ${intent.intentId} must preserve evidence packet flow state.`);
    }

    if (intent.category === "evidence-packet" && !intent.blocksEvidenceUpload) {
      errors.push(`Evidence packet write intent ${intent.intentId} must block live evidence uploads.`);
    }

    if (intent.category === "evidence-packet" && !intent.blocksSignedApprovalCapture) {
      errors.push(`Evidence packet write intent ${intent.intentId} must block signed approval capture.`);
    }

    if (intent.category === "evidence-packet" && !intent.blocksEvidencePacketPromotion) {
      errors.push(`Evidence packet write intent ${intent.intentId} must block evidence-driven promotion.`);
    }

    if (intent.category === "evidence-packet" && !intent.blocksStudentFacingUploadUse) {
      errors.push(`Evidence packet write intent ${intent.intentId} must block student-facing upload use.`);
    }

    if (intent.category === "evidence-attachment" && !intent.preservesEvidenceAttachmentMetadata) {
      errors.push(`Evidence attachment write intent ${intent.intentId} must preserve evidence attachment metadata.`);
    }

    if (intent.category === "evidence-attachment" && !intent.blocksAttachmentUpload) {
      errors.push(`Evidence attachment write intent ${intent.intentId} must block attachment upload.`);
    }

    if (intent.category === "evidence-attachment" && !intent.blocksAttachmentDownload) {
      errors.push(`Evidence attachment write intent ${intent.intentId} must block attachment download.`);
    }

    if (intent.category === "evidence-attachment" && !intent.blocksStorageWrite) {
      errors.push(`Evidence attachment write intent ${intent.intentId} must block storage writes.`);
    }

    if (intent.category === "evidence-attachment" && !intent.blocksStudentFacingAttachment) {
      errors.push(`Evidence attachment write intent ${intent.intentId} must block student-facing attachments.`);
    }

    if (intent.category === "game-asset-manifest" && !intent.preservesGameAssetManifest) {
      errors.push(`Game asset manifest write intent ${intent.intentId} must preserve reviewed game asset metadata.`);
    }

    if (intent.category === "game-asset-manifest" && !intent.blocksStudentFacingGameAssetUse) {
      errors.push(`Game asset manifest write intent ${intent.intentId} must block student-facing asset use.`);
    }

    if (intent.category === "label-anchor-record" && !intent.preservesLabelAnchorRecords) {
      errors.push(`Label anchor write intent ${intent.intentId} must preserve reviewed label anchors.`);
    }

    if (intent.category === "label-anchor-record" && !intent.requiresLabelAudioCoverage) {
      errors.push(`Label anchor write intent ${intent.intentId} must require label audio coverage.`);
    }

    if (intent.category === "label-anchor-record" && !intent.blocksSupportLanguageProgress) {
      errors.push(`Label anchor write intent ${intent.intentId} must block support-language progress triggers.`);
    }

    if (intent.category === "activity-compatibility-snapshot" && !intent.preservesActivityCompatibilitySnapshot) {
      errors.push(`Activity compatibility snapshot write intent ${intent.intentId} must preserve curated compatibility outcomes.`);
    }

    if (intent.category === "activity-compatibility-snapshot" && !intent.blocksUncheckedActivityConversion) {
      errors.push(`Activity compatibility snapshot write intent ${intent.intentId} must block unchecked activity conversion.`);
    }

    if (intent.category === "activity-compatibility-snapshot" && !intent.blocksSupportLanguageProgress) {
      errors.push(`Activity compatibility snapshot write intent ${intent.intentId} must block support-language progress triggers.`);
    }

    if (intent.category === "template-rendering-profile" && !intent.preservesTemplateRenderingProfile) {
      errors.push(`Template rendering profile write intent ${intent.intentId} must preserve template rendering controls.`);
    }

    if (intent.category === "template-rendering-profile" && !intent.blocksUnsafeTemplateRendering) {
      errors.push(`Template rendering profile write intent ${intent.intentId} must block unsafe template rendering.`);
    }

    if (intent.category === "font-accessibility-profile" && !intent.preservesFontAccessibilityProfile) {
      errors.push(`Font accessibility profile write intent ${intent.intentId} must preserve font accessibility controls.`);
    }

    if (intent.category === "font-accessibility-profile" && !intent.blocksUnapprovedFontUse) {
      errors.push(`Font accessibility profile write intent ${intent.intentId} must block unapproved font use.`);
    }

    if (intent.category === "media-playlist-binding" && !intent.preservesMediaPlaylistBinding) {
      errors.push(`Media playlist binding write intent ${intent.intentId} must preserve media playlist bindings.`);
    }

    if (intent.category === "media-playlist-binding" && !intent.blocksMediaOnlyProgress) {
      errors.push(`Media playlist binding write intent ${intent.intentId} must block media-only progress.`);
    }

    if (intent.category === "background-media-policy-binding" && !intent.preservesBackgroundMediaPolicy) {
      errors.push(`Background media policy binding write intent ${intent.intentId} must preserve background media policy.`);
    }

    if (intent.category === "background-media-policy-binding" && !intent.requiresLearningAudioPriority) {
      errors.push(`Background media policy binding write intent ${intent.intentId} must require learning-audio priority.`);
    }

    if (intent.category === "local-media-bundle-entry" && !intent.preservesLocalMediaBundleEntry) {
      errors.push(`Local media bundle entry write intent ${intent.intentId} must preserve local media bundle entries.`);
    }

    if (intent.category === "local-media-bundle-entry" && !intent.blocksLocalFolderActivation) {
      errors.push(`Local media bundle entry write intent ${intent.intentId} must block local folder activation.`);
    }

    if (intent.category === "tenant-library-item" && !intent.preservesLibrarySourceLineage) {
      errors.push(`Tenant library write intent ${intent.intentId} must preserve source lineage.`);
    }

    if (intent.category === "tenant-library-item" && !intent.blocksStudentDataCopy) {
      errors.push(`Tenant library write intent ${intent.intentId} must block student data copies.`);
    }

    if (intent.category === "tenant-library-item" && !intent.blocksPublicCommunityPublishing) {
      errors.push(`Tenant library write intent ${intent.intentId} must block public community publishing.`);
    }

    if (intent.category === "pilot-evidence-packet" && !intent.preservesPilotEvidencePacket) {
      errors.push(`Pilot evidence packet write intent ${intent.intentId} must preserve release evidence packet metadata.`);
    }

    if (intent.category === "pilot-evidence-packet" && !intent.blocksEvidenceUpload) {
      errors.push(`Pilot evidence packet write intent ${intent.intentId} must block evidence uploads until storage policy exists.`);
    }

    if (intent.category === "pilot-evidence-packet" && !intent.blocksSignedApprovalCapture) {
      errors.push(`Pilot evidence packet write intent ${intent.intentId} must block signed approval capture until identity and policy exist.`);
    }

    if (intent.category === "reviewer-identity-signature-gate" && !intent.preservesReviewerIdentitySignatureGate) {
      errors.push(`Reviewer identity signature gate write intent ${intent.intentId} must preserve reviewer identity, approval intent, signature policy, and audit retention gates.`);
    }

    if (intent.category === "reviewer-identity-signature-gate" && !intent.blocksApprovalCapture) {
      errors.push(`Reviewer identity signature gate write intent ${intent.intentId} must block approval capture.`);
    }

    if (intent.category === "reviewer-identity-signature-gate" && !intent.blocksSignatureAttachmentUpload) {
      errors.push(`Reviewer identity signature gate write intent ${intent.intentId} must block signature attachment upload.`);
    }

    if (intent.category === "reviewer-identity-signature-gate" && !intent.blocksApprovalDrivenAssignment) {
      errors.push(`Reviewer identity signature gate write intent ${intent.intentId} must block student assignment from approval.`);
    }

    if (intent.category === "teacher-dry-run-rehearsal" && !intent.preservesTeacherDryRunRehearsal) {
      errors.push(`Teacher dry-run rehearsal write intent ${intent.intentId} must preserve route, game, audio, media, report, and local fallback checks.`);
    }

    if (intent.category === "teacher-dry-run-rehearsal" && !intent.blocksStudentLaunchAction) {
      errors.push(`Teacher dry-run rehearsal write intent ${intent.intentId} must block live student launch actions.`);
    }

    if (intent.category === "teacher-dry-run-rehearsal" && !intent.blocksRealLearnerDataCollection) {
      errors.push(`Teacher dry-run rehearsal write intent ${intent.intentId} must block real learner data collection.`);
    }

    if (intent.category === "teacher-dry-run-rehearsal" && !intent.blocksLiveReportExport) {
      errors.push(`Teacher dry-run rehearsal write intent ${intent.intentId} must block live report export.`);
    }

    if (intent.category === "classroom-launch-gate" && !intent.preservesClassroomLaunchGate) {
      errors.push(`Classroom launch gate write intent ${intent.intentId} must preserve launch gate status, blockers, and source references.`);
    }

    if (intent.category === "classroom-launch-gate" && !intent.blocksLiveClassroomLaunch) {
      errors.push(`Classroom launch gate write intent ${intent.intentId} must block live classroom launch.`);
    }

    if (intent.category === "classroom-launch-gate" && !intent.blocksLaunchWithoutPolicy) {
      errors.push(`Classroom launch gate write intent ${intent.intentId} must block launch without school policy.`);
    }

    if (intent.category === "classroom-launch-gate" && !intent.blocksLaunchWithoutPersistence) {
      errors.push(`Classroom launch gate write intent ${intent.intentId} must block launch without accepted persistence.`);
    }

    if (intent.intentId.includes("package-audio-coverage") && !intent.preservesGameAudioCoverageSnapshot) {
      errors.push(`Package game/audio coverage write intent ${intent.intentId} must preserve reviewed game/audio coverage snapshots.`);
    }

    if (intent.category === "launch-session" && !intent.preservesTeacherSessionSettingsSnapshot) {
      errors.push(`Launch session write intent ${intent.intentId} must preserve teacher session settings snapshots.`);
    }

    if (intent.category === "launch-session" && !intent.preservesTeacherSessionEventAcceptanceGate) {
      errors.push(`Launch session write intent ${intent.intentId} must preserve teacher session event acceptance gates.`);
    }
  }

  return errors;
}

export function getPersistenceAdapterWarnings(plan: PersistenceAdapterPlan): string[] {
  const warnings: string[] = [];

  if (plan.mode === "static-demo") {
    warnings.push(`${plan.label} is useful for demos, but cannot support real teacher reports or QR registry changes.`);
  }

  for (const intent of plan.writeIntents) {
    if (intent.requiredBeforePilot && intent.readiness !== "pilot-ready") {
      warnings.push(`${intent.label} must be resolved before pilot use. Current readiness: ${intent.readiness}.`);
    }

    if (intent.containsStudentData && intent.readiness !== "pilot-ready") {
      warnings.push(`${intent.label} contains student data and needs policy plus persistence before live use.`);
    }

    if (intent.allowsExport && !intent.requiresSchoolPolicy) {
      warnings.push(`${intent.label} allows export and should require school or tenant policy.`);
    }
  }

  return warnings;
}
