import { sampleSchoolRollbackSafeFallbackPlan } from "@/data/sampleSchoolRollbackSafeFallbackPlan";

export type SafeFallbackPreflightStatus = "blocked" | "needs-policy" | "future-required";
export type SafeFallbackPreflightOwner = "school" | "publisher" | "platform" | "teacher" | "shared";

export interface SafeFallbackPreflightLane {
  laneId: string;
  label: string;
  owner: SafeFallbackPreflightOwner;
  status: SafeFallbackPreflightStatus;
  requiredBeforeUse: string[];
  blockedUntilResolved: string[];
}

export interface SchoolRollbackSafeFallbackPreflight {
  preflightId: string;
  label: string;
  sourcePlanId: string;
  statusLabel: string;
  summary: string;
  lanes: SafeFallbackPreflightLane[];
  minimumActivationFields: string[];
  blockedActions: string[];
  rules: string[];
}

export const sampleSchoolRollbackSafeFallbackPreflight: SchoolRollbackSafeFallbackPreflight = {
  preflightId: `${sampleSchoolRollbackSafeFallbackPlan.planId}-preflight`,
  label: "School rollback safe fallback preflight",
  sourcePlanId: sampleSchoolRollbackSafeFallbackPlan.planId,
  statusLabel: "Fallback activation blocked",
  summary:
    "This preflight lists what must be reviewed before safe fallback copy, printed QR pause behavior, local companion fallback, or media playlist pause behavior can ever move beyond review-only planning.",
  lanes: [
    {
      laneId: "child-safe-copy-review",
      label: "Child-safe copy review",
      owner: "school",
      status: "needs-policy",
      requiredBeforeUse: [
        "Student pause wording reviewed for age level",
        "No private school, legal, learner-data, or billing details in student copy",
        "Target-language and support-language versions reviewed separately",
      ],
      blockedUntilResolved: ["No student-facing pause page", "No live notification", "No support-language-only progression"],
    },
    {
      laneId: "school-communication-policy",
      label: "School communication policy",
      owner: "school",
      status: "future-required",
      requiredBeforeUse: [
        "Who can approve teacher and school admin messages",
        "How teachers are told which package is safe",
        "How support requests are routed without exposing learner data",
      ],
      blockedUntilResolved: ["No teacher contact handoff", "No school admin notice", "No classroom shutdown workflow"],
    },
    {
      laneId: "printed-qr-fallback-policy",
      label: "Printed QR fallback policy",
      owner: "shared",
      status: "blocked",
      requiredBeforeUse: [
        "Printed QR route alias inventory reviewed",
        "Safe destination approved by school and platform",
        "Installed PWA cache and direct local links reviewed",
      ],
      blockedUntilResolved: ["No production QR redirect mutation", "No route alias shutdown", "No launch-ready status change"],
    },
    {
      laneId: "local-companion-fallback-policy",
      label: "Local companion fallback policy",
      owner: "platform",
      status: "needs-policy",
      requiredBeforeUse: [
        "Backup and restore procedure accepted",
        "Local update and archive procedure accepted",
        "School support contact and offline recovery path accepted",
      ],
      blockedUntilResolved: ["No local bundle deactivation", "No local deep-link change", "No desktop companion shutdown"],
    },
    {
      laneId: "media-playlist-fallback-policy",
      label: "Media playlist fallback policy",
      owner: "publisher",
      status: "needs-policy",
      requiredBeforeUse: [
        "Replacement or pause media rights reviewed",
        "Captions, transcripts, and learning-audio priority reviewed",
        "Background media cannot override target-language audio",
      ],
      blockedUntilResolved: ["No media replacement", "No playlist mutation", "No background media override"],
    },
    {
      laneId: "assignment-and-report-policy",
      label: "Assignment and report policy",
      owner: "teacher",
      status: "blocked",
      requiredBeforeUse: [
        "Student assignment continuity plan accepted",
        "Teacher report retention and access reviewed",
        "No fallback can create or move student assignments by itself",
      ],
      blockedUntilResolved: ["No student reassignment", "No report export", "No learner-data deletion workflow"],
    },
  ],
  minimumActivationFields: [
    "safe_fallback_preflight_id",
    "safe_fallback_plan_id",
    "tenant_id",
    "package_id",
    "release_candidate_id",
    "approved_student_message_version",
    "approved_teacher_message_version",
    "approved_qr_fallback_policy",
    "approved_local_fallback_policy",
    "approved_media_fallback_policy",
    "assignment_and_report_policy",
    "support_language_boundary",
  ],
  blockedActions: [
    "No fallback activation",
    "No production QR redirect mutation",
    "No live notification",
    "No classroom shutdown workflow",
    "No local bundle deactivation",
    "No media replacement",
    "No student reassignment",
    "No report export",
  ],
  rules: [
    "The preflight is not an activation workflow and cannot change route, release, local package, media, report, or assignment state.",
    "Student-facing fallback copy must be child-safe and must not expose private school, publisher, legal, billing, or learner-data details.",
    "Support-language fallback copy may explain a pause, but target-language evidence remains the only progress trigger.",
    "Closed/local fallback cannot activate without backup, restore, update, archive, and school support procedures.",
    "No fallback can be used with live classrooms until school policy, release-control, persistence, and support rules pass.",
  ],
};
