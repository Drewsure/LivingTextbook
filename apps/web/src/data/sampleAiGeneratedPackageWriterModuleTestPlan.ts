import {
  sampleAiGeneratedPackageWriterImplementationReadiness,
  type AiGeneratedPackageWriterImplementationReadiness,
} from "@/data/sampleAiGeneratedPackageWriterImplementationReadiness";
import {
  getAiGeneratedPackageWriterModuleTestPlanCollectionWarnings,
  validateAiGeneratedPackageWriterModuleTestPlans,
  type AiGeneratedPackageWriterModuleTestPlan,
  type AiGeneratedPackageWriterModuleTestPlanStatus,
  type AiGeneratedPackageWriterModuleTestSuite,
} from "@living-textbook/content-model/src/aiPackageWriterModuleTestPlan";

export type {
  AiGeneratedPackageWriterModuleTestPlan,
  AiGeneratedPackageWriterModuleTestPlanStatus,
  AiGeneratedPackageWriterModuleTestSuite,
};

export const sampleAiGeneratedPackageWriterModuleTestPlans: AiGeneratedPackageWriterModuleTestPlan[] =
  sampleAiGeneratedPackageWriterImplementationReadiness.map((readiness) => createModuleTestPlan(readiness));

export const sampleAiGeneratedPackageWriterModuleTestPlanErrors = validateAiGeneratedPackageWriterModuleTestPlans(
  sampleAiGeneratedPackageWriterModuleTestPlans,
);

export const sampleAiGeneratedPackageWriterModuleTestPlanWarnings =
  getAiGeneratedPackageWriterModuleTestPlanCollectionWarnings(sampleAiGeneratedPackageWriterModuleTestPlans);

export function filterAiGeneratedPackageWriterModuleTestPlansByTenant(
  plans: AiGeneratedPackageWriterModuleTestPlan[],
  tenantId: string,
): AiGeneratedPackageWriterModuleTestPlan[] {
  return plans.filter((plan) => plan.tenantId === tenantId);
}

function createModuleTestPlan(
  readiness: AiGeneratedPackageWriterImplementationReadiness,
): AiGeneratedPackageWriterModuleTestPlan {
  const isMiniStar = readiness.tenantId === "ministar";

  return {
    testPlanId: `ai-generated-package-writer-module-test-plan-${readiness.requestId}`,
    tenantId: readiness.tenantId,
    requestId: readiness.requestId,
    implementationReadinessId: readiness.readinessId,
    rollbackDrillId: readiness.rollbackDrillId,
    label: isMiniStar
      ? "MiniStar generated package writer module test plan"
      : "AI generated package writer module test plan",
    summary:
      "Review-only package writer module test plan. It defines required fixture, route, audio, local export, rollback, and support-language assertions before any writer implementation or test execution can exist.",
    status: "blocked",
    testPlanState: "Module test plan blocked until storage contract and Codex implementation decision",
    packageIdPreview: readiness.packageIdPreview,
    moduleTestSuites: [
      {
        suiteId: `${readiness.packageIdPreview}-content-package-writer-tests`,
        moduleId: `${readiness.packageIdPreview}-content-package-writer-module`,
        label: "Content package writer module tests",
        requiredFixtures: ["Reviewed generated package JSON", "Teacher approval ledger snapshot"],
        requiredAssertions: [
          "Writes reviewed package JSON only",
          "Preserves 8-12 vocabulary range",
          "Preserves exactly two target sentence structures",
          "Rejects support-language-only progress triggers",
        ],
        blockedExecution: ["No app file patch", "No generated package JSON write"],
      },
      {
        suiteId: `${readiness.packageIdPreview}-route-registry-writer-tests`,
        moduleId: `${readiness.packageIdPreview}-route-registry-writer-module`,
        label: "Route registry writer module tests",
        requiredFixtures: ["Reviewed launch route preview", "Permanent QR alias policy snapshot"],
        requiredAssertions: [
          "Writes only approved route aliases",
          "Keeps production QR redirects blocked",
          "Requires route smoke verification",
        ],
        blockedExecution: ["No route registry write", "No production QR redirect mutation"],
      },
      {
        suiteId: `${readiness.packageIdPreview}-media-playlist-writer-tests`,
        moduleId: `${readiness.packageIdPreview}-media-playlist-writer-module`,
        label: "Media playlist writer module tests",
        requiredFixtures: ["Media rights manifest", "Target-language audio coverage report"],
        requiredAssertions: [
          "Requires learning-audio priority",
          "Preserves tap-to-speak cue coverage",
          "Blocks background media from replacing learning audio",
        ],
        blockedExecution: ["No media playlist write", "No background media override"],
      },
      {
        suiteId: `${readiness.packageIdPreview}-local-companion-writer-tests`,
        moduleId: `${readiness.packageIdPreview}-local-companion-writer-module`,
        label: "Local companion writer module tests",
        requiredFixtures: ["Local companion handoff", "Local media bundle manifest"],
        requiredAssertions: [
          "Exports local package manifests only",
          "Keeps offline activation blocked",
          "Requires local companion release policy",
        ],
        blockedExecution: ["No local bundle packaging", "No local folder activation"],
      },
      {
        suiteId: `${readiness.packageIdPreview}-assignment-shell-writer-tests`,
        moduleId: `${readiness.packageIdPreview}-assignment-shell-writer-module`,
        label: "Assignment shell writer module tests",
        requiredFixtures: ["Teacher assignment rollout gate", "Class roster plan"],
        requiredAssertions: [
          "Creates preview shells only",
          "Rejects real learner data mutation",
          "Requires school launch policy",
        ],
        blockedExecution: ["No assignment activation", "No real learner data mutation"],
      },
      {
        suiteId: `${readiness.packageIdPreview}-release-rollback-guard-tests`,
        moduleId: `${readiness.packageIdPreview}-release-rollback-guard-module`,
        label: "Release rollback guard module tests",
        requiredFixtures: ["Rollback drill replay", "Release rollback map preview"],
        requiredAssertions: [
          "Requires pre-write snapshots",
          "Requires post-write verification",
          "Keeps rollback execution blocked",
        ],
        blockedExecution: ["No rollback execution", "No rollback map write"],
      },
    ],
    requiredEvidence: [
      "Reviewed JSON fixture replay",
      "Route smoke verification",
      "Tap-to-speak audio coverage report",
      "Local companion export dry run",
      "Rollback drill replay result",
      "Support-language boundary proof",
    ],
    blockedTestActions: [
      "No automated writer test execution",
      "No Playwright writer mutation run",
      "No app file patch",
      "No generated package JSON write",
      "No route registry write",
      "No media playlist write",
      "No local bundle packaging",
      "No assignment activation",
      "No production QR redirect mutation",
      "No support-language-only test pass",
    ],
    nextRequiredRecords: [
      "ai_generated_package_writer_implementation_readiness",
      "ai_generated_package_writer_implementation_readiness storage contract",
      "package_writer_module_test_plan storage contract",
      "release_rollback_map",
      "codex_package_writer_implementation_decision",
    ],
    supportLanguageBoundary: readiness.supportLanguageBoundary,
  };
}
