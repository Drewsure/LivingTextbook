import {
  sampleAiGeneratedPackageWriterHarnessImplementationDecisions,
  type AiGeneratedPackageWriterHarnessImplementationDecision,
} from "@/data/sampleAiGeneratedPackageWriterHarnessImplementationDecision";
import {
  getAiGeneratedPackageWriterRoutePlaylistWriteGuardCollectionWarnings,
  validateAiGeneratedPackageWriterRoutePlaylistWriteGuards,
  type AiGeneratedPackageWriterRoutePlaylistSurface,
  type AiGeneratedPackageWriterRoutePlaylistSurfaceStatus,
  type AiGeneratedPackageWriterRoutePlaylistWriteGuard,
  type AiGeneratedPackageWriterRoutePlaylistWriteGuardStatus,
} from "@living-textbook/content-model/src/aiPackageWriterRoutePlaylistWriteGuard";

export type {
  AiGeneratedPackageWriterRoutePlaylistSurface,
  AiGeneratedPackageWriterRoutePlaylistSurfaceStatus,
  AiGeneratedPackageWriterRoutePlaylistWriteGuard,
  AiGeneratedPackageWriterRoutePlaylistWriteGuardStatus,
};

export const sampleAiGeneratedPackageWriterRoutePlaylistWriteGuards:
  AiGeneratedPackageWriterRoutePlaylistWriteGuard[] =
  sampleAiGeneratedPackageWriterHarnessImplementationDecisions.map((decision) =>
    createRoutePlaylistWriteGuard(decision),
  );

export const sampleAiGeneratedPackageWriterRoutePlaylistWriteGuardErrors =
  validateAiGeneratedPackageWriterRoutePlaylistWriteGuards(sampleAiGeneratedPackageWriterRoutePlaylistWriteGuards);

export const sampleAiGeneratedPackageWriterRoutePlaylistWriteGuardWarnings =
  getAiGeneratedPackageWriterRoutePlaylistWriteGuardCollectionWarnings(
    sampleAiGeneratedPackageWriterRoutePlaylistWriteGuards,
  );

export function filterAiGeneratedPackageWriterRoutePlaylistWriteGuardsByTenant(
  guards: AiGeneratedPackageWriterRoutePlaylistWriteGuard[],
  tenantId: string,
): AiGeneratedPackageWriterRoutePlaylistWriteGuard[] {
  return guards.filter((guard) => guard.tenantId === tenantId);
}

function createRoutePlaylistWriteGuard(
  decision: AiGeneratedPackageWriterHarnessImplementationDecision,
): AiGeneratedPackageWriterRoutePlaylistWriteGuard {
  const isMiniStar = decision.tenantId === "ministar";
  const packageIdPreview = isMiniStar
    ? "generated-ministar-l1-greetings-package-preview"
    : "generated-sample-publisher-l1-routines-package-preview";
  const routePreview = isMiniStar ? "/launch/ministar-generated-greetings-blocked" : "/launch/generated-package-preview-blocked";
  const playlistPreview = isMiniStar
    ? "playlist-ministar-generated-l1-greetings-blocked"
    : "playlist-sample-publisher-generated-l1-routines-blocked";

  return {
    guardId: `ai-generated-package-writer-route-playlist-write-guard-${decision.requestId}`,
    tenantId: decision.tenantId,
    requestId: decision.requestId,
    decisionId: decision.decisionId,
    label: isMiniStar ? "MiniStar route and playlist write guard" : "AI package writer route and playlist write guard",
    summary: isMiniStar
      ? "Route, playlist, and QR writes stay blocked until English route triggers, playlist audio, release-control, and hiragana support-only evidence are reviewed."
      : "Route, playlist, and QR writes stay blocked until target-language route triggers, playlist audio, release-control, and support-language boundaries are reviewed.",
    status: "blocked",
    guardState: "Route and playlist write blocked pending review",
    packageIdPreview,
    protectedSurfaces: [
      {
        surfaceId: `${packageIdPreview}-student-route-registry`,
        label: "Student launch route registry guard",
        surfaceKind: "student_route_registry",
        status: "blocked",
        sourceRecord: routePreview,
        requiredProofs: [
          decision.decisionId,
          "Generated package assembly dry run route artifact",
          "Stable QR deep link smoke check",
          "Release-control binding",
        ],
        blockedMutations: ["No student-facing route activation", "No route registry write", "No QR target mutation"],
      },
      {
        surfaceId: `${packageIdPreview}-teacher-route-registry`,
        label: "Teacher route registry guard",
        surfaceKind: "teacher_route_registry",
        status: "blocked",
        sourceRecord: `/teacher/sessions/${packageIdPreview}-blocked`,
        requiredProofs: [
          "Teacher route isolation check",
          "Teacher report policy state",
          "No real learner data collection",
        ],
        blockedMutations: ["No teacher route mutation", "No report route activation"],
      },
      {
        surfaceId: `${packageIdPreview}-media-playlist-binding`,
        label: "Media playlist binding guard",
        surfaceKind: "media_playlist_binding",
        status: "blocked",
        sourceRecord: `/media/${playlistPreview}`,
        requiredProofs: [
          "Media playlist preview",
          "Media rights manifest check",
          "Target-language audio first check",
          "Background media opt-in check",
        ],
        blockedMutations: ["No media playlist write", "No background media override"],
      },
      {
        surfaceId: `${packageIdPreview}-qr-deep-link`,
        label: "QR deep-link guard",
        surfaceKind: "qr_deep_link",
        status: "blocked",
        sourceRecord: "stable-qr-route-registry",
        requiredProofs: [
          "Stable QR deep link smoke check",
          "Front-door entry policy",
          "Production QR redirect remains unchanged",
        ],
        blockedMutations: ["No production QR redirect mutation", "No QR route rewrite"],
      },
      {
        surfaceId: `${packageIdPreview}-route-smoke-check`,
        label: "Route smoke check guard",
        surfaceKind: "route_smoke_check",
        status: "blocked",
        sourceRecord: "active-route-verification-preview",
        requiredProofs: [
          "Route smoke expectations",
          "Target-language launch route check",
          "No support-language-only route or playlist approval",
        ],
        blockedMutations: ["No generated route smoke pass", "No student-ready route marker"],
      },
    ],
    routeSafetyChecks: [
      "Stable QR deep link smoke check",
      "Target-language launch route check",
      "Teacher route isolation check",
      "No route registry write from guard",
      ...(isMiniStar ? ["English route trigger protected"] : []),
    ],
    playlistSafetyChecks: [
      "Media rights manifest check",
      "Target-language audio first check",
      "Background media opt-in check",
      "No media playlist write from guard",
    ],
    blockedWriteActions: [
      "No route registry write",
      "No media playlist write",
      "No production QR redirect mutation",
      "No student-facing route activation",
      "No route rewrite from generated package",
      "No playlist rewrite from generated package",
      "No support-language-only route or playlist approval",
      "No writer execution",
    ],
    nextRequiredRecords: [
      "Route and playlist write guard storage contract",
      "Local companion package guard review",
      "Assignment shell guard review",
      "Rollback guard review",
      "Signed approval preflight",
    ],
    supportLanguageBoundary: decision.supportLanguageBoundary,
  };
}
