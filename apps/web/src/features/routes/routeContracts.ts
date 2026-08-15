import { getLaunchPath, getPermanentQrPath } from "@living-textbook/content-model";
import type { LaunchCode, PermanentQrIdentifier, TenantId } from "@living-textbook/content-model";
import type { TrainingFocusType } from "@/features/training/trainingAcademyAdapter";

export type AppRouteAudience = "platform" | "teacher" | "student";
export type AppRouteStatus = "active-scaffold" | "future";

export interface AppRouteContract {
  id: string;
  pattern: string;
  audience: AppRouteAudience;
  status: AppRouteStatus;
  purpose: string;
  requiredState: string[];
}

export const appRouteContracts: AppRouteContract[] = [
  {
    id: "tenant-overview",
    pattern: "/",
    audience: "platform",
    status: "active-scaffold",
    purpose: "Show the current tenant, selected unit, progression summary, multimedia package concept, and first game sequence.",
    requiredState: ["TenantConfig", "UnitPayload", "ContentPackage"],
  },
  {
    id: "teacher-launch",
    pattern: "/teacher",
    audience: "teacher",
    status: "active-scaffold",
    purpose: "Let the teacher review the launch protocol and share the classroom QR launch route.",
    requiredState: ["TenantConfig", "UnitPayload", "LaunchSession"],
  },
  {
    id: "teacher-content-intake",
    pattern: "/teacher/intake",
    audience: "teacher",
    status: "active-scaffold",
    purpose: "Let teacher/admin users inspect source intake gates, package releases, reviewed package readiness, front-door route registry data, deployment profiles, local bundle manifests, persistence boundaries, and durable record requirements before assignment.",
    requiredState: [
      "ContentIntakeRun[]",
      "ContentPackageRelease[]",
      "FrontDoorRouteRegistryEntry[]",
      "TenantDeploymentProfile[]",
      "LocalBundleManifestSummary[]",
      "PersistenceBoundary[]",
      "PersistenceStrategyOption[]",
      "DurableRecordContract[]",
      "durableRecordErrors[]",
      "durableRecordWarnings[]",
      "TenantConfig",
    ],
  },
  {
    id: "teacher-source-review-workspace",
    pattern: "/teacher/sources/[tenantId]",
    audience: "teacher",
    status: "active-scaffold",
    purpose:
      "Show a tenant-scoped source review workspace for PDF, DOCX, audio, video, OCR/parser, and AI extraction evidence while live extraction, package release, route creation, playlist creation, and assignment remain blocked.",
    requiredState: ["TenantConfig", "SourceReviewQueue", "source_extraction_review_packet", "teacher_draft_review_handoff"],
  },
  {
    id: "teacher-ai-game-generator",
    pattern: "/teacher/generator/[tenantId]",
    audience: "teacher",
    status: "active-scaffold",
    purpose:
      "Show a tenant-scoped AI teaching game generator preview that creates draft package requests, verifier packets, target-language audio plans, and curated activity pathway proposals while live model calls, direct publishing, route creation, and student assignment remain blocked.",
    requiredState: [
      "TenantConfig",
      "AiGameGeneratorPlan",
      "teacher_draft_package",
      "teacher_draft_verifier_submission",
      "activity_compatibility_snapshot",
      "package_game_audio_coverage",
    ],
  },
  {
    id: "teacher-draft-authoring-preview",
    pattern: "/teacher/authoring/[draftId]",
    audience: "teacher",
    status: "active-scaffold",
    purpose: "Preview a teacher-only draft package while blocking direct student assignment until review, audio, rights, route, and approval gates pass.",
    requiredState: ["TenantConfig", "TeacherDraftPackagePreview", "TeacherAuthoringGate[]"],
  },
  {
    id: "teacher-draft-review-queue",
    pattern: "/teacher/review",
    audience: "teacher",
    status: "active-scaffold",
    purpose: "Preview teacher draft review handoff queue items while blocking live verifier submission, approval, publishing, and student assignment.",
    requiredState: ["TenantConfig", "TeacherDraftReviewQueue", "TeacherDraftReviewQueueItem[]"],
  },
  {
    id: "tenant-teacher-draft-review-queue",
    pattern: "/teacher/review/[tenantId]",
    audience: "teacher",
    status: "active-scaffold",
    purpose:
      "Preview a tenant-scoped teacher draft review queue while preserving the same verifier, evidence, package writer, release-control, and assignment blockers as the global review workbench.",
    requiredState: ["TenantConfig", "TeacherDraftReviewQueue", "TeacherDraftReviewQueueItem[]"],
  },
  {
    id: "teacher-private-library",
    pattern: "/teacher/library/[tenantId]",
    audience: "teacher",
    status: "active-scaffold",
    purpose: "Show a tenant-scoped private teacher library with draft packages, reviewed packages, planned school sharing, and blocked public community publishing.",
    requiredState: ["TenantConfig", "TenantLibraryPlan", "TeacherPrivateLibraryPreview", "TeacherDraftPackagePreview[]"],
  },
  {
    id: "teacher-publisher-maintenance",
    pattern: "/teacher/maintenance/[tenantId]",
    audience: "teacher",
    status: "active-scaffold",
    purpose:
      "Show a tenant-scoped publisher maintenance route for yearly content, media, game, QR, local bundle, and report updates while live maintenance actions remain blocked.",
    requiredState: ["TenantConfig", "PublisherMaintenancePlan", "PublisherMaintenanceChangeRequest[]"],
  },
  {
    id: "teacher-release-control",
    pattern: "/teacher/release-control/[tenantId]",
    audience: "teacher",
    status: "active-scaffold",
    purpose:
      "Show a tenant-scoped release-control route that joins the pilot release candidate, package publish gate, and approval ledger while live publish, assignment, local bundle, release-state, and student-ready actions remain blocked.",
    requiredState: ["TenantConfig", "PackagePublishGate", "PackageApprovalLedger", "ReleaseCandidate"],
  },
  {
    id: "teacher-media-library",
    pattern: "/teacher/media/[tenantId]",
    audience: "teacher",
    status: "active-scaffold",
    purpose: "Show a tenant-scoped media maintenance preview with rights state, target records, blocked live upload actions, and local bundle media readiness.",
    requiredState: ["TenantConfig", "MediaRightsPlan", "TeacherMediaLibraryPreview", "MediaRightsRecord[]"],
  },
  {
    id: "teacher-upload-workspace",
    pattern: "/teacher/uploads/[tenantId]",
    audience: "teacher",
    status: "active-scaffold",
    purpose: "Show tenant-scoped upload intake controls, file policies, review queues, promotion gates, Labelled Diagram asset gates, and multimedia asset gates while live file input remains blocked.",
    requiredState: [
      "TenantConfig",
      "UploadChannelReadinessPlan",
      "UploadFilePolicyPlan",
      "UploadReviewQueue",
      "UploadPromotionReadinessPlan",
      "LabelledDiagramAssetReadinessPlan",
      "MultimediaAssetReadinessPlan",
    ],
  },
  {
    id: "teacher-evidence-packet-review",
    pattern: "/teacher/evidence/[tenantId]",
    audience: "teacher",
    status: "active-scaffold",
    purpose:
      "Show a tenant-scoped evidence packet review index for upload, Labelled Diagram, and media asset workspaces while evidence upload, signed approval, promotion, publishing, and assignment remain blocked.",
    requiredState: ["TenantConfig", "EvidencePacketReviewIndex", "EvidencePacketFlow[]", "evidence_packet"],
  },
  {
    id: "teacher-evidence-packet-handoff",
    pattern: "/teacher/evidence/[tenantId]/handoff",
    audience: "teacher",
    status: "active-scaffold",
    purpose:
      "Preview a tenant evidence packet handoff bundle while export, signed approval capture, promotion, publishing, route creation, playlist creation, and assignment remain blocked.",
    requiredState: ["TenantConfig", "EvidencePacketHandoffPackage", "evidence_packet", "release_control_packet"],
  },
  {
    id: "teacher-school-policy-handoff",
    pattern: "/teacher/policy-handoff/[packetId]",
    audience: "teacher",
    status: "active-scaffold",
    purpose:
      "Preview the school policy handoff packet as a direct meeting route while policy acceptance, signed approval, evidence export, launch-ready status, production QR promises, and live classroom workflow remain blocked.",
    requiredState: ["TenantConfig", "SchoolPolicyHandoffPacket", "SchoolLaunchPolicyGate", "school_policy_handoff_packet"],
  },
  {
    id: "teacher-labelled-diagram-asset-workspace",
    pattern: "/teacher/assets/labelled-diagram/[assetId]",
    audience: "teacher",
    status: "active-scaffold",
    purpose:
      "Show a teacher-only Labelled Diagram asset review workspace with game asset manifest, label anchor, audio coverage, target mapping, support-language, and release-gate boundaries before any student-facing image game exists.",
    requiredState: ["TenantConfig", "LabelledDiagramAssetWorkspace", "game_asset_manifest", "label_anchor_record"],
  },
  {
    id: "teacher-media-asset-workspace",
    pattern: "/teacher/assets/media/[assetId]",
    audience: "teacher",
    status: "active-scaffold",
    purpose:
      "Show a teacher-only media asset review workspace with media manifest, playlist binding, background-media policy, local bundle entry, rights, optional playback, and learning-audio priority boundaries before live media upload exists.",
    requiredState: [
      "TenantConfig",
      "MediaAssetWorkspace",
      "media_manifest",
      "media_playlist_binding",
      "background_media_policy_binding",
      "local_media_bundle_entry",
    ],
  },
  {
    id: "partner-pilot-demo",
    pattern: "/partner-demo",
    audience: "platform",
    status: "active-scaffold",
    purpose: "Show a second sample tenant and partner-style content package to prove the white-label path.",
    requiredState: ["TenantConfig", "ContentPackage", "UnitPayload", "LaunchSession"],
  },
  {
    id: "student-activity-hub",
    pattern: "/activities/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose:
      "Show the reviewed activity pathway for one launch session without exposing a switch-to-anything template panel or teacher/admin controls.",
    requiredState: ["TenantConfig", "UnitPayload", "LaunchSession", "StudentProgressionState", "ContentPackage"],
  },
  {
    id: "student-launch",
    pattern: "/launch/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose: "Let a student enter from a QR code, complete entry practice, and see the next recommended game.",
    requiredState: ["TenantConfig", "UnitPayload", "LaunchSession", "StudentProgressionState"],
  },
  {
    id: "front-door-entry",
    pattern: "/enter/[tenantId]",
    audience: "student",
    status: "active-scaffold",
    purpose: "Let a student enter a teacher-provided entry code and optional user code before opening a reportable unit package.",
    requiredState: ["TenantConfig", "FrontDoorAccessPolicy", "LaunchSession", "ContentPackage"],
  },
  {
    id: "private-assignment-link",
    pattern: "/assign/[assignmentId]",
    audience: "student",
    status: "active-scaffold",
    purpose: "Open a tenant-scoped private assignment preview that routes students to the correct launch or front-door path without exposing public sharing or teacher/admin controls.",
    requiredState: ["TenantConfig", "TeacherAssignmentPlan", "LaunchSession", "ContentPackage", "TeacherSessionSettings"],
  },
  {
    id: "earned-collection",
    pattern: "/collection/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose: "Show deterministic mastery-earned collection items, avatar/cosmetic/room/pet categories, and the next unlock without random pressure loops.",
    requiredState: ["TenantConfig", "LaunchSession", "StudentProgressionState", "RewardCatalogItem[]"],
  },
  {
    id: "training-academy",
    pattern: "/training/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose: "Let a student complete deterministic recovery practice and return to the normal unit path without requiring AI Tutor.",
    requiredState: ["TenantConfig", "UnitPayload", "LaunchSession", "StudentProgressionState", "GameProgressEvent[]"],
  },
  {
    id: "flashcards",
    pattern: "/flashcards/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose:
      "Let a student complete direct entry flashcard practice with target-language audio as the progress trigger before recommended games unlock.",
    requiredState: [
      "TenantConfig",
      "UnitPayload",
      "LaunchSession",
      "StudentProgressionState",
      "AudioCue[]",
      "UnitAssistLanguagePlan?",
      "TeacherAssignmentPlan?",
    ],
  },
  {
    id: "memory-match",
    pattern: "/memory/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose: "Let a student reinforce reviewed vocabulary through the pairing parent engine with tap-to-speak card support and deterministic completion events.",
    requiredState: ["TenantConfig", "UnitPayload", "LaunchSession", "StudentProgressionState", "AudioCue[]"],
  },
  {
    id: "match-up",
    pattern: "/match/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose:
      "Let a student match audio prompts to reviewed vocabulary word cards through the pairing parent engine with deterministic completion events.",
    requiredState: ["TenantConfig", "UnitPayload", "LaunchSession", "StudentProgressionState", "AudioCue[]"],
  },
  {
    id: "label-it",
    pattern: "/label-it/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose:
      "Let a student place reviewed target-language labels onto reviewed diagram anchors through the pairing parent engine while uploaded images remain review-gated.",
    requiredState: ["TenantConfig", "UnitPayload", "LaunchSession", "StudentProgressionState", "AudioCue[]", "game_asset_manifest?", "label_anchor_record?"],
  },
  {
    id: "sentence-builder",
    pattern: "/sentence/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose: "Let a student build reviewed target sentences with audio-supported word tiles through the text-spelling parent engine.",
    requiredState: ["TenantConfig", "UnitPayload", "LaunchSession", "StudentProgressionState", "AudioCue[]"],
  },
  {
    id: "type-answer",
    pattern: "/type-answer/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose: "Let a student type reviewed vocabulary answers after hearing target-language prompts through the text-spelling parent engine.",
    requiredState: ["TenantConfig", "UnitPayload", "LaunchSession", "StudentProgressionState", "AudioCue[]"],
  },
  {
    id: "quiz",
    pattern: "/quiz/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose: "Let a student answer reviewed vocabulary and sentence prompts through the selection parent engine.",
    requiredState: ["TenantConfig", "UnitPayload", "LaunchSession", "StudentProgressionState", "AudioCue[]"],
  },
  {
    id: "true-false",
    pattern: "/true-false/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose:
      "Let a student decide whether a target-language audio prompt matches the visible vocabulary card through the selection parent engine.",
    requiredState: ["TenantConfig", "UnitPayload", "LaunchSession", "StudentProgressionState", "AudioCue[]"],
  },
  {
    id: "balloon-pop",
    pattern: "/balloon/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose:
      "Let a student pop reviewed vocabulary targets through an arcade-style selection parent-engine skin with tap-to-speak prompts and deterministic scoring.",
    requiredState: ["TenantConfig", "UnitPayload", "LaunchSession", "StudentProgressionState", "AudioCue[]"],
  },
  {
    id: "speak-it",
    pattern: "/speak/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose:
      "Let a student complete audio-led speaking and listening practice with teacher-controlled microphone record/replay and premium AI speech scoring kept off by default.",
    requiredState: ["TenantConfig", "UnitPayload", "LaunchSession", "StudentProgressionState", "AudioCue[]", "TeacherAssignmentPlan?"],
  },
  {
    id: "permanent-textbook-qr",
    pattern: "/q/tenant/[tenantId]/series/[seriesId]/book/[bookId]/unit/[unitId]/activity/[activityId]",
    audience: "student",
    status: "future",
    purpose: "Resolve a printed textbook QR identifier to the current unit, front door, game, playlist, or teacher preview.",
    requiredState: ["PermanentQrRoute", "ContentPackage", "DeploymentChannel"],
  },
  {
    id: "unit-media-playlist",
    pattern: "/media/[playlistId]",
    audience: "student",
    status: "active-scaffold",
    purpose: "Open a unit-linked playlist scaffold from a launch session, QR route, or teacher preview without treating media files as loose public assets.",
    requiredState: ["UnitMediaPlaylist", "MediaAsset[]", "GameProgressEvent[]"],
  },
  {
    id: "printable-worksheet-preview",
    pattern: "/print/[code]",
    audience: "teacher",
    status: "active-scaffold",
    purpose: "Render a browser-print worksheet preview from reviewed package data while PDF export remains blocked.",
    requiredState: ["TenantConfig", "ContentPackage", "UnitPayload", "AudioCue[]", "UnitAssistLanguagePlan?"],
  },
  {
    id: "teacher-unit-review",
    pattern: "/teacher/units/[unitKey]",
    audience: "teacher",
    status: "active-scaffold",
    purpose: "Review generated content, audio coverage, curated activity paths, media, assignment controls, and pilot blockers before classroom launch.",
    requiredState: ["TenantConfig", "UnitPayload", "ContentPackage", "LaunchSession", "TeacherAssignmentPlan", "UnitPackageReadinessSummary"],
  },
  {
    id: "teacher-session-monitor",
    pattern: "/teacher/sessions/[launchCode]",
    audience: "teacher",
    status: "active-scaffold",
    purpose: "Monitor sample student completion, media engagement, mastery, speaking-practice readiness, teacher settings, lifecycle controls, and Training Academy recommendations from one report stream.",
    requiredState: [
      "TenantConfig",
      "LaunchSession",
      "StudentProgressionState",
      "GameProgressEvent[]",
      "TeacherSessionSettings",
      "TeacherSessionSetting[]",
      "TeacherSessionControlAction[]",
      "TeacherSessionMonitorMetric[]",
      "sessionSettingErrors[]",
      "sessionSettingWarnings[]",
      "sessionControlErrors[]",
      "sessionControlWarnings[]",
    ],
  },
];

