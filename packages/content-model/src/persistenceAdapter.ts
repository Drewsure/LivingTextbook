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
  preservesAiGeneratedGameBuildBrief?: boolean;
  preservesAiPrototypeReturnReview?: boolean;
  requiresPrototypeArtifactEvidence?: boolean;
  requiresJsonFixtureConformance?: boolean;
  requiresStandardEventReplay?: boolean;
  requiresAudioCueCoverageReview?: boolean;
  requiresMobileAccessibilityReview?: boolean;
  blocksProductionMerge?: boolean;
  blocksAudioManifestMutation?: boolean;
  blocksStudentFacingPrototypePreview?: boolean;
  requiresParentEngineBinding?: boolean;
  requiresStandardEventContract?: boolean;
  requiresAudioCueManifest?: boolean;
  preservesDeterministicScoringContract?: boolean;
  blocksStandaloneGamePromotion?: boolean;
  blocksPhaserBypass?: boolean;
  blocksGeneratedGameRouteWrite?: boolean;
  blocksScoringProfileOverride?: boolean;
  preservesAiGeneratedPackageManifest?: boolean;
  preservesAiGeneratedPackagePromotionChecklist?: boolean;
  preservesAiGeneratedPackageReleaseCandidate?: boolean;
  requiresLineageMap?: boolean;
  requiresTargetLanguageAudioApproval?: boolean;
  blocksGeneratedPackagePromotion?: boolean;
  requiresPrivateLibraryTarget?: boolean;
  blocksGeneratedPackageLibraryPublish?: boolean;
  blocksReleaseCandidateWrite?: boolean;
  blocksTenantLibraryItemWrite?: boolean;
  blocksStudentFacingRelease?: boolean;
  blocksGeneratedLocalBundleRelease?: boolean;
  blocksSupportLanguageRelease?: boolean;
  blocksGeneratedPackageAssembly?: boolean;
  blocksGeneratedPackageRouteWrite?: boolean;
  blocksGeneratedPackagePlaylistWrite?: boolean;
  blocksGeneratedPackageAssignment?: boolean;
  blocksGeneratedPackageLocalBundleWrite?: boolean;
  blocksStudentReadyMarker?: boolean;
  preservesAiRewardReadinessGate?: boolean;
  preservesDeterministicRewardRules?: boolean;
  blocksRewardPublishing?: boolean;
  blocksCollectionInventoryWrite?: boolean;
  blocksGeneratedSurpriseRewards?: boolean;
  blocksSpinWheelTicketIssuance?: boolean;
  blocksAvatarEvolutionWrite?: boolean;
  requiresAiDraftCorrectionQueueClearance?: boolean;
  preservesAiGeneratedPublishReadinessGate?: boolean;
  requiresVerifierPacketApproval?: boolean;
  requiresManifestCompleteness?: boolean;
  requiresReleaseControlBinding?: boolean;
  requiresTeacherApprovalLedger?: boolean;
  preservesAiGeneratorTenantCoverageGate?: boolean;
  requiresTenantSpecificGeneratorRecords?: boolean;
  blocksGeneratorRequestSubmission?: boolean;
  blocksLiveModelCall?: boolean;
  blocksVerifierSubmission?: boolean;
  preservesTeacherAssignmentRolloutGate?: boolean;
  preservesPrivateAssignmentLink?: boolean;
  blocksPublicSharing?: boolean;
  blocksIframeEmbed?: boolean;
  blocksTeacherAdminControlExposure?: boolean;
  preservesClassRosterPlan?: boolean;
  blocksRealLearnerNameStorage?: boolean;
  blocksFamilyContactStorage?: boolean;
  blocksRawAudioStorage?: boolean;
  blocksTranscriptStorage?: boolean;
  preservesSourceExtractionReviewPacket?: boolean;
  blocksUnreviewedExtractionPromotion?: boolean;
  blocksRawPdfStudentPayload?: boolean;
  blocksUnreviewedOcrAssignment?: boolean;
  preservesUploadFilePolicyProfile?: boolean;
  requiresScanAndFilePolicyPacket?: boolean;
  blocksUploadWithoutFilePolicy?: boolean;
  blocksUnsafeMimeType?: boolean;
  blocksOversizeUpload?: boolean;
  blocksUncheckedFileScan?: boolean;
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
  preservesSchoolLaunchPolicyGate?: boolean;
  blocksPolicyAcceptanceWorkflow?: boolean;
  blocksLaunchWithoutSchoolPolicy?: boolean;
  preservesSchoolPolicyHandoffPacket?: boolean;
  blocksPolicyHandoffAcceptance?: boolean;
  blocksHandoffEvidenceExport?: boolean;
  preservesSchoolPolicyAcceptancePreflight?: boolean;
  blocksPreflightPolicyAcceptance?: boolean;
  blocksPreflightEvidenceExport?: boolean;
  blocksPreflightStorageActivation?: boolean;
  blocksPreflightLaunchReadyStatus?: boolean;
  preservesSchoolPolicyTextPack?: boolean;
  blocksPolicyTextAcceptance?: boolean;
  blocksPolicyTextSignatureCapture?: boolean;
  blocksPolicyTextEvidenceExport?: boolean;
  blocksPolicyTextStorageActivation?: boolean;
  blocksPolicyTextLaunchReadyStatus?: boolean;
  preservesSchoolPolicyAcceptanceRecordPreview?: boolean;
  blocksAcceptedTermsStorage?: boolean;
  blocksAcceptanceSignatureCapture?: boolean;
  blocksAcceptanceEvidenceExport?: boolean;
  blocksAcceptanceStorageActivation?: boolean;
  blocksAcceptanceLaunchReadyStatus?: boolean;
  preservesSchoolPolicyRevocationRollbackPreview?: boolean;
  preservesSchoolPolicyRollbackImpactMatrix?: boolean;
  preservesSchoolRollbackSafeFallbackPlan?: boolean;
  preservesSchoolRollbackSafeFallbackPreflight?: boolean;
  preservesSchoolRollbackSafeFallbackActivationPreview?: boolean;
  preservesSchoolRollbackSafeFallbackRestorationPreview?: boolean;
  blocksRevocationAction?: boolean;
  blocksRollbackAction?: boolean;
  blocksReleaseStateMutation?: boolean;
  blocksProductionQrRedirectMutation?: boolean;
  blocksLearnerDataDeletionWorkflow?: boolean;
  blocksMediaReplacement?: boolean;
  blocksLocalBundleDeactivation?: boolean;
  blocksLocalBundleRestoration?: boolean;
  blocksAiTutorEntitlementChange?: boolean;
  blocksLiveNotification?: boolean;
  blocksStudentReassignment?: boolean;
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

    if (intent.category === "ai-generated-game-build-brief" && !intent.preservesAiGeneratedGameBuildBrief) {
      errors.push(`AI generated game build brief write intent ${intent.intentId} must preserve build brief sections.`);
    }

    if (intent.category === "ai-generated-game-build-brief" && !intent.requiresParentEngineBinding) {
      errors.push(`AI generated game build brief write intent ${intent.intentId} must require parent-engine binding.`);
    }

    if (intent.category === "ai-generated-game-build-brief" && !intent.requiresStandardEventContract) {
      errors.push(`AI generated game build brief write intent ${intent.intentId} must require the standard event contract.`);
    }

    if (intent.category === "ai-generated-game-build-brief" && !intent.requiresAudioCueManifest) {
      errors.push(`AI generated game build brief write intent ${intent.intentId} must require an audio cue manifest.`);
    }

    if (intent.category === "ai-generated-game-build-brief" && !intent.preservesDeterministicScoringContract) {
      errors.push(`AI generated game build brief write intent ${intent.intentId} must preserve deterministic scoring rules.`);
    }

    if (intent.category === "ai-generated-game-build-brief" && !intent.blocksStandaloneGamePromotion) {
      errors.push(`AI generated game build brief write intent ${intent.intentId} must block standalone game promotion.`);
    }

    if (intent.category === "ai-generated-game-build-brief" && !intent.blocksPhaserBypass) {
      errors.push(`AI generated game build brief write intent ${intent.intentId} must block Phaser bypass.`);
    }

    if (intent.category === "ai-generated-game-build-brief" && !intent.blocksGeneratedGameRouteWrite) {
      errors.push(`AI generated game build brief write intent ${intent.intentId} must block generated game route writes.`);
    }

    if (intent.category === "ai-generated-game-build-brief" && !intent.blocksScoringProfileOverride) {
      errors.push(`AI generated game build brief write intent ${intent.intentId} must block scoring profile overrides.`);
    }

    if (intent.category === "ai-generated-game-build-brief" && !intent.blocksDirectStudentAssignment) {
      errors.push(`AI generated game build brief write intent ${intent.intentId} must block student assignment.`);
    }

    if (intent.category === "ai-prototype-return-review" && !intent.preservesAiPrototypeReturnReview) {
      errors.push(`AI prototype return review write intent ${intent.intentId} must preserve return review sections.`);
    }

    if (intent.category === "ai-prototype-return-review" && !intent.requiresPrototypeArtifactEvidence) {
      errors.push(`AI prototype return review write intent ${intent.intentId} must require prototype artifact evidence.`);
    }

    if (intent.category === "ai-prototype-return-review" && !intent.requiresParentEngineBinding) {
      errors.push(`AI prototype return review write intent ${intent.intentId} must require parent-engine wrapper review.`);
    }

    if (intent.category === "ai-prototype-return-review" && !intent.requiresJsonFixtureConformance) {
      errors.push(`AI prototype return review write intent ${intent.intentId} must require JSON fixture conformance.`);
    }

    if (intent.category === "ai-prototype-return-review" && !intent.requiresStandardEventReplay) {
      errors.push(`AI prototype return review write intent ${intent.intentId} must require standard event replay.`);
    }

    if (intent.category === "ai-prototype-return-review" && !intent.requiresAudioCueCoverageReview) {
      errors.push(`AI prototype return review write intent ${intent.intentId} must require audio cue coverage review.`);
    }

    if (intent.category === "ai-prototype-return-review" && !intent.preservesDeterministicScoringContract) {
      errors.push(`AI prototype return review write intent ${intent.intentId} must preserve deterministic scoring review.`);
    }

    if (intent.category === "ai-prototype-return-review" && !intent.requiresMobileAccessibilityReview) {
      errors.push(`AI prototype return review write intent ${intent.intentId} must require mobile accessibility review.`);
    }

    if (intent.category === "ai-prototype-return-review" && !intent.blocksProductionMerge) {
      errors.push(`AI prototype return review write intent ${intent.intentId} must block production merge.`);
    }

    if (intent.category === "ai-prototype-return-review" && !intent.blocksGeneratedGameRouteWrite) {
      errors.push(`AI prototype return review write intent ${intent.intentId} must block route writes.`);
    }

    if (intent.category === "ai-prototype-return-review" && !intent.blocksScoringProfileOverride) {
      errors.push(`AI prototype return review write intent ${intent.intentId} must block scoring mutations.`);
    }

    if (intent.category === "ai-prototype-return-review" && !intent.blocksAudioManifestMutation) {
      errors.push(`AI prototype return review write intent ${intent.intentId} must block audio manifest mutations.`);
    }

    if (intent.category === "ai-prototype-return-review" && !intent.blocksDirectStudentAssignment) {
      errors.push(`AI prototype return review write intent ${intent.intentId} must block assignment creation.`);
    }

    if (intent.category === "ai-prototype-return-review" && !intent.blocksStudentFacingPrototypePreview) {
      errors.push(`AI prototype return review write intent ${intent.intentId} must block student-facing prototype previews.`);
    }

    if (intent.category === "ai-generated-package-manifest" && !intent.preservesAiGeneratedPackageManifest) {
      errors.push(`AI generated package manifest write intent ${intent.intentId} must preserve generated package manifest links.`);
    }

    if (intent.category === "ai-generated-package-manifest" && !intent.blocksGeneratedPackageAssembly) {
      errors.push(`AI generated package manifest write intent ${intent.intentId} must block package assembly.`);
    }

    if (intent.category === "ai-generated-package-manifest" && !intent.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generated package manifest write intent ${intent.intentId} must block route registry writes.`);
    }

    if (intent.category === "ai-generated-package-manifest" && !intent.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generated package manifest write intent ${intent.intentId} must block media playlist writes.`);
    }

    if (intent.category === "ai-generated-package-manifest" && !intent.blocksGeneratedPackageAssignment) {
      errors.push(`AI generated package manifest write intent ${intent.intentId} must block generated package assignments.`);
    }

    if (intent.category === "ai-generated-package-manifest" && !intent.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generated package manifest write intent ${intent.intentId} must block local bundle writes.`);
    }

    if (intent.category === "ai-generated-package-manifest" && !intent.blocksStudentReadyMarker) {
      errors.push(`AI generated package manifest write intent ${intent.intentId} must block student-ready markers.`);
    }

    if (
      intent.category === "ai-generated-package-promotion-checklist" &&
      !intent.preservesAiGeneratedPackagePromotionChecklist
    ) {
      errors.push(`AI generated package promotion checklist write intent ${intent.intentId} must preserve promotion checklist steps.`);
    }

    if (intent.category === "ai-generated-package-promotion-checklist" && !intent.requiresLineageMap) {
      errors.push(`AI generated package promotion checklist write intent ${intent.intentId} must require a lineage map.`);
    }

    if (
      intent.category === "ai-generated-package-promotion-checklist" &&
      !intent.requiresTargetLanguageAudioApproval
    ) {
      errors.push(`AI generated package promotion checklist write intent ${intent.intentId} must require target-language audio approval.`);
    }

    if (intent.category === "ai-generated-package-promotion-checklist" && !intent.requiresVerifierPacketApproval) {
      errors.push(`AI generated package promotion checklist write intent ${intent.intentId} must require verifier packet approval.`);
    }

    if (intent.category === "ai-generated-package-promotion-checklist" && !intent.requiresManifestCompleteness) {
      errors.push(`AI generated package promotion checklist write intent ${intent.intentId} must require manifest completeness.`);
    }

    if (intent.category === "ai-generated-package-promotion-checklist" && !intent.preservesAiRewardReadinessGate) {
      errors.push(`AI generated package promotion checklist write intent ${intent.intentId} must preserve reward readiness state.`);
    }

    if (intent.category === "ai-generated-package-promotion-checklist" && !intent.requiresReleaseControlBinding) {
      errors.push(`AI generated package promotion checklist write intent ${intent.intentId} must require release-control binding.`);
    }

    if (intent.category === "ai-generated-package-promotion-checklist" && !intent.requiresTeacherApprovalLedger) {
      errors.push(`AI generated package promotion checklist write intent ${intent.intentId} must require teacher approval ledger capture.`);
    }

    if (intent.category === "ai-generated-package-promotion-checklist" && !intent.blocksGeneratedPackagePromotion) {
      errors.push(`AI generated package promotion checklist write intent ${intent.intentId} must block generated package promotion.`);
    }

    if (intent.category === "ai-generated-package-promotion-checklist" && !intent.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generated package promotion checklist write intent ${intent.intentId} must block route registry writes.`);
    }

    if (intent.category === "ai-generated-package-promotion-checklist" && !intent.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generated package promotion checklist write intent ${intent.intentId} must block media playlist writes.`);
    }

    if (intent.category === "ai-generated-package-promotion-checklist" && !intent.blocksGeneratedPackageAssignment) {
      errors.push(`AI generated package promotion checklist write intent ${intent.intentId} must block generated package assignments.`);
    }

    if (intent.category === "ai-generated-package-promotion-checklist" && !intent.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generated package promotion checklist write intent ${intent.intentId} must block local bundle writes.`);
    }

    if (intent.category === "ai-generated-package-promotion-checklist" && !intent.blocksStudentReadyMarker) {
      errors.push(`AI generated package promotion checklist write intent ${intent.intentId} must block student-ready markers.`);
    }

    if (
      intent.category === "ai-generated-package-release-candidate" &&
      !intent.preservesAiGeneratedPackageReleaseCandidate
    ) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must preserve release candidate signals.`);
    }

    if (
      intent.category === "ai-generated-package-release-candidate" &&
      !intent.preservesAiGeneratedPackageManifest
    ) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must preserve generated package manifest links.`);
    }

    if (
      intent.category === "ai-generated-package-release-candidate" &&
      !intent.preservesAiGeneratedPackagePromotionChecklist
    ) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must preserve promotion checklist links.`);
    }

    if (
      intent.category === "ai-generated-package-release-candidate" &&
      !intent.preservesAiGeneratedPublishReadinessGate
    ) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must preserve publish readiness links.`);
    }

    if (intent.category === "ai-generated-package-release-candidate" && !intent.requiresPrivateLibraryTarget) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must require a private library target.`);
    }

    if (intent.category === "ai-generated-package-release-candidate" && !intent.requiresReleaseControlBinding) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must require release-control binding.`);
    }

    if (intent.category === "ai-generated-package-release-candidate" && !intent.requiresTeacherApprovalLedger) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must require teacher approval ledger capture.`);
    }

    if (intent.category === "ai-generated-package-release-candidate" && !intent.blocksGeneratedPackageLibraryPublish) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must block generated package library publish.`);
    }

    if (intent.category === "ai-generated-package-release-candidate" && !intent.blocksReleaseCandidateWrite) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must block release candidate writes.`);
    }

    if (intent.category === "ai-generated-package-release-candidate" && !intent.blocksTenantLibraryItemWrite) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must block tenant library item writes.`);
    }

    if (intent.category === "ai-generated-package-release-candidate" && !intent.blocksStudentFacingRelease) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must block student-facing release.`);
    }

    if (intent.category === "ai-generated-package-release-candidate" && !intent.blocksGeneratedPackageAssignment) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must block generated package assignments.`);
    }

    if (intent.category === "ai-generated-package-release-candidate" && !intent.blocksGeneratedLocalBundleRelease) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must block generated local bundle release.`);
    }

    if (intent.category === "ai-generated-package-release-candidate" && !intent.blocksStudentReadyMarker) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must block student-ready markers.`);
    }

    if (intent.category === "ai-generated-package-release-candidate" && !intent.blocksSupportLanguageRelease) {
      errors.push(`AI generated package release candidate write intent ${intent.intentId} must block support-language release.`);
    }

    if (intent.category === "ai-reward-readiness-gate" && !intent.preservesAiRewardReadinessGate) {
      errors.push(`AI reward readiness gate write intent ${intent.intentId} must preserve generated reward readiness checks.`);
    }

    if (intent.category === "ai-reward-readiness-gate" && !intent.preservesDeterministicRewardRules) {
      errors.push(`AI reward readiness gate write intent ${intent.intentId} must preserve deterministic reward rules.`);
    }

    if (intent.category === "ai-reward-readiness-gate" && !intent.blocksRewardPublishing) {
      errors.push(`AI reward readiness gate write intent ${intent.intentId} must block reward publishing.`);
    }

    if (intent.category === "ai-reward-readiness-gate" && !intent.blocksCollectionInventoryWrite) {
      errors.push(`AI reward readiness gate write intent ${intent.intentId} must block collection inventory writes.`);
    }

    if (intent.category === "ai-reward-readiness-gate" && !intent.blocksGeneratedSurpriseRewards) {
      errors.push(`AI reward readiness gate write intent ${intent.intentId} must block generated surprise rewards.`);
    }

    if (intent.category === "ai-reward-readiness-gate" && !intent.blocksSpinWheelTicketIssuance) {
      errors.push(`AI reward readiness gate write intent ${intent.intentId} must block Spin Wheel ticket issuance.`);
    }

    if (intent.category === "ai-reward-readiness-gate" && !intent.blocksAvatarEvolutionWrite) {
      errors.push(`AI reward readiness gate write intent ${intent.intentId} must block avatar evolution writes.`);
    }

    if (intent.category === "ai-reward-readiness-gate" && !intent.requiresAiDraftCorrectionQueueClearance) {
      errors.push(`AI reward readiness gate write intent ${intent.intentId} must require correction queue clearance.`);
    }

    if (
      intent.category === "ai-generated-publish-readiness-gate" &&
      !intent.preservesAiGeneratedPublishReadinessGate
    ) {
      errors.push(`AI generated publish readiness gate write intent ${intent.intentId} must preserve publish readiness checks.`);
    }

    if (intent.category === "ai-generated-publish-readiness-gate" && !intent.requiresAiDraftCorrectionQueueClearance) {
      errors.push(`AI generated publish readiness gate write intent ${intent.intentId} must require correction queue clearance.`);
    }

    if (intent.category === "ai-generated-publish-readiness-gate" && !intent.requiresVerifierPacketApproval) {
      errors.push(`AI generated publish readiness gate write intent ${intent.intentId} must require verifier packet approval.`);
    }

    if (intent.category === "ai-generated-publish-readiness-gate" && !intent.requiresManifestCompleteness) {
      errors.push(`AI generated publish readiness gate write intent ${intent.intentId} must require manifest completeness.`);
    }

    if (intent.category === "ai-generated-publish-readiness-gate" && !intent.preservesAiRewardReadinessGate) {
      errors.push(`AI generated publish readiness gate write intent ${intent.intentId} must preserve reward readiness state.`);
    }

    if (intent.category === "ai-generated-publish-readiness-gate" && !intent.requiresReleaseControlBinding) {
      errors.push(`AI generated publish readiness gate write intent ${intent.intentId} must require release-control binding.`);
    }

    if (intent.category === "ai-generated-publish-readiness-gate" && !intent.requiresTeacherApprovalLedger) {
      errors.push(`AI generated publish readiness gate write intent ${intent.intentId} must require teacher approval ledger capture.`);
    }

    if (intent.category === "ai-generated-publish-readiness-gate" && !intent.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generated publish readiness gate write intent ${intent.intentId} must block route registry writes.`);
    }

    if (intent.category === "ai-generated-publish-readiness-gate" && !intent.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generated publish readiness gate write intent ${intent.intentId} must block media playlist writes.`);
    }

    if (intent.category === "ai-generated-publish-readiness-gate" && !intent.blocksGeneratedPackageAssignment) {
      errors.push(`AI generated publish readiness gate write intent ${intent.intentId} must block assignment writes.`);
    }

    if (intent.category === "ai-generated-publish-readiness-gate" && !intent.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generated publish readiness gate write intent ${intent.intentId} must block local bundle writes.`);
    }

    if (intent.category === "ai-generated-publish-readiness-gate" && !intent.blocksStudentReadyMarker) {
      errors.push(`AI generated publish readiness gate write intent ${intent.intentId} must block student-ready markers.`);
    }

    if (intent.category === "ai-generator-tenant-coverage-gate" && !intent.preservesAiGeneratorTenantCoverageGate) {
      errors.push(`AI generator tenant coverage gate write intent ${intent.intentId} must preserve tenant coverage checks.`);
    }

    if (intent.category === "ai-generator-tenant-coverage-gate" && !intent.requiresTenantSpecificGeneratorRecords) {
      errors.push(`AI generator tenant coverage gate write intent ${intent.intentId} must require tenant-specific generator records.`);
    }

    if (intent.category === "ai-generator-tenant-coverage-gate" && !intent.blocksGeneratorRequestSubmission) {
      errors.push(`AI generator tenant coverage gate write intent ${intent.intentId} must block generator request submission.`);
    }

    if (intent.category === "ai-generator-tenant-coverage-gate" && !intent.blocksLiveModelCall) {
      errors.push(`AI generator tenant coverage gate write intent ${intent.intentId} must block live model calls.`);
    }

    if (intent.category === "ai-generator-tenant-coverage-gate" && !intent.blocksVerifierSubmission) {
      errors.push(`AI generator tenant coverage gate write intent ${intent.intentId} must block verifier submission.`);
    }

    if (intent.category === "ai-generator-tenant-coverage-gate" && !intent.blocksGeneratedPackageAssembly) {
      errors.push(`AI generator tenant coverage gate write intent ${intent.intentId} must block generated package assembly.`);
    }

    if (intent.category === "ai-generator-tenant-coverage-gate" && !intent.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generator tenant coverage gate write intent ${intent.intentId} must block route registry writes.`);
    }

    if (intent.category === "ai-generator-tenant-coverage-gate" && !intent.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generator tenant coverage gate write intent ${intent.intentId} must block media playlist writes.`);
    }

    if (intent.category === "ai-generator-tenant-coverage-gate" && !intent.blocksGeneratedPackageAssignment) {
      errors.push(`AI generator tenant coverage gate write intent ${intent.intentId} must block assignment writes.`);
    }

    if (intent.category === "ai-generator-tenant-coverage-gate" && !intent.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generator tenant coverage gate write intent ${intent.intentId} must block local bundle writes.`);
    }

    if (intent.category === "ai-generator-tenant-coverage-gate" && !intent.blocksStudentReadyMarker) {
      errors.push(`AI generator tenant coverage gate write intent ${intent.intentId} must block student-ready markers.`);
    }

    if (intent.category === "teacher-assignment-rollout-gate" && !intent.preservesTeacherAssignmentRolloutGate) {
      errors.push(`Teacher assignment rollout gate write intent ${intent.intentId} must preserve rollout status, gate evidence, blockers, and scheduling rules.`);
    }

    if (intent.category === "teacher-assignment-rollout-gate" && !intent.blocksStudentLaunchAction) {
      errors.push(`Teacher assignment rollout gate write intent ${intent.intentId} must block student launch actions.`);
    }

    if (intent.category === "teacher-assignment-rollout-gate" && !intent.blocksLiveClassroomLaunch) {
      errors.push(`Teacher assignment rollout gate write intent ${intent.intentId} must block live classroom launch.`);
    }

    if (intent.category === "teacher-assignment-rollout-gate" && !intent.blocksRealLearnerDataCollection) {
      errors.push(`Teacher assignment rollout gate write intent ${intent.intentId} must block real learner data collection.`);
    }

    if (intent.category === "teacher-assignment-rollout-gate" && !intent.blocksLiveReportExport) {
      errors.push(`Teacher assignment rollout gate write intent ${intent.intentId} must block live report export.`);
    }

    if (intent.category === "private-assignment-link" && !intent.preservesPrivateAssignmentLink) {
      errors.push(`Private assignment link write intent ${intent.intentId} must preserve tenant scope, assignment binding, student target, access rules, and safety boundaries.`);
    }

    if (intent.category === "private-assignment-link" && !intent.blocksPublicSharing) {
      errors.push(`Private assignment link write intent ${intent.intentId} must block public sharing.`);
    }

    if (intent.category === "private-assignment-link" && !intent.blocksIframeEmbed) {
      errors.push(`Private assignment link write intent ${intent.intentId} must block iframe embed use.`);
    }

    if (intent.category === "private-assignment-link" && !intent.blocksTeacherAdminControlExposure) {
      errors.push(`Private assignment link write intent ${intent.intentId} must block teacher/admin control exposure.`);
    }

    if (intent.category === "private-assignment-link" && !intent.blocksRealLearnerDataCollection) {
      errors.push(`Private assignment link write intent ${intent.intentId} must block real learner data collection.`);
    }

    if (intent.category === "private-assignment-link" && !intent.blocksLiveReportExport) {
      errors.push(`Private assignment link write intent ${intent.intentId} must block live report export.`);
    }

    if (intent.category === "class-roster-plan" && !intent.preservesClassRosterPlan) {
      errors.push(`Class roster plan write intent ${intent.intentId} must preserve roster ids, learner code slots, data boundaries, readiness, and pilot blockers.`);
    }

    if (intent.category === "class-roster-plan" && !intent.blocksRealLearnerNameStorage) {
      errors.push(`Class roster plan write intent ${intent.intentId} must block real learner name storage.`);
    }

    if (intent.category === "class-roster-plan" && !intent.blocksFamilyContactStorage) {
      errors.push(`Class roster plan write intent ${intent.intentId} must block family contact storage.`);
    }

    if (intent.category === "class-roster-plan" && !intent.blocksRawAudioStorage) {
      errors.push(`Class roster plan write intent ${intent.intentId} must block raw audio storage.`);
    }

    if (intent.category === "class-roster-plan" && !intent.blocksTranscriptStorage) {
      errors.push(`Class roster plan write intent ${intent.intentId} must block transcript storage.`);
    }

    if (intent.category === "class-roster-plan" && !intent.blocksLiveReportExport) {
      errors.push(`Class roster plan write intent ${intent.intentId} must block live report export.`);
    }

    if (intent.category === "source-extraction-review-packet" && !intent.preservesSourceExtractionReviewPacket) {
      errors.push(`Source extraction write intent ${intent.intentId} must preserve extraction source, OCR confidence, segmentation review, candidate payloads, and review blockers.`);
    }

    if (intent.category === "source-extraction-review-packet" && !intent.blocksUnreviewedExtractionPromotion) {
      errors.push(`Source extraction write intent ${intent.intentId} must block unreviewed extraction promotion.`);
    }

    if (intent.category === "source-extraction-review-packet" && !intent.blocksRawPdfStudentPayload) {
      errors.push(`Source extraction write intent ${intent.intentId} must block raw PDF student payloads.`);
    }

    if (intent.category === "source-extraction-review-packet" && !intent.blocksUnreviewedOcrAssignment) {
      errors.push(`Source extraction write intent ${intent.intentId} must block unreviewed OCR assignments.`);
    }

    if (intent.category === "source-extraction-review-packet" && !intent.blocksDirectStudentAssignment) {
      errors.push(`Source extraction write intent ${intent.intentId} must block direct student assignment.`);
    }

    if (intent.category === "upload-file-policy-profile" && !intent.preservesUploadFilePolicyProfile) {
      errors.push(`Upload file policy write intent ${intent.intentId} must preserve accepted file kinds, MIME rules, size limits, scan requirements, rights requirements, and blocked shortcuts.`);
    }

    if (intent.category === "upload-file-policy-profile" && !intent.requiresScanAndFilePolicyPacket) {
      errors.push(`Upload file policy write intent ${intent.intentId} must require a scan and file policy packet.`);
    }

    if (intent.category === "upload-file-policy-profile" && !intent.blocksUploadWithoutFilePolicy) {
      errors.push(`Upload file policy write intent ${intent.intentId} must block uploads without accepted file policy.`);
    }

    if (intent.category === "upload-file-policy-profile" && !intent.blocksUnsafeMimeType) {
      errors.push(`Upload file policy write intent ${intent.intentId} must block unsafe MIME types.`);
    }

    if (intent.category === "upload-file-policy-profile" && !intent.blocksOversizeUpload) {
      errors.push(`Upload file policy write intent ${intent.intentId} must block oversize uploads.`);
    }

    if (intent.category === "upload-file-policy-profile" && !intent.blocksUncheckedFileScan) {
      errors.push(`Upload file policy write intent ${intent.intentId} must block unchecked file scans.`);
    }

    if (intent.category === "upload-file-policy-profile" && !intent.blocksStudentFacingUploadUse) {
      errors.push(`Upload file policy write intent ${intent.intentId} must block student-facing uploaded file use.`);
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

    if (intent.category === "school-launch-policy-gate" && !intent.preservesSchoolLaunchPolicyGate) {
      errors.push(`School launch policy gate write intent ${intent.intentId} must preserve school policy launch gates.`);
    }

    if (intent.category === "school-launch-policy-gate" && !intent.blocksPolicyAcceptanceWorkflow) {
      errors.push(`School launch policy gate write intent ${intent.intentId} must block policy acceptance workflows.`);
    }

    if (intent.category === "school-launch-policy-gate" && !intent.blocksLaunchWithoutSchoolPolicy) {
      errors.push(`School launch policy gate write intent ${intent.intentId} must block launch without school policy.`);
    }

    if (intent.category === "school-launch-policy-gate" && !intent.blocksRealLearnerDataCollection) {
      errors.push(`School launch policy gate write intent ${intent.intentId} must block real learner data collection.`);
    }

    if (intent.category === "school-launch-policy-gate" && !intent.blocksLiveReportExport) {
      errors.push(`School launch policy gate write intent ${intent.intentId} must block live report export.`);
    }

    if (intent.category === "school-policy-handoff-packet" && !intent.preservesSchoolPolicyHandoffPacket) {
      errors.push(`School policy handoff packet write intent ${intent.intentId} must preserve packet sections, evidence needs, deferred decisions, and blocked actions.`);
    }

    if (intent.category === "school-policy-handoff-packet" && !intent.blocksPolicyHandoffAcceptance) {
      errors.push(`School policy handoff packet write intent ${intent.intentId} must block policy acceptance from handoff packets.`);
    }

    if (intent.category === "school-policy-handoff-packet" && !intent.blocksHandoffEvidenceExport) {
      errors.push(`School policy handoff packet write intent ${intent.intentId} must block evidence export from handoff packets.`);
    }

    if (intent.category === "school-policy-handoff-packet" && !intent.blocksLiveClassroomLaunch) {
      errors.push(`School policy handoff packet write intent ${intent.intentId} must block live classroom launch.`);
    }

    if (intent.category === "school-policy-handoff-packet" && !intent.blocksLaunchWithoutSchoolPolicy) {
      errors.push(`School policy handoff packet write intent ${intent.intentId} must block launch without school policy.`);
    }

    if (intent.category === "school-policy-acceptance-preflight" && !intent.preservesSchoolPolicyAcceptancePreflight) {
      errors.push(`School policy acceptance preflight write intent ${intent.intentId} must preserve missing acceptance requirements, blocked actions, minimum acceptance fields, and operating rules.`);
    }

    if (intent.category === "school-policy-acceptance-preflight" && !intent.blocksPreflightPolicyAcceptance) {
      errors.push(`School policy acceptance preflight write intent ${intent.intentId} must block policy acceptance from preflight records.`);
    }

    if (intent.category === "school-policy-acceptance-preflight" && !intent.blocksPreflightEvidenceExport) {
      errors.push(`School policy acceptance preflight write intent ${intent.intentId} must block evidence export from preflight records.`);
    }

    if (intent.category === "school-policy-acceptance-preflight" && !intent.blocksPreflightStorageActivation) {
      errors.push(`School policy acceptance preflight write intent ${intent.intentId} must block storage activation from preflight records.`);
    }

    if (intent.category === "school-policy-acceptance-preflight" && !intent.blocksPreflightLaunchReadyStatus) {
      errors.push(`School policy acceptance preflight write intent ${intent.intentId} must block launch-ready status from preflight records.`);
    }

    if (intent.category === "school-policy-acceptance-preflight" && !intent.blocksLiveClassroomLaunch) {
      errors.push(`School policy acceptance preflight write intent ${intent.intentId} must block live classroom launch.`);
    }

    if (intent.category === "school-policy-text-pack" && !intent.preservesSchoolPolicyTextPack) {
      errors.push(`School policy text pack write intent ${intent.intentId} must preserve policy clauses, minimum version fields, blocked actions, and review rules.`);
    }

    if (intent.category === "school-policy-text-pack" && !intent.blocksPolicyTextAcceptance) {
      errors.push(`School policy text pack write intent ${intent.intentId} must block policy acceptance from text packs.`);
    }

    if (intent.category === "school-policy-text-pack" && !intent.blocksPolicyTextSignatureCapture) {
      errors.push(`School policy text pack write intent ${intent.intentId} must block signature capture from text packs.`);
    }

    if (intent.category === "school-policy-text-pack" && !intent.blocksPolicyTextEvidenceExport) {
      errors.push(`School policy text pack write intent ${intent.intentId} must block evidence export from text packs.`);
    }

    if (intent.category === "school-policy-text-pack" && !intent.blocksPolicyTextStorageActivation) {
      errors.push(`School policy text pack write intent ${intent.intentId} must block storage activation from text packs.`);
    }

    if (intent.category === "school-policy-text-pack" && !intent.blocksPolicyTextLaunchReadyStatus) {
      errors.push(`School policy text pack write intent ${intent.intentId} must block launch-ready status from text packs.`);
    }

    if (intent.category === "school-policy-text-pack" && !intent.blocksLiveClassroomLaunch) {
      errors.push(`School policy text pack write intent ${intent.intentId} must block live classroom launch.`);
    }

    if (
      intent.category === "school-policy-acceptance-record-preview" &&
      !intent.preservesSchoolPolicyAcceptanceRecordPreview
    ) {
      errors.push(`School policy acceptance record preview write intent ${intent.intentId} must preserve minimum accepted-record fields, non-accepted markers, blocked actions, and review rules.`);
    }

    if (intent.category === "school-policy-acceptance-record-preview" && !intent.blocksAcceptedTermsStorage) {
      errors.push(`School policy acceptance record preview write intent ${intent.intentId} must block accepted terms storage.`);
    }

    if (intent.category === "school-policy-acceptance-record-preview" && !intent.blocksAcceptanceSignatureCapture) {
      errors.push(`School policy acceptance record preview write intent ${intent.intentId} must block acceptance signature capture.`);
    }

    if (intent.category === "school-policy-acceptance-record-preview" && !intent.blocksAcceptanceEvidenceExport) {
      errors.push(`School policy acceptance record preview write intent ${intent.intentId} must block acceptance evidence export.`);
    }

    if (intent.category === "school-policy-acceptance-record-preview" && !intent.blocksAcceptanceStorageActivation) {
      errors.push(`School policy acceptance record preview write intent ${intent.intentId} must block acceptance storage activation.`);
    }

    if (intent.category === "school-policy-acceptance-record-preview" && !intent.blocksAcceptanceLaunchReadyStatus) {
      errors.push(`School policy acceptance record preview write intent ${intent.intentId} must block acceptance launch-ready status.`);
    }

    if (intent.category === "school-policy-acceptance-record-preview" && !intent.blocksLiveClassroomLaunch) {
      errors.push(`School policy acceptance record preview write intent ${intent.intentId} must block live classroom launch.`);
    }

    if (
      intent.category === "school-policy-revocation-rollback-preview" &&
      !intent.preservesSchoolPolicyRevocationRollbackPreview
    ) {
      errors.push(`School policy revocation rollback preview write intent ${intent.intentId} must preserve revocation authority, rollback scope, QR effects, learner-data/report effects, media/local effects, premium feature effects, and blocked actions.`);
    }

    if (intent.category === "school-policy-revocation-rollback-preview" && !intent.blocksRevocationAction) {
      errors.push(`School policy revocation rollback preview write intent ${intent.intentId} must block revocation actions.`);
    }

    if (intent.category === "school-policy-revocation-rollback-preview" && !intent.blocksRollbackAction) {
      errors.push(`School policy revocation rollback preview write intent ${intent.intentId} must block rollback actions.`);
    }

    if (intent.category === "school-policy-revocation-rollback-preview" && !intent.blocksProductionQrRedirectMutation) {
      errors.push(`School policy revocation rollback preview write intent ${intent.intentId} must block production QR redirect mutation.`);
    }

    if (intent.category === "school-policy-revocation-rollback-preview" && !intent.blocksLearnerDataDeletionWorkflow) {
      errors.push(`School policy revocation rollback preview write intent ${intent.intentId} must block learner-data deletion workflows.`);
    }

    if (intent.category === "school-policy-revocation-rollback-preview" && !intent.blocksLiveReportExport) {
      errors.push(`School policy revocation rollback preview write intent ${intent.intentId} must block report export.`);
    }

    if (intent.category === "school-policy-revocation-rollback-preview" && !intent.blocksMediaReplacement) {
      errors.push(`School policy revocation rollback preview write intent ${intent.intentId} must block media replacement.`);
    }

    if (intent.category === "school-policy-revocation-rollback-preview" && !intent.blocksLocalBundleDeactivation) {
      errors.push(`School policy revocation rollback preview write intent ${intent.intentId} must block local bundle deactivation.`);
    }

    if (intent.category === "school-policy-revocation-rollback-preview" && !intent.blocksAiTutorEntitlementChange) {
      errors.push(`School policy revocation rollback preview write intent ${intent.intentId} must block AI Tutor entitlement changes.`);
    }

    if (intent.category === "school-policy-revocation-rollback-preview" && !intent.blocksLiveClassroomLaunch) {
      errors.push(`School policy revocation rollback preview write intent ${intent.intentId} must block live classroom launch.`);
    }

    if (
      intent.category === "school-policy-rollback-impact-matrix" &&
      !intent.preservesSchoolPolicyRollbackImpactMatrix
    ) {
      errors.push(`School policy rollback impact matrix write intent ${intent.intentId} must preserve affected records, required evidence, blocked actions, and matrix rules.`);
    }

    if (intent.category === "school-policy-rollback-impact-matrix" && !intent.blocksReleaseStateMutation) {
      errors.push(`School policy rollback impact matrix write intent ${intent.intentId} must block release-state mutation.`);
    }

    if (intent.category === "school-policy-rollback-impact-matrix" && !intent.blocksProductionQrRedirectMutation) {
      errors.push(`School policy rollback impact matrix write intent ${intent.intentId} must block production QR redirect mutation.`);
    }

    if (intent.category === "school-policy-rollback-impact-matrix" && !intent.blocksLearnerDataDeletionWorkflow) {
      errors.push(`School policy rollback impact matrix write intent ${intent.intentId} must block learner-data deletion workflows.`);
    }

    if (intent.category === "school-policy-rollback-impact-matrix" && !intent.blocksLiveReportExport) {
      errors.push(`School policy rollback impact matrix write intent ${intent.intentId} must block report export.`);
    }

    if (intent.category === "school-policy-rollback-impact-matrix" && !intent.blocksMediaReplacement) {
      errors.push(`School policy rollback impact matrix write intent ${intent.intentId} must block media replacement.`);
    }

    if (intent.category === "school-policy-rollback-impact-matrix" && !intent.blocksLocalBundleDeactivation) {
      errors.push(`School policy rollback impact matrix write intent ${intent.intentId} must block local bundle deactivation.`);
    }

    if (intent.category === "school-policy-rollback-impact-matrix" && !intent.blocksAiTutorEntitlementChange) {
      errors.push(`School policy rollback impact matrix write intent ${intent.intentId} must block AI Tutor entitlement changes.`);
    }

    if (intent.category === "school-policy-rollback-impact-matrix" && !intent.blocksLiveClassroomLaunch) {
      errors.push(`School policy rollback impact matrix write intent ${intent.intentId} must block live classroom launch.`);
    }

    if (
      intent.category === "school-rollback-safe-fallback-plan" &&
      !intent.preservesSchoolRollbackSafeFallbackPlan
    ) {
      errors.push(`School rollback safe fallback plan write intent ${intent.intentId} must preserve safe messages, route fallbacks, blocked actions, and fallback rules.`);
    }

    if (intent.category === "school-rollback-safe-fallback-plan" && !intent.blocksProductionQrRedirectMutation) {
      errors.push(`School rollback safe fallback plan write intent ${intent.intentId} must block production QR redirect mutation.`);
    }

    if (intent.category === "school-rollback-safe-fallback-plan" && !intent.blocksLiveNotification) {
      errors.push(`School rollback safe fallback plan write intent ${intent.intentId} must block live notifications.`);
    }

    if (intent.category === "school-rollback-safe-fallback-plan" && !intent.blocksLiveClassroomLaunch) {
      errors.push(`School rollback safe fallback plan write intent ${intent.intentId} must block live classroom launch.`);
    }

    if (intent.category === "school-rollback-safe-fallback-plan" && !intent.blocksLiveReportExport) {
      errors.push(`School rollback safe fallback plan write intent ${intent.intentId} must block report export.`);
    }

    if (intent.category === "school-rollback-safe-fallback-plan" && !intent.blocksMediaReplacement) {
      errors.push(`School rollback safe fallback plan write intent ${intent.intentId} must block media replacement.`);
    }

    if (intent.category === "school-rollback-safe-fallback-plan" && !intent.blocksLocalBundleDeactivation) {
      errors.push(`School rollback safe fallback plan write intent ${intent.intentId} must block local bundle deactivation.`);
    }

    if (intent.category === "school-rollback-safe-fallback-plan" && !intent.blocksStudentReassignment) {
      errors.push(`School rollback safe fallback plan write intent ${intent.intentId} must block student reassignment.`);
    }

    if (
      intent.category === "school-rollback-safe-fallback-preflight" &&
      !intent.preservesSchoolRollbackSafeFallbackPreflight
    ) {
      errors.push(`School rollback safe fallback preflight write intent ${intent.intentId} must preserve preflight lanes, minimum activation fields, blocked actions, and preflight rules.`);
    }

    if (intent.category === "school-rollback-safe-fallback-preflight" && !intent.blocksReleaseStateMutation) {
      errors.push(`School rollback safe fallback preflight write intent ${intent.intentId} must block release-state mutation.`);
    }

    if (intent.category === "school-rollback-safe-fallback-preflight" && !intent.blocksProductionQrRedirectMutation) {
      errors.push(`School rollback safe fallback preflight write intent ${intent.intentId} must block production QR redirect mutation.`);
    }

    if (intent.category === "school-rollback-safe-fallback-preflight" && !intent.blocksLiveNotification) {
      errors.push(`School rollback safe fallback preflight write intent ${intent.intentId} must block live notifications.`);
    }

    if (intent.category === "school-rollback-safe-fallback-preflight" && !intent.blocksLiveClassroomLaunch) {
      errors.push(`School rollback safe fallback preflight write intent ${intent.intentId} must block live classroom launch.`);
    }

    if (intent.category === "school-rollback-safe-fallback-preflight" && !intent.blocksLiveReportExport) {
      errors.push(`School rollback safe fallback preflight write intent ${intent.intentId} must block report export.`);
    }

    if (intent.category === "school-rollback-safe-fallback-preflight" && !intent.blocksMediaReplacement) {
      errors.push(`School rollback safe fallback preflight write intent ${intent.intentId} must block media replacement.`);
    }

    if (intent.category === "school-rollback-safe-fallback-preflight" && !intent.blocksLocalBundleDeactivation) {
      errors.push(`School rollback safe fallback preflight write intent ${intent.intentId} must block local bundle deactivation.`);
    }

    if (intent.category === "school-rollback-safe-fallback-preflight" && !intent.blocksStudentReassignment) {
      errors.push(`School rollback safe fallback preflight write intent ${intent.intentId} must block student reassignment.`);
    }

    if (
      intent.category === "school-rollback-safe-fallback-activation-preview" &&
      !intent.preservesSchoolRollbackSafeFallbackActivationPreview
    ) {
      errors.push(`School rollback safe fallback activation preview write intent ${intent.intentId} must preserve minimum activation fields, non-activated markers, blocked actions, and review rules.`);
    }

    if (intent.category === "school-rollback-safe-fallback-activation-preview" && !intent.blocksReleaseStateMutation) {
      errors.push(`School rollback safe fallback activation preview write intent ${intent.intentId} must block release-state mutation.`);
    }

    if (intent.category === "school-rollback-safe-fallback-activation-preview" && !intent.blocksProductionQrRedirectMutation) {
      errors.push(`School rollback safe fallback activation preview write intent ${intent.intentId} must block production QR redirect mutation.`);
    }

    if (intent.category === "school-rollback-safe-fallback-activation-preview" && !intent.blocksLiveNotification) {
      errors.push(`School rollback safe fallback activation preview write intent ${intent.intentId} must block live notifications.`);
    }

    if (intent.category === "school-rollback-safe-fallback-activation-preview" && !intent.blocksLiveClassroomLaunch) {
      errors.push(`School rollback safe fallback activation preview write intent ${intent.intentId} must block live classroom launch.`);
    }

    if (intent.category === "school-rollback-safe-fallback-activation-preview" && !intent.blocksLiveReportExport) {
      errors.push(`School rollback safe fallback activation preview write intent ${intent.intentId} must block report export.`);
    }

    if (intent.category === "school-rollback-safe-fallback-activation-preview" && !intent.blocksMediaReplacement) {
      errors.push(`School rollback safe fallback activation preview write intent ${intent.intentId} must block media replacement.`);
    }

    if (intent.category === "school-rollback-safe-fallback-activation-preview" && !intent.blocksLocalBundleDeactivation) {
      errors.push(`School rollback safe fallback activation preview write intent ${intent.intentId} must block local bundle deactivation.`);
    }

    if (intent.category === "school-rollback-safe-fallback-activation-preview" && !intent.blocksStudentReassignment) {
      errors.push(`School rollback safe fallback activation preview write intent ${intent.intentId} must block student reassignment.`);
    }

    if (
      intent.category === "school-rollback-safe-fallback-restoration-preview" &&
      !intent.preservesSchoolRollbackSafeFallbackRestorationPreview
    ) {
      errors.push(`School rollback safe fallback restoration preview write intent ${intent.intentId} must preserve minimum restoration fields, non-restored markers, blocked actions, and review rules.`);
    }

    if (intent.category === "school-rollback-safe-fallback-restoration-preview" && !intent.blocksReleaseStateMutation) {
      errors.push(`School rollback safe fallback restoration preview write intent ${intent.intentId} must block release-state mutation.`);
    }

    if (intent.category === "school-rollback-safe-fallback-restoration-preview" && !intent.blocksProductionQrRedirectMutation) {
      errors.push(`School rollback safe fallback restoration preview write intent ${intent.intentId} must block production QR redirect mutation.`);
    }

    if (intent.category === "school-rollback-safe-fallback-restoration-preview" && !intent.blocksLiveNotification) {
      errors.push(`School rollback safe fallback restoration preview write intent ${intent.intentId} must block live notifications.`);
    }

    if (intent.category === "school-rollback-safe-fallback-restoration-preview" && !intent.blocksLiveClassroomLaunch) {
      errors.push(`School rollback safe fallback restoration preview write intent ${intent.intentId} must block live classroom restart.`);
    }

    if (intent.category === "school-rollback-safe-fallback-restoration-preview" && !intent.blocksLiveReportExport) {
      errors.push(`School rollback safe fallback restoration preview write intent ${intent.intentId} must block report export.`);
    }

    if (intent.category === "school-rollback-safe-fallback-restoration-preview" && !intent.blocksMediaReplacement) {
      errors.push(`School rollback safe fallback restoration preview write intent ${intent.intentId} must block media restoration.`);
    }

    if (intent.category === "school-rollback-safe-fallback-restoration-preview" && !intent.blocksLocalBundleRestoration) {
      errors.push(`School rollback safe fallback restoration preview write intent ${intent.intentId} must block local bundle restoration.`);
    }

    if (intent.category === "school-rollback-safe-fallback-restoration-preview" && !intent.blocksStudentReassignment) {
      errors.push(`School rollback safe fallback restoration preview write intent ${intent.intentId} must block student reassignment.`);
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
