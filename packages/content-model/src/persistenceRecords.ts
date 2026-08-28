export type PersistenceRecordCategory =
  | "tenant-config"
  | "content-package"
  | "teacher-draft-package"
  | "teacher-draft-review-handoff"
  | "teacher-draft-review-decision"
  | "teacher-draft-review-evidence"
  | "teacher-draft-review-audit"
  | "teacher-draft-verifier-submission"
  | "ai-generation-request-packet"
  | "ai-generated-game-build-brief"
  | "ai-external-prototype-task-packet"
  | "prototype-intake-queue-item"
  | "prototype-return-package-checklist"
  | "ai-external-task-export-readiness-gate"
  | "ai-prototype-return-review"
  | "ai-prototype-integration-plan"
  | "ai-prototype-wrapper-adapter-review"
  | "ai-prototype-fixture-replay-report"
  | "ai-prototype-event-replay-report"
  | "ai-prototype-audio-coverage-report"
  | "ai-prototype-mobile-accessibility-report"
  | "ai-prototype-scoring-replay-report"
  | "codex-integration-review-decision"
  | "ai-prototype-app-patch-proposal"
  | "ai-prototype-patch-test-readiness-gate"
  | "ai-prototype-patch-test-harness-plan"
  | "ai-prototype-patch-harness-implementation-proposal"
  | "codex-patch-approval-decision"
  | "ai-prototype-signed-approval-preflight"
  | "ai-prototype-patch-authorization-release-lock"
  | "ai-prototype-patch-implementation-work-order"
  | "ai-prototype-patch-change-set-preview"
  | "ai-prototype-integration-readiness-gate"
  | "target-language-audio-approval"
  | "ai-generated-package-teacher-review-packet"
  | "ai-generated-package-manifest"
  | "ai-generated-package-promotion-checklist"
  | "ai-generated-package-release-candidate"
  | "ai-generated-package-assembly-readiness"
  | "ai-generated-package-assembly-dry-run"
  | "ai-generated-package-writer-preflight"
  | "ai-generated-package-writer-rollback-drill"
  | "ai-generated-package-writer-implementation-readiness"
  | "ai-generated-package-writer-module-test-plan"
  | "ai-generated-package-writer-test-evidence-packet"
  | "ai-generated-package-writer-test-harness-plan"
  | "ai-generated-package-writer-test-harness-implementation-proposal"
  | "ai-generated-package-writer-harness-implementation-decision"
  | "ai-generated-package-writer-route-playlist-write-guard"
  | "ai-generated-package-writer-local-companion-package-guard"
  | "ai-reward-readiness-gate"
  | "ai-generated-publish-readiness-gate"
  | "ai-generator-tenant-coverage-gate"
  | "ai-generator-review-summary"
  | "ai-generator-reviewer-runbook"
  | "ai-generator-responsibility-matrix"
  | "teacher-assignment-rollout-gate"
  | "private-assignment-link"
  | "class-roster-plan"
  | "source-extraction-review-packet"
  | "upload-file-policy-profile"
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
  | "game-mode-settings-profile"
  | "teacher-game-mode-settings-snapshot"
  | "game-mode-settings-change-request"
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
  | "package-adoption-record-preview"
  | "pilot-evidence-packet"
  | "reviewer-identity-signature-gate"
  | "teacher-dry-run-rehearsal"
  | "classroom-launch-gate"
  | "school-launch-policy-gate"
  | "school-policy-handoff-packet"
  | "school-policy-acceptance-preflight"
  | "school-policy-text-pack"
  | "school-policy-acceptance-record-preview"
  | "school-policy-revocation-rollback-preview"
  | "school-policy-rollback-impact-matrix"
  | "school-rollback-safe-fallback-plan"
  | "school-rollback-safe-fallback-preflight"
  | "school-rollback-safe-fallback-activation-preview"
  | "school-rollback-safe-fallback-restoration-preview";

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
  preservesTeacherSessionSettingsReviewPacket?: boolean;
  preservesEventEffectTaxonomy?: boolean;
  preservesSettingsContext?: boolean;
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
  preservesAiGeneratedGameBuildBrief?: boolean;
  preservesAiExternalPrototypeTaskPacket?: boolean;
  requiresExternalPrototypeTaskScope?: boolean;
  requiresExternalPrototypeHandoffContents?: boolean;
  requiresExternalPrototypeReturnEvidence?: boolean;
  blocksExternalPrototypeLiveHandoff?: boolean;
  blocksExternalPrototypeTaskShortcuts?: boolean;
  preservesPrototypeIntakeQueueItem?: boolean;
  requiresPrototypeIntakeRepositoryScope?: boolean;
  requiresPrototypeIntakeReviewRoute?: boolean;
  requiresPrototypeIntakeMissingEvidence?: boolean;
  blocksPrototypeIntakeDirectImport?: boolean;
  blocksPrototypeIntakeRouteReplacement?: boolean;
  preservesPrototypeReturnPackageChecklist?: boolean;
  requiresPrototypeReturnSourceManifest?: boolean;
  requiresPrototypeReturnFixtureFolder?: boolean;
  blocksPrototypeReturnArchiveImport?: boolean;
  preservesAiExternalTaskExportReadinessGate?: boolean;
  requiresExternalTaskExportChannels?: boolean;
  requiresExternalTaskExportReadinessChecks?: boolean;
  blocksExternalTaskExport?: boolean;
  blocksPromptCopyAction?: boolean;
  blocksRepositoryIssueCreation?: boolean;
  blocksArchiveDownload?: boolean;
  preservesAiPrototypeReturnReview?: boolean;
  preservesAiPrototypeIntegrationPlan?: boolean;
  preservesAiPrototypeWrapperAdapterReview?: boolean;
  preservesAiPrototypeFixtureReplayReport?: boolean;
  preservesAiPrototypeEventReplayReport?: boolean;
  preservesAiPrototypeAudioCoverageReport?: boolean;
  preservesAiPrototypeMobileAccessibilityReport?: boolean;
  preservesAiPrototypeScoringReplayReport?: boolean;
  preservesCodexIntegrationReviewDecision?: boolean;
  preservesAiPrototypeAppPatchProposal?: boolean;
  preservesAiPrototypePatchTestReadinessGate?: boolean;
  preservesAiPrototypePatchTestHarnessPlan?: boolean;
  preservesAiPrototypePatchHarnessImplementationProposal?: boolean;
  preservesCodexPatchApprovalDecision?: boolean;
  preservesAiPrototypeSignedApprovalPreflight?: boolean;
  preservesAiPrototypePatchAuthorizationReleaseLock?: boolean;
  preservesAiPrototypePatchImplementationWorkOrder?: boolean;
  preservesAiPrototypePatchChangeSetPreview?: boolean;
  requiresProposedPatchFileScope?: boolean;
  requiresPrePatchGates?: boolean;
  requiresPatchTestGates?: boolean;
  requiresPatchTestHarnessPlan?: boolean;
  requiresHarnessRuntimePolicy?: boolean;
  requiresHarnessRequiredInputs?: boolean;
  requiresHarnessSectionCoverage?: boolean;
  requiresHarnessNonExecutionOutputs?: boolean;
  requiresHarnessImplementationFileScopeReview?: boolean;
  requiresHarnessImplementationReviewGates?: boolean;
  requiresDryRunOnlyChecks?: boolean;
  blocksHarnessImplementation?: boolean;
  requiresRouteSafetyReleaseGate?: boolean;
  requiresRollbackDrillRecord?: boolean;
  requiresStorageContractVerification?: boolean;
  requiresCodexPatchApprovalDecision?: boolean;
  requiresPatchApprovalEvidenceChecks?: boolean;
  requiresPatchScopeReview?: boolean;
  requiresSignedApprovalPreflightScopeLocks?: boolean;
  requiresApprovalRecordDraftFields?: boolean;
  requiresCannotApproveWhileChecks?: boolean;
  requiresSignedApprovalEvidenceChecklist?: boolean;
  requiresPatchAuthorizationReleaseLocks?: boolean;
  requiresPatchAuthorizationScope?: boolean;
  requiresForbiddenUntilUnlockedChecks?: boolean;
  requiresReleaseEvidence?: boolean;
  requiresPatchImplementationRequiredBeforeWork?: boolean;
  requiresPatchImplementationFileGroups?: boolean;
  requiresPatchImplementationDryRunOrder?: boolean;
  requiresPatchImplementationRollbackPlan?: boolean;
  requiresPatchChangeSetPlannedFileChanges?: boolean;
  requiresPatchChangeSetInvariantChecks?: boolean;
  requiresPatchChangeSetReviewBlockers?: boolean;
  requiresPatchChangeSetNextRecords?: boolean;
  requiresReviewerIdentitySignatureGate?: boolean;
  blocksAppFileWrite?: boolean;
  blocksWorkOrderExecution?: boolean;
  blocksApplyPatch?: boolean;
  blocksGeneratedFileWrite?: boolean;
  blocksTestExecution?: boolean;
  blocksPlaywrightRun?: boolean;
  requiresManualCodexReview?: boolean;
  blocksAppPatchGeneration?: boolean;
  preservesAiPrototypeIntegrationReadinessGate?: boolean;
  requiresAllPrototypeEvidenceReviewed?: boolean;
  requiresCodexIntegrationReviewDecision?: boolean;
  blocksStudentFacingRoute?: boolean;
  requiresReviewedUnitJsonFixture?: boolean;
  requiresFixtureCoverage?: boolean;
  requiresFixtureReplayEvidence?: boolean;
  requiresTargetLanguageProgressTrigger?: boolean;
  blocksHardCodedUnitText?: boolean;
  requiresStandardEventCoverage?: boolean;
  requiresRequiredEventOrder?: boolean;
  requiresAllowedEventPayloadFields?: boolean;
  requiresAcceptedProgressEffects?: boolean;
  blocksHiddenProgressStream?: boolean;
  requiresTargetLanguageAudioCoverage?: boolean;
  requiresControlAudioCoverage?: boolean;
  requiresSupportLanguageAudioRules?: boolean;
  requiresAudioReplayEvidence?: boolean;
  blocksGeneratedVoiceCall?: boolean;
  blocksVoiceApiCost?: boolean;
  blocksMediaOnlyMastery?: boolean;
  blocksPackageAudioCompleteMarker?: boolean;
  requiresDeterministicScoringReplay?: boolean;
  requiresScoringProfileSnapshot?: boolean;
  requiresMasteryThresholdReplay?: boolean;
  requiresRewardBoundaryChecks?: boolean;
  blocksStarDustWrite?: boolean;
  requiresMobileViewportEvidence?: boolean;
  requiresTouchTargetChecks?: boolean;
  requiresKeyboardFocusChecks?: boolean;
  requiresReadableTextChecks?: boolean;
  requiresVisualStabilityChecks?: boolean;
  requiresAccessibleWrapperControls?: boolean;
  blocksAccessibilityWaiver?: boolean;
  requiresFixtureInputContract?: boolean;
  requiresStandardEventOutputContract?: boolean;
  requiresStateOwnershipRules?: boolean;
  requiresWrapperEvidence?: boolean;
  requiresRejectionTriggers?: boolean;
  blocksEventContractBypass?: boolean;
  blocksTenantHardCoding?: boolean;
  blocksScoreAuthority?: boolean;
  blocksRouteStateOwnership?: boolean;
  blocksAudioManifestAuthority?: boolean;
  blocksRewardInventoryWrite?: boolean;
  blocksSupportLanguageProgressTrigger?: boolean;
  requiresPrototypeArtifactEvidence?: boolean;
  requiresWrapperAdapterReview?: boolean;
  requiresFixtureReplayReport?: boolean;
  requiresEventReplayReport?: boolean;
  requiresAudioCoverageReport?: boolean;
  requiresScoringReplayReport?: boolean;
  requiresJsonFixtureConformance?: boolean;
  requiresStandardEventReplay?: boolean;
  requiresAudioCueCoverageReview?: boolean;
  requiresMobileAccessibilityReview?: boolean;
  blocksProductionMerge?: boolean;
  blocksDirectAppImport?: boolean;
  blocksGameSequenceMutation?: boolean;
  blocksPackagePromotion?: boolean;
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
  preservesGameModeSettingsProfile?: boolean;
  preservesTeacherGameModeSettingsSnapshot?: boolean;
  preservesGameModeSettingsChangeRequest?: boolean;
  blocksLiveTeacherSettingSave?: boolean;
  requiresSchoolPolicyAcceptance?: boolean;
  requiresAccessibilityReview?: boolean;
  blocksDirectSafeDefaultMutation?: boolean;
  blocksArcadeSpeedMutation?: boolean;
  blocksGameSkinMutation?: boolean;
  blocksBackgroundMusicPromotion?: boolean;
  preservesTargetLanguageAudioApproval?: boolean;
  requiresAudioApprovalCueReview?: boolean;
  requiresAudioApprovalProgressBoundaries?: boolean;
  preservesAiGeneratedPackageTeacherReviewPacket?: boolean;
  requiresTeacherReviewDecisionLanes?: boolean;
  requiresTeacherReviewMissingEvidence?: boolean;
  preservesAiGeneratedPackageManifest?: boolean;
  preservesAiGeneratedPackagePromotionChecklist?: boolean;
  preservesAiGeneratedPackageReleaseCandidate?: boolean;
  preservesAiGeneratedPackageAssemblyReadiness?: boolean;
  preservesAiGeneratedPackageAssemblyDryRun?: boolean;
  preservesAiGeneratedPackageWriterPreflight?: boolean;
  preservesAiGeneratedPackageWriterRollbackDrill?: boolean;
  preservesAiGeneratedPackageWriterImplementationReadiness?: boolean;
  preservesAiGeneratedPackageWriterModuleTestPlan?: boolean;
  preservesAiGeneratedPackageWriterTestEvidencePacket?: boolean;
  preservesAiGeneratedPackageWriterTestHarnessPlan?: boolean;
  preservesAiGeneratedPackageWriterTestHarnessImplementationProposal?: boolean;
  preservesAiGeneratedPackageWriterHarnessImplementationDecision?: boolean;
  preservesAiGeneratedPackageWriterRoutePlaylistWriteGuard?: boolean;
  preservesAiGeneratedPackageWriterLocalCompanionPackageGuard?: boolean;
  requiresLineageMap?: boolean;
  requiresTargetLanguageAudioApproval?: boolean;
  requiresPackageAssemblyReadinessLanes?: boolean;
  requiresGeneratedPackageArtifactMap?: boolean;
  requiresGeneratedPackageWriterTargets?: boolean;
  requiresGeneratedPackageRollbackSnapshots?: boolean;
  requiresGeneratedPackageRollbackVerification?: boolean;
  requiresPackageWriterModulePlan?: boolean;
  requiresPackageWriterTestGates?: boolean;
  requiresPackageWriterReleaseControls?: boolean;
  requiresCodexPackageWriterImplementationDecision?: boolean;
  requiresPackageWriterModuleTestSuites?: boolean;
  requiresPackageWriterTestEvidence?: boolean;
  requiresPackageWriterEvidenceLanes?: boolean;
  requiresPackageWriterAcceptanceChecks?: boolean;
  requiresPackageWriterHarnessPhases?: boolean;
  requiresPackageWriterHarnessAdapters?: boolean;
  requiresPackageWriterHarnessPrerequisites?: boolean;
  requiresPackageWriterHarnessImplementationModuleScope?: boolean;
  requiresPackageWriterHarnessImplementationReviewGates?: boolean;
  requiresPackageWriterHarnessDryRunOnlyChecks?: boolean;
  requiresPackageWriterHarnessDecisionEvidence?: boolean;
  requiresPackageWriterHarnessDecisionFileScope?: boolean;
  requiresPackageWriterHarnessDecisionOptions?: boolean;
  requiresRoutePlaylistProtectedSurfaces?: boolean;
  requiresLocalCompanionProtectedArtifacts?: boolean;
  requiresOfflineRouteMapReview?: boolean;
  requiresStudentDataExclusion?: boolean;
  blocksHarnessImplementationApproval?: boolean;
  requiresMediaRightsEvidence?: boolean;
  blocksGeneratedPackagePromotion?: boolean;
  requiresPrivateLibraryTarget?: boolean;
  blocksGeneratedPackageLibraryPublish?: boolean;
  blocksReleaseCandidateWrite?: boolean;
  blocksTenantLibraryItemWrite?: boolean;
  blocksStudentFacingRelease?: boolean;
  blocksGeneratedLocalBundleRelease?: boolean;
  blocksSupportLanguageRelease?: boolean;
  blocksGeneratedPackageAssembly?: boolean;
  blocksGeneratedPackageWriterExecution?: boolean;
  blocksGeneratedPackageWriterImplementation?: boolean;
  blocksPackageWriterTestExecution?: boolean;
  blocksGeneratedPackageRollbackExecution?: boolean;
  blocksGeneratedPackageJsonWrite?: boolean;
  blocksGeneratedPackageRouteWrite?: boolean;
  blocksGeneratedPackagePlaylistWrite?: boolean;
  blocksGeneratedPackageAssignment?: boolean;
  blocksGeneratedPackageLocalBundleWrite?: boolean;
  blocksStudentReadyMarker?: boolean;
  blocksSupportLanguageAssembly?: boolean;
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
  preservesAiGenerationRequestPacket?: boolean;
  requiresRequestBuilderReviewPacket?: boolean;
  requiresPremiumAiCostGate?: boolean;
  requiresAiGenerationSourceEvidence?: boolean;
  requiresAiGenerationAudioCoverage?: boolean;
  requiresAiGenerationCompatibilitySnapshot?: boolean;
  preservesAiGeneratorTenantCoverageGate?: boolean;
  requiresTenantSpecificGeneratorRecords?: boolean;
  preservesAiGeneratorReviewSummary?: boolean;
  preservesGeneratorSectionReadiness?: boolean;
  requiresGeneratorPrimaryBlockers?: boolean;
  requiresGeneratorNextRecords?: boolean;
  preservesAiGeneratorReviewerRunbook?: boolean;
  preservesGeneratorReviewOrder?: boolean;
  requiresGeneratorRunbookEvidence?: boolean;
  requiresGeneratorRunbookRequiredRecords?: boolean;
  blocksGeneratorRunbookShortcuts?: boolean;
  preservesAiGeneratorResponsibilityMatrix?: boolean;
  preservesGeneratorRoleOwnership?: boolean;
  requiresGeneratorHandoffRecords?: boolean;
  blocksExternalBuilderAuthority?: boolean;
  blocksGeneratorResponsibilityShortcuts?: boolean;
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
  preservesPackageAdoptionRecordPreview?: boolean;
  requiresPackageCostReview?: boolean;
  requiresTenantPackageSelection?: boolean;
  blocksAcceptedAdoptionRecordStorage?: boolean;
  blocksBillingEntitlementWrite?: boolean;
  blocksPremiumFeatureActivation?: boolean;
  blocksMicrophoneScoringEnablement?: boolean;
  blocksReportExportEnablement?: boolean;
  blocksLocalCompanionActivation?: boolean;
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
  recommendedFirstPilotStore: PersistenceStorageTier[];
  note: string;
}