export function getStudentLaunchPath(launchCode: LaunchCode): string {
  return getLaunchPath(launchCode);
}

export function getStudentActivityHubPath(launchCode: LaunchCode): string {
  return `/activities/${encodeURIComponent(launchCode)}`;
}

export function getTrainingAcademyPath(launchCode: LaunchCode, focusType?: TrainingFocusType): string {
  const basePath = `/training/${encodeURIComponent(launchCode)}`;

  return focusType ? `${basePath}?focus=${encodeURIComponent(focusType)}` : basePath;
}

export function getFlashcardsPath(launchCode: LaunchCode): string {
  return `/flashcards/${encodeURIComponent(launchCode)}`;
}

export function getSentenceBuilderPath(launchCode: LaunchCode): string {
  return `/sentence/${encodeURIComponent(launchCode)}`;
}

export function getTypeAnswerPath(launchCode: LaunchCode): string {
  return `/type-answer/${encodeURIComponent(launchCode)}`;
}

export function getQuizPath(launchCode: LaunchCode): string {
  return `/quiz/${encodeURIComponent(launchCode)}`;
}

export function getTrueFalsePath(launchCode: LaunchCode): string {
  return `/true-false/${encodeURIComponent(launchCode)}`;
}

export function getBalloonPopPath(launchCode: LaunchCode): string {
  return `/balloon/${encodeURIComponent(launchCode)}`;
}

