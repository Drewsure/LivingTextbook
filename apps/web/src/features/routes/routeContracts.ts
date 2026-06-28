import { getLaunchPath } from "@living-textbook/content-model";
import type { LaunchCode } from "@living-textbook/content-model";

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
    purpose: "Show the current tenant, selected unit, progression summary, and first game sequence.",
    requiredState: ["TenantConfig", "UnitPayload"],
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
    id: "teacher-unit-review",
    pattern: "/teacher/units/[unitKey]",
    audience: "teacher",
    status: "future",
    purpose: "Review generated content, approve assignment, and configure classroom launch settings.",
    requiredState: ["TenantConfig", "UnitPayload", "VerificationResult"],
  },
  {
    id: "teacher-session-monitor",
    pattern: "/teacher/sessions/[launchCode]",
    audience: "teacher",
    status: "future",
    purpose: "Monitor student completion, mastery, and Training Academy recommendations.",
    requiredState: ["LaunchSession", "GameProgressEvent[]", "StudentProgressionState[]"],
  },
];

export function getStudentLaunchPath(launchCode: LaunchCode): string {
  return getLaunchPath(launchCode);
}