function validateAiGenerationRequestPacketRecord(record: DurableRecordContract, errors: string[]): void {
  if (record.category !== "ai-generation-request-packet") {
    return;
  }

  const requiredChecks: Array<[boolean | undefined, string]> = [
    [record.preservesAiGenerationRequestPacket, "preserve the AI generation request packet"],
    [record.requiresRequestBuilderReviewPacket, "require the request-builder review packet"],
    [record.requiresPremiumAiCostGate, "require the premium AI cost gate"],
    [record.requiresAiGenerationSourceEvidence, "require source evidence"],
    [record.requiresAiGenerationAudioCoverage, "require target-language audio coverage"],
    [record.requiresAiGenerationCompatibilitySnapshot, "require activity compatibility evidence"],
    [record.requiresMediaRightsEvidence, "require media-rights evidence"],
    [record.blocksGeneratorRequestSubmission, "block generator request submission"],
    [record.blocksLiveModelCall, "block live model calls"],
    [record.blocksVerifierSubmission, "block verifier submission"],
    [record.blocksGeneratedPackageAssembly, "block generated package assembly"],
    [record.blocksGeneratedPackageRouteWrite, "block route writes"],
    [record.blocksGeneratedPackagePlaylistWrite, "block playlist writes"],
    [record.blocksGeneratedPackageAssignment, "block generated package assignment"],
    [record.blocksStudentReadyMarker, "block student-ready markers"],
    [record.blocksSupportLanguageProgressTrigger, "block support-language progress triggers"]
  ];

  for (const [passes, requirement] of requiredChecks) {
    if (!passes) {
      errors.push(`AI generation request packet record ${record.recordId} must ${requirement}.`);
    }
  }
}