export function getMemoryMatchPath(launchCode: LaunchCode): string {
  return `/memory/${encodeURIComponent(launchCode)}`;
}

export function getMatchUpPath(launchCode: LaunchCode): string {
  return `/match/${encodeURIComponent(launchCode)}`;
}

export function getLabelItPath(launchCode: LaunchCode): string {
  return `/label-it/${encodeURIComponent(launchCode)}`;
}

export function getSpeakItPath(launchCode: LaunchCode): string {
  return `/speak/${encodeURIComponent(launchCode)}`;
}

export function getTeacherSessionMonitorPath(launchCode: LaunchCode): string {
  return `/teacher/sessions/${encodeURIComponent(launchCode)}`;
}

export function getTeacherUnitReviewPath(unitKey: string): string {
  return `/teacher/units/${encodeURIComponent(unitKey)}`;
}

export function getTeacherDraftAuthoringPath(draftId: string): string {
  return `/teacher/authoring/${encodeURIComponent(draftId)}`;
}

export function getTeacherDraftReviewQueuePath(): string {
  return "/teacher/review";
}

export function getTenantTeacherDraftReviewQueuePath(tenantId: TenantId): string {
  return `/teacher/review/${encodeURIComponent(tenantId)}`;
}

export function getTeacherSourceReviewWorkspacePath(tenantId: TenantId): string {
  return `/teacher/sources/${encodeURIComponent(tenantId)}`;
}

