import {
  sampleAiGeneratedPackageWriterModuleTestPlans,
  type AiGeneratedPackageWriterModuleTestPlan,
} from "@/data/sampleAiGeneratedPackageWriterModuleTestPlan";

export type AiGeneratedPackageWriterTestEvidencePacketStatus = "blocked" | "review-only";

export interface AiGeneratedPackageWriterTestEvidenceLane {
  laneId: string;
  label: string;
  sourceRecords: string[];
  requiredEvidence: string[];
  acceptanceChecks: string[];
  blockedGaps: string[];
}

export interface AiGeneratedPackageWriterTestEvidencePacket {
  evidencePacketId: string;
  tenantId: string;
  requestId: string;
  moduleTestPlanId: string;
  implementationReadinessId: string;
  rollbackDrillId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageWriterTestEvidencePacketStatus;
  evidenceState: string;
  packageIdPreview: string;
  evidenceLanes: AiGeneratedPackageWriterTestEvidenceLane[];
  missingEvidence: string[];
  blockedEvidenceActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const sampleAiGeneratedPackageWriterTestEvidencePackets: AiGeneratedPackageWriterTestEvidencePacket[] =
  sampleAiGeneratedPackageWriterModuleTestPlans.map((plan) => createTestEvidencePacket(plan));

export function filterAiGeneratedPackageWriterTestEvidencePacketsByTenant(
  packets: AiGeneratedPackageWriterTestEvidencePacket[],
  tenantId: string,
): AiGeneratedPackageWriterTestEvidencePacket[] {
  return packets.filter((packet) => packet.tenantId === tenantId);
}

function createTestEvidencePacket(
  plan: AiGeneratedPackageWriterModuleTestPlan,
): AiGeneratedPackageWriterTestEvidencePacket {
  const isMiniStar = plan.tenantId === "ministar";

  return {
    evidencePacketId: `ai-generated-package-writer-test-evidence-packet-${plan.requestId}`,
    tenantId: plan.tenantId,
    requestId: plan.requestId,
    moduleTestPlanId: plan.testPlanId,
    implementationReadinessId: plan.implementationReadinessId,
    rollbackDrillId: plan.rollbackDrillId,
    label: isMiniStar
      ? "MiniStar generated package writer test evidence packet"
      : "AI generated package writer test evidence packet",
    summary:
      "Review-only writer test evidence packet. It names the proof needed before writer module tests, mutation browser checks, route writes, playlist writes, local bundle packaging, or assignment activation can exist.",
    status: "blocked",
    evidenceState: "Evidence packet blocked until storage contract and Codex test harness decision",
    packageIdPreview: plan.packageIdPreview,
    evidenceLanes: [
      {
        laneId: `${plan.packageIdPreview}-fixture-evidence-lane`,
        label: "Fixture evidence lane",
        sourceRecords: [plan.testPlanId, plan.implementationReadinessId],
        requiredEvidence: ["Reviewed generated package JSON", "Reviewed JSON fixture replay", "Teacher approval ledger snapshot"],
        acceptanceChecks: [
          "Fixture proves target-language-only progression",
          "Fixture proves 8-12 vocabulary terms",
          "Fixture proves exactly two target sentences",
        ],
        blockedGaps: ["No fixture-only package write", "No support-language-only fixture acceptance"],
      },
      {
        laneId: `${plan.packageIdPreview}-route-evidence-lane`,
        label: "Route and QR evidence lane",
        sourceRecords: ["activity_compatibility_snapshot", "private_assignment_link", "school_policy_handoff_packet"],
        requiredEvidence: ["Route smoke verification", "Permanent QR alias policy snapshot", "Production QR mutation block"],
        acceptanceChecks: [
          "Route evidence references reviewed aliases only",
          "Route evidence keeps production QR redirects blocked",
          "Route evidence names school policy dependency",
        ],
        blockedGaps: ["No route registry write", "No production QR redirect mutation"],
      },
      {
        laneId: `${plan.packageIdPreview}-audio-media-evidence-lane`,
        label: "Audio and media evidence lane",
        sourceRecords: ["package_game_audio_coverage", "media_playlist_binding", "background_media_policy_binding"],
        requiredEvidence: ["Tap-to-speak audio coverage report", "Media rights manifest", "Background media policy review"],
        acceptanceChecks: [
          "Target-language audio covers all student-facing text",
          "Background media cannot override learning audio",
          "Media-only progress remains blocked",
        ],
        blockedGaps: ["No media playlist write", "No generated voice or speech scoring cost"],
      },
      {
        laneId: `${plan.packageIdPreview}-local-assignment-evidence-lane`,
        label: "Local and assignment evidence lane",
        sourceRecords: ["local_media_bundle_entry", "teacher_assignment_rollout_gate", "class_roster_plan"],
        requiredEvidence: ["Local companion export dry run", "Assignment rollout gate", "Class roster identity boundary"],
        acceptanceChecks: [
          "Local export evidence does not activate offline packages",
          "Assignment evidence remains preview-only",
          "Real learner data remains blocked",
        ],
        blockedGaps: ["No local bundle packaging", "No assignment activation"],
      },
      {
        laneId: `${plan.packageIdPreview}-rollback-support-evidence-lane`,
        label: "Rollback and support-language evidence lane",
        sourceRecords: [plan.rollbackDrillId, "assist_language_policy", "school_policy_revocation_rollback_preview"],
        requiredEvidence: ["Rollback drill replay result", "Support-language boundary proof", "School rollback policy preview"],
        acceptanceChecks: [
          "Rollback evidence keeps execution blocked",
          "Support-language evidence is support-only",
          "School rollback expectations are visible before launch",
        ],
        blockedGaps: ["No rollback execution", "No support-language-only test pass"],
      },
    ],
    missingEvidence: [
      "Codex test harness decision",
      "Backend-neutral evidence packet storage contract",
      "Signed teacher approval evidence",
      "School policy acceptance record",
    ],
    blockedEvidenceActions: [
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
      "No support-language-only evidence pass",
    ],
    nextRequiredRecords: [
      "ai_generated_package_writer_module_test_plan",
      "ai_generated_package_writer_module_test_plan storage contract",
      "package_writer_test_evidence_packet storage contract",
      "codex_test_harness_decision",
      "school_policy_acceptance_record_preview",
    ],
    supportLanguageBoundary: plan.supportLanguageBoundary,
  };
}