function validatePrototypeReturnPackageChecklistRecord(record: DurableRecordContract, errors: string[]): void {
  if (record.category !== "prototype-return-package-checklist") {
    return;
  }

  const requiredChecks: Array<[boolean | undefined, string]> = [
    [record.preservesPrototypeReturnPackageChecklist, "preserve return package checklist sections"],
    [record.requiresPrototypeReturnSourceManifest, "require source archive manifest evidence"],
    [record.requiresPrototypeReturnFixtureFolder, "require reviewed fixture folder evidence"],
    [record.requiresStandardEventReplay, "require standard event replay evidence"],
    [record.requiresDeterministicScoringReplay, "require deterministic scoring replay evidence"],
    [record.requiresTargetLanguageAudioCoverage, "require target-language audio coverage"],
    [record.requiresMobileAccessibilityReview, "require mobile accessibility review evidence"],
    [record.requiresWrapperEvidence, "require wrapper boundary evidence"],
    [record.blocksPrototypeReturnArchiveImport, "block archive imports"],
    [record.blocksAppFileWrite, "block app file writes"],
    [record.blocksGeneratedGameRouteWrite, "block game route writes"],
    [record.blocksScoringProfileOverride, "block scoring profile overrides"],
    [record.blocksRewardInventoryWrite, "block reward inventory writes"],
    [record.blocksGeneratedPackagePlaylistWrite, "block playlist writes"],
    [record.blocksGeneratedPackageAssembly, "block package promotion or assembly"],
    [record.blocksDirectStudentAssignment, "block student assignment"],
    [record.blocksSupportLanguageProgressTrigger, "block support-language progress triggers"]
  ];

  for (const [passes, requirement] of requiredChecks) {
    if (!passes) {
      errors.push(`Prototype return package checklist record ${record.recordId} must ${requirement}.`);
    }
  }
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

    if (record.category === "launch-session" && !record.preservesTeacherSessionSettingsReviewPacket) {
      errors.push(`Launch-session durable record ${record.recordId} must preserve teacher session settings review packets.`);
    }

    if (record.category === "progress-event-stream" && !record.preservesEventEffectTaxonomy) {
      errors.push(`Progress event durable record ${record.recordId} must preserve event effect taxonomy.`);
    }

    if (record.category === "progress-event-stream" && !record.preservesSettingsContext) {
      errors.push(`Progress event durable record ${record.recordId} must preserve settings context.`);
    }

    if (record.category === "progress-event-stream" && record.containsStudentData && !record.requiresEventAcceptanceGate) {
      errors.push(`Progress event durable record ${record.recordId} must require a passed event acceptance gate.`);
    }

    if (record.category === "teacher-report-package" && !record.preservesReportEventAcceptanceSummary) {
      errors.push(`Teacher report package durable record ${record.recordId} must preserve event acceptance summaries.`);
    }

    if (record.category === "teacher-report-package" && !record.preservesSettingsContext) {
      errors.push(`Teacher report package durable record ${record.recordId} must preserve settings context summaries.`);
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

    validateAiGenerationRequestPacketRecord(record, errors);

    if (record.category === "ai-generated-game-build-brief" && !record.preservesAiGeneratedGameBuildBrief) {
      errors.push(`AI generated game build brief record ${record.recordId} must preserve build brief sections.`);
    }

    if (record.category === "ai-generated-game-build-brief" && !record.requiresParentEngineBinding) {
      errors.push(`AI generated game build brief record ${record.recordId} must require parent-engine binding.`);
    }

    if (record.category === "ai-generated-game-build-brief" && !record.requiresStandardEventContract) {
      errors.push(`AI generated game build brief record ${record.recordId} must require the standard event contract.`);
    }

    if (record.category === "ai-generated-game-build-brief" && !record.requiresAudioCueManifest) {
      errors.push(`AI generated game build brief record ${record.recordId} must require an audio cue manifest.`);
    }

    if (record.category === "ai-generated-game-build-brief" && !record.preservesDeterministicScoringContract) {
      errors.push(`AI generated game build brief record ${record.recordId} must preserve deterministic scoring rules.`);
    }

    if (record.category === "ai-generated-game-build-brief" && !record.blocksStandaloneGamePromotion) {
      errors.push(`AI generated game build brief record ${record.recordId} must block standalone game promotion.`);
    }

    if (record.category === "ai-generated-game-build-brief" && !record.blocksPhaserBypass) {
      errors.push(`AI generated game build brief record ${record.recordId} must block Phaser bypass.`);
    }

    if (record.category === "ai-generated-game-build-brief" && !record.blocksGeneratedGameRouteWrite) {
      errors.push(`AI generated game build brief record ${record.recordId} must block generated game route writes.`);
    }

    if (record.category === "ai-generated-game-build-brief" && !record.blocksScoringProfileOverride) {
      errors.push(`AI generated game build brief record ${record.recordId} must block scoring profile overrides.`);
    }

    if (record.category === "ai-generated-game-build-brief" && !record.blocksDirectStudentAssignment) {
      errors.push(`AI generated game build brief record ${record.recordId} must block student assignment.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.preservesAiExternalPrototypeTaskPacket) {
      errors.push(`AI external prototype task packet record ${record.recordId} must preserve task packet sections.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.requiresExternalPrototypeTaskScope) {
      errors.push(`AI external prototype task packet record ${record.recordId} must require repository and output scope.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.requiresExternalPrototypeHandoffContents) {
      errors.push(`AI external prototype task packet record ${record.recordId} must require handoff contents.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.requiresParentEngineBinding) {
      errors.push(`AI external prototype task packet record ${record.recordId} must require parent-engine binding.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.requiresStandardEventContract) {
      errors.push(`AI external prototype task packet record ${record.recordId} must require the standard event contract.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.requiresAudioCueManifest) {
      errors.push(`AI external prototype task packet record ${record.recordId} must require an audio cue manifest.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.preservesDeterministicScoringContract) {
      errors.push(`AI external prototype task packet record ${record.recordId} must preserve deterministic scoring rules.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.requiresExternalPrototypeReturnEvidence) {
      errors.push(`AI external prototype task packet record ${record.recordId} must require return evidence.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksExternalPrototypeLiveHandoff) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block live handoff.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksExternalBuilderAuthority) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block external builder authority.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksAppPatchGeneration) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block app patch generation.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksStandaloneGamePromotion) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block standalone game promotion.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksPhaserBypass) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block Phaser bypass.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksGeneratedGameRouteWrite) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block route writes.`);
    }

    if (record.category === "prototype-intake-queue-item" && !record.preservesPrototypeIntakeQueueItem) {
      errors.push(`Prototype intake queue item record ${record.recordId} must preserve queue item scope, evidence, and blocked actions.`);
    }

    if (record.category === "prototype-intake-queue-item" && !record.requiresPrototypeIntakeRepositoryScope) {
      errors.push(`Prototype intake queue item record ${record.recordId} must require source repository scope.`);
    }

    if (record.category === "prototype-intake-queue-item" && !record.requiresPrototypeIntakeReviewRoute) {
      errors.push(`Prototype intake queue item record ${record.recordId} must require a prototype review route.`);
    }

    if (record.category === "prototype-intake-queue-item" && !record.requiresPrototypeIntakeMissingEvidence) {
      errors.push(`Prototype intake queue item record ${record.recordId} must preserve missing evidence.`);
    }

    if (record.category === "prototype-intake-queue-item" && !record.blocksPrototypeIntakeDirectImport) {
      errors.push(`Prototype intake queue item record ${record.recordId} must block direct prototype import.`);
    }

    if (record.category === "prototype-intake-queue-item" && !record.blocksPrototypeIntakeRouteReplacement) {
      errors.push(`Prototype intake queue item record ${record.recordId} must block active route replacement.`);
    }

    validatePrototypeReturnPackageChecklistRecord(record, errors);

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksScoringProfileOverride) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block scoring profile overrides.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksRewardInventoryWrite) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block reward inventory writes.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block playlist writes.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksGeneratedPackageAssembly) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block package assembly.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksGeneratedPackageAssignment) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block assignment writes.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksStudentFacingPrototypePreview) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block student-facing previews.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksSupportLanguageProgressTrigger) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block support-language progress triggers.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksStudentReadyMarker) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block student-ready markers.`);
    }

    if (record.category === "ai-external-prototype-task-packet" && !record.blocksExternalPrototypeTaskShortcuts) {
      errors.push(`AI external prototype task packet record ${record.recordId} must block task shortcut actions.`);
    }

    if (record.category === "ai-external-task-export-readiness-gate" && !record.preservesAiExternalTaskExportReadinessGate) {
      errors.push(`AI external task export readiness gate record ${record.recordId} must preserve export readiness gate sections.`);
    }

    if (record.category === "ai-external-task-export-readiness-gate" && !record.requiresExternalTaskExportChannels) {
      errors.push(`AI external task export readiness gate record ${record.recordId} must require export channel status.`);
    }

    if (record.category === "ai-external-task-export-readiness-gate" && !record.requiresExternalTaskExportReadinessChecks) {
      errors.push(`AI external task export readiness gate record ${record.recordId} must require readiness checks.`);
    }

    if (record.category === "ai-external-task-export-readiness-gate" && !record.blocksExternalTaskExport) {
      errors.push(`AI external task export readiness gate record ${record.recordId} must block task export.`);
    }

    if (record.category === "ai-external-task-export-readiness-gate" && !record.blocksPromptCopyAction) {
      errors.push(`AI external task export readiness gate record ${record.recordId} must block prompt copy actions.`);
    }

    if (record.category === "ai-external-task-export-readiness-gate" && !record.blocksRepositoryIssueCreation) {
      errors.push(`AI external task export readiness gate record ${record.recordId} must block repository issue creation.`);
    }

    if (record.category === "ai-external-task-export-readiness-gate" && !record.blocksArchiveDownload) {
      errors.push(`AI external task export readiness gate record ${record.recordId} must block archive downloads.`);
    }

    if (record.category === "ai-external-task-export-readiness-gate" && !record.blocksExternalPrototypeLiveHandoff) {
      errors.push(`AI external task export readiness gate record ${record.recordId} must block live handoff.`);
    }

    if (record.category === "ai-external-task-export-readiness-gate" && !record.blocksAppPatchGeneration) {
      errors.push(`AI external task export readiness gate record ${record.recordId} must block app patch generation.`);
    }

    if (record.category === "ai-external-task-export-readiness-gate" && !record.blocksGeneratedGameRouteWrite) {
      errors.push(`AI external task export readiness gate record ${record.recordId} must block route creation.`);
    }

    if (record.category === "ai-external-task-export-readiness-gate" && !record.blocksScoringProfileOverride) {
      errors.push(`AI external task export readiness gate record ${record.recordId} must block scoring authority.`);
    }

    if (record.category === "ai-external-task-export-readiness-gate" && !record.blocksStudentFacingPrototypePreview) {
      errors.push(`AI external task export readiness gate record ${record.recordId} must block student-facing pathways.`);
    }

    if (record.category === "ai-external-task-export-readiness-gate" && !record.blocksSupportLanguageProgressTrigger) {
      errors.push(`AI external task export readiness gate record ${record.recordId} must block support-language progress triggers.`);
    }

    if (record.category === "ai-prototype-return-review" && !record.preservesAiPrototypeReturnReview) {
      errors.push(`AI prototype return review record ${record.recordId} must preserve return review sections.`);
    }

    if (record.category === "ai-prototype-return-review" && !record.requiresPrototypeArtifactEvidence) {
      errors.push(`AI prototype return review record ${record.recordId} must require prototype artifact evidence.`);
    }

    if (record.category === "ai-prototype-return-review" && !record.requiresParentEngineBinding) {
      errors.push(`AI prototype return review record ${record.recordId} must require parent-engine wrapper review.`);
    }

    if (record.category === "ai-prototype-return-review" && !record.requiresJsonFixtureConformance) {
      errors.push(`AI prototype return review record ${record.recordId} must require JSON fixture conformance.`);
    }

    if (record.category === "ai-prototype-return-review" && !record.requiresStandardEventReplay) {
      errors.push(`AI prototype return review record ${record.recordId} must require standard event replay.`);
    }

    if (record.category === "ai-prototype-return-review" && !record.requiresAudioCueCoverageReview) {
      errors.push(`AI prototype return review record ${record.recordId} must require audio cue coverage review.`);
    }

    if (record.category === "ai-prototype-return-review" && !record.preservesDeterministicScoringContract) {
      errors.push(`AI prototype return review record ${record.recordId} must preserve deterministic scoring review.`);
    }

    if (record.category === "ai-prototype-return-review" && !record.requiresMobileAccessibilityReview) {
      errors.push(`AI prototype return review record ${record.recordId} must require mobile accessibility review.`);
    }

    if (record.category === "ai-prototype-return-review" && !record.blocksProductionMerge) {
      errors.push(`AI prototype return review record ${record.recordId} must block production merge.`);
    }

    if (record.category === "ai-prototype-return-review" && !record.blocksGeneratedGameRouteWrite) {
      errors.push(`AI prototype return review record ${record.recordId} must block route writes.`);
    }

    if (record.category === "ai-prototype-return-review" && !record.blocksScoringProfileOverride) {
      errors.push(`AI prototype return review record ${record.recordId} must block scoring mutations.`);
    }

    if (record.category === "ai-prototype-return-review" && !record.blocksAudioManifestMutation) {
      errors.push(`AI prototype return review record ${record.recordId} must block audio manifest mutations.`);
    }

    if (record.category === "ai-prototype-return-review" && !record.blocksDirectStudentAssignment) {
      errors.push(`AI prototype return review record ${record.recordId} must block assignment creation.`);
    }

    if (record.category === "ai-prototype-return-review" && !record.blocksStudentFacingPrototypePreview) {
      errors.push(`AI prototype return review record ${record.recordId} must block student-facing prototype previews.`);
    }

    if (record.category === "ai-prototype-integration-plan" && !record.preservesAiPrototypeIntegrationPlan) {
      errors.push(`AI prototype integration plan record ${record.recordId} must preserve integration plan sections.`);
    }

    if (record.category === "ai-prototype-integration-plan" && !record.requiresWrapperAdapterReview) {
      errors.push(`AI prototype integration plan record ${record.recordId} must require wrapper adapter review.`);
    }

    if (record.category === "ai-prototype-integration-plan" && !record.requiresFixtureReplayReport) {
      errors.push(`AI prototype integration plan record ${record.recordId} must require fixture replay reports.`);
    }

    if (record.category === "ai-prototype-integration-plan" && !record.requiresEventReplayReport) {
      errors.push(`AI prototype integration plan record ${record.recordId} must require event replay reports.`);
    }

    if (record.category === "ai-prototype-integration-plan" && !record.requiresAudioCoverageReport) {
      errors.push(`AI prototype integration plan record ${record.recordId} must require audio coverage reports.`);
    }

    if (record.category === "ai-prototype-integration-plan" && !record.requiresScoringReplayReport) {
      errors.push(`AI prototype integration plan record ${record.recordId} must require scoring replay reports.`);
    }

    if (record.category === "ai-prototype-integration-plan" && !record.requiresMobileAccessibilityReview) {
      errors.push(`AI prototype integration plan record ${record.recordId} must require mobile accessibility review.`);
    }

    if (record.category === "ai-prototype-integration-plan" && !record.blocksDirectAppImport) {
      errors.push(`AI prototype integration plan record ${record.recordId} must block direct app imports.`);
    }

    if (record.category === "ai-prototype-integration-plan" && !record.blocksGeneratedGameRouteWrite) {
      errors.push(`AI prototype integration plan record ${record.recordId} must block route writes.`);
    }

    if (record.category === "ai-prototype-integration-plan" && !record.blocksGameSequenceMutation) {
      errors.push(`AI prototype integration plan record ${record.recordId} must block game sequence mutations.`);
    }

    if (record.category === "ai-prototype-integration-plan" && !record.blocksScoringProfileOverride) {
      errors.push(`AI prototype integration plan record ${record.recordId} must block scoring mutations.`);
    }

    if (record.category === "ai-prototype-integration-plan" && !record.blocksAudioManifestMutation) {
      errors.push(`AI prototype integration plan record ${record.recordId} must block audio manifest mutations.`);
    }

    if (record.category === "ai-prototype-integration-plan" && !record.blocksPackagePromotion) {
      errors.push(`AI prototype integration plan record ${record.recordId} must block package promotion.`);
    }

    if (record.category === "ai-prototype-integration-plan" && !record.blocksDirectStudentAssignment) {
      errors.push(`AI prototype integration plan record ${record.recordId} must block student assignments.`);
    }

    if (record.category === "codex-integration-review-decision" && !record.preservesCodexIntegrationReviewDecision) {
      errors.push(`Codex integration review decision record ${record.recordId} must preserve decision sections.`);
    }

    if (record.category === "codex-integration-review-decision" && !record.requiresManualCodexReview) {
      errors.push(`Codex integration review decision record ${record.recordId} must require manual Codex review.`);
    }

    if (record.category === "codex-integration-review-decision" && !record.requiresAllPrototypeEvidenceReviewed) {
      errors.push(`Codex integration review decision record ${record.recordId} must require all prototype evidence reviewed.`);
    }

    if (record.category === "codex-integration-review-decision" && !record.blocksAppPatchGeneration) {
      errors.push(`Codex integration review decision record ${record.recordId} must block app patch generation.`);
    }

    if (record.category === "codex-integration-review-decision" && !record.blocksDirectAppImport) {
      errors.push(`Codex integration review decision record ${record.recordId} must block direct app imports.`);
    }

    if (record.category === "codex-integration-review-decision" && !record.blocksGeneratedGameRouteWrite) {
      errors.push(`Codex integration review decision record ${record.recordId} must block route writes.`);
    }

    if (record.category === "codex-integration-review-decision" && !record.blocksStudentFacingRoute) {
      errors.push(`Codex integration review decision record ${record.recordId} must block student-facing routes.`);
    }

    if (record.category === "codex-integration-review-decision" && !record.blocksScoringProfileOverride) {
      errors.push(`Codex integration review decision record ${record.recordId} must block scoring mutations.`);
    }

    if (record.category === "codex-integration-review-decision" && !record.blocksStarDustWrite) {
      errors.push(`Codex integration review decision record ${record.recordId} must block Star Dust writes.`);
    }

    if (record.category === "codex-integration-review-decision" && !record.blocksRewardInventoryWrite) {
      errors.push(`Codex integration review decision record ${record.recordId} must block reward inventory writes.`);
    }

    if (record.category === "codex-integration-review-decision" && !record.blocksAudioManifestMutation) {
      errors.push(`Codex integration review decision record ${record.recordId} must block audio manifest mutations.`);
    }

    if (record.category === "codex-integration-review-decision" && !record.blocksPackagePromotion) {
      errors.push(`Codex integration review decision record ${record.recordId} must block package promotion.`);
    }

    if (record.category === "codex-integration-review-decision" && !record.blocksDirectStudentAssignment) {
      errors.push(`Codex integration review decision record ${record.recordId} must block student assignments.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.preservesAiPrototypeAppPatchProposal) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must preserve proposal sections.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.requiresCodexIntegrationReviewDecision) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must require Codex integration decisions.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.requiresAllPrototypeEvidenceReviewed) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must require all prototype evidence reviewed.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.requiresProposedPatchFileScope) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must require proposed patch file scope.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.requiresPrePatchGates) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must require pre-patch gates.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.requiresPatchTestGates) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must require patch test gates.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.requiresReviewerIdentitySignatureGate) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must require reviewer identity signature gates.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.requiresReleaseControlBinding) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must require release-control binding.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.blocksAppFileWrite) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must block app file writes.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.blocksAppPatchGeneration) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must block app patch generation.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.blocksDirectAppImport) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must block direct app imports.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.blocksGeneratedGameRouteWrite) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must block route writes.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.blocksStudentFacingRoute) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must block student-facing routes.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.blocksScoringProfileOverride) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must block scoring mutations.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.blocksStarDustWrite) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must block Star Dust writes.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.blocksRewardInventoryWrite) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must block reward inventory writes.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.blocksAudioManifestMutation) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must block audio manifest mutations.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.blocksPackagePromotion) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must block package promotion.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.blocksDirectStudentAssignment) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must block student assignments.`);
    }

    if (record.category === "ai-prototype-app-patch-proposal" && !record.blocksSupportLanguageProgressTrigger) {
      errors.push(`AI prototype app patch proposal record ${record.recordId} must block support-language progress triggers.`);
    }

    if (
      record.category === "ai-prototype-patch-test-readiness-gate" &&
      !record.preservesAiPrototypePatchTestReadinessGate
    ) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must preserve readiness gate sections.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.requiresPatchTestHarnessPlan) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must require patch test harness plans.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.requiresRouteSafetyReleaseGate) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must require route safety release gates.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.requiresRollbackDrillRecord) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must require rollback drill records.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.requiresStorageContractVerification) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must require storage contract verification.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.requiresCodexPatchApprovalDecision) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must require Codex patch approval decisions.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.blocksTestExecution) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must block test execution.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.blocksAppFileWrite) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must block app file writes.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.blocksAppPatchGeneration) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must block app patch generation.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.blocksGeneratedGameRouteWrite) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must block route writes.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.blocksStudentFacingRoute) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must block student-facing routes.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.blocksScoringProfileOverride) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must block scoring mutations.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.blocksStarDustWrite) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must block Star Dust writes.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.blocksRewardInventoryWrite) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must block reward inventory writes.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.blocksAudioManifestMutation) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must block audio manifest mutations.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.blocksPackagePromotion) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must block package promotion.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.blocksDirectStudentAssignment) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must block student assignments.`);
    }

    if (record.category === "ai-prototype-patch-test-readiness-gate" && !record.blocksSupportLanguageProgressTrigger) {
      errors.push(`AI prototype patch test readiness gate record ${record.recordId} must block support-language progress triggers.`);
    }

    if (
      record.category === "ai-prototype-patch-test-harness-plan" &&
      !record.preservesAiPrototypePatchTestHarnessPlan
    ) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must preserve harness plan sections.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.requiresHarnessRuntimePolicy) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must require harness runtime policy.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.requiresHarnessRequiredInputs) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must require harness inputs.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.requiresHarnessSectionCoverage) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must require harness section coverage.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.requiresHarnessNonExecutionOutputs) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must require non-execution outputs.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.blocksTestExecution) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must block test execution.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.blocksPlaywrightRun) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must block Playwright runs.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.blocksAppFileWrite) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must block app file writes.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.blocksAppPatchGeneration) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must block app patch generation.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.blocksGeneratedGameRouteWrite) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must block route writes.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.blocksStudentFacingRoute) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must block student-facing routes.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.blocksScoringProfileOverride) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must block scoring mutations.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.blocksStarDustWrite) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must block Star Dust writes.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.blocksRewardInventoryWrite) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must block reward inventory writes.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.blocksAudioManifestMutation) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must block audio manifest mutations.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.blocksPackagePromotion) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must block package promotion.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.blocksDirectStudentAssignment) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must block student assignments.`);
    }

    if (record.category === "ai-prototype-patch-test-harness-plan" && !record.blocksSupportLanguageProgressTrigger) {
      errors.push(`AI prototype patch test harness plan record ${record.recordId} must block support-language progress triggers.`);
    }

    if (
      record.category === "ai-prototype-patch-harness-implementation-proposal" &&
      !record.preservesAiPrototypePatchHarnessImplementationProposal
    ) {
      errors.push(
        `AI prototype patch harness implementation proposal record ${record.recordId} must preserve implementation proposal sections.`,
      );
    }

    if (
      record.category === "ai-prototype-patch-harness-implementation-proposal" &&
      !record.requiresHarnessImplementationFileScopeReview
    ) {
      errors.push(
        `AI prototype patch harness implementation proposal record ${record.recordId} must require implementation file-scope review.`,
      );
    }

    if (
      record.category === "ai-prototype-patch-harness-implementation-proposal" &&
      !record.requiresHarnessImplementationReviewGates
    ) {
      errors.push(
        `AI prototype patch harness implementation proposal record ${record.recordId} must require implementation review gates.`,
      );
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.requiresDryRunOnlyChecks) {
      errors.push(`AI prototype patch harness implementation proposal record ${record.recordId} must require dry-run-only checks.`);
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.blocksHarnessImplementation) {
      errors.push(`AI prototype patch harness implementation proposal record ${record.recordId} must block harness implementation.`);
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.blocksTestExecution) {
      errors.push(`AI prototype patch harness implementation proposal record ${record.recordId} must block test execution.`);
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.blocksPlaywrightRun) {
      errors.push(`AI prototype patch harness implementation proposal record ${record.recordId} must block Playwright runs.`);
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.blocksAppFileWrite) {
      errors.push(`AI prototype patch harness implementation proposal record ${record.recordId} must block app file writes.`);
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.blocksAppPatchGeneration) {
      errors.push(`AI prototype patch harness implementation proposal record ${record.recordId} must block app patch generation.`);
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.blocksGeneratedGameRouteWrite) {
      errors.push(`AI prototype patch harness implementation proposal record ${record.recordId} must block route writes.`);
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.blocksStudentFacingRoute) {
      errors.push(`AI prototype patch harness implementation proposal record ${record.recordId} must block student-facing routes.`);
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.blocksScoringProfileOverride) {
      errors.push(`AI prototype patch harness implementation proposal record ${record.recordId} must block scoring mutations.`);
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.blocksStarDustWrite) {
      errors.push(`AI prototype patch harness implementation proposal record ${record.recordId} must block Star Dust writes.`);
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.blocksRewardInventoryWrite) {
      errors.push(`AI prototype patch harness implementation proposal record ${record.recordId} must block reward inventory writes.`);
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.blocksAudioManifestMutation) {
      errors.push(`AI prototype patch harness implementation proposal record ${record.recordId} must block audio manifest mutations.`);
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.blocksPackagePromotion) {
      errors.push(`AI prototype patch harness implementation proposal record ${record.recordId} must block package promotion.`);
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.blocksDirectStudentAssignment) {
      errors.push(`AI prototype patch harness implementation proposal record ${record.recordId} must block student assignments.`);
    }

    if (record.category === "ai-prototype-patch-harness-implementation-proposal" && !record.blocksSupportLanguageProgressTrigger) {
      errors.push(
        `AI prototype patch harness implementation proposal record ${record.recordId} must block support-language progress triggers.`,
      );
    }

    if (
      record.category === "ai-prototype-integration-readiness-gate" &&
      !record.preservesAiPrototypeIntegrationReadinessGate
    ) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must preserve readiness gate sections.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.requiresWrapperAdapterReview) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must require wrapper adapter review.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.requiresFixtureReplayReport) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must require fixture replay reports.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.requiresEventReplayReport) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must require event replay reports.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.requiresAudioCoverageReport) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must require audio coverage reports.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.requiresMobileAccessibilityReview) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must require mobile accessibility review.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.requiresScoringReplayReport) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must require scoring replay reports.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.requiresAllPrototypeEvidenceReviewed) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must require all prototype evidence reviewed.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.requiresCodexIntegrationReviewDecision) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must require Codex integration review decisions.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.blocksDirectAppImport) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must block direct app imports.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.blocksGeneratedGameRouteWrite) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must block route writes.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.blocksStudentFacingRoute) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must block student-facing routes.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.blocksScoringProfileOverride) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must block scoring mutations.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.blocksStarDustWrite) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must block Star Dust writes.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.blocksRewardInventoryWrite) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must block reward inventory writes.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.blocksAudioManifestMutation) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must block audio manifest mutations.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.blocksPackagePromotion) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must block package promotion.`);
    }

    if (record.category === "ai-prototype-integration-readiness-gate" && !record.blocksDirectStudentAssignment) {
      errors.push(`AI prototype integration readiness gate record ${record.recordId} must block student assignments.`);
    }

    if (
      record.category === "ai-prototype-wrapper-adapter-review" &&
      !record.preservesAiPrototypeWrapperAdapterReview
    ) {
      errors.push(`AI prototype wrapper adapter review record ${record.recordId} must preserve adapter review sections.`);
    }

    if (record.category === "ai-prototype-wrapper-adapter-review" && !record.requiresFixtureInputContract) {
      errors.push(`AI prototype wrapper adapter review record ${record.recordId} must require fixture input contracts.`);
    }

    if (record.category === "ai-prototype-wrapper-adapter-review" && !record.requiresStandardEventOutputContract) {
      errors.push(`AI prototype wrapper adapter review record ${record.recordId} must require standard event output contracts.`);
    }

    if (record.category === "ai-prototype-wrapper-adapter-review" && !record.requiresStateOwnershipRules) {
      errors.push(`AI prototype wrapper adapter review record ${record.recordId} must require state ownership rules.`);
    }

    if (record.category === "ai-prototype-wrapper-adapter-review" && !record.requiresWrapperEvidence) {
      errors.push(`AI prototype wrapper adapter review record ${record.recordId} must require wrapper evidence.`);
    }

    if (record.category === "ai-prototype-wrapper-adapter-review" && !record.requiresRejectionTriggers) {
      errors.push(`AI prototype wrapper adapter review record ${record.recordId} must require rejection triggers.`);
    }

    if (record.category === "ai-prototype-wrapper-adapter-review" && !record.blocksEventContractBypass) {
      errors.push(`AI prototype wrapper adapter review record ${record.recordId} must block event contract bypass.`);
    }

    if (record.category === "ai-prototype-wrapper-adapter-review" && !record.blocksTenantHardCoding) {
      errors.push(`AI prototype wrapper adapter review record ${record.recordId} must block tenant hard-coding.`);
    }

    if (record.category === "ai-prototype-wrapper-adapter-review" && !record.blocksScoreAuthority) {
      errors.push(`AI prototype wrapper adapter review record ${record.recordId} must block wrapper score authority.`);
    }

    if (record.category === "ai-prototype-wrapper-adapter-review" && !record.blocksRouteStateOwnership) {
      errors.push(`AI prototype wrapper adapter review record ${record.recordId} must block route state ownership.`);
    }

    if (record.category === "ai-prototype-wrapper-adapter-review" && !record.blocksAudioManifestAuthority) {
      errors.push(`AI prototype wrapper adapter review record ${record.recordId} must block audio manifest authority.`);
    }

    if (record.category === "ai-prototype-wrapper-adapter-review" && !record.blocksRewardInventoryWrite) {
      errors.push(`AI prototype wrapper adapter review record ${record.recordId} must block reward inventory writes.`);
    }

    if (record.category === "ai-prototype-wrapper-adapter-review" && !record.blocksSupportLanguageProgressTrigger) {
      errors.push(`AI prototype wrapper adapter review record ${record.recordId} must block support-language progress triggers.`);
    }

    if (
      record.category === "ai-prototype-fixture-replay-report" &&
      !record.preservesAiPrototypeFixtureReplayReport
    ) {
      errors.push(`AI prototype fixture replay report record ${record.recordId} must preserve fixture replay sections.`);
    }

    if (record.category === "ai-prototype-fixture-replay-report" && !record.requiresReviewedUnitJsonFixture) {
      errors.push(`AI prototype fixture replay report record ${record.recordId} must require reviewed unit JSON fixtures.`);
    }

    if (record.category === "ai-prototype-fixture-replay-report" && !record.requiresFixtureCoverage) {
      errors.push(`AI prototype fixture replay report record ${record.recordId} must require fixture coverage.`);
    }

    if (record.category === "ai-prototype-fixture-replay-report" && !record.requiresFixtureReplayEvidence) {
      errors.push(`AI prototype fixture replay report record ${record.recordId} must require fixture replay evidence.`);
    }

    if (record.category === "ai-prototype-fixture-replay-report" && !record.requiresTargetLanguageProgressTrigger) {
      errors.push(`AI prototype fixture replay report record ${record.recordId} must require target-language progress triggers.`);
    }

    if (record.category === "ai-prototype-fixture-replay-report" && !record.blocksHardCodedUnitText) {
      errors.push(`AI prototype fixture replay report record ${record.recordId} must block hard-coded unit text.`);
    }

    if (record.category === "ai-prototype-fixture-replay-report" && !record.blocksTenantHardCoding) {
      errors.push(`AI prototype fixture replay report record ${record.recordId} must block tenant hard-coding.`);
    }

    if (record.category === "ai-prototype-fixture-replay-report" && !record.blocksSupportLanguageProgressTrigger) {
      errors.push(`AI prototype fixture replay report record ${record.recordId} must block support-language progress triggers.`);
    }

    if (record.category === "ai-prototype-fixture-replay-report" && !record.blocksScoreAuthority) {
      errors.push(`AI prototype fixture replay report record ${record.recordId} must block prototype score authority.`);
    }

    if (record.category === "ai-prototype-fixture-replay-report" && !record.blocksAudioManifestAuthority) {
      errors.push(`AI prototype fixture replay report record ${record.recordId} must block audio manifest authority.`);
    }

    if (record.category === "ai-prototype-fixture-replay-report" && !record.blocksRewardInventoryWrite) {
      errors.push(`AI prototype fixture replay report record ${record.recordId} must block reward inventory writes.`);
    }

    if (
      record.category === "ai-prototype-event-replay-report" &&
      !record.preservesAiPrototypeEventReplayReport
    ) {
      errors.push(`AI prototype event replay report record ${record.recordId} must preserve event replay sections.`);
    }

    if (record.category === "ai-prototype-event-replay-report" && !record.requiresStandardEventCoverage) {
      errors.push(`AI prototype event replay report record ${record.recordId} must require standard event coverage.`);
    }

    if (record.category === "ai-prototype-event-replay-report" && !record.requiresRequiredEventOrder) {
      errors.push(`AI prototype event replay report record ${record.recordId} must require event order checks.`);
    }

    if (record.category === "ai-prototype-event-replay-report" && !record.requiresAllowedEventPayloadFields) {
      errors.push(`AI prototype event replay report record ${record.recordId} must require allowed event payload fields.`);
    }

    if (record.category === "ai-prototype-event-replay-report" && !record.requiresAcceptedProgressEffects) {
      errors.push(`AI prototype event replay report record ${record.recordId} must require accepted progress effects.`);
    }

    if (record.category === "ai-prototype-event-replay-report" && !record.requiresTargetLanguageProgressTrigger) {
      errors.push(`AI prototype event replay report record ${record.recordId} must require target-language progress triggers.`);
    }

    if (record.category === "ai-prototype-event-replay-report" && !record.blocksHiddenProgressStream) {
      errors.push(`AI prototype event replay report record ${record.recordId} must block hidden progress streams.`);
    }

    if (record.category === "ai-prototype-event-replay-report" && !record.blocksScoreAuthority) {
      errors.push(`AI prototype event replay report record ${record.recordId} must block score authority.`);
    }

    if (record.category === "ai-prototype-event-replay-report" && !record.blocksRewardInventoryWrite) {
      errors.push(`AI prototype event replay report record ${record.recordId} must block reward inventory writes.`);
    }

    if (record.category === "ai-prototype-event-replay-report" && !record.blocksRouteStateOwnership) {
      errors.push(`AI prototype event replay report record ${record.recordId} must block route state ownership.`);
    }

    if (record.category === "ai-prototype-event-replay-report" && !record.blocksLiveReportExport) {
      errors.push(`AI prototype event replay report record ${record.recordId} must block report export.`);
    }

    if (record.category === "ai-prototype-event-replay-report" && !record.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI prototype event replay report record ${record.recordId} must block playlist writes.`);
    }

    if (record.category === "ai-prototype-event-replay-report" && !record.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI prototype event replay report record ${record.recordId} must block local bundle writes.`);
    }

    if (record.category === "ai-prototype-event-replay-report" && !record.blocksSupportLanguageProgressTrigger) {
      errors.push(`AI prototype event replay report record ${record.recordId} must block support-language progress triggers.`);
    }

    if (
      record.category === "ai-prototype-audio-coverage-report" &&
      !record.preservesAiPrototypeAudioCoverageReport
    ) {
      errors.push(`AI prototype audio coverage report record ${record.recordId} must preserve audio coverage sections.`);
    }

    if (record.category === "ai-prototype-audio-coverage-report" && !record.requiresTargetLanguageAudioCoverage) {
      errors.push(`AI prototype audio coverage report record ${record.recordId} must require target-language audio coverage.`);
    }

    if (record.category === "ai-prototype-audio-coverage-report" && !record.requiresControlAudioCoverage) {
      errors.push(`AI prototype audio coverage report record ${record.recordId} must require control audio coverage.`);
    }

    if (record.category === "ai-prototype-audio-coverage-report" && !record.requiresSupportLanguageAudioRules) {
      errors.push(`AI prototype audio coverage report record ${record.recordId} must require support-language audio rules.`);
    }

    if (record.category === "ai-prototype-audio-coverage-report" && !record.requiresAudioReplayEvidence) {
      errors.push(`AI prototype audio coverage report record ${record.recordId} must require audio replay evidence.`);
    }

    if (record.category === "ai-prototype-audio-coverage-report" && !record.blocksGeneratedVoiceCall) {
      errors.push(`AI prototype audio coverage report record ${record.recordId} must block generated voice calls.`);
    }

    if (record.category === "ai-prototype-audio-coverage-report" && !record.blocksVoiceApiCost) {
      errors.push(`AI prototype audio coverage report record ${record.recordId} must block voice API cost.`);
    }

    if (record.category === "ai-prototype-audio-coverage-report" && !record.blocksAudioManifestMutation) {
      errors.push(`AI prototype audio coverage report record ${record.recordId} must block audio manifest mutation.`);
    }

    if (record.category === "ai-prototype-audio-coverage-report" && !record.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI prototype audio coverage report record ${record.recordId} must block playlist writes.`);
    }

    if (record.category === "ai-prototype-audio-coverage-report" && !record.blocksMediaOnlyMastery) {
      errors.push(`AI prototype audio coverage report record ${record.recordId} must block media-only mastery.`);
    }

    if (record.category === "ai-prototype-audio-coverage-report" && !record.blocksSupportLanguageProgressTrigger) {
      errors.push(`AI prototype audio coverage report record ${record.recordId} must block support-language progress triggers.`);
    }

    if (record.category === "ai-prototype-audio-coverage-report" && !record.blocksPackageAudioCompleteMarker) {
      errors.push(`AI prototype audio coverage report record ${record.recordId} must block package audio-complete markers.`);
    }

    if (record.category === "ai-prototype-audio-coverage-report" && !record.blocksDirectStudentAssignment) {
      errors.push(`AI prototype audio coverage report record ${record.recordId} must block direct student assignments.`);
    }

    if (
      record.category === "ai-prototype-mobile-accessibility-report" &&
      !record.preservesAiPrototypeMobileAccessibilityReport
    ) {
      errors.push(`AI prototype mobile accessibility report record ${record.recordId} must preserve mobile accessibility sections.`);
    }

    if (
      record.category === "ai-prototype-mobile-accessibility-report" &&
      !record.requiresMobileViewportEvidence
    ) {
      errors.push(`AI prototype mobile accessibility report record ${record.recordId} must require mobile viewport evidence.`);
    }

    if (record.category === "ai-prototype-mobile-accessibility-report" && !record.requiresTouchTargetChecks) {
      errors.push(`AI prototype mobile accessibility report record ${record.recordId} must require touch target checks.`);
    }

    if (record.category === "ai-prototype-mobile-accessibility-report" && !record.requiresKeyboardFocusChecks) {
      errors.push(`AI prototype mobile accessibility report record ${record.recordId} must require keyboard and focus checks.`);
    }

    if (record.category === "ai-prototype-mobile-accessibility-report" && !record.requiresReadableTextChecks) {
      errors.push(`AI prototype mobile accessibility report record ${record.recordId} must require readable text checks.`);
    }

    if (record.category === "ai-prototype-mobile-accessibility-report" && !record.requiresVisualStabilityChecks) {
      errors.push(`AI prototype mobile accessibility report record ${record.recordId} must require visual stability checks.`);
    }

    if (record.category === "ai-prototype-mobile-accessibility-report" && !record.requiresAccessibleWrapperControls) {
      errors.push(`AI prototype mobile accessibility report record ${record.recordId} must require accessible wrapper controls.`);
    }

    if (record.category === "ai-prototype-mobile-accessibility-report" && !record.blocksAccessibilityWaiver) {
      errors.push(`AI prototype mobile accessibility report record ${record.recordId} must block accessibility waivers.`);
    }

    if (
      record.category === "ai-prototype-mobile-accessibility-report" &&
      !record.blocksStudentFacingPrototypePreview
    ) {
      errors.push(`AI prototype mobile accessibility report record ${record.recordId} must block student-facing prototype previews.`);
    }

    if (record.category === "ai-prototype-mobile-accessibility-report" && !record.blocksDirectAppImport) {
      errors.push(`AI prototype mobile accessibility report record ${record.recordId} must block direct app imports.`);
    }

    if (record.category === "ai-prototype-mobile-accessibility-report" && !record.blocksGeneratedGameRouteWrite) {
      errors.push(`AI prototype mobile accessibility report record ${record.recordId} must block route writes.`);
    }

    if (record.category === "ai-prototype-mobile-accessibility-report" && !record.blocksDirectStudentAssignment) {
      errors.push(`AI prototype mobile accessibility report record ${record.recordId} must block direct student assignments.`);
    }

    if (
      record.category === "ai-prototype-scoring-replay-report" &&
      !record.preservesAiPrototypeScoringReplayReport
    ) {
      errors.push(`AI prototype scoring replay report record ${record.recordId} must preserve scoring replay sections.`);
    }

    if (
      record.category === "ai-prototype-scoring-replay-report" &&
      !record.requiresDeterministicScoringReplay
    ) {
      errors.push(`AI prototype scoring replay report record ${record.recordId} must require deterministic scoring replay.`);
    }

    if (
      record.category === "ai-prototype-scoring-replay-report" &&
      !record.requiresScoringProfileSnapshot
    ) {
      errors.push(`AI prototype scoring replay report record ${record.recordId} must require scoring profile snapshots.`);
    }

    if (
      record.category === "ai-prototype-scoring-replay-report" &&
      !record.requiresMasteryThresholdReplay
    ) {
      errors.push(`AI prototype scoring replay report record ${record.recordId} must require mastery threshold replay.`);
    }

    if (
      record.category === "ai-prototype-scoring-replay-report" &&
      !record.requiresRewardBoundaryChecks
    ) {
      errors.push(`AI prototype scoring replay report record ${record.recordId} must require reward boundary checks.`);
    }

    if (record.category === "ai-prototype-scoring-replay-report" && !record.blocksScoreAuthority) {
      errors.push(`AI prototype scoring replay report record ${record.recordId} must block direct score authority.`);
    }

    if (record.category === "ai-prototype-scoring-replay-report" && !record.blocksScoringProfileOverride) {
      errors.push(`AI prototype scoring replay report record ${record.recordId} must block scoring profile overrides.`);
    }

    if (record.category === "ai-prototype-scoring-replay-report" && !record.blocksStarDustWrite) {
      errors.push(`AI prototype scoring replay report record ${record.recordId} must block Star Dust writes.`);
    }

    if (record.category === "ai-prototype-scoring-replay-report" && !record.blocksRewardInventoryWrite) {
      errors.push(`AI prototype scoring replay report record ${record.recordId} must block reward inventory writes.`);
    }

    if (record.category === "ai-prototype-scoring-replay-report" && !record.blocksGeneratedSurpriseRewards) {
      errors.push(`AI prototype scoring replay report record ${record.recordId} must block generated surprise rewards.`);
    }

    if (record.category === "ai-prototype-scoring-replay-report" && !record.blocksMediaOnlyMastery) {
      errors.push(`AI prototype scoring replay report record ${record.recordId} must block media-only mastery.`);
    }

    if (record.category === "ai-prototype-scoring-replay-report" && !record.blocksSupportLanguageProgressTrigger) {
      errors.push(`AI prototype scoring replay report record ${record.recordId} must block support-language progress triggers.`);
    }

    if (record.category === "ai-prototype-scoring-replay-report" && !record.blocksDirectStudentAssignment) {
      errors.push(`AI prototype scoring replay report record ${record.recordId} must block direct student assignments.`);
    }

    if (record.category === "ai-generated-package-manifest" && !record.preservesAiGeneratedPackageManifest) {
      errors.push(`AI generated package manifest record ${record.recordId} must preserve generated package manifest links.`);
    }

    if (record.category === "ai-generated-package-manifest" && !record.blocksGeneratedPackageAssembly) {
      errors.push(`AI generated package manifest record ${record.recordId} must block package assembly.`);
    }

    if (record.category === "ai-generated-package-manifest" && !record.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generated package manifest record ${record.recordId} must block route registry writes.`);
    }

    if (record.category === "ai-generated-package-manifest" && !record.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generated package manifest record ${record.recordId} must block media playlist writes.`);
    }

    if (record.category === "ai-generated-package-manifest" && !record.blocksGeneratedPackageAssignment) {
      errors.push(`AI generated package manifest record ${record.recordId} must block generated package assignments.`);
    }

    if (record.category === "ai-generated-package-manifest" && !record.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generated package manifest record ${record.recordId} must block local bundle writes.`);
    }

    if (record.category === "ai-generated-package-manifest" && !record.blocksStudentReadyMarker) {
      errors.push(`AI generated package manifest record ${record.recordId} must block student-ready markers.`);
    }

    if (
      record.category === "ai-generated-package-promotion-checklist" &&
      !record.preservesAiGeneratedPackagePromotionChecklist
    ) {
      errors.push(`AI generated package promotion checklist record ${record.recordId} must preserve promotion checklist steps.`);
    }

    if (record.category === "ai-generated-package-promotion-checklist" && !record.requiresLineageMap) {
      errors.push(`AI generated package promotion checklist record ${record.recordId} must require a lineage map.`);
    }

    if (
      record.category === "ai-generated-package-promotion-checklist" &&
      !record.requiresTargetLanguageAudioApproval
    ) {
      errors.push(`AI generated package promotion checklist record ${record.recordId} must require target-language audio approval.`);
    }

    if (record.category === "ai-generated-package-promotion-checklist" && !record.requiresVerifierPacketApproval) {
      errors.push(`AI generated package promotion checklist record ${record.recordId} must require verifier packet approval.`);
    }

    if (record.category === "ai-generated-package-promotion-checklist" && !record.requiresManifestCompleteness) {
      errors.push(`AI generated package promotion checklist record ${record.recordId} must require manifest completeness.`);
    }

    if (record.category === "ai-generated-package-promotion-checklist" && !record.preservesAiRewardReadinessGate) {
      errors.push(`AI generated package promotion checklist record ${record.recordId} must preserve reward readiness state.`);
    }

    if (record.category === "ai-generated-package-promotion-checklist" && !record.requiresReleaseControlBinding) {
      errors.push(`AI generated package promotion checklist record ${record.recordId} must require release-control binding.`);
    }

    if (record.category === "ai-generated-package-promotion-checklist" && !record.requiresTeacherApprovalLedger) {
      errors.push(`AI generated package promotion checklist record ${record.recordId} must require teacher approval ledger capture.`);
    }

    if (record.category === "ai-generated-package-promotion-checklist" && !record.blocksGeneratedPackagePromotion) {
      errors.push(`AI generated package promotion checklist record ${record.recordId} must block generated package promotion.`);
    }

    if (record.category === "ai-generated-package-promotion-checklist" && !record.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generated package promotion checklist record ${record.recordId} must block route registry writes.`);
    }

    if (record.category === "ai-generated-package-promotion-checklist" && !record.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generated package promotion checklist record ${record.recordId} must block media playlist writes.`);
    }

    if (record.category === "ai-generated-package-promotion-checklist" && !record.blocksGeneratedPackageAssignment) {
      errors.push(`AI generated package promotion checklist record ${record.recordId} must block generated package assignments.`);
    }

    if (record.category === "ai-generated-package-promotion-checklist" && !record.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generated package promotion checklist record ${record.recordId} must block local bundle writes.`);
    }

    if (record.category === "ai-generated-package-promotion-checklist" && !record.blocksStudentReadyMarker) {
      errors.push(`AI generated package promotion checklist record ${record.recordId} must block student-ready markers.`);
    }

    if (
      record.category === "ai-generated-package-release-candidate" &&
      !record.preservesAiGeneratedPackageReleaseCandidate
    ) {
      errors.push(`AI generated package release candidate record ${record.recordId} must preserve release candidate signals.`);
    }

    if (
      record.category === "ai-generated-package-release-candidate" &&
      !record.preservesAiGeneratedPackageManifest
    ) {
      errors.push(`AI generated package release candidate record ${record.recordId} must preserve generated package manifest links.`);
    }

    if (
      record.category === "ai-generated-package-release-candidate" &&
      !record.preservesAiGeneratedPackagePromotionChecklist
    ) {
      errors.push(`AI generated package release candidate record ${record.recordId} must preserve promotion checklist links.`);
    }

    if (
      record.category === "ai-generated-package-release-candidate" &&
      !record.preservesAiGeneratedPublishReadinessGate
    ) {
      errors.push(`AI generated package release candidate record ${record.recordId} must preserve publish readiness links.`);
    }

    if (record.category === "ai-generated-package-release-candidate" && !record.requiresPrivateLibraryTarget) {
      errors.push(`AI generated package release candidate record ${record.recordId} must require a private library target.`);
    }

    if (record.category === "ai-generated-package-release-candidate" && !record.requiresReleaseControlBinding) {
      errors.push(`AI generated package release candidate record ${record.recordId} must require release-control binding.`);
    }

    if (record.category === "ai-generated-package-release-candidate" && !record.requiresTeacherApprovalLedger) {
      errors.push(`AI generated package release candidate record ${record.recordId} must require teacher approval ledger capture.`);
    }

    if (record.category === "ai-generated-package-release-candidate" && !record.blocksGeneratedPackageLibraryPublish) {
      errors.push(`AI generated package release candidate record ${record.recordId} must block generated package library publish.`);
    }

    if (record.category === "ai-generated-package-release-candidate" && !record.blocksReleaseCandidateWrite) {
      errors.push(`AI generated package release candidate record ${record.recordId} must block release candidate writes.`);
    }

    if (record.category === "ai-generated-package-release-candidate" && !record.blocksTenantLibraryItemWrite) {
      errors.push(`AI generated package release candidate record ${record.recordId} must block tenant library item writes.`);
    }

    if (record.category === "ai-generated-package-release-candidate" && !record.blocksStudentFacingRelease) {
      errors.push(`AI generated package release candidate record ${record.recordId} must block student-facing release.`);
    }

    if (record.category === "ai-generated-package-release-candidate" && !record.blocksGeneratedPackageAssignment) {
      errors.push(`AI generated package release candidate record ${record.recordId} must block generated package assignments.`);
    }

    if (record.category === "ai-generated-package-release-candidate" && !record.blocksGeneratedLocalBundleRelease) {
      errors.push(`AI generated package release candidate record ${record.recordId} must block generated local bundle release.`);
    }

    if (record.category === "ai-generated-package-release-candidate" && !record.blocksStudentReadyMarker) {
      errors.push(`AI generated package release candidate record ${record.recordId} must block student-ready markers.`);
    }

    if (record.category === "ai-generated-package-release-candidate" && !record.blocksSupportLanguageRelease) {
      errors.push(`AI generated package release candidate record ${record.recordId} must block support-language release.`);
    }

    if (
      record.category === "ai-generated-package-assembly-readiness" &&
      !record.preservesAiGeneratedPackageAssemblyReadiness
    ) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must preserve assembly readiness lanes.`);
    }

    if (
      record.category === "ai-generated-package-assembly-readiness" &&
      !record.preservesAiGeneratedPackageManifest
    ) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must preserve generated package manifest links.`);
    }

    if (
      record.category === "ai-generated-package-assembly-readiness" &&
      !record.preservesAiGeneratedPackagePromotionChecklist
    ) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must preserve promotion checklist links.`);
    }

    if (
      record.category === "ai-generated-package-assembly-readiness" &&
      !record.preservesAiGeneratedPublishReadinessGate
    ) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must preserve publish readiness links.`);
    }

    if (
      record.category === "ai-generated-package-assembly-readiness" &&
      !record.preservesAiGeneratedPackageReleaseCandidate
    ) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must preserve release candidate links.`);
    }

    if (
      record.category === "ai-generated-package-assembly-readiness" &&
      !record.requiresPackageAssemblyReadinessLanes
    ) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must require assembly readiness lanes.`);
    }

    if (
      record.category === "ai-generated-package-assembly-readiness" &&
      !record.requiresTargetLanguageAudioApproval
    ) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must require target-language audio approval.`);
    }

    if (record.category === "ai-generated-package-assembly-readiness" && !record.requiresMediaRightsEvidence) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must require media rights evidence.`);
    }

    if (record.category === "ai-generated-package-assembly-readiness" && !record.requiresTeacherApprovalLedger) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must require teacher approval ledger capture.`);
    }

    if (record.category === "ai-generated-package-assembly-readiness" && !record.blocksGeneratedPackageAssembly) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must block generated package assembly.`);
    }

    if (record.category === "ai-generated-package-assembly-readiness" && !record.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must block route registry writes.`);
    }

    if (record.category === "ai-generated-package-assembly-readiness" && !record.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must block media playlist writes.`);
    }

    if (record.category === "ai-generated-package-assembly-readiness" && !record.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must block local bundle writes.`);
    }

    if (record.category === "ai-generated-package-assembly-readiness" && !record.blocksStudentReadyMarker) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must block student-ready markers.`);
    }

    if (record.category === "ai-generated-package-assembly-readiness" && !record.blocksGeneratedPackageAssignment) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must block assignment writes.`);
    }

    if (record.category === "ai-generated-package-assembly-readiness" && !record.blocksSupportLanguageAssembly) {
      errors.push(`AI generated package assembly readiness record ${record.recordId} must block support-language-only assembly.`);
    }

    if (
      record.category === "ai-generated-package-assembly-dry-run" &&
      !record.preservesAiGeneratedPackageAssemblyDryRun
    ) {
      errors.push(`AI generated package assembly dry run record ${record.recordId} must preserve dry-run artifact maps.`);
    }

    if (
      record.category === "ai-generated-package-assembly-dry-run" &&
      !record.preservesAiGeneratedPackageAssemblyReadiness
    ) {
      errors.push(`AI generated package assembly dry run record ${record.recordId} must preserve assembly readiness links.`);
    }

    if (
      record.category === "ai-generated-package-assembly-dry-run" &&
      !record.preservesAiGeneratedPackageManifest
    ) {
      errors.push(`AI generated package assembly dry run record ${record.recordId} must preserve generated package manifest links.`);
    }

    if (
      record.category === "ai-generated-package-assembly-dry-run" &&
      !record.requiresGeneratedPackageArtifactMap
    ) {
      errors.push(`AI generated package assembly dry run record ${record.recordId} must require generated package artifact maps.`);
    }

    if (record.category === "ai-generated-package-assembly-dry-run" && !record.blocksGeneratedPackageJsonWrite) {
      errors.push(`AI generated package assembly dry run record ${record.recordId} must block package JSON writes.`);
    }

    if (record.category === "ai-generated-package-assembly-dry-run" && !record.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generated package assembly dry run record ${record.recordId} must block route registry writes.`);
    }

    if (record.category === "ai-generated-package-assembly-dry-run" && !record.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generated package assembly dry run record ${record.recordId} must block media playlist writes.`);
    }

    if (record.category === "ai-generated-package-assembly-dry-run" && !record.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generated package assembly dry run record ${record.recordId} must block local bundle writes.`);
    }

    if (record.category === "ai-generated-package-assembly-dry-run" && !record.blocksGeneratedPackageAssignment) {
      errors.push(`AI generated package assembly dry run record ${record.recordId} must block assignment writes.`);
    }

    if (record.category === "ai-generated-package-assembly-dry-run" && !record.blocksStudentReadyMarker) {
      errors.push(`AI generated package assembly dry run record ${record.recordId} must block student-ready markers.`);
    }

    if (record.category === "ai-generated-package-assembly-dry-run" && !record.blocksSupportLanguageAssembly) {
      errors.push(`AI generated package assembly dry run record ${record.recordId} must block support-language-only assembly.`);
    }

    if (
      record.category === "ai-generated-package-writer-preflight" &&
      !record.preservesAiGeneratedPackageWriterPreflight
    ) {
      errors.push(`AI generated package writer preflight record ${record.recordId} must preserve writer target maps.`);
    }

    if (
      record.category === "ai-generated-package-writer-preflight" &&
      !record.preservesAiGeneratedPackageAssemblyDryRun
    ) {
      errors.push(`AI generated package writer preflight record ${record.recordId} must preserve assembly dry-run links.`);
    }

    if (
      record.category === "ai-generated-package-writer-preflight" &&
      !record.requiresGeneratedPackageWriterTargets
    ) {
      errors.push(`AI generated package writer preflight record ${record.recordId} must require generated package writer targets.`);
    }

    if (record.category === "ai-generated-package-writer-preflight" && !record.blocksGeneratedPackageWriterExecution) {
      errors.push(`AI generated package writer preflight record ${record.recordId} must block package writer execution.`);
    }

    if (record.category === "ai-generated-package-writer-preflight" && !record.blocksGeneratedPackageJsonWrite) {
      errors.push(`AI generated package writer preflight record ${record.recordId} must block package JSON writes.`);
    }

    if (record.category === "ai-generated-package-writer-preflight" && !record.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generated package writer preflight record ${record.recordId} must block route registry writes.`);
    }

    if (record.category === "ai-generated-package-writer-preflight" && !record.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generated package writer preflight record ${record.recordId} must block media playlist writes.`);
    }

    if (record.category === "ai-generated-package-writer-preflight" && !record.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generated package writer preflight record ${record.recordId} must block local bundle writes.`);
    }

    if (record.category === "ai-generated-package-writer-preflight" && !record.blocksGeneratedPackageAssignment) {
      errors.push(`AI generated package writer preflight record ${record.recordId} must block assignment writes.`);
    }

    if (record.category === "ai-generated-package-writer-preflight" && !record.blocksStudentReadyMarker) {
      errors.push(`AI generated package writer preflight record ${record.recordId} must block student-ready markers.`);
    }

    if (record.category === "ai-generated-package-writer-preflight" && !record.blocksSupportLanguageAssembly) {
      errors.push(`AI generated package writer preflight record ${record.recordId} must block support-language-only writers.`);
    }

    if (
      record.category === "ai-generated-package-writer-rollback-drill" &&
      !record.preservesAiGeneratedPackageWriterRollbackDrill
    ) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must preserve rollback drill evidence.`);
    }

    if (
      record.category === "ai-generated-package-writer-rollback-drill" &&
      !record.preservesAiGeneratedPackageWriterPreflight
    ) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must preserve writer preflight links.`);
    }

    if (
      record.category === "ai-generated-package-writer-rollback-drill" &&
      !record.requiresGeneratedPackageRollbackSnapshots
    ) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must require rollback snapshots.`);
    }

    if (
      record.category === "ai-generated-package-writer-rollback-drill" &&
      !record.requiresGeneratedPackageRollbackVerification
    ) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must require rollback verification.`);
    }

    if (
      record.category === "ai-generated-package-writer-rollback-drill" &&
      !record.blocksGeneratedPackageRollbackExecution
    ) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must block rollback execution.`);
    }

    if (
      record.category === "ai-generated-package-writer-rollback-drill" &&
      !record.blocksGeneratedPackageWriterExecution
    ) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must block package writer execution.`);
    }

    if (record.category === "ai-generated-package-writer-rollback-drill" && !record.blocksRollbackAction) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must block rollback actions.`);
    }

    if (
      record.category === "ai-generated-package-writer-rollback-drill" &&
      !record.blocksProductionQrRedirectMutation
    ) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must block production QR redirects.`);
    }

    if (record.category === "ai-generated-package-writer-rollback-drill" && !record.blocksGeneratedPackageJsonWrite) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must block package JSON rollback writes.`);
    }

    if (record.category === "ai-generated-package-writer-rollback-drill" && !record.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must block route rollback writes.`);
    }

    if (record.category === "ai-generated-package-writer-rollback-drill" && !record.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must block playlist rollback writes.`);
    }

    if (record.category === "ai-generated-package-writer-rollback-drill" && !record.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must block local bundle rollback writes.`);
    }

    if (record.category === "ai-generated-package-writer-rollback-drill" && !record.blocksGeneratedPackageAssignment) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must block assignment rollback writes.`);
    }

    if (record.category === "ai-generated-package-writer-rollback-drill" && !record.blocksStudentReadyMarker) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must block student-ready markers.`);
    }

    if (record.category === "ai-generated-package-writer-rollback-drill" && !record.blocksSupportLanguageAssembly) {
      errors.push(`AI generated package writer rollback drill record ${record.recordId} must block support-language-only rollback evidence.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.preservesAiGeneratedPackageWriterImplementationReadiness
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must preserve implementation readiness gates.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.preservesAiGeneratedPackageWriterRollbackDrill
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must preserve rollback drill links.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.requiresPackageWriterModulePlan
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must require package writer module plans.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.requiresPackageWriterTestGates
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must require package writer test gates.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.requiresPackageWriterReleaseControls
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must require package writer release controls.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.requiresCodexPackageWriterImplementationDecision
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must require a Codex package writer implementation decision.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.blocksGeneratedPackageWriterImplementation
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must block package writer implementation.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.blocksGeneratedPackageWriterExecution
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must block package writer execution.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.blocksGeneratedPackageJsonWrite
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must block generated package JSON writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.blocksGeneratedPackageRouteWrite
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must block route registry writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.blocksGeneratedPackagePlaylistWrite
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must block media playlist writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.blocksGeneratedPackageLocalBundleWrite
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must block local bundle writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.blocksGeneratedPackageAssignment
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must block assignment writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.blocksStudentReadyMarker
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must block student-ready markers.`);
    }

    if (
      record.category === "ai-generated-package-writer-implementation-readiness" &&
      !record.blocksSupportLanguageAssembly
    ) {
      errors.push(`AI generated package writer implementation readiness record ${record.recordId} must block support-language-only implementation evidence.`);
    }

    if (
      record.category === "ai-generated-package-writer-module-test-plan" &&
      !record.preservesAiGeneratedPackageWriterModuleTestPlan
    ) {
      errors.push(`AI generated package writer module test plan record ${record.recordId} must preserve module test plans.`);
    }

    if (
      record.category === "ai-generated-package-writer-module-test-plan" &&
      !record.preservesAiGeneratedPackageWriterImplementationReadiness
    ) {
      errors.push(`AI generated package writer module test plan record ${record.recordId} must preserve implementation readiness links.`);
    }

    if (
      record.category === "ai-generated-package-writer-module-test-plan" &&
      !record.requiresPackageWriterModuleTestSuites
    ) {
      errors.push(`AI generated package writer module test plan record ${record.recordId} must require module test suites.`);
    }

    if (
      record.category === "ai-generated-package-writer-module-test-plan" &&
      !record.requiresPackageWriterTestEvidence
    ) {
      errors.push(`AI generated package writer module test plan record ${record.recordId} must require writer test evidence.`);
    }

    if (
      record.category === "ai-generated-package-writer-module-test-plan" &&
      !record.blocksPackageWriterTestExecution
    ) {
      errors.push(`AI generated package writer module test plan record ${record.recordId} must block package writer test execution.`);
    }

    if (record.category === "ai-generated-package-writer-module-test-plan" && !record.blocksPlaywrightRun) {
      errors.push(`AI generated package writer module test plan record ${record.recordId} must block writer mutation browser runs.`);
    }

    if (record.category === "ai-generated-package-writer-module-test-plan" && !record.blocksAppFileWrite) {
      errors.push(`AI generated package writer module test plan record ${record.recordId} must block app file patches.`);
    }

    if (
      record.category === "ai-generated-package-writer-module-test-plan" &&
      !record.blocksGeneratedPackageJsonWrite
    ) {
      errors.push(`AI generated package writer module test plan record ${record.recordId} must block generated package JSON writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-module-test-plan" &&
      !record.blocksGeneratedPackageRouteWrite
    ) {
      errors.push(`AI generated package writer module test plan record ${record.recordId} must block route registry writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-module-test-plan" &&
      !record.blocksGeneratedPackagePlaylistWrite
    ) {
      errors.push(`AI generated package writer module test plan record ${record.recordId} must block media playlist writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-module-test-plan" &&
      !record.blocksGeneratedPackageLocalBundleWrite
    ) {
      errors.push(`AI generated package writer module test plan record ${record.recordId} must block local bundle writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-module-test-plan" &&
      !record.blocksGeneratedPackageAssignment
    ) {
      errors.push(`AI generated package writer module test plan record ${record.recordId} must block assignment writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-module-test-plan" &&
      !record.blocksSupportLanguageAssembly
    ) {
      errors.push(`AI generated package writer module test plan record ${record.recordId} must block support-language-only test passes.`);
    }

    if (
      record.category === "ai-generated-package-writer-test-evidence-packet" &&
      !record.preservesAiGeneratedPackageWriterTestEvidencePacket
    ) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must preserve test evidence packets.`);
    }

    if (
      record.category === "ai-generated-package-writer-test-evidence-packet" &&
      !record.preservesAiGeneratedPackageWriterModuleTestPlan
    ) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must preserve module test plan links.`);
    }

    if (
      record.category === "ai-generated-package-writer-test-evidence-packet" &&
      !record.requiresPackageWriterEvidenceLanes
    ) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must require evidence lanes.`);
    }

    if (
      record.category === "ai-generated-package-writer-test-evidence-packet" &&
      !record.requiresPackageWriterAcceptanceChecks
    ) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must require acceptance checks.`);
    }

    if (
      record.category === "ai-generated-package-writer-test-evidence-packet" &&
      !record.requiresPackageWriterTestEvidence
    ) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must require writer test evidence.`);
    }

    if (
      record.category === "ai-generated-package-writer-test-evidence-packet" &&
      !record.blocksPackageWriterTestExecution
    ) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must block package writer test execution.`);
    }

    if (record.category === "ai-generated-package-writer-test-evidence-packet" && !record.blocksPlaywrightRun) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must block writer mutation browser runs.`);
    }

    if (record.category === "ai-generated-package-writer-test-evidence-packet" && !record.blocksEvidenceUpload) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must block evidence upload.`);
    }

    if (
      record.category === "ai-generated-package-writer-test-evidence-packet" &&
      !record.blocksSignedApprovalCapture
    ) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must block signed approval capture.`);
    }

    if (record.category === "ai-generated-package-writer-test-evidence-packet" && !record.blocksAppFileWrite) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must block app file patches.`);
    }

    if (
      record.category === "ai-generated-package-writer-test-evidence-packet" &&
      !record.blocksGeneratedPackageJsonWrite
    ) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must block generated package JSON writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-test-evidence-packet" &&
      !record.blocksGeneratedPackageRouteWrite
    ) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must block route registry writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-test-evidence-packet" &&
      !record.blocksGeneratedPackagePlaylistWrite
    ) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must block media playlist writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-test-evidence-packet" &&
      !record.blocksGeneratedPackageLocalBundleWrite
    ) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must block local bundle writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-test-evidence-packet" &&
      !record.blocksGeneratedPackageAssignment
    ) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must block assignment writes.`);
    }

    if (
      record.category === "ai-generated-package-writer-test-evidence-packet" &&
      !record.blocksSupportLanguageAssembly
    ) {
      errors.push(`AI generated package writer test evidence packet record ${record.recordId} must block support-language-only evidence passes.`);
    }

    validateAiGeneratedPackageWriterTestHarnessPlanRecord(record, errors);
    validateAiGeneratedPackageWriterTestHarnessImplementationProposalRecord(record, errors);
    validateAiGeneratedPackageWriterHarnessImplementationDecisionRecord(record, errors);
    validateCodexPatchApprovalDecisionRecord(record, errors);
    validateAiPrototypeSignedApprovalPreflightRecord(record, errors);
    validateAiPrototypePatchAuthorizationReleaseLockRecord(record, errors);
    validateAiPrototypePatchImplementationWorkOrderRecord(record, errors);
    validateAiPrototypePatchChangeSetPreviewRecord(record, errors);
    validateTargetLanguageAudioApprovalRecord(record, errors);
    validateAiGeneratedPackageTeacherReviewPacketRecord(record, errors);

    if (record.category === "ai-reward-readiness-gate" && !record.preservesAiRewardReadinessGate) {
      errors.push(`AI reward readiness gate record ${record.recordId} must preserve generated reward readiness checks.`);
    }

    if (record.category === "ai-reward-readiness-gate" && !record.preservesDeterministicRewardRules) {
      errors.push(`AI reward readiness gate record ${record.recordId} must preserve deterministic reward rules.`);
    }

    if (record.category === "ai-reward-readiness-gate" && !record.blocksRewardPublishing) {
      errors.push(`AI reward readiness gate record ${record.recordId} must block reward publishing.`);
    }

    if (record.category === "ai-reward-readiness-gate" && !record.blocksCollectionInventoryWrite) {
      errors.push(`AI reward readiness gate record ${record.recordId} must block collection inventory writes.`);
    }

    if (record.category === "ai-reward-readiness-gate" && !record.blocksGeneratedSurpriseRewards) {
      errors.push(`AI reward readiness gate record ${record.recordId} must block generated surprise rewards.`);
    }

    if (record.category === "ai-reward-readiness-gate" && !record.blocksSpinWheelTicketIssuance) {
      errors.push(`AI reward readiness gate record ${record.recordId} must block Spin Wheel ticket issuance.`);
    }

    if (record.category === "ai-reward-readiness-gate" && !record.blocksAvatarEvolutionWrite) {
      errors.push(`AI reward readiness gate record ${record.recordId} must block avatar evolution writes.`);
    }

    if (record.category === "ai-reward-readiness-gate" && !record.requiresAiDraftCorrectionQueueClearance) {
      errors.push(`AI reward readiness gate record ${record.recordId} must require correction queue clearance.`);
    }

    if (
      record.category === "ai-generated-publish-readiness-gate" &&
      !record.preservesAiGeneratedPublishReadinessGate
    ) {
      errors.push(`AI generated publish readiness gate record ${record.recordId} must preserve publish readiness checks.`);
    }

    if (record.category === "ai-generated-publish-readiness-gate" && !record.requiresAiDraftCorrectionQueueClearance) {
      errors.push(`AI generated publish readiness gate record ${record.recordId} must require correction queue clearance.`);
    }

    if (record.category === "ai-generated-publish-readiness-gate" && !record.requiresVerifierPacketApproval) {
      errors.push(`AI generated publish readiness gate record ${record.recordId} must require verifier packet approval.`);
    }

    if (record.category === "ai-generated-publish-readiness-gate" && !record.requiresManifestCompleteness) {
      errors.push(`AI generated publish readiness gate record ${record.recordId} must require manifest completeness.`);
    }

    if (record.category === "ai-generated-publish-readiness-gate" && !record.preservesAiRewardReadinessGate) {
      errors.push(`AI generated publish readiness gate record ${record.recordId} must preserve reward readiness state.`);
    }

    if (record.category === "ai-generated-publish-readiness-gate" && !record.requiresReleaseControlBinding) {
      errors.push(`AI generated publish readiness gate record ${record.recordId} must require release-control binding.`);
    }

    if (record.category === "ai-generated-publish-readiness-gate" && !record.requiresTeacherApprovalLedger) {
      errors.push(`AI generated publish readiness gate record ${record.recordId} must require teacher approval ledger capture.`);
    }

    if (record.category === "ai-generated-publish-readiness-gate" && !record.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generated publish readiness gate record ${record.recordId} must block route registry writes.`);
    }

    if (record.category === "ai-generated-publish-readiness-gate" && !record.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generated publish readiness gate record ${record.recordId} must block media playlist writes.`);
    }

    if (record.category === "ai-generated-publish-readiness-gate" && !record.blocksGeneratedPackageAssignment) {
      errors.push(`AI generated publish readiness gate record ${record.recordId} must block assignment writes.`);
    }

    if (record.category === "ai-generated-publish-readiness-gate" && !record.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generated publish readiness gate record ${record.recordId} must block local bundle writes.`);
    }

    if (record.category === "ai-generated-publish-readiness-gate" && !record.blocksStudentReadyMarker) {
      errors.push(`AI generated publish readiness gate record ${record.recordId} must block student-ready markers.`);
    }

    if (record.category === "ai-generator-tenant-coverage-gate" && !record.preservesAiGeneratorTenantCoverageGate) {
      errors.push(`AI generator tenant coverage gate record ${record.recordId} must preserve tenant coverage checks.`);
    }

    if (record.category === "ai-generator-tenant-coverage-gate" && !record.requiresTenantSpecificGeneratorRecords) {
      errors.push(`AI generator tenant coverage gate record ${record.recordId} must require tenant-specific generator records.`);
    }

    if (record.category === "ai-generator-tenant-coverage-gate" && !record.blocksGeneratorRequestSubmission) {
      errors.push(`AI generator tenant coverage gate record ${record.recordId} must block generator request submission.`);
    }

    if (record.category === "ai-generator-tenant-coverage-gate" && !record.blocksLiveModelCall) {
      errors.push(`AI generator tenant coverage gate record ${record.recordId} must block live model calls.`);
    }

    if (record.category === "ai-generator-tenant-coverage-gate" && !record.blocksVerifierSubmission) {
      errors.push(`AI generator tenant coverage gate record ${record.recordId} must block verifier submission.`);
    }

    if (record.category === "ai-generator-tenant-coverage-gate" && !record.blocksGeneratedPackageAssembly) {
      errors.push(`AI generator tenant coverage gate record ${record.recordId} must block generated package assembly.`);
    }

    if (record.category === "ai-generator-tenant-coverage-gate" && !record.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generator tenant coverage gate record ${record.recordId} must block route registry writes.`);
    }

    if (record.category === "ai-generator-tenant-coverage-gate" && !record.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generator tenant coverage gate record ${record.recordId} must block media playlist writes.`);
    }

    if (record.category === "ai-generator-tenant-coverage-gate" && !record.blocksGeneratedPackageAssignment) {
      errors.push(`AI generator tenant coverage gate record ${record.recordId} must block assignment writes.`);
    }

    if (record.category === "ai-generator-tenant-coverage-gate" && !record.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generator tenant coverage gate record ${record.recordId} must block local bundle writes.`);
    }

    if (record.category === "ai-generator-tenant-coverage-gate" && !record.blocksStudentReadyMarker) {
      errors.push(`AI generator tenant coverage gate record ${record.recordId} must block student-ready markers.`);
    }

    if (record.category === "ai-generator-review-summary" && !record.preservesAiGeneratorReviewSummary) {
      errors.push(`AI generator review summary record ${record.recordId} must preserve generator review summary rollups.`);
    }

    if (record.category === "ai-generator-review-summary" && !record.preservesGeneratorSectionReadiness) {
      errors.push(`AI generator review summary record ${record.recordId} must preserve section readiness.`);
    }

    if (record.category === "ai-generator-review-summary" && !record.requiresGeneratorPrimaryBlockers) {
      errors.push(`AI generator review summary record ${record.recordId} must require primary blockers.`);
    }

    if (record.category === "ai-generator-review-summary" && !record.requiresGeneratorNextRecords) {
      errors.push(`AI generator review summary record ${record.recordId} must require next required records.`);
    }

    if (record.category === "ai-generator-review-summary" && !record.blocksLiveModelCall) {
      errors.push(`AI generator review summary record ${record.recordId} must block live model calls.`);
    }

    if (record.category === "ai-generator-review-summary" && !record.blocksAppPatchGeneration) {
      errors.push(`AI generator review summary record ${record.recordId} must block app patch generation.`);
    }

    if (record.category === "ai-generator-review-summary" && !record.blocksGeneratedPackageAssembly) {
      errors.push(`AI generator review summary record ${record.recordId} must block generated package assembly.`);
    }

    if (record.category === "ai-generator-review-summary" && !record.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generator review summary record ${record.recordId} must block route registry writes.`);
    }

    if (record.category === "ai-generator-review-summary" && !record.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generator review summary record ${record.recordId} must block media playlist writes.`);
    }

    if (record.category === "ai-generator-review-summary" && !record.blocksGeneratedPackageAssignment) {
      errors.push(`AI generator review summary record ${record.recordId} must block assignment writes.`);
    }

    if (record.category === "ai-generator-review-summary" && !record.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generator review summary record ${record.recordId} must block local bundle writes.`);
    }

    if (record.category === "ai-generator-review-summary" && !record.blocksStudentReadyMarker) {
      errors.push(`AI generator review summary record ${record.recordId} must block student-ready markers.`);
    }

    if (record.category === "ai-generator-reviewer-runbook" && !record.preservesAiGeneratorReviewerRunbook) {
      errors.push(`AI generator reviewer runbook record ${record.recordId} must preserve reviewer runbook guidance.`);
    }

    if (record.category === "ai-generator-reviewer-runbook" && !record.preservesGeneratorReviewOrder) {
      errors.push(`AI generator reviewer runbook record ${record.recordId} must preserve human review order.`);
    }

    if (record.category === "ai-generator-reviewer-runbook" && !record.requiresGeneratorRunbookEvidence) {
      errors.push(`AI generator reviewer runbook record ${record.recordId} must require evidence review.`);
    }

    if (record.category === "ai-generator-reviewer-runbook" && !record.requiresGeneratorRunbookRequiredRecords) {
      errors.push(`AI generator reviewer runbook record ${record.recordId} must require linked source records.`);
    }

    if (record.category === "ai-generator-reviewer-runbook" && !record.blocksGeneratorRunbookShortcuts) {
      errors.push(`AI generator reviewer runbook record ${record.recordId} must block shortcut actions.`);
    }

    if (record.category === "ai-generator-reviewer-runbook" && !record.blocksLiveModelCall) {
      errors.push(`AI generator reviewer runbook record ${record.recordId} must block live model calls.`);
    }

    if (record.category === "ai-generator-reviewer-runbook" && !record.blocksAppPatchGeneration) {
      errors.push(`AI generator reviewer runbook record ${record.recordId} must block app patch generation.`);
    }

    if (record.category === "ai-generator-reviewer-runbook" && !record.blocksGeneratedPackageAssembly) {
      errors.push(`AI generator reviewer runbook record ${record.recordId} must block generated package assembly.`);
    }

    if (record.category === "ai-generator-reviewer-runbook" && !record.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generator reviewer runbook record ${record.recordId} must block route registry writes.`);
    }

    if (record.category === "ai-generator-reviewer-runbook" && !record.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generator reviewer runbook record ${record.recordId} must block media playlist writes.`);
    }

    if (record.category === "ai-generator-reviewer-runbook" && !record.blocksGeneratedPackageAssignment) {
      errors.push(`AI generator reviewer runbook record ${record.recordId} must block assignment writes.`);
    }

    if (record.category === "ai-generator-reviewer-runbook" && !record.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generator reviewer runbook record ${record.recordId} must block local bundle writes.`);
    }

    if (record.category === "ai-generator-reviewer-runbook" && !record.blocksStudentReadyMarker) {
      errors.push(`AI generator reviewer runbook record ${record.recordId} must block student-ready markers.`);
    }

    if (record.category === "ai-generator-responsibility-matrix" && !record.preservesAiGeneratorResponsibilityMatrix) {
      errors.push(`AI generator responsibility matrix record ${record.recordId} must preserve responsibility matrices.`);
    }

    if (record.category === "ai-generator-responsibility-matrix" && !record.preservesGeneratorRoleOwnership) {
      errors.push(`AI generator responsibility matrix record ${record.recordId} must preserve role ownership.`);
    }

    if (record.category === "ai-generator-responsibility-matrix" && !record.requiresGeneratorHandoffRecords) {
      errors.push(`AI generator responsibility matrix record ${record.recordId} must require handoff records.`);
    }

    if (record.category === "ai-generator-responsibility-matrix" && !record.blocksExternalBuilderAuthority) {
      errors.push(`AI generator responsibility matrix record ${record.recordId} must block external builder authority.`);
    }

    if (record.category === "ai-generator-responsibility-matrix" && !record.blocksGeneratorResponsibilityShortcuts) {
      errors.push(`AI generator responsibility matrix record ${record.recordId} must block responsibility shortcut actions.`);
    }

    if (record.category === "ai-generator-responsibility-matrix" && !record.blocksLiveModelCall) {
      errors.push(`AI generator responsibility matrix record ${record.recordId} must block live model calls.`);
    }

    if (record.category === "ai-generator-responsibility-matrix" && !record.blocksAppPatchGeneration) {
      errors.push(`AI generator responsibility matrix record ${record.recordId} must block app patch generation.`);
    }

    if (record.category === "ai-generator-responsibility-matrix" && !record.blocksGeneratedPackageAssembly) {
      errors.push(`AI generator responsibility matrix record ${record.recordId} must block generated package assembly.`);
    }

    if (record.category === "ai-generator-responsibility-matrix" && !record.blocksGeneratedPackageRouteWrite) {
      errors.push(`AI generator responsibility matrix record ${record.recordId} must block route registry writes.`);
    }

    if (record.category === "ai-generator-responsibility-matrix" && !record.blocksGeneratedPackagePlaylistWrite) {
      errors.push(`AI generator responsibility matrix record ${record.recordId} must block media playlist writes.`);
    }

    if (record.category === "ai-generator-responsibility-matrix" && !record.blocksGeneratedPackageAssignment) {
      errors.push(`AI generator responsibility matrix record ${record.recordId} must block assignment writes.`);
    }

    if (record.category === "ai-generator-responsibility-matrix" && !record.blocksGeneratedPackageLocalBundleWrite) {
      errors.push(`AI generator responsibility matrix record ${record.recordId} must block local bundle writes.`);
    }

    if (record.category === "ai-generator-responsibility-matrix" && !record.blocksStudentReadyMarker) {
      errors.push(`AI generator responsibility matrix record ${record.recordId} must block student-ready markers.`);
    }

    if (record.category === "teacher-assignment-rollout-gate" && !record.preservesTeacherAssignmentRolloutGate) {
      errors.push(`Teacher assignment rollout gate ${record.recordId} must preserve rollout status, gate evidence, blockers, and scheduling rules.`);
    }

    if (record.category === "teacher-assignment-rollout-gate" && !record.blocksStudentLaunchAction) {
      errors.push(`Teacher assignment rollout gate ${record.recordId} must block student launch actions.`);
    }

    if (record.category === "teacher-assignment-rollout-gate" && !record.blocksLiveClassroomLaunch) {
      errors.push(`Teacher assignment rollout gate ${record.recordId} must block live classroom launch.`);
    }

    if (record.category === "teacher-assignment-rollout-gate" && !record.blocksRealLearnerDataCollection) {
      errors.push(`Teacher assignment rollout gate ${record.recordId} must block real learner data collection.`);
    }

    if (record.category === "teacher-assignment-rollout-gate" && !record.blocksLiveReportExport) {
      errors.push(`Teacher assignment rollout gate ${record.recordId} must block live report export.`);
    }

    if (record.category === "private-assignment-link" && !record.preservesPrivateAssignmentLink) {
      errors.push(`Private assignment link ${record.recordId} must preserve tenant scope, assignment binding, student target, access rules, and safety boundaries.`);
    }

    if (record.category === "private-assignment-link" && !record.blocksPublicSharing) {
      errors.push(`Private assignment link ${record.recordId} must block public sharing.`);
    }

    if (record.category === "private-assignment-link" && !record.blocksIframeEmbed) {
      errors.push(`Private assignment link ${record.recordId} must block iframe embed use.`);
    }

    if (record.category === "private-assignment-link" && !record.blocksTeacherAdminControlExposure) {
      errors.push(`Private assignment link ${record.recordId} must block teacher/admin control exposure.`);
    }

    if (record.category === "private-assignment-link" && !record.blocksRealLearnerDataCollection) {
      errors.push(`Private assignment link ${record.recordId} must block real learner data collection.`);
    }

    if (record.category === "private-assignment-link" && !record.blocksLiveReportExport) {
      errors.push(`Private assignment link ${record.recordId} must block live report export.`);
    }

    if (record.category === "class-roster-plan" && !record.preservesClassRosterPlan) {
      errors.push(`Class roster plan ${record.recordId} must preserve roster ids, learner code slots, data boundaries, readiness, and pilot blockers.`);
    }

    if (record.category === "class-roster-plan" && !record.blocksRealLearnerNameStorage) {
      errors.push(`Class roster plan ${record.recordId} must block real learner name storage.`);
    }

    if (record.category === "class-roster-plan" && !record.blocksFamilyContactStorage) {
      errors.push(`Class roster plan ${record.recordId} must block family contact storage.`);
    }

    if (record.category === "class-roster-plan" && !record.blocksRawAudioStorage) {
      errors.push(`Class roster plan ${record.recordId} must block raw audio storage.`);
    }

    if (record.category === "class-roster-plan" && !record.blocksTranscriptStorage) {
      errors.push(`Class roster plan ${record.recordId} must block transcript storage.`);
    }

    if (record.category === "class-roster-plan" && !record.blocksLiveReportExport) {
      errors.push(`Class roster plan ${record.recordId} must block live report export.`);
    }

    if (record.category === "source-extraction-review-packet" && !record.preservesSourceExtractionReviewPacket) {
      errors.push(`Source extraction review packet ${record.recordId} must preserve extraction source, OCR confidence, segmentation review, candidate payloads, and review blockers.`);
    }

    if (record.category === "source-extraction-review-packet" && !record.blocksUnreviewedExtractionPromotion) {
      errors.push(`Source extraction review packet ${record.recordId} must block unreviewed extraction promotion.`);
    }

    if (record.category === "source-extraction-review-packet" && !record.blocksRawPdfStudentPayload) {
      errors.push(`Source extraction review packet ${record.recordId} must block raw PDF student payloads.`);
    }

    if (record.category === "source-extraction-review-packet" && !record.blocksUnreviewedOcrAssignment) {
      errors.push(`Source extraction review packet ${record.recordId} must block unreviewed OCR assignments.`);
    }

    if (record.category === "source-extraction-review-packet" && !record.blocksDirectStudentAssignment) {
      errors.push(`Source extraction review packet ${record.recordId} must block direct student assignment.`);
    }

    if (record.category === "upload-file-policy-profile" && !record.preservesUploadFilePolicyProfile) {
      errors.push(`Upload file policy profile ${record.recordId} must preserve accepted file kinds, MIME rules, size limits, scan requirements, rights requirements, and blocked shortcuts.`);
    }

    if (record.category === "upload-file-policy-profile" && !record.requiresScanAndFilePolicyPacket) {
      errors.push(`Upload file policy profile ${record.recordId} must require a scan and file policy packet.`);
    }

    if (record.category === "upload-file-policy-profile" && !record.blocksUploadWithoutFilePolicy) {
      errors.push(`Upload file policy profile ${record.recordId} must block uploads without accepted file policy.`);
    }

    if (record.category === "upload-file-policy-profile" && !record.blocksUnsafeMimeType) {
      errors.push(`Upload file policy profile ${record.recordId} must block unsafe MIME types.`);
    }

    if (record.category === "upload-file-policy-profile" && !record.blocksOversizeUpload) {
      errors.push(`Upload file policy profile ${record.recordId} must block oversize uploads.`);
    }

    if (record.category === "upload-file-policy-profile" && !record.blocksUncheckedFileScan) {
      errors.push(`Upload file policy profile ${record.recordId} must block unchecked file scans.`);
    }

    if (record.category === "upload-file-policy-profile" && !record.blocksStudentFacingUploadUse) {
      errors.push(`Upload file policy profile ${record.recordId} must block student-facing uploaded file use.`);
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

    if (record.category === "reviewer-identity-signature-gate" && !record.preservesReviewerIdentitySignatureGate) {
      errors.push(`Reviewer identity signature gate record ${record.recordId} must preserve reviewer identity, approval intent, signature policy, and audit retention gates.`);
    }

    if (record.category === "reviewer-identity-signature-gate" && !record.blocksApprovalCapture) {
      errors.push(`Reviewer identity signature gate record ${record.recordId} must block approval capture.`);
    }

    if (record.category === "reviewer-identity-signature-gate" && !record.blocksSignatureAttachmentUpload) {
      errors.push(`Reviewer identity signature gate record ${record.recordId} must block signature attachment upload.`);
    }

    if (record.category === "reviewer-identity-signature-gate" && !record.blocksApprovalDrivenAssignment) {
      errors.push(`Reviewer identity signature gate record ${record.recordId} must block student assignment from approval.`);
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

    if (record.category === "school-launch-policy-gate" && !record.preservesSchoolLaunchPolicyGate) {
      errors.push(`School launch policy gate record ${record.recordId} must preserve school policy launch gates.`);
    }

    if (record.category === "school-launch-policy-gate" && !record.blocksPolicyAcceptanceWorkflow) {
      errors.push(`School launch policy gate record ${record.recordId} must block policy acceptance workflows.`);
    }

    if (record.category === "school-launch-policy-gate" && !record.blocksLaunchWithoutSchoolPolicy) {
      errors.push(`School launch policy gate record ${record.recordId} must block launch without school policy.`);
    }

    if (record.category === "school-launch-policy-gate" && !record.blocksRealLearnerDataCollection) {
      errors.push(`School launch policy gate record ${record.recordId} must block real learner data collection.`);
    }

    if (record.category === "school-launch-policy-gate" && !record.blocksLiveReportExport) {
      errors.push(`School launch policy gate record ${record.recordId} must block live report export.`);
    }

    if (record.category === "school-policy-handoff-packet" && !record.preservesSchoolPolicyHandoffPacket) {
      errors.push(`School policy handoff packet record ${record.recordId} must preserve packet sections, evidence needs, deferred decisions, and blocked actions.`);
    }

    if (record.category === "school-policy-handoff-packet" && !record.blocksPolicyHandoffAcceptance) {
      errors.push(`School policy handoff packet record ${record.recordId} must block policy acceptance from handoff packets.`);
    }

    if (record.category === "school-policy-handoff-packet" && !record.blocksHandoffEvidenceExport) {
      errors.push(`School policy handoff packet record ${record.recordId} must block evidence export from handoff packets.`);
    }

    if (record.category === "school-policy-handoff-packet" && !record.blocksLiveClassroomLaunch) {
      errors.push(`School policy handoff packet record ${record.recordId} must block live classroom launch.`);
    }

    if (record.category === "school-policy-handoff-packet" && !record.blocksLaunchWithoutSchoolPolicy) {
      errors.push(`School policy handoff packet record ${record.recordId} must block launch without school policy.`);
    }

    if (record.category === "school-policy-acceptance-preflight" && !record.preservesSchoolPolicyAcceptancePreflight) {
      errors.push(`School policy acceptance preflight record ${record.recordId} must preserve missing acceptance requirements, blocked actions, minimum acceptance fields, and operating rules.`);
    }

    if (record.category === "school-policy-acceptance-preflight" && !record.blocksPreflightPolicyAcceptance) {
      errors.push(`School policy acceptance preflight record ${record.recordId} must block policy acceptance from preflight records.`);
    }

    if (record.category === "school-policy-acceptance-preflight" && !record.blocksPreflightEvidenceExport) {
      errors.push(`School policy acceptance preflight record ${record.recordId} must block evidence export from preflight records.`);
    }

    if (record.category === "school-policy-acceptance-preflight" && !record.blocksPreflightStorageActivation) {
      errors.push(`School policy acceptance preflight record ${record.recordId} must block storage activation from preflight records.`);
    }

    if (record.category === "school-policy-acceptance-preflight" && !record.blocksPreflightLaunchReadyStatus) {
      errors.push(`School policy acceptance preflight record ${record.recordId} must block launch-ready status from preflight records.`);
    }

    if (record.category === "school-policy-acceptance-preflight" && !record.blocksLiveClassroomLaunch) {
      errors.push(`School policy acceptance preflight record ${record.recordId} must block live classroom launch.`);
    }

    if (record.category === "school-policy-text-pack" && !record.preservesSchoolPolicyTextPack) {
      errors.push(`School policy text pack record ${record.recordId} must preserve policy clauses, minimum version fields, blocked actions, and review rules.`);
    }

    if (record.category === "school-policy-text-pack" && !record.blocksPolicyTextAcceptance) {
      errors.push(`School policy text pack record ${record.recordId} must block policy acceptance from text packs.`);
    }

    if (record.category === "school-policy-text-pack" && !record.blocksPolicyTextSignatureCapture) {
      errors.push(`School policy text pack record ${record.recordId} must block signature capture from text packs.`);
    }

    if (record.category === "school-policy-text-pack" && !record.blocksPolicyTextEvidenceExport) {
      errors.push(`School policy text pack record ${record.recordId} must block evidence export from text packs.`);
    }

    if (record.category === "school-policy-text-pack" && !record.blocksPolicyTextStorageActivation) {
      errors.push(`School policy text pack record ${record.recordId} must block storage activation from text packs.`);
    }

    if (record.category === "school-policy-text-pack" && !record.blocksPolicyTextLaunchReadyStatus) {
      errors.push(`School policy text pack record ${record.recordId} must block launch-ready status from text packs.`);
    }

    if (record.category === "school-policy-text-pack" && !record.blocksLiveClassroomLaunch) {
      errors.push(`School policy text pack record ${record.recordId} must block live classroom launch.`);
    }

    validatePackageAdoptionRecordPreview(record, errors);

    if (
      record.category === "school-policy-acceptance-record-preview" &&
      !record.preservesSchoolPolicyAcceptanceRecordPreview
    ) {
      errors.push(`School policy acceptance record preview ${record.recordId} must preserve minimum accepted-record fields, non-accepted markers, blocked actions, and review rules.`);
    }

    if (record.category === "school-policy-acceptance-record-preview" && !record.blocksAcceptedTermsStorage) {
      errors.push(`School policy acceptance record preview ${record.recordId} must block accepted terms storage.`);
    }

    if (record.category === "school-policy-acceptance-record-preview" && !record.blocksAcceptanceSignatureCapture) {
      errors.push(`School policy acceptance record preview ${record.recordId} must block acceptance signature capture.`);
    }

    if (record.category === "school-policy-acceptance-record-preview" && !record.blocksAcceptanceEvidenceExport) {
      errors.push(`School policy acceptance record preview ${record.recordId} must block acceptance evidence export.`);
    }

    if (record.category === "school-policy-acceptance-record-preview" && !record.blocksAcceptanceStorageActivation) {
      errors.push(`School policy acceptance record preview ${record.recordId} must block acceptance storage activation.`);
    }

    if (record.category === "school-policy-acceptance-record-preview" && !record.blocksAcceptanceLaunchReadyStatus) {
      errors.push(`School policy acceptance record preview ${record.recordId} must block acceptance launch-ready status.`);
    }

    if (record.category === "school-policy-acceptance-record-preview" && !record.blocksLiveClassroomLaunch) {
      errors.push(`School policy acceptance record preview ${record.recordId} must block live classroom launch.`);
    }

    if (
      record.category === "school-policy-revocation-rollback-preview" &&
      !record.preservesSchoolPolicyRevocationRollbackPreview
    ) {
      errors.push(`School policy revocation rollback preview ${record.recordId} must preserve revocation authority, rollback scope, QR effects, learner-data/report effects, media/local effects, premium feature effects, and blocked actions.`);
    }

    if (record.category === "school-policy-revocation-rollback-preview" && !record.blocksRevocationAction) {
      errors.push(`School policy revocation rollback preview ${record.recordId} must block revocation actions.`);
    }

    if (record.category === "school-policy-revocation-rollback-preview" && !record.blocksRollbackAction) {
      errors.push(`School policy revocation rollback preview ${record.recordId} must block rollback actions.`);
    }

    if (record.category === "school-policy-revocation-rollback-preview" && !record.blocksProductionQrRedirectMutation) {
      errors.push(`School policy revocation rollback preview ${record.recordId} must block production QR redirect mutation.`);
    }

    if (record.category === "school-policy-revocation-rollback-preview" && !record.blocksLearnerDataDeletionWorkflow) {
      errors.push(`School policy revocation rollback preview ${record.recordId} must block learner-data deletion workflows.`);
    }

    if (record.category === "school-policy-revocation-rollback-preview" && !record.blocksLiveReportExport) {
      errors.push(`School policy revocation rollback preview ${record.recordId} must block report export.`);
    }

    if (record.category === "school-policy-revocation-rollback-preview" && !record.blocksMediaReplacement) {
      errors.push(`School policy revocation rollback preview ${record.recordId} must block media replacement.`);
    }

    if (record.category === "school-policy-revocation-rollback-preview" && !record.blocksLocalBundleDeactivation) {
      errors.push(`School policy revocation rollback preview ${record.recordId} must block local bundle deactivation.`);
    }

    if (record.category === "school-policy-revocation-rollback-preview" && !record.blocksAiTutorEntitlementChange) {
      errors.push(`School policy revocation rollback preview ${record.recordId} must block AI Tutor entitlement changes.`);
    }

    if (record.category === "school-policy-revocation-rollback-preview" && !record.blocksLiveClassroomLaunch) {
      errors.push(`School policy revocation rollback preview ${record.recordId} must block live classroom launch.`);
    }

    if (
      record.category === "school-policy-rollback-impact-matrix" &&
      !record.preservesSchoolPolicyRollbackImpactMatrix
    ) {
      errors.push(`School policy rollback impact matrix ${record.recordId} must preserve affected records, required evidence, blocked actions, and matrix rules.`);
    }

    if (record.category === "school-policy-rollback-impact-matrix" && !record.blocksReleaseStateMutation) {
      errors.push(`School policy rollback impact matrix ${record.recordId} must block release-state mutation.`);
    }

    if (record.category === "school-policy-rollback-impact-matrix" && !record.blocksProductionQrRedirectMutation) {
      errors.push(`School policy rollback impact matrix ${record.recordId} must block production QR redirect mutation.`);
    }

    if (record.category === "school-policy-rollback-impact-matrix" && !record.blocksLearnerDataDeletionWorkflow) {
      errors.push(`School policy rollback impact matrix ${record.recordId} must block learner-data deletion workflows.`);
    }

    if (record.category === "school-policy-rollback-impact-matrix" && !record.blocksLiveReportExport) {
      errors.push(`School policy rollback impact matrix ${record.recordId} must block report export.`);
    }

    if (record.category === "school-policy-rollback-impact-matrix" && !record.blocksMediaReplacement) {
      errors.push(`School policy rollback impact matrix ${record.recordId} must block media replacement.`);
    }

    if (record.category === "school-policy-rollback-impact-matrix" && !record.blocksLocalBundleDeactivation) {
      errors.push(`School policy rollback impact matrix ${record.recordId} must block local bundle deactivation.`);
    }

    if (record.category === "school-policy-rollback-impact-matrix" && !record.blocksAiTutorEntitlementChange) {
      errors.push(`School policy rollback impact matrix ${record.recordId} must block AI Tutor entitlement changes.`);
    }

    if (record.category === "school-policy-rollback-impact-matrix" && !record.blocksLiveClassroomLaunch) {
      errors.push(`School policy rollback impact matrix ${record.recordId} must block live classroom launch.`);
    }

    if (record.category === "school-rollback-safe-fallback-plan" && !record.preservesSchoolRollbackSafeFallbackPlan) {
      errors.push(`School rollback safe fallback plan ${record.recordId} must preserve safe messages, route fallbacks, blocked actions, and fallback rules.`);
    }

    if (record.category === "school-rollback-safe-fallback-plan" && !record.blocksProductionQrRedirectMutation) {
      errors.push(`School rollback safe fallback plan ${record.recordId} must block production QR redirect mutation.`);
    }

    if (record.category === "school-rollback-safe-fallback-plan" && !record.blocksLiveNotification) {
      errors.push(`School rollback safe fallback plan ${record.recordId} must block live notifications.`);
    }

    if (record.category === "school-rollback-safe-fallback-plan" && !record.blocksLiveClassroomLaunch) {
      errors.push(`School rollback safe fallback plan ${record.recordId} must block live classroom launch.`);
    }

    if (record.category === "school-rollback-safe-fallback-plan" && !record.blocksLiveReportExport) {
      errors.push(`School rollback safe fallback plan ${record.recordId} must block report export.`);
    }

    if (record.category === "school-rollback-safe-fallback-plan" && !record.blocksMediaReplacement) {
      errors.push(`School rollback safe fallback plan ${record.recordId} must block media replacement.`);
    }

    if (record.category === "school-rollback-safe-fallback-plan" && !record.blocksLocalBundleDeactivation) {
      errors.push(`School rollback safe fallback plan ${record.recordId} must block local bundle deactivation.`);
    }

    if (record.category === "school-rollback-safe-fallback-plan" && !record.blocksStudentReassignment) {
      errors.push(`School rollback safe fallback plan ${record.recordId} must block student reassignment.`);
    }

    if (
      record.category === "school-rollback-safe-fallback-preflight" &&
      !record.preservesSchoolRollbackSafeFallbackPreflight
    ) {
      errors.push(`School rollback safe fallback preflight ${record.recordId} must preserve preflight lanes, minimum activation fields, blocked actions, and preflight rules.`);
    }

    if (record.category === "school-rollback-safe-fallback-preflight" && !record.blocksReleaseStateMutation) {
      errors.push(`School rollback safe fallback preflight ${record.recordId} must block release-state mutation.`);
    }

    if (record.category === "school-rollback-safe-fallback-preflight" && !record.blocksProductionQrRedirectMutation) {
      errors.push(`School rollback safe fallback preflight ${record.recordId} must block production QR redirect mutation.`);
    }

    if (record.category === "school-rollback-safe-fallback-preflight" && !record.blocksLiveNotification) {
      errors.push(`School rollback safe fallback preflight ${record.recordId} must block live notifications.`);
    }

    if (record.category === "school-rollback-safe-fallback-preflight" && !record.blocksLiveClassroomLaunch) {
      errors.push(`School rollback safe fallback preflight ${record.recordId} must block live classroom launch.`);
    }

    if (record.category === "school-rollback-safe-fallback-preflight" && !record.blocksLiveReportExport) {
      errors.push(`School rollback safe fallback preflight ${record.recordId} must block report export.`);
    }

    if (record.category === "school-rollback-safe-fallback-preflight" && !record.blocksMediaReplacement) {
      errors.push(`School rollback safe fallback preflight ${record.recordId} must block media replacement.`);
    }

    if (record.category === "school-rollback-safe-fallback-preflight" && !record.blocksLocalBundleDeactivation) {
      errors.push(`School rollback safe fallback preflight ${record.recordId} must block local bundle deactivation.`);
    }

    if (record.category === "school-rollback-safe-fallback-preflight" && !record.blocksStudentReassignment) {
      errors.push(`School rollback safe fallback preflight ${record.recordId} must block student reassignment.`);
    }

    if (
      record.category === "school-rollback-safe-fallback-activation-preview" &&
      !record.preservesSchoolRollbackSafeFallbackActivationPreview
    ) {
      errors.push(`School rollback safe fallback activation preview ${record.recordId} must preserve minimum activation fields, non-activated markers, blocked actions, and review rules.`);
    }

    if (record.category === "school-rollback-safe-fallback-activation-preview" && !record.blocksReleaseStateMutation) {
      errors.push(`School rollback safe fallback activation preview ${record.recordId} must block release-state mutation.`);
    }

    if (record.category === "school-rollback-safe-fallback-activation-preview" && !record.blocksProductionQrRedirectMutation) {
      errors.push(`School rollback safe fallback activation preview ${record.recordId} must block production QR redirect mutation.`);
    }

    if (record.category === "school-rollback-safe-fallback-activation-preview" && !record.blocksLiveNotification) {
      errors.push(`School rollback safe fallback activation preview ${record.recordId} must block live notifications.`);
    }

    if (record.category === "school-rollback-safe-fallback-activation-preview" && !record.blocksLiveClassroomLaunch) {
      errors.push(`School rollback safe fallback activation preview ${record.recordId} must block live classroom launch.`);
    }

    if (record.category === "school-rollback-safe-fallback-activation-preview" && !record.blocksLiveReportExport) {
      errors.push(`School rollback safe fallback activation preview ${record.recordId} must block report export.`);
    }

    if (record.category === "school-rollback-safe-fallback-activation-preview" && !record.blocksMediaReplacement) {
      errors.push(`School rollback safe fallback activation preview ${record.recordId} must block media replacement.`);
    }

    if (record.category === "school-rollback-safe-fallback-activation-preview" && !record.blocksLocalBundleDeactivation) {
      errors.push(`School rollback safe fallback activation preview ${record.recordId} must block local bundle deactivation.`);
    }

    if (record.category === "school-rollback-safe-fallback-activation-preview" && !record.blocksStudentReassignment) {
      errors.push(`School rollback safe fallback activation preview ${record.recordId} must block student reassignment.`);
    }

    if (
      record.category === "school-rollback-safe-fallback-restoration-preview" &&
      !record.preservesSchoolRollbackSafeFallbackRestorationPreview
    ) {
      errors.push(`School rollback safe fallback restoration preview ${record.recordId} must preserve minimum restoration fields, non-restored markers, blocked actions, and review rules.`);
    }

    if (record.category === "school-rollback-safe-fallback-restoration-preview" && !record.blocksReleaseStateMutation) {
      errors.push(`School rollback safe fallback restoration preview ${record.recordId} must block release-state mutation.`);
    }

    if (record.category === "school-rollback-safe-fallback-restoration-preview" && !record.blocksProductionQrRedirectMutation) {
      errors.push(`School rollback safe fallback restoration preview ${record.recordId} must block production QR redirect mutation.`);
    }

    if (record.category === "school-rollback-safe-fallback-restoration-preview" && !record.blocksLiveNotification) {
      errors.push(`School rollback safe fallback restoration preview ${record.recordId} must block live notifications.`);
    }

    if (record.category === "school-rollback-safe-fallback-restoration-preview" && !record.blocksLiveClassroomLaunch) {
      errors.push(`School rollback safe fallback restoration preview ${record.recordId} must block live classroom restart.`);
    }

    if (record.category === "school-rollback-safe-fallback-restoration-preview" && !record.blocksLiveReportExport) {
      errors.push(`School rollback safe fallback restoration preview ${record.recordId} must block report export.`);
    }

    if (record.category === "school-rollback-safe-fallback-restoration-preview" && !record.blocksMediaReplacement) {
      errors.push(`School rollback safe fallback restoration preview ${record.recordId} must block media restoration.`);
    }

    if (record.category === "school-rollback-safe-fallback-restoration-preview" && !record.blocksLocalBundleRestoration) {
      errors.push(`School rollback safe fallback restoration preview ${record.recordId} must block local bundle restoration.`);
    }

    if (record.category === "school-rollback-safe-fallback-restoration-preview" && !record.blocksStudentReassignment) {
      errors.push(`School rollback safe fallback restoration preview ${record.recordId} must block student reassignment.`);
    }

    if (record.supportsLocalDeployment && !record.recommendedFirstPilotStore.includes("local-classroom-store")) {
      errors.push(`Local-capable record ${record.recordId} must name the local classroom store path.`);
    }
  }

  return errors;
}

