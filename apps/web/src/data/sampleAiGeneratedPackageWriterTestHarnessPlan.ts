import {
  sampleAiGeneratedPackageWriterTestEvidencePackets,
  type AiGeneratedPackageWriterTestEvidencePacket,
} from "@/data/sampleAiGeneratedPackageWriterTestEvidencePacket";

export type AiGeneratedPackageWriterTestHarnessPlanStatus = "blocked" | "review-only";

export interface AiGeneratedPackageWriterTestHarnessPhase {
  phaseId: string;
  label: string;
  purpose: string;
  requiredInputs: string[];
  plannedChecks: string[];
  blockedExecution: string[];
}

export interface AiGeneratedPackageWriterTestHarnessAdapter {
  adapterId: string;
  label: string;
  target: string;
  commandScope: string[];
  blockedAdapters: string[];
}

export interface AiGeneratedPackageWriterTestHarnessPlan {
  harnessPlanId: string;
  tenantId: string;
  requestId: string;
  evidencePacketId: string;
  moduleTestPlanId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageWriterTestHarnessPlanStatus;
  harnessState: string;
  packageIdPreview: string;
  harnessPhases: AiGeneratedPackageWriterTestHarnessPhase[];
  environmentAdapters: AiGeneratedPackageWriterTestHarnessAdapter[];
  requiredBeforeHarness: string[];
  blockedHarnessActions: string[];
  supportLanguageBoundary: string[];
}

export const sampleAiGeneratedPackageWriterTestHarnessPlans: AiGeneratedPackageWriterTestHarnessPlan[] =
  sampleAiGeneratedPackageWriterTestEvidencePackets.map((packet) => createHarnessPlan(packet));

export function filterAiGeneratedPackageWriterTestHarnessPlansByTenant(
  plans: AiGeneratedPackageWriterTestHarnessPlan[],
  tenantId: string,
): AiGeneratedPackageWriterTestHarnessPlan[] {
  return plans.filter((plan) => plan.tenantId === tenantId);
}

function createHarnessPlan(packet: AiGeneratedPackageWriterTestEvidencePacket): AiGeneratedPackageWriterTestHarnessPlan {
  const isMiniStar = packet.tenantId === "ministar";

  return {
    harnessPlanId: `ai-generated-package-writer-test-harness-plan-${packet.requestId}`,
    tenantId: packet.tenantId,
    requestId: packet.requestId,
    evidencePacketId: packet.evidencePacketId,
    moduleTestPlanId: packet.moduleTestPlanId,
    label: isMiniStar
      ? "MiniStar generated package writer test harness plan"
      : "AI generated package writer test harness plan",
    summary:
      "Review-only package writer test harness plan. It names future dry-run harness phases and environment adapters before any test runner, mutation browser run, app patch, package write, route write, playlist write, local bundle packaging, or assignment activation can exist.",
    status: "blocked",
    harnessState: "Harness plan blocked until Codex test harness implementation decision",
    packageIdPreview: packet.packageIdPreview,
    harnessPhases: [
      {
        phaseId: `${packet.packageIdPreview}-fixture-replay-phase`,
        label: "Fixture replay phase",
        purpose: "Replay reviewed generated package JSON against the shared content-model validators.",
        requiredInputs: ["Reviewed generated package JSON", "Draft payload validator", "Teacher approval ledger snapshot"],
        plannedChecks: [
          "8-12 vocabulary terms",
          "Exactly two target sentence structures",
          "Target-language-only progress trigger",
          "Support language remains support-only",
        ],
        blockedExecution: ["No generated package JSON write", "No support-language-only fixture pass"],
      },
      {
        phaseId: `${packet.packageIdPreview}-route-smoke-phase`,
        label: "Route smoke phase",
        purpose: "Plan future route smoke checks for reviewed aliases without mutating route registries.",
        requiredInputs: ["Reviewed route registry preview", "Permanent QR alias policy", "Launch safety gate"],
        plannedChecks: [
          "Student route stays controlled practice",
          "Production QR redirect mutation remains blocked",
          "Teacher launch gate remains visible",
        ],
        blockedExecution: ["No route registry write", "No production QR redirect mutation"],
      },
      {
        phaseId: `${packet.packageIdPreview}-media-policy-phase`,
        label: "Media policy phase",
        purpose: "Plan future media and learning-audio checks before playlist writes exist.",
        requiredInputs: ["Tap-to-speak audio coverage report", "Media rights manifest", "Background media policy"],
        plannedChecks: [
          "Every target-language text has audio support",
          "Background media cannot replace learning audio",
          "Media-only progress remains blocked",
        ],
        blockedExecution: ["No media playlist write", "No generated voice or speech scoring cost"],
      },
      {
        phaseId: `${packet.packageIdPreview}-local-assignment-phase`,
        label: "Local and assignment phase",
        purpose: "Plan local companion and assignment-shell checks while keeping launch workflows blocked.",
        requiredInputs: ["Local companion export dry run", "Teacher assignment rollout gate", "Class roster plan"],
        plannedChecks: [
          "Local package stays inactive",
          "Assignment shells remain preview-only",
          "Real learner data remains blocked",
        ],
        blockedExecution: ["No local bundle packaging", "No assignment activation"],
      },
      {
        phaseId: `${packet.packageIdPreview}-rollback-guard-phase`,
        label: "Rollback guard phase",
        purpose: "Plan future rollback guard checks before any writer or rollback execution exists.",
        requiredInputs: ["Rollback drill replay result", "School rollback policy preview", "Production QR mutation block"],
        plannedChecks: [
          "Pre-write snapshots are required",
          "Post-write verification is required",
          "Rollback execution remains blocked",
        ],
        blockedExecution: ["No rollback execution", "No app file patch"],
      },
    ],
    environmentAdapters: [
      {
        adapterId: `${packet.packageIdPreview}-static-fixture-adapter`,
        label: "Static fixture adapter",
        target: "content-model validation",
        commandScope: ["Read reviewed JSON fixture", "Run pure validation", "Emit evidence-only report"],
        blockedAdapters: ["No file writes", "No generated package commit"],
      },
      {
        adapterId: `${packet.packageIdPreview}-browser-smoke-adapter`,
        label: "Browser smoke adapter",
        target: "future route smoke checks",
        commandScope: ["Open reviewed preview routes", "Check expected text", "Capture non-mutating report"],
        blockedAdapters: ["No mutation browser run", "No route registry write"],
      },
      {
        adapterId: `${packet.packageIdPreview}-local-dry-run-adapter`,
        label: "Local dry-run adapter",
        target: "future closed local package checks",
        commandScope: ["Read local manifest preview", "Check package map", "Emit export-readiness report"],
        blockedAdapters: ["No local bundle packaging", "No local folder activation"],
      },
    ],
    requiredBeforeHarness: [
      "package_writer_test_evidence_packet storage contract",
      "Codex test harness implementation decision",
      "Release rollback guard review",
      "School policy acceptance preflight",
      "Teacher approval evidence",
    ],
    blockedHarnessActions: [
      "No test harness implementation",
      "No automated writer test execution",
      "No writer mutation browser run",
      "No evidence upload or signed approval capture",
      "No app file patch",
      "No generated package JSON write",
      "No route registry write",
      "No media playlist write",
      "No local bundle packaging",
      "No assignment activation",
      "No production QR redirect mutation",
      "No support-language-only harness pass",
    ],
    supportLanguageBoundary: packet.supportLanguageBoundary,
  };
}
