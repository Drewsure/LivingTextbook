import {
  sampleSchoolRollbackSafeFallbackActivationPreview,
  type SchoolRollbackSafeFallbackActivationPreview,
} from "@/data/sampleSchoolRollbackSafeFallbackActivationPreview";

export type SafeFallbackRestorationPreviewStatus = "blocked" | "missing-policy" | "future-required";

export interface SafeFallbackRestorationField {
  fieldId: string;
  label: string;
  status: SafeFallbackRestorationPreviewStatus;
  source: string;
  requiredValue: string;
  blockedReason: string;
}

export interface SchoolRollbackSafeFallbackRestorationPreview {
  previewId: string;
  label: string;
  sourceActivationPreviewId: string;
  statusLabel: string;
  summary: string;
  minimumRestorationRecordFields: SafeFallbackRestorationField[];
  nonRestoredMarkers: string[];
  blockedActions: string[];
  reviewRules: string[];
}

export const sampleSchoolRollbackSafeFallbackRestorationPreview = createSchoolRollbackSafeFallbackRestorationPreview({
  activationPreview: sampleSchoolRollbackSafeFallbackActivationPreview,
});

export function createSchoolRollbackSafeFallbackRestorationPreview({
  activationPreview,
}: {
  activationPreview: SchoolRollbackSafeFallbackActivationPreview;
}): SchoolRollbackSafeFallbackRestorationPreview {
  return {
    previewId: `${activationPreview.previewId}-restoration-record-preview`,
    label: "Future safe fallback restoration record preview",
    sourceActivationPreviewId: activationPreview.previewId,
    statusLabel: "Restoration record blocked",
    summary:
      "This preview shows the minimum fields a future restoration record would need after a safe fallback event. It is not a restore action and cannot reactivate routes, change media, unlock reports, or move students.",
    minimumRestorationRecordFields: [
      {
        fieldId: "authenticated-restoration-operator",
        label: "Authenticated restoration operator",
        status: "future-required",
        source: "reviewer-identity-signature-gate",
        requiredValue: "School operator id, role, school organization id, identity provider, timestamp, and restoration authority",
        blockedReason: "No authenticated restoration operator workflow exists.",
      },
      {
        fieldId: "source-activation-binding",
        label: "Source activation binding",
        status: "blocked",
        source: activationPreview.previewId,
        requiredValue: "safe_fallback_activation_preview_id, future activation record id, activation scope, and incident/reason code",
        blockedReason: "No safe fallback activation record exists.",
      },
      {
        fieldId: "route-restoration-map",
        label: "Route restoration map",
        status: "missing-policy",
        source: "printed-qr-route-scope",
        requiredValue: "Route aliases, QR ids, pre-fallback target, restored target, cache/PWA effect, and rollback owner",
        blockedReason: "Production QR restoration and route mutation remain blocked.",
      },
      {
        fieldId: "local-package-restoration",
        label: "Local package restoration",
        status: "missing-policy",
        source: "local-companion-fallback-binding",
        requiredValue: "Local package id, backup snapshot, restored manifest checksum, update/archive status, and school support contact",
        blockedReason: "Local companion restore, backup, update, and archive policy are not accepted.",
      },
      {
        fieldId: "media-restoration-scope",
        label: "Media restoration scope",
        status: "missing-policy",
        source: "media-playlist-fallback-binding",
        requiredValue: "Media playlist id, restored media ids, rights proof, caption/transcript review, and learning-audio priority",
        blockedReason: "Media playlist restoration and replacement remain blocked.",
      },
      {
        fieldId: "assignment-report-continuity",
        label: "Assignment and report continuity",
        status: "blocked",
        source: "assignment-report-scope",
        requiredValue: "Assignment continuity, report retention, report access, excluded learner-data rules, and no duplicate progress effects",
        blockedReason: "Student reassignment, learner-data deletion, and report export remain blocked.",
      },
      {
        fieldId: "teacher-school-communication",
        label: "Teacher and school communication",
        status: "missing-policy",
        source: "school-communication-policy",
        requiredValue: "Teacher notice, school admin notice, student-safe wording, support contact, target-language copy, and support-language copy",
        blockedReason: "Live notifications and restoration communication policy are not accepted.",
      },
      {
        fieldId: "restoration-effect",
        label: "Restoration effect",
        status: "blocked",
        source: "release-control",
        requiredValue: "Explicit statement of what restoration does and does not change",
        blockedReason: "Restoration cannot override missing school policy, release-control, persistence, report, media, local, or child-safety gates.",
      },
    ],
    nonRestoredMarkers: [
      "No restoration activated",
      "No production QR target restored",
      "No live notification sent",
      "No local bundle restored",
      "No media playlist restored",
      "No report export generated",
      "No student reassignment created",
    ],
    blockedActions: [
      "No restore normal route button",
      "No release-state mutation",
      "No production QR redirect mutation",
      "No live notification",
      "No classroom restart workflow",
      "No local bundle restoration",
      "No media replacement",
      "No report export",
      "No student reassignment",
    ],
    reviewRules: [
      "A future restoration record must bind to a real, policy-accepted fallback activation record.",
      "A future restoration record must identify the school operator and school organization.",
      "A future restoration record must state exactly which printed QR routes, local package, media playlist, report scope, and assignment scope are restored.",
      "Restoration must not create progress, collection unlocks, AI Tutor activation, report export, learner-data deletion, or student reassignment by itself.",
      "Restoration must preserve support-language-as-support-only rules and cannot create target-language progress evidence.",
    ],
  };
}
