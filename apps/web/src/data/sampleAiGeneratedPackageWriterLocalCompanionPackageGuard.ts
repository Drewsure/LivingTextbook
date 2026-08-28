import {
  sampleAiGeneratedPackageWriterRoutePlaylistWriteGuards,
  type AiGeneratedPackageWriterRoutePlaylistWriteGuard,
} from "@/data/sampleAiGeneratedPackageWriterRoutePlaylistWriteGuard";
import {
  getAiGeneratedPackageWriterLocalCompanionPackageGuardCollectionWarnings,
  validateAiGeneratedPackageWriterLocalCompanionPackageGuards,
  type AiGeneratedPackageWriterLocalCompanionArtifact,
  type AiGeneratedPackageWriterLocalCompanionArtifactStatus,
  type AiGeneratedPackageWriterLocalCompanionPackageGuard,
  type AiGeneratedPackageWriterLocalCompanionPackageGuardStatus,
} from "@living-textbook/content-model/src/aiPackageWriterLocalCompanionPackageGuard";

export type {
  AiGeneratedPackageWriterLocalCompanionArtifact,
  AiGeneratedPackageWriterLocalCompanionArtifactStatus,
  AiGeneratedPackageWriterLocalCompanionPackageGuard,
  AiGeneratedPackageWriterLocalCompanionPackageGuardStatus,
};

export const sampleAiGeneratedPackageWriterLocalCompanionPackageGuards:
  AiGeneratedPackageWriterLocalCompanionPackageGuard[] =
  sampleAiGeneratedPackageWriterRoutePlaylistWriteGuards.map((guard) => createLocalCompanionPackageGuard(guard));

export const sampleAiGeneratedPackageWriterLocalCompanionPackageGuardErrors =
  validateAiGeneratedPackageWriterLocalCompanionPackageGuards(
    sampleAiGeneratedPackageWriterLocalCompanionPackageGuards,
  );

export const sampleAiGeneratedPackageWriterLocalCompanionPackageGuardWarnings =
  getAiGeneratedPackageWriterLocalCompanionPackageGuardCollectionWarnings(
    sampleAiGeneratedPackageWriterLocalCompanionPackageGuards,
  );

export function filterAiGeneratedPackageWriterLocalCompanionPackageGuardsByTenant(
  guards: AiGeneratedPackageWriterLocalCompanionPackageGuard[],
  tenantId: string,
): AiGeneratedPackageWriterLocalCompanionPackageGuard[] {
  return guards.filter((guard) => guard.tenantId === tenantId);
}