export function getTeacherAiGameGeneratorPath(tenantId: TenantId): string {
  return `/teacher/generator/${encodeURIComponent(tenantId)}`;
}

export function getTeacherPrivateLibraryPath(tenantId: TenantId): string {
  return `/teacher/library/${encodeURIComponent(tenantId)}`;
}

export function getTeacherPublisherMaintenancePath(tenantId: TenantId): string {
  return `/teacher/maintenance/${encodeURIComponent(tenantId)}`;
}

export function getTeacherReleaseControlPath(tenantId: TenantId): string {
  return `/teacher/release-control/${encodeURIComponent(tenantId)}`;
}

export function getTeacherMediaLibraryPath(tenantId: TenantId): string {
  return `/teacher/media/${encodeURIComponent(tenantId)}`;
}

export function getTeacherUploadWorkspacePath(tenantId: TenantId): string {
  return `/teacher/uploads/${encodeURIComponent(tenantId)}`;
}

export function getTeacherEvidencePacketReviewPath(tenantId: TenantId): string {
  return `/teacher/evidence/${encodeURIComponent(tenantId)}`;
}

export function getTeacherEvidencePacketHandoffPath(tenantId: TenantId): string {
  return `/teacher/evidence/${encodeURIComponent(tenantId)}/handoff`;
}