function validateAiGeneratedPackageWriterTestHarnessPlanRecord(
  record: DurableRecordContract,
  errors: string[],
): void {
  if (record.category !== "ai-generated-package-writer-test-harness-plan") {
    return;
  }

  const prefix = `AI generated package writer test harness plan record ${record.recordId}`;

  if (!record.preservesAiGeneratedPackageWriterTestHarnessPlan) {
    errors.push(`${prefix} must preserve test harness plans.`);
  }

  if (!record.preservesAiGeneratedPackageWriterTestEvidencePacket) {
    errors.push(`${prefix} must preserve test evidence packet links.`);
  }

  if (!record.requiresPackageWriterHarnessPhases) {
    errors.push(`${prefix} must require harness phases.`);
  }

  if (!record.requiresPackageWriterHarnessAdapters) {
    errors.push(`${prefix} must require harness adapters.`);
  }

  if (!record.requiresPackageWriterHarnessPrerequisites) {
    errors.push(`${prefix} must require harness prerequisites.`);
  }

  if (!record.requiresPackageWriterTestEvidence) {
    errors.push(`${prefix} must require writer test evidence.`);
  }

  if (!record.blocksPackageWriterTestExecution) {
    errors.push(`${prefix} must block package writer test execution.`);
  }

  if (!record.blocksPlaywrightRun) {
    errors.push(`${prefix} must block writer mutation browser runs.`);
  }

  if (!record.blocksEvidenceUpload) {
    errors.push(`${prefix} must block evidence upload.`);
  }

  if (!record.blocksSignedApprovalCapture) {
    errors.push(`${prefix} must block signed approval capture.`);
  }

  if (!record.blocksAppFileWrite) {
    errors.push(`${prefix} must block app file patches.`);
  }

  if (!record.blocksGeneratedPackageJsonWrite) {
    errors.push(`${prefix} must block generated package JSON writes.`);
  }

  if (!record.blocksGeneratedPackageRouteWrite) {
    errors.push(`${prefix} must block route registry writes.`);
  }

  if (!record.blocksGeneratedPackagePlaylistWrite) {
    errors.push(`${prefix} must block media playlist writes.`);
  }

  if (!record.blocksGeneratedPackageLocalBundleWrite) {
    errors.push(`${prefix} must block local bundle writes.`);
  }

  if (!record.blocksGeneratedPackageAssignment) {
    errors.push(`${prefix} must block assignment writes.`);
  }

  if (!record.blocksSupportLanguageAssembly) {
    errors.push(`${prefix} must block support-language-only harness passes.`);
  }
}

