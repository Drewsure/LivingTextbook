import { getLaunchPath, getPermanentQrPath } from "@living-textbook/content-model";
import type { LaunchCode, PermanentQrIdentifier, TenantId } from "@living-textbook/content-model";

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
    status: "future",
    purpose: "Open a unit-linked playlist or media activity from a launch session, QR route, or teacher preview.",
    requiredState: ["UnitMediaPlaylist", "MediaAsset[]", "GameProgressEvent[]"],
  },
  {
    id: "teacher-unit-review",
    pattern: "/teacher/units/[unitKey]",
    audience: "teacher",
    status: "future",
    purpose: "Review generated content, approve assignment, configure media, and configure classroom launch settings.",
    requiredState: ["TenantConfig", "UnitPayload", "ContentPackage", "VerificationResult"],
  },
  {
    id: "teacher-session-monitor",
    pattern: "/teacher/sessions/[launchCode]",
    audience: "teacher",
    status: "future",
    purpose: "Monitor student completion, media engagement, mastery, and Training Academy recommendations.",
    requiredState: ["LaunchSession", "GameProgressEvent[]", "StudentProgressionState[]"],
  },
];

export function getStudentLaunchPath(launchCode: LaunchCode): string {
  return getLaunchPath(launchCode);
}

export function getPermanentTextbookQrPath(identifier: PermanentQrIdentifier): string {
  return getPermanentQrPath(identifier);
}

export function getFrontDoorPath(tenantId: TenantId): string {
  return `/enter/${encodeURIComponent(tenantId)}`;
}

export function getMediaPlaylistPath(playlistId: string): string {
  return `/media/${encodeURIComponent(playlistId)}`;
}
