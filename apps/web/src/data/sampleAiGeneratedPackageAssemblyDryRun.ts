import { sampleAiGeneratedPackageAssemblyReadiness } from "@/data/sampleAiGeneratedPackageAssemblyReadiness";
import type { AiGeneratedPackageAssemblyReadiness } from "@living-textbook/content-model/src/aiGeneratedPackageAssemblyReadiness";
import {
  getAiGeneratedPackageAssemblyDryRunCollectionWarnings,
  validateAiGeneratedPackageAssemblyDryRuns,
  type AiGeneratedPackageAssemblyArtifact,
  type AiGeneratedPackageAssemblyArtifactStatus,
  type AiGeneratedPackageAssemblyDryRun,
  type AiGeneratedPackageAssemblyDryRunStatus,
} from "@living-textbook/content-model/src/aiPackageAssemblyDryRun";

export type {
  AiGeneratedPackageAssemblyArtifact,
  AiGeneratedPackageAssemblyArtifactStatus,
  AiGeneratedPackageAssemblyDryRun,
  AiGeneratedPackageAssemblyDryRunStatus,
};

export const sampleAiGeneratedPackageAssemblyDryRuns: AiGeneratedPackageAssemblyDryRun[] =
  sampleAiGeneratedPackageAssemblyReadiness.map((readiness) => createDryRun(readiness));

export const sampleAiGeneratedPackageAssemblyDryRunErrors = validateAiGeneratedPackageAssemblyDryRuns(
  sampleAiGeneratedPackageAssemblyDryRuns,
);

export const sampleAiGeneratedPackageAssemblyDryRunWarnings =
  getAiGeneratedPackageAssemblyDryRunCollectionWarnings(sampleAiGeneratedPackageAssemblyDryRuns);

export function filterAiGeneratedPackageAssemblyDryRunsByTenant(
  dryRuns: AiGeneratedPackageAssemblyDryRun[],
  tenantId: string,
): AiGeneratedPackageAssemblyDryRun[] {
  return dryRuns.filter((dryRun) => dryRun.tenantId === tenantId);
}

function createDryRun(readiness: AiGeneratedPackageAssemblyReadiness): AiGeneratedPackageAssemblyDryRun {
  const isMiniStar = readiness.tenantId === "ministar";
  const packageIdPreview = isMiniStar
    ? "generated-ministar-l1-greetings-package-preview"
    : "generated-sample-publisher-l1-routines-package-preview";
  const routePreview = isMiniStar ? "/launch/ministar-generated-greetings-blocked" : "/launch/generated-package-preview-blocked";
  const playlistPreview = isMiniStar
    ? "playlist-ministar-generated-l1-greetings-blocked"
    : "playlist-sample-publisher-generated-l1-routines-blocked";

  return {
    dryRunId: `ai-generated-package-assembly-dry-run-${readiness.requestId}`,
    tenantId: readiness.tenantId,
    requestId: readiness.requestId,
    readinessId: readiness.readinessId,
    label: isMiniStar ? "MiniStar generated package assembly dry run" : "AI generated package assembly dry run",
    summary:
      "Review-only dry-run artifact map before writes. It previews the package JSON, route registry entry, media playlist, local bundle, assignment shell, and teacher report binding that would be needed after every readiness lane clears.",
    status: "blocked",
    dryRunState: "Artifact map before writes",
    packageIdPreview,
    versionPreview: "2026.1-dry-run-preview",
    artifacts: [
      {
        artifactId: `${packageIdPreview}-package-json`,
        label: "Generated package JSON",
        artifactType: "teacher_draft_package -> content_package",
        status: "blocked",
        proposedPath: `/packages/${packageIdPreview}.json`,
        sourceRecords: [
          readiness.manifestId,
          readiness.promotionChecklistId,
          readiness.publishReadinessGateId,
          readiness.releaseCandidateId,
        ],
        previewContents: [
          "Reviewed unit payload snapshot",
          "Curated activity pathway",
          "Target-language audio manifest links",
          "Media rights and approval references",
        ],
        blockedWrites: ["No package JSON write from dry run", "No content package promotion from dry run"],
      },
      {
        artifactId: `${packageIdPreview}-route-registry`,
        label: "Route registry entry",
        artifactType: "route_registry",
        status: "blocked",
        proposedPath: routePreview,
        sourceRecords: [readiness.readinessId, "package_publish_gate", "classroom_launch_gate"],
        previewContents: ["Stable launch route", "Tenant id", "Package version", "Launch safety state"],
        blockedWrites: ["No route registry write from dry run", "No QR target mutation from dry run"],
      },
      {
        artifactId: `${packageIdPreview}-media-playlist`,
        label: "Media playlist binding",
        artifactType: "media_playlist_binding",
        status: "blocked",
        proposedPath: `/media/${playlistPreview}`,
        sourceRecords: ["media_rights_manifest", "package_game_audio_coverage", "background_media_policy_binding"],
        previewContents: ["Target-language audio priority", "Optional background media", "Video and music policy state"],
        blockedWrites: ["No media playlist write from dry run", "No background media override from dry run"],
      },
      {
        artifactId: `${packageIdPreview}-local-bundle`,
        label: "Local companion artifact",
        artifactType: "local_media_bundle_entry",
        status: "blocked",
        proposedPath: `/local/${readiness.tenantId}/${packageIdPreview}`,
        sourceRecords: ["local_companion_release_gate", readiness.readinessId],
        previewContents: ["Closed local package manifest", "Offline route map", "Media file inventory", "Rollback notes"],
        blockedWrites: ["No local bundle write from dry run", "No local folder activation from dry run"],
      },
      {
        artifactId: `${packageIdPreview}-assignment-shell`,
        label: "Assignment shell",
        artifactType: "teacher_assignment_rollout_gate",
        status: "blocked",
        proposedPath: `/assign/${packageIdPreview}-blocked`,
        sourceRecords: ["teacher_assignment_rollout_gate", "class_roster_plan", readiness.readinessId],
        previewContents: ["Teacher-led QR entry", "Student self-progression path", "Roster/report policy state"],
        blockedWrites: ["No assignment from dry run", "No real learner data from dry run"],
      },
    ],
    allowedReviewActions: [
      "Inspect dry-run artifact map",
      "Compare proposed artifacts with readiness blockers",
      "Return generated draft for correction",
      "Prepare missing approval, media-rights, audio, release, and local-bundle records",
    ],
    blockedDryRunActions: [
      "No package JSON write from dry run",
      "No route registry write from dry run",
      "No media playlist write from dry run",
      "No local bundle write from dry run",
      "No assignment from dry run",
      "No student-ready marker from dry run",
      "No support-language-only assembly dry run",
    ],
    nextRequiredRecords: [
      "ai_generated_package_assembly_readiness",
      "package_approval_ledger",
      "media_rights_manifest",
      "package_game_audio_coverage",
      "package_publish_gate",
      "local_companion_release_gate",
      "teacher_assignment_rollout_gate",
    ],
    supportLanguageBoundary: readiness.supportLanguageBoundary,
  };
}