function validateAiGeneratedPackageWriterTestHarnessImplementationProposalRecord(
  record: DurableRecordContract,
  errors: string[],
): void {
  if (record.category !== "ai-generated-package-writer-test-harness-implementation-proposal") {
    return;
  }

  const prefix = `AI generated package writer test harness implementation proposal record ${record.recordId}`;

  if (!record.preservesAiGeneratedPackageWriterTestHarnessImplementationProposal) {
    errors.push(`${prefix} must preserve test harness implementation proposals.`);
  }

  if (!record.preservesAiGeneratedPackageWriterTestHarnessPlan) {
    errors.push(`${prefix} must preserve test harness plan links.`);
  }

  if (!record.requiresPackageWriterHarnessImplementationModuleScope) {
    errors.push(`${prefix} must require harness implementation module scope.`);
  }

  if (!record.requiresPackageWriterHarnessImplementationReviewGates) {
    errors.push(`${prefix} must require harness implementation review gates.`);
  }

  if (!record.requiresPackageWriterHarnessDryRunOnlyChecks) {
    errors.push(`${prefix} must require dry-run-only checks.`);
  }

  if (!record.requiresPackageWriterTestEvidence) {
    errors.push(`${prefix} must require writer test evidence.`);
  }

  if (!record.blocksPackageWriterTestExecution) {
    errors.push(`${prefix} must block package writer test execution.`);
  }

  if (!record.blocksPlaywrightRun) {
    errors.push(`${prefix} must block writer mutation browser runs.`);
  }

  if (!record.blocksEvidenceUpload) {
    errors.push(`${prefix} must block evidence upload.`);
  }

  if (!record.blocksSignedApprovalCapture) {
    errors.push(`${prefix} must block signed approval capture.`);
  }

  if (!record.blocksAppFileWrite) {
    errors.push(`${prefix} must block app file patches.`);
  }

  if (!record.blocksGeneratedPackageJsonWrite) {
    errors.push(`${prefix} must block generated package JSON writes.`);
  }

  if (!record.blocksGeneratedPackageRouteWrite) {
    errors.push(`${prefix} must block route registry writes.`);
  }

  if (!record.blocksGeneratedPackagePlaylistWrite) {
    errors.push(`${prefix} must block media playlist writes.`);
  }

  if (!record.blocksGeneratedPackageLocalBundleWrite) {
    errors.push(`${prefix} must block local bundle writes.`);
  }

  if (!record.blocksGeneratedPackageAssignment) {
    errors.push(`${prefix} must block assignment writes.`);
  }

  if (!record.blocksSupportLanguageAssembly) {
    errors.push(`${prefix} must block support-language-only harness passes.`);
  }
}

