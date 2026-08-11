import {
  sampleAiGeneratedPackageWriterRollbackDrills,
  type AiGeneratedPackageWriterRollbackDrill,
} from "@/data/sampleAiGeneratedPackageWriterRollbackDrill";
import {
  getAiGeneratedPackageWriterImplementationReadinessCollectionWarnings,
  validateAiGeneratedPackageWriterImplementationReadinessCollection,
  type AiGeneratedPackageWriterImplementationReadiness,
  type AiGeneratedPackageWriterImplementationReadinessStatus,
  type AiGeneratedPackageWriterModule,
  type AiGeneratedPackageWriterModuleStatus,
} from "@living-textbook/content-model/src/aiPackageWriterImplementationReadiness";

export type {
  AiGeneratedPackageWriterImplementationReadiness,
  AiGeneratedPackageWriterImplementationReadinessStatus,
  AiGeneratedPackageWriterModule,
  AiGeneratedPackageWriterModuleStatus,
};

export const sampleAiGeneratedPackageWriterImplementationReadiness: AiGeneratedPackageWriterImplementationReadiness[] =
  sampleAiGeneratedPackageWriterRollbackDrills.map((drill) => createImplementationReadiness(drill));

export const sampleAiGeneratedPackageWriterImplementationReadinessErrors =
  validateAiGeneratedPackageWriterImplementationReadinessCollection(
    sampleAiGeneratedPackageWriterImplementationReadiness,
  );

export const sampleAiGeneratedPackageWriterImplementationReadinessWarnings =
  getAiGeneratedPackageWriterImplementationReadinessCollectionWarnings(
    sampleAiGeneratedPackageWriterImplementationReadiness,
  );

export function filterAiGeneratedPackageWriterImplementationReadinessByTenant(
  readiness: AiGeneratedPackageWriterImplementationReadiness[],
  tenantId: string,
): AiGeneratedPackageWriterImplementationReadiness[] {
  return readiness.filter((item) => item.tenantId === tenantId);
}

function createImplementationReadiness(
  drill: AiGeneratedPackageWriterRollbackDrill,
): AiGeneratedPackageWriterImplementationReadiness {
  const isMiniStar = drill.tenantId === "ministar";

  return {
    readinessId: `ai-generated-package-writer-implementation-readiness-${drill.requestId}`,
    tenantId: drill.tenantId,
    requestId: drill.requestId,
    rollbackDrillId: drill.drillId,
    label: isMiniStar
      ? "MiniStar generated package writer implementation readiness"
      : "AI generated package writer implementation readiness",
    summary:
      "Review-only readiness gate for a future generated package writer implementation. It names the modules, test gates, release controls, and blocked implementation actions required before any writer code can exist.",
    status: "blocked",
    readinessState: "Implementation readiness blocked until Codex package-writer decision",
    packageIdPreview: drill.packageIdPreview,
    modulePlan: [
      {
        moduleId: `${drill.packageIdPreview}-content-package-writer-module`,
        label: "Content package writer module",
        status: "blocked",
        implementationBoundary: "Writes reviewed package JSON only after release-control and approval gates pass.",
        requiredInputs: ["ai_generated_package_manifest", "ai_generated_package_writer_preflight", drill.drillId],
        blockedActions: ["No package writer implementation", "No package writer execution"],
      },
      {
        moduleId: `${drill.packageIdPreview}-route-registry-writer-module`,
        label: "Route registry writer module",
        status: "blocked",
        implementationBoundary: "Writes route registry entries only through release-control and QR alias policy.",
        requiredInputs: ["classroom_launch_gate", "school_launch_policy_gate", "release_rollback_map"],
        blockedActions: ["No route registry mutation", "No production QR redirect mutation"],
      },
      {
        moduleId: `${drill.packageIdPreview}-media-playlist-writer-module`,
        label: "Media playlist writer module",
        status: "blocked",
        implementationBoundary: "Writes playlist bindings only after media rights and learning-audio priority pass.",
        requiredInputs: ["media_rights_manifest", "package_game_audio_coverage", "background_media_policy_binding"],
        blockedActions: ["No media playlist creation", "No background media override"],
      },
      {
        moduleId: `${drill.packageIdPreview}-local-companion-writer-module`,
        label: "Local companion writer module",
        status: "blocked",
        implementationBoundary: "Writes local package manifests only after local companion release policy passes.",
        requiredInputs: ["local_companion_release_gate", "local_companion_handoff", "local_media_bundle_entry"],
        blockedActions: ["No local bundle packaging", "No local folder activation"],
      },
      {
        moduleId: `${drill.packageIdPreview}-assignment-shell-writer-module`,
        label: "Assignment shell writer module",
        status: "blocked",
        implementationBoundary: "Writes assignment preview shells only after rollout, roster, and school policy gates pass.",
        requiredInputs: ["teacher_assignment_rollout_gate", "class_roster_plan", "school_launch_policy_gate"],
        blockedActions: ["No assignment activation", "No real learner data mutation"],
      },
      {
        moduleId: `${drill.packageIdPreview}-release-rollback-guard-module`,
        label: "Release rollback guard module",
        status: "blocked",
        implementationBoundary: "Verifies pre-write snapshots and rollback drills before any generated write transaction.",
        requiredInputs: [drill.drillId, "release_rollback_map", "school_rollback_safe_fallback_preflight"],
        blockedActions: ["No rollback execution", "No rollback map write"],
      },
    ],
    requiredTestGates: [
      "Storage contract verification",
      "Rollback drill replay",
      "Route smoke verification",
      "Support-language boundary test",
      "No real learner data mutation test",
      "Local companion export test",
    ],
    releaseControls: [
      "Feature flag disabled by default",
      "Manual Codex implementation decision",
      "Teacher approval ledger required",
      "School policy gate required",
      "Rollback map accepted before writer execution",
    ],
    blockedImplementationActions: [
      "No package writer implementation",
      "No package writer execution",
      "No generated app file write",
      "No route registry mutation",
      "No media playlist creation",
      "No local bundle packaging",
      "No assignment activation",
      "No rollback execution",
      "No production QR redirect mutation",
      "No support-language-only implementation evidence",
    ],
    nextRequiredRecords: [
      "ai_generated_package_writer_rollback_drill",
      "ai_generated_package_writer_rollback_drill storage contract",
      "package_writer_module_test_plan",
      "release_rollback_map",
      "codex_package_writer_implementation_decision",
    ],
    supportLanguageBoundary: drill.supportLanguageBoundary,
  };
}