export function getTeacherSchoolPolicyHandoffPath(packetId: string): string {
  return `/teacher/policy-handoff/${encodeURIComponent(packetId)}`;
}

export function getTeacherLabelledDiagramAssetWorkspacePath(assetId: string): string {
  return `/teacher/assets/labelled-diagram/${encodeURIComponent(assetId)}`;
}

export function getTeacherMediaAssetWorkspacePath(assetId: string): string {
  return `/teacher/assets/media/${encodeURIComponent(assetId)}`;
}

export function getPermanentTextbookQrPath(identifier: PermanentQrIdentifier): string {
  return getPermanentQrPath(identifier);
}

export function getFrontDoorPath(tenantId: TenantId): string {
  return `/enter/${encodeURIComponent(tenantId)}`;
}

export function getPrivateAssignmentPath(assignmentId: string): string {
  return `/assign/${encodeURIComponent(assignmentId)}`;
}

export function getCollectionPath(launchCode: LaunchCode): string {
  return `/collection/${encodeURIComponent(launchCode)}`;
}

export function getMediaPlaylistPath(playlistId: string): string {
  return `/media/${encodeURIComponent(playlistId)}`;
}

export function getPrintableWorksheetPath(launchCode: LaunchCode): string {
  return `/print/${encodeURIComponent(launchCode)}`;
}