function validateAiGeneratedPackageWriterHarnessImplementationDecisionRecord(
  record: DurableRecordContract,
  errors: string[],
): void {
  if (record.category !== "ai-generated-package-writer-harness-implementation-decision") {
    return;
  }

  const prefix = `AI generated package writer harness implementation decision record ${record.recordId}`;

  if (!record.preservesAiGeneratedPackageWriterHarnessImplementationDecision) {
    errors.push(`${prefix} must preserve harness implementation decisions.`);
  }

  if (!record.preservesAiGeneratedPackageWriterTestHarnessImplementationProposal) {
    errors.push(`${prefix} must preserve harness implementation proposal links.`);
  }

  if (!record.requiresPackageWriterHarnessDecisionEvidence) {
    errors.push(`${prefix} must require decision evidence.`);
  }

  if (!record.requiresPackageWriterHarnessDecisionFileScope) {
    errors.push(`${prefix} must require decision file scope.`);
  }

  if (!record.requiresPackageWriterHarnessDecisionOptions) {
    errors.push(`${prefix} must require decision options.`);
  }

  if (!record.requiresReviewerIdentitySignatureGate) {
    errors.push(`${prefix} must require reviewer identity signature gates.`);
  }

  if (!record.blocksHarnessImplementationApproval) {
    errors.push(`${prefix} must block harness implementation approval.`);
  }

  if (!record.blocksHarnessImplementation) {
    errors.push(`${prefix} must block harness implementation.`);
  }

  if (!record.blocksPackageWriterTestExecution) {
    errors.push(`${prefix} must block package writer test execution.`);
  }

  if (!record.blocksPlaywrightRun) {
    errors.push(`${prefix} must block writer mutation browser runs.`);
  }

  if (!record.blocksEvidenceUpload) {
    errors.push(`${prefix} must block evidence upload.`);
  }

  if (!record.blocksSignedApprovalCapture) {
    errors.push(`${prefix} must block signed approval capture.`);
  }

  if (!record.blocksAppFileWrite) {
    errors.push(`${prefix} must block app file patches.`);
  }

  if (!record.blocksGeneratedPackageJsonWrite) {
    errors.push(`${prefix} must block generated package JSON writes.`);
  }

  if (!record.blocksGeneratedPackageRouteWrite) {
    errors.push(`${prefix} must block route registry writes.`);
  }

  if (!record.blocksGeneratedPackagePlaylistWrite) {
    errors.push(`${prefix} must block media playlist writes.`);
  }

  if (!record.blocksGeneratedPackageLocalBundleWrite) {
    errors.push(`${prefix} must block local bundle writes.`);
  }

  if (!record.blocksGeneratedPackageAssignment) {
    errors.push(`${prefix} must block assignment writes.`);
  }

  if (!record.blocksSupportLanguageAssembly) {
    errors.push(`${prefix} must block support-language-only implementation decisions.`);
  }
}

