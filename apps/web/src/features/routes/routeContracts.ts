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
    id: "teacher-draft-authoring-preview",
    pattern: "/teacher/authoring/[draftId]",
    audience: "teacher",
    status: "active-scaffold",
    purpose: "Preview a teacher-only draft package while blocking direct student assignment until review, audio, rights, route, and approval gates pass.",
    requiredState: ["TenantConfig", "TeacherDraftPackagePreview", "TeacherAuthoringGate[]"],
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
    id: "partner-pilot-demo",
    pattern: "/partner-demo",
    audience: "platform",
    status: "active-scaffold",
    purpose: "Show a second sample tenant and partner-style content package to prove the white-label path.",
    requiredState: ["TenantConfig", "ContentPackage", "UnitPayload", "LaunchSession"],
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
    id: "sentence-builder",
    pattern: "/sentence/[code]",
    audience: "student",
    status: "active-scaffold",
    purpose: "Let a student build reviewed target sentences with audio-supported word tiles through the text-spelling parent engine.",
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

export function getTrainingAcademyPath(launchCode: LaunchCode, focusType?: TrainingFocusType): string {
  const basePath = `/training/${encodeURIComponent(launchCode)}`;

  return focusType ? `${basePath}?focus=${encodeURIComponent(focusType)}` : basePath;
}

export function getSentenceBuilderPath(launchCode: LaunchCode): string {
  return `/sentence/${encodeURIComponent(launchCode)}`;
}

export function getQuizPath(launchCode: LaunchCode): string {
  return `/quiz/${encodeURIComponent(launchCode)}`;
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

export function getTeacherPrivateLibraryPath(tenantId: TenantId): string {
  return `/teacher/library/${encodeURIComponent(tenantId)}`;
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