function createLocalCompanionPackageGuard(
  routePlaylistGuard: AiGeneratedPackageWriterRoutePlaylistWriteGuard,
): AiGeneratedPackageWriterLocalCompanionPackageGuard {
  const isMiniStar = routePlaylistGuard.tenantId === "ministar";
  const packageIdPreview = routePlaylistGuard.packageIdPreview;
  const localPackagePreview = isMiniStar
    ? "ministar-local-companion-l1-greetings-preview-blocked"
    : "sample-publisher-local-companion-l1-routines-preview-blocked";

  return {
    guardId: `ai-generated-package-writer-local-companion-package-guard-${routePlaylistGuard.requestId}`,
    tenantId: routePlaylistGuard.tenantId,
    requestId: routePlaylistGuard.requestId,
    routePlaylistGuardId: routePlaylistGuard.guardId,
    label: isMiniStar ? "MiniStar local companion package guard" : "AI package writer local companion package guard",
    summary: isMiniStar
      ? "Closed local package work stays blocked until English route and audio triggers, hiragana support-only rules, offline route maps, media inventory, and student-data exclusion are reviewed."
      : "Closed local package work stays blocked until target-language route triggers, offline route maps, media inventory, local restore points, and student-data exclusion are reviewed.",
    status: "blocked",
    guardState: "Local companion blocked pending review",
    packageIdPreview,
    protectedArtifacts: [
      {
        artifactId: `${localPackagePreview}-manifest`,
        label: "Closed local manifest guard",
        artifactKind: "local_manifest",
        status: "blocked",
        sourceRecord: packageIdPreview,
        requiredProofs: [
          routePlaylistGuard.guardId,
          "Closed local manifest review",
          "Release-control binding",
          "School policy acceptance preflight",
        ],
        blockedActions: ["No local bundle packaging", "No local folder activation"],
      },
      {
        artifactId: `${localPackagePreview}-media-inventory`,
        label: "Media bundle inventory guard",
        artifactKind: "media_bundle_inventory",
        status: "blocked",
        sourceRecord: `${packageIdPreview}-media-playlist-binding`,
        requiredProofs: [
          "Media rights and file inventory review",
          "Target-language audio first check",
          "No background music overriding learning audio",
        ],
        blockedActions: ["No media file copy", "No playlist rewrite from local package"],
      },
      {
        artifactId: `${localPackagePreview}-offline-route-map`,
        label: "Offline route map guard",
        artifactKind: "offline_route_map",
        status: "blocked",
        sourceRecord: "offline-route-map-preview",
        requiredProofs: [
          "Offline route map smoke check",
          "Target-language launch route check",
          "Teacher route isolation check",
        ],
        blockedActions: ["No offline route activation", "No route rewrite from local package"],
      },
      {
        artifactId: `${localPackagePreview}-qr-fallback-sheet`,
        label: "Printed QR fallback guard",
        artifactKind: "qr_fallback_sheet",
        status: "blocked",
        sourceRecord: "printed-qr-fallback-preview",
        requiredProofs: [
          "Printed QR fallback review",
          "Stable QR deep link smoke check",
          "Production QR redirect remains unchanged",
        ],
        blockedActions: ["No production QR redirect mutation", "No QR fallback publish"],
      },
      {
        artifactId: `${localPackagePreview}-export-archive`,
        label: "Export archive guard",
        artifactKind: "export_archive",
        status: "blocked",
        sourceRecord: "local-export-archive-preview",
        requiredProofs: [
          "Student data exclusion check",
          "Media rights and file inventory review",
          "School policy acceptance preflight",
        ],
        blockedActions: ["No export archive creation", "No local companion release"],
      },
      {
        artifactId: `${localPackagePreview}-restore-checkpoint`,
        label: "Restore checkpoint guard",
        artifactKind: "restore_checkpoint",
        status: "blocked",
        sourceRecord: "rollback-restore-checkpoint-preview",
        requiredProofs: [
          "Rollback restore checkpoint review",
          "Rollback guard review",
          "Local companion safe fallback",
        ],
        blockedActions: ["No restore checkpoint write", "No rollback execution"],
      },
    ],
    localSafetyChecks: [
      "Closed local manifest review",
      "Media rights and file inventory review",
      "Rollback restore checkpoint review",
      "No local folder activation from guard",
      ...(isMiniStar ? ["English local companion trigger protected"] : []),
    ],
    offlineFallbackChecks: [
      "Offline route map smoke check",
      "Printed QR fallback review",
      "Student data exclusion check",
      "No offline activation from guard",
      ...(isMiniStar ? ["Hiragana local companion support remains support-only"] : []),
    ],
    blockedPackageActions: [
      "No local bundle packaging",
      "No local folder activation",
      "No offline route activation",
      "No media file copy",
      "No export archive creation",
      "No local companion release",
      "No assignment activation from local companion",
      "No support-language-only local package approval",
      "No writer execution",
    ],
    nextRequiredRecords: [
      "Local companion package guard storage contract",
      "Assignment shell guard review",
      "Rollback guard review",
      "Signed approval preflight",
      "School policy acceptance preflight",
    ],
    supportLanguageBoundary: routePlaylistGuard.supportLanguageBoundary,
  };
}