function validateCodexPatchApprovalDecisionRecord(record: DurableRecordContract, errors: string[]): void {
  if (record.category !== "codex-patch-approval-decision") {
    return;
  }

  const prefix = `Codex patch approval decision record ${record.recordId}`;

  if (!record.preservesCodexPatchApprovalDecision) {
    errors.push(`${prefix} must preserve patch approval decisions.`);
  }

  if (!record.requiresManualCodexReview) {
    errors.push(`${prefix} must require manual Codex review.`);
  }

  if (!record.requiresPatchApprovalEvidenceChecks) {
    errors.push(`${prefix} must require approval evidence checks.`);
  }

  if (!record.requiresPatchScopeReview) {
    errors.push(`${prefix} must require patch scope review.`);
  }

  if (!record.requiresRouteSafetyReleaseGate) {
    errors.push(`${prefix} must require route safety release gates.`);
  }

  if (!record.requiresRollbackDrillRecord) {
    errors.push(`${prefix} must require rollback drill records.`);
  }

  if (!record.requiresStorageContractVerification) {
    errors.push(`${prefix} must require storage contract verification.`);
  }

  if (!record.requiresReviewerIdentitySignatureGate) {
    errors.push(`${prefix} must require reviewer identity signature gates.`);
  }

  if (!record.blocksAppFileWrite) {
    errors.push(`${prefix} must block app file writes.`);
  }

  if (!record.blocksAppPatchGeneration) {
    errors.push(`${prefix} must block app patch generation.`);
  }

  if (!record.blocksTestExecution) {
    errors.push(`${prefix} must block test execution.`);
  }

  if (!record.blocksPlaywrightRun) {
    errors.push(`${prefix} must block Playwright runs.`);
  }

  if (!record.blocksGeneratedGameRouteWrite) {
    errors.push(`${prefix} must block route writes.`);
  }

  if (!record.blocksSupportLanguageProgressTrigger) {
    errors.push(`${prefix} must block support-language progress triggers.`);
  }
}

