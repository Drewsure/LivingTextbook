import {
  sampleSchoolRollbackSafeFallbackPreflight,
  type SchoolRollbackSafeFallbackPreflight,
} from "@/data/sampleSchoolRollbackSafeFallbackPreflight";

export type SafeFallbackActivationPreviewStatus = "blocked" | "missing-policy" | "future-required";

export interface SafeFallbackActivationField {
  fieldId: string;
  label: string;
  status: SafeFallbackActivationPreviewStatus;
  source: string;
  requiredValue: string;
  blockedReason: string;
}

export interface SchoolRollbackSafeFallbackActivationPreview {
  previewId: string;
  label: string;
  sourcePreflightId: string;
  statusLabel: string;
  summary: string;
  minimumActivationRecordFields: SafeFallbackActivationField[];
  nonActivatedMarkers: string[];
  blockedActions: string[];
  reviewRules: string[];
}

export const sampleSchoolRollbackSafeFallbackActivationPreview = createSchoolRollbackSafeFallbackActivationPreview({
  preflight: sampleSchoolRollbackSafeFallbackPreflight,
});

export function createSchoolRollbackSafeFallbackActivationPreview({
  preflight,
}: {
  preflight: SchoolRollbackSafeFallbackPreflight;
}): SchoolRollbackSafeFallbackActivationPreview {
  return {
    previewId: `${preflight.preflightId}-activation-record-preview`,
    label: "Future safe fallback activation record preview",
    sourcePreflightId: preflight.preflightId,
    statusLabel: "Activation record blocked",
    summary:
      "This preview shows the minimum fields a future safe fallback activation record would need. It is not an activation record and cannot pause routes, send notices, change media, export reports, or move students.",
    minimumActivationRecordFields: [
      {
        fieldId: "authenticated-school-operator",
        label: "Authenticated school operator",
        status: "future-required",
        source: "reviewer-identity-signature-gate",
        requiredValue: "School operator id, role, school organization id, identity provider, and timestamp",
        blockedReason: "No authenticated fallback operator workflow exists.",
      },
      {
        fieldId: "accepted-safe-fallback-preflight",
        label: "Accepted safe fallback preflight",
        status: "missing-policy",
        source: preflight.preflightId,
        requiredValue: "safe_fallback_preflight_id, preflight revision, resolved lane statuses, and policy version",
        blockedReason: "The safe fallback preflight is review-only and cannot be accepted.",
      },
      {
        fieldId: "fallback-copy-version-binding",
        label: "Fallback copy version binding",
        status: "missing-policy",
        source: "child-safe-copy-review",
        requiredValue: "approved student, teacher, school admin, publisher, target-language, and support-language message versions",
        blockedReason: "Child-safe copy and support-language fallback wording are not accepted.",
      },
      {
        fieldId: "printed-qr-route-scope",
        label: "Printed QR route scope",
        status: "blocked",
        source: "printed-qr-fallback-policy",
        requiredValue: "route aliases, QR ids, cache/PWA effect, approved pause target, and rollback owner",
        blockedReason: "Production QR redirect mutation remains blocked.",
      },
      {
        fieldId: "local-companion-fallback-binding",
        label: "Local companion fallback binding",
        status: "missing-policy",
        source: "local-companion-fallback-policy",
        requiredValue: "local package id, backup snapshot, restore path, update/archive policy, and school support contact",
        blockedReason: "Local companion fallback, backup, restore, and archive policy are not accepted.",
      },
      {
        fieldId: "media-playlist-fallback-binding",
        label: "Media playlist fallback binding",
        status: "missing-policy",
        source: "media-playlist-fallback-policy",
        requiredValue: "media playlist id, rights proof, caption/transcript review, pause/replacement policy, and learning-audio priority",
        blockedReason: "Media replacement and playlist mutation remain blocked.",
      },
      {
        fieldId: "assignment-report-scope",
        label: "Assignment and report scope",
        status: "blocked",
        source: "assignment-and-report-policy",
        requiredValue: "student assignment continuity, teacher report retention, report access, and excluded learner-data rules",
        blockedReason: "Student reassignment, learner-data deletion, and report export remain blocked.",
      },
      {
        fieldId: "activation-effect",
        label: "Activation effect",
        status: "blocked",
        source: "release-control",
        requiredValue: "Explicit statement of what fallback activation does and does not change",
        blockedReason: "Activation cannot override missing school policy, release-control, persistence, report, media, local, or child-safety gates.",
      },
    ],
    nonActivatedMarkers: [
      "No fallback activated",
      "No production QR redirect stored",
      "No live notification sent",
      "No local bundle deactivated",
      "No media playlist changed",
      "No report export generated",
      "No student reassignment created",
    ],
    blockedActions: [
      "No activate fallback button",
      "No release-state mutation",
      "No production QR redirect mutation",
      "No live notification",
      "No classroom shutdown workflow",
      "No local bundle deactivation",
      "No media replacement",
      "No report export",
      "No student reassignment",
    ],
    reviewRules: [
      "A future activation record must bind to a reviewed safe fallback preflight revision.",
      "A future activation record must identify the school operator and school organization.",
      "A future activation record must state exactly which printed QR routes, local package, media playlist, report scope, and assignment scope are affected.",
      "Fallback activation must not create progress, collection unlocks, AI Tutor activation, report export, learner-data deletion, or student reassignment by itself.",
      "Rollback, deactivation, and restoration rules must exist before activation can affect launch readiness.",
    ],
  };
}
