import { sampleSchoolPolicyRollbackImpactMatrix } from "@/data/sampleSchoolPolicyRollbackImpactMatrix";

export type RollbackFallbackStatus = "blocked" | "needs-policy" | "future-required";
export type RollbackFallbackOwner = "school" | "publisher" | "platform" | "teacher" | "shared";

export interface RollbackFallbackMessage {
  messageId: string;
  label: string;
  owner: RollbackFallbackOwner;
  status: RollbackFallbackStatus;
  audience: string;
  copyPurpose: string;
  sampleCopy: string;
  blockedActions: string[];
}

export interface RollbackRouteFallback {
  fallbackId: string;
  label: string;
  owner: RollbackFallbackOwner;
  status: RollbackFallbackStatus;
  routeSurface: string;
  safeDestination: string;
  requiredPolicy: string[];
  blockedActions: string[];
}

export interface SchoolRollbackSafeFallbackPlan {
  planId: string;
  label: string;
  sourceMatrixId: string;
  statusLabel: string;
  summary: string;
  messages: RollbackFallbackMessage[];
  routeFallbacks: RollbackRouteFallback[];
  rules: string[];
}

export const sampleSchoolRollbackSafeFallbackPlan: SchoolRollbackSafeFallbackPlan = {
  planId: `${sampleSchoolPolicyRollbackImpactMatrix.matrixId}-safe-fallback-plan`,
  label: "School rollback safe fallback plan",
  sourceMatrixId: sampleSchoolPolicyRollbackImpactMatrix.matrixId,
  statusLabel: "Fallback messaging blocked",
  summary:
    "This plan previews the safe pause messages and route fallback responsibilities needed before a school rollback can ever affect printed QR routes, installed PWA paths, local companion packages, or teacher-facing support pages.",
  messages: [
    {
      messageId: "student-pause-notice",
      label: "Student pause notice",
      owner: "school",
      status: "needs-policy",
      audience: "Student",
      copyPurpose: "Give a child-safe pause message without exposing private school, legal, or learner-data details.",
      sampleCopy: "This activity is paused. Please ask your teacher for the next classroom activity.",
      blockedActions: ["No production QR redirect mutation", "No learner-data disclosure", "No live notification"],
    },
    {
      messageId: "teacher-contact-handoff",
      label: "Teacher contact handoff",
      owner: "teacher",
      status: "needs-policy",
      audience: "Teacher",
      copyPurpose: "Tell the teacher what changed, where to check policy status, and which reviewed package remains safe.",
      sampleCopy: "This package needs school review before classroom use. Use the teacher intake page and current safe package notes.",
      blockedActions: ["No classroom shutdown workflow", "No report export", "No student reassignment"],
    },
    {
      messageId: "school-admin-notice",
      label: "School admin notice",
      owner: "school",
      status: "future-required",
      audience: "School admin",
      copyPurpose: "Prepare the policy and evidence handoff without becoming an acceptance or revocation action.",
      sampleCopy: "Review the rollback impact matrix, affected records, and required evidence before approving any route change.",
      blockedActions: ["No revocation action", "No signed approval capture", "No evidence export"],
    },
    {
      messageId: "publisher-media-notice",
      label: "Publisher media notice",
      owner: "publisher",
      status: "future-required",
      audience: "Publisher admin",
      copyPurpose: "Name the media, local bundle, and yearly-update responsibilities before a replacement is considered.",
      sampleCopy: "Media and local package changes remain blocked until rights, backup, update, and archive policy are accepted.",
      blockedActions: ["No media replacement", "No playlist mutation", "No local bundle deactivation"],
    },
  ],
  routeFallbacks: [
    {
      fallbackId: "printed-qr-safe-pause",
      label: "Printed QR safe pause",
      owner: "shared",
      status: "blocked",
      routeSurface: "Printed textbook QR resolver",
      safeDestination: "Review-only pause page or teacher contact instructions after policy acceptance",
      requiredPolicy: [
        "Who can authorize a printed QR pause",
        "Which safe package or notice can replace the current route",
        "How installed PWA cache and local companion paths are handled",
      ],
      blockedActions: ["No production QR redirect mutation", "No route alias shutdown", "No launch-ready status change"],
    },
    {
      fallbackId: "local-companion-safe-fallback",
      label: "Local companion safe fallback",
      owner: "platform",
      status: "needs-policy",
      routeSurface: "Closed local companion package",
      safeDestination: "Local package pause notice, previous reviewed package, or teacher-only support page",
      requiredPolicy: [
        "Backup and restore procedure",
        "Local route deactivation policy",
        "School support contact and update path",
      ],
      blockedActions: ["No local bundle deactivation", "No local deep-link change", "No classroom shutdown workflow"],
    },
    {
      fallbackId: "media-playlist-safe-fallback",
      label: "Media playlist safe fallback",
      owner: "publisher",
      status: "needs-policy",
      routeSurface: "Audio, music, and video playlist routes",
      safeDestination: "Reviewed replacement playlist or media-paused notice after rights review",
      requiredPolicy: [
        "Rights proof for replacement media",
        "Caption and transcript review",
        "Learning-audio priority review",
      ],
      blockedActions: ["No media replacement", "No playlist mutation", "No background media override"],
    },
  ],
  rules: [
    "Fallback messages are review-only copy and cannot trigger route, release, media, learner-data, report, or premium entitlement changes.",
    "Student-facing fallback copy must be child-safe and must not expose private school, publisher, legal, or learner-data details.",
    "Support language can explain a pause, but it cannot unlock progress or replace target-language activity evidence.",
    "Closed/local fallback requires backup, restore, update, archive, and school support procedures before activation.",
    "No safe fallback can become a production QR redirect until school policy, release-control, and persistence gates pass.",
  ],
};