function validateAiPrototypeSignedApprovalPreflightRecord(record: DurableRecordContract, errors: string[]): void {
  if (record.category !== "ai-prototype-signed-approval-preflight") {
    return;
  }

  const prefix = `AI prototype signed approval preflight record ${record.recordId}`;

  if (!record.preservesAiPrototypeSignedApprovalPreflight) {
    errors.push(`${prefix} must preserve signed approval preflights.`);
  }

  if (!record.requiresReviewerIdentitySignatureGate) {
    errors.push(`${prefix} must require reviewer identity signature gates.`);
  }

  if (!record.requiresSignedApprovalPreflightScopeLocks) {
    errors.push(`${prefix} must require approval scope locks.`);
  }

  if (!record.requiresApprovalRecordDraftFields) {
    errors.push(`${prefix} must require approval record draft fields.`);
  }

  if (!record.requiresCannotApproveWhileChecks) {
    errors.push(`${prefix} must require cannot-approve-while checks.`);
  }

  if (!record.requiresSignedApprovalEvidenceChecklist) {
    errors.push(`${prefix} must require approval evidence checklists.`);
  }

  if (!record.requiresRouteSafetyReleaseGate) {
    errors.push(`${prefix} must require route safety release gates.`);
  }

  if (!record.requiresRollbackDrillRecord) {
    errors.push(`${prefix} must require rollback drill records.`);
  }

  if (!record.requiresStorageContractVerification) {
    errors.push(`${prefix} must require storage contract verification.`);
  }

  if (!record.blocksSignedApprovalCapture) {
    errors.push(`${prefix} must block signed approval capture.`);
  }

  if (!record.blocksAppFileWrite) {
    errors.push(`${prefix} must block app file writes.`);
  }

  if (!record.blocksAppPatchGeneration) {
    errors.push(`${prefix} must block app patch generation.`);
  }

  if (!record.blocksTestExecution) {
    errors.push(`${prefix} must block test execution.`);
  }

  if (!record.blocksPlaywrightRun) {
    errors.push(`${prefix} must block Playwright runs.`);
  }

  if (!record.blocksGeneratedGameRouteWrite) {
    errors.push(`${prefix} must block route writes.`);
  }

  if (!record.blocksSupportLanguageProgressTrigger) {
    errors.push(`${prefix} must block support-language progress triggers.`);
  }
}

function validateAiPrototypePatchAuthorizationReleaseLockRecord(
  record: DurableRecordContract,
  errors: string[],
): void {
  if (record.category !== "ai-prototype-patch-authorization-release-lock") {
    return;
  }

  const prefix = `AI prototype patch authorization release lock record ${record.recordId}`;

  if (!record.preservesAiPrototypePatchAuthorizationReleaseLock) {
    errors.push(`${prefix} must preserve patch authorization release locks.`);
  }

  if (!record.requiresPatchAuthorizationReleaseLocks) {
    errors.push(`${prefix} must require release locks.`);
  }

  if (!record.requiresPatchAuthorizationScope) {
    errors.push(`${prefix} must require authorization scope.`);
  }

  if (!record.requiresForbiddenUntilUnlockedChecks) {
    errors.push(`${prefix} must require forbidden-until-unlocked checks.`);
  }

  if (!record.requiresReleaseEvidence) {
    errors.push(`${prefix} must require release evidence.`);
  }

  if (!record.requiresRouteSafetyReleaseGate) {
    errors.push(`${prefix} must require route safety release gates.`);
  }

  if (!record.requiresRollbackDrillRecord) {
    errors.push(`${prefix} must require rollback drill records.`);
  }

  if (!record.requiresStorageContractVerification) {
    errors.push(`${prefix} must require storage contract verification.`);
  }

  if (!record.requiresReviewerIdentitySignatureGate) {
    errors.push(`${prefix} must require reviewer identity signature gates.`);
  }

  if (!record.blocksAppFileWrite) {
    errors.push(`${prefix} must block app file writes.`);
  }

  if (!record.blocksAppPatchGeneration) {
    errors.push(`${prefix} must block app patch generation.`);
  }

  if (!record.blocksTestExecution) {
    errors.push(`${prefix} must block test execution.`);
  }

  if (!record.blocksPlaywrightRun) {
    errors.push(`${prefix} must block Playwright runs.`);
  }

  if (!record.blocksGeneratedGameRouteWrite) {
    errors.push(`${prefix} must block route writes.`);
  }

  if (!record.blocksSupportLanguageProgressTrigger) {
    errors.push(`${prefix} must block support-language progress triggers.`);
  }
}

function validateAiPrototypePatchImplementationWorkOrderRecord(
  record: DurableRecordContract,
  errors: string[],
): void {
  if (record.category !== "ai-prototype-patch-implementation-work-order") {
    return;
  }

  const prefix = `AI prototype patch implementation work order record ${record.recordId}`;

  if (!record.preservesAiPrototypePatchImplementationWorkOrder) {
    errors.push(`${prefix} must preserve patch implementation work orders.`);
  }

  if (!record.preservesAiPrototypePatchAuthorizationReleaseLock) {
    errors.push(`${prefix} must preserve patch authorization release lock links.`);
  }

  if (!record.requiresPatchImplementationRequiredBeforeWork) {
    errors.push(`${prefix} must require required-before-work records.`);
  }

  if (!record.requiresPatchImplementationFileGroups) {
    errors.push(`${prefix} must require allowed future file groups.`);
  }

  if (!record.requiresPatchImplementationDryRunOrder) {
    errors.push(`${prefix} must require dry-run verification order.`);
  }

  if (!record.requiresPatchImplementationRollbackPlan) {
    errors.push(`${prefix} must require rollback plans.`);
  }

  if (!record.requiresRouteSafetyReleaseGate) {
    errors.push(`${prefix} must require route safety release gates.`);
  }

  if (!record.requiresRollbackDrillRecord) {
    errors.push(`${prefix} must require rollback drill records.`);
  }

  if (!record.requiresStorageContractVerification) {
    errors.push(`${prefix} must require storage contract verification.`);
  }

  if (!record.requiresReviewerIdentitySignatureGate) {
    errors.push(`${prefix} must require reviewer identity signature gates.`);
  }

  if (!record.blocksWorkOrderExecution) {
    errors.push(`${prefix} must block work order execution.`);
  }

  if (!record.blocksAppFileWrite) {
    errors.push(`${prefix} must block app file writes.`);
  }

  if (!record.blocksAppPatchGeneration) {
    errors.push(`${prefix} must block app patch generation.`);
  }

  if (!record.blocksTestExecution) {
    errors.push(`${prefix} must block test execution.`);
  }

  if (!record.blocksPlaywrightRun) {
    errors.push(`${prefix} must block Playwright runs.`);
  }

  if (!record.blocksGeneratedGameRouteWrite) {
    errors.push(`${prefix} must block route writes.`);
  }

  if (!record.blocksSupportLanguageProgressTrigger) {
    errors.push(`${prefix} must block support-language progress triggers.`);
  }
}

function validateAiPrototypePatchChangeSetPreviewRecord(record: DurableRecordContract, errors: string[]): void {
  if (record.category !== "ai-prototype-patch-change-set-preview") {
    return;
  }

  const prefix = `AI prototype patch change set preview record ${record.recordId}`;

  if (!record.preservesAiPrototypePatchChangeSetPreview) {
    errors.push(`${prefix} must preserve patch change set previews.`);
  }

  if (!record.preservesAiPrototypePatchImplementationWorkOrder) {
    errors.push(`${prefix} must preserve patch implementation work order links.`);
  }

  if (!record.requiresPatchChangeSetPlannedFileChanges) {
    errors.push(`${prefix} must require planned file changes.`);
  }

  if (!record.requiresPatchChangeSetInvariantChecks) {
    errors.push(`${prefix} must require invariant checks.`);
  }

  if (!record.requiresPatchChangeSetReviewBlockers) {
    errors.push(`${prefix} must require review blockers.`);
  }

  if (!record.requiresPatchChangeSetNextRecords) {
    errors.push(`${prefix} must require next records.`);
  }

  if (!record.requiresRouteSafetyReleaseGate) {
    errors.push(`${prefix} must require route safety release gates.`);
  }

  if (!record.requiresRollbackDrillRecord) {
    errors.push(`${prefix} must require rollback drill records.`);
  }

  if (!record.requiresStorageContractVerification) {
    errors.push(`${prefix} must require storage contract verification.`);
  }

  if (!record.requiresReviewerIdentitySignatureGate) {
    errors.push(`${prefix} must require reviewer identity signature gates.`);
  }

  if (!record.blocksApplyPatch) {
    errors.push(`${prefix} must block apply-patch actions.`);
  }

  if (!record.blocksAppFileWrite) {
    errors.push(`${prefix} must block app file writes.`);
  }

  if (!record.blocksAppPatchGeneration) {
    errors.push(`${prefix} must block app patch generation.`);
  }

  if (!record.blocksGeneratedFileWrite) {
    errors.push(`${prefix} must block generated file writes.`);
  }

  if (!record.blocksTestExecution) {
    errors.push(`${prefix} must block test execution.`);
  }

  if (!record.blocksPlaywrightRun) {
    errors.push(`${prefix} must block Playwright runs.`);
  }

  if (!record.blocksGeneratedGameRouteWrite) {
    errors.push(`${prefix} must block route writes.`);
  }

  if (!record.blocksSupportLanguageProgressTrigger) {
    errors.push(`${prefix} must block support-language progress triggers.`);
  }
}

function validateAiGeneratedPackageTeacherReviewPacketRecord(record: DurableRecordContract, errors: string[]): void {
  if (record.category !== "ai-generated-package-teacher-review-packet") {
    return;
  }

  const prefix = `AI generated package teacher review packet record ${record.recordId}`;

  if (!record.preservesAiGeneratedPackageTeacherReviewPacket) {
    errors.push(`${prefix} must preserve teacher review packets.`);
  }

  if (!record.requiresTeacherReviewDecisionLanes) {
    errors.push(`${prefix} must require teacher decision lanes.`);
  }

  if (!record.requiresTeacherReviewMissingEvidence) {
    errors.push(`${prefix} must require missing evidence lanes.`);
  }

  if (!record.requiresTargetLanguageAudioApproval) {
    errors.push(`${prefix} must require target-language audio approval.`);
  }

  if (!record.requiresMediaRightsEvidence) {
    errors.push(`${prefix} must require media rights evidence.`);
  }

  if (!record.requiresTeacherApprovalLedger) {
    errors.push(`${prefix} must require a teacher approval ledger.`);
  }

  if (!record.requiresReleaseControlBinding) {
    errors.push(`${prefix} must require release-control binding.`);
  }

  if (!record.blocksApprovalCapture) {
    errors.push(`${prefix} must block approval capture.`);
  }

  if (!record.blocksGeneratedPackageAssembly) {
    errors.push(`${prefix} must block package assembly.`);
  }

  if (!record.blocksGeneratedPackageRouteWrite) {
    errors.push(`${prefix} must block route registry writes.`);
  }

  if (!record.blocksGeneratedPackagePlaylistWrite) {
    errors.push(`${prefix} must block media playlist writes.`);
  }

  if (!record.blocksGeneratedPackageAssignment) {
    errors.push(`${prefix} must block generated package assignments.`);
  }

  if (!record.blocksGeneratedPackageLocalBundleWrite) {
    errors.push(`${prefix} must block local bundle writes.`);
  }

  if (!record.blocksStudentReadyMarker) {
    errors.push(`${prefix} must block student-ready markers.`);
  }

  if (!record.blocksSupportLanguageProgressTrigger) {
    errors.push(`${prefix} must block support-language progress triggers.`);
  }
}

function validateTargetLanguageAudioApprovalRecord(record: DurableRecordContract, errors: string[]): void {
  if (record.category !== "target-language-audio-approval") {
    return;
  }

  const prefix = `Target-language audio approval record ${record.recordId}`;

  if (!record.preservesTargetLanguageAudioApproval) {
    errors.push(`${prefix} must preserve target-language audio approval packets.`);
  }

  if (!record.requiresAudioApprovalCueReview) {
    errors.push(`${prefix} must require cue-level audio review.`);
  }

  if (!record.requiresAudioApprovalProgressBoundaries) {
    errors.push(`${prefix} must require progress boundary checks.`);
  }

  if (!record.requiresAudioCueManifest) {
    errors.push(`${prefix} must require audio cue manifests.`);
  }

  if (!record.requiresTargetLanguageAudioCoverage) {
    errors.push(`${prefix} must require target-language audio coverage.`);
  }

  if (!record.requiresControlAudioCoverage) {
    errors.push(`${prefix} must require control audio coverage.`);
  }

  if (!record.requiresSupportLanguageAudioRules) {
    errors.push(`${prefix} must require support-language audio rules.`);
  }

  if (!record.blocksApprovalCapture) {
    errors.push(`${prefix} must block approval capture.`);
  }

  if (!record.blocksGeneratedVoiceCall) {
    errors.push(`${prefix} must block generated voice calls.`);
  }

  if (!record.blocksVoiceApiCost) {
    errors.push(`${prefix} must block voice API cost.`);
  }

  if (!record.blocksPackageAudioCompleteMarker) {
    errors.push(`${prefix} must block package audio-complete markers.`);
  }

  if (!record.blocksGeneratedPackageRouteWrite) {
    errors.push(`${prefix} must block route registry writes.`);
  }

  if (!record.blocksGeneratedPackagePlaylistWrite) {
    errors.push(`${prefix} must block media playlist writes.`);
  }

  if (!record.blocksGeneratedPackageAssignment) {
    errors.push(`${prefix} must block generated package assignments.`);
  }

  if (!record.blocksMediaOnlyMastery) {
    errors.push(`${prefix} must block media-only mastery.`);
  }

  if (!record.blocksSupportLanguageProgressTrigger) {
    errors.push(`${prefix} must block support-language progress triggers.`);
  }
}

function validatePackageAdoptionRecordPreview(record: DurableRecordContract, errors: string[]) {
  if (record.category !== "package-adoption-record-preview") {
    return;
  }

  const prefix = `Package adoption record preview ${record.recordId}`;

  if (!record.preservesPackageAdoptionRecordPreview) {
    errors.push(`${prefix} must preserve minimum fields, evidence, acceptance scopes, blocked writes, and rollback hooks.`);
  }

  if (!record.requiresSchoolPolicyAcceptance) {
    errors.push(`${prefix} must require school policy acceptance.`);
  }

  if (!record.requiresPackageCostReview) {
    errors.push(`${prefix} must require package cost review.`);
  }

  if (!record.requiresTenantPackageSelection) {
    errors.push(`${prefix} must require tenant package selection.`);
  }

  if (!record.requiresReleaseControlBinding) {
    errors.push(`${prefix} must require release-control binding.`);
  }

  if (!record.blocksAcceptedAdoptionRecordStorage) {
    errors.push(`${prefix} must block accepted adoption record storage.`);
  }

  if (!record.blocksBillingEntitlementWrite) {
    errors.push(`${prefix} must block billing entitlement writes.`);
  }

  if (!record.blocksPremiumFeatureActivation) {
    errors.push(`${prefix} must block premium feature activation.`);
  }

  if (!record.blocksLiveModelCall) {
    errors.push(`${prefix} must block live model calls.`);
  }

  if (!record.blocksVoiceApiCost) {
    errors.push(`${prefix} must block voice API cost.`);
  }

  if (!record.blocksMicrophoneScoringEnablement) {
    errors.push(`${prefix} must block microphone scoring enablement.`);
  }

  if (!record.blocksReportExportEnablement) {
    errors.push(`${prefix} must block report export enablement.`);
  }

  if (!record.blocksStorageWrite) {
    errors.push(`${prefix} must block storage writes.`);
  }

  if (!record.blocksLocalCompanionActivation) {
    errors.push(`${prefix} must block local companion activation.`);
  }
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
