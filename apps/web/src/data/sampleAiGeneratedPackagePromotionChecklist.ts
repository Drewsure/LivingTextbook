import { sampleAiGeneratedPackageManifests } from "@/data/sampleAiGeneratedPackageManifest";
import { sampleAiGeneratedPublishReadinessGates } from "@/data/sampleAiGeneratedPublishReadinessGate";
import { sampleAiGeneratorLineageMaps } from "@/data/sampleAiGeneratorLineageMap";
import {
  getAiGeneratedPackagePromotionChecklistCollectionWarnings,
  validateAiGeneratedPackagePromotionChecklists,
  type AiGeneratedPackagePromotionChecklist,
  type AiGeneratedPackagePromotionStep,
} from "@living-textbook/content-model/src/aiGeneratedPackagePromotionChecklist";

export const sampleAiGeneratedPackagePromotionChecklists: AiGeneratedPackagePromotionChecklist[] =
  sampleAiGeneratedPackageManifests.map((manifest) => {
    const publishGate = sampleAiGeneratedPublishReadinessGates.find((gate) => gate.requestId === manifest.requestId);
    const lineageMap = sampleAiGeneratorLineageMaps.find((map) => map.requestId === manifest.requestId);
    const isMiniStar = manifest.tenantId === "ministar";

    const steps: AiGeneratedPackagePromotionStep[] = [
      {
        stepId: "lineage-reviewed",
        label: "Lineage reviewed",
        status: lineageMap ? "ready-preview" : "missing",
        requiredRecord: "ai_generator_lineage_map",
        evidence: lineageMap
          ? `${lineageMap.steps.length} lineage step(s) trace request, prompt, Draft JSON, verifier, manifest, publish gate, and review queue.`
          : "No request-to-review lineage map is attached.",
        releaseBoundary: "Lineage review cannot generate content, submit verifier packets, or create student routes.",
      },
      {
        stepId: "correction-queue-clear",
        label: "Correction queue clear",
        status:
          publishGate?.checks.find((check) => check.checkId === "draft-correction-queue-clear")?.status ??
          "missing",
        requiredRecord: "ai_draft_correction_queue",
        evidence:
          publishGate?.checks.find((check) => check.checkId === "draft-correction-queue-clear")?.evidence ??
          "Correction queue record is missing.",
        releaseBoundary: "Generated drafts cannot move to package review with schema, audio, or progress-policy repairs open.",
      },
      {
        stepId: "target-audio-approved",
        label: isMiniStar ? "English audio approved" : "Target-language audio approved",
        status: "blocked",
        requiredRecord: "package_game_audio_coverage",
        evidence: isMiniStar
          ? "MiniStar target English term, sentence, instruction, feedback, and control audio still needs approval."
          : "Target-language term, sentence, instruction, feedback, and control audio still needs approval.",
        releaseBoundary: "Tap-to-speak learning audio must be approved before any generated package reaches students.",
      },
      {
        stepId: "verifier-accepted",
        label: "Verifier result evidence accepted",
        status: "blocked",
        requiredRecord: "ai_verifier_result_evidence_packet",
        evidence:
          "Verifier result evidence remains verifier-result-not-submitted, so package promotion cannot rely on verifier output.",
        releaseBoundary:
          "Vision/reasoning result evidence must be reviewed before package approval or promotion can be considered.",
      },
      {
        stepId: "manifest-complete",
        label: "Manifest complete",
        status: publishGate?.checks.find((check) => check.checkId === "manifest-records-complete")?.status ?? "missing",
        requiredRecord: "ai_generated_package_manifest",
        evidence:
          publishGate?.checks.find((check) => check.checkId === "manifest-records-complete")?.evidence ??
          "Generated package manifest is missing.",
        releaseBoundary: "Package assembly stays blocked until rights, approval, audio, engine, reward, and release records are complete.",
      },
      {
        stepId: "reward-and-collection-reviewed",
        label: "Reward and collection reviewed",
        status: publishGate?.checks.find((check) => check.checkId === "reward-readiness-passed")?.status ?? "missing",
        requiredRecord: "ai_reward_readiness_gate",
        evidence:
          publishGate?.checks.find((check) => check.checkId === "reward-readiness-passed")?.evidence ??
          "Reward readiness gate is missing.",
        releaseBoundary: "Generated games cannot publish random rewards, generated gacha, media-only Star Dust, or support-language mastery.",
      },
      {
        stepId: "release-control-bound",
        label: "Release control and approval bound",
        status: "blocked",
        requiredRecord: "package_publish_gate + package_approval_ledger",
        evidence: "Release-control binding, reviewer identity, teacher approval ledger, and school policy evidence are not captured.",
        releaseBoundary: "Generated package promotion cannot create launch routes, playlists, assignments, local bundles, or student-ready markers.",
      },
      {
        stepId: "student-route-scheduled",
        label: "Student route scheduled",
        status: "blocked",
        requiredRecord: "teacher_assignment_rollout_gate",
        evidence: "No reviewed assignment rollout, class roster plan, storage adapter, report policy, or local companion handoff exists.",
        releaseBoundary: "A generated package cannot become a classroom assignment from the promotion checklist.",
      },
      ...(isMiniStar
        ? [
            {
              stepId: "ministar-support-language-boundary",
              label: "Hiragana support stays support-only",
              status: "ready-preview" as const,
              requiredRecord: "assist_language_policy_snapshot",
              evidence:
                "MiniStar Level 1 Japanese support remains ja-hiragana, teacher-enabled, and never unlocks progress.",
              releaseBoundary: "English is the target-language trigger; Japanese support cannot promote, score, or unlock the package.",
            },
          ]
        : []),
    ];

    return {
      checklistId: `ai-generated-package-promotion-${manifest.manifestId}`,
      tenantId: manifest.tenantId,
      requestId: manifest.requestId,
      manifestId: manifest.manifestId,
      lineageId: lineageMap?.lineageId ?? "missing-lineage-map",
      label: isMiniStar ? "MiniStar generated package promotion checklist" : "AI generated package promotion checklist",
      pathwayLabel: "Draft-to-playable package pathway",
      summary: isMiniStar
        ? "A teacher/admin checklist showing exactly what must happen before the MiniStar generated greetings draft can become a reviewed, playable package while English remains the only progress trigger."
        : "A teacher/admin checklist showing exactly what must happen before a generated draft can become a reviewed, playable package.",
      status: steps.some((step) => step.status !== "ready-preview") ? "blocked" : "ready-for-review",
      currentPackageState: "Promotion blocked",
      futurePromotionTarget: isMiniStar
        ? "/launch/ministar-generated-greetings-blocked"
        : "/launch/generated-package-preview-blocked",
      steps,
      allowedNow: [
        "Review promotion evidence",
        "Return generated draft for correction",
        "Prepare audio approval packet",
        "Prepare media-rights evidence",
        "Compare promotion checklist with teacher review queue",
      ],
      blockedActions: [
        "No promote generated package button",
        "No generated route registry write",
        "No generated playlist write",
        "No generated assignment write",
        "No local companion bundle write",
        "No student-ready marker from promotion checklist",
        "No support-language-only promotion",
        ...(isMiniStar ? ["No Japanese support-language promotion"] : []),
      ],
      nextRecords: [
        "package_game_audio_coverage",
        "media_rights_manifest",
        "ai_verifier_result_evidence_packet",
        "ai_verifier_submission_packet",
        "package_publish_gate",
        "package_approval_ledger",
        "teacher_assignment_rollout_gate",
        "class_roster_plan",
        "release_control_adapter_write_intent",
      ],
    };
  });

export function filterAiGeneratedPackagePromotionChecklistsByTenant(
  checklists: AiGeneratedPackagePromotionChecklist[],
  tenantId: string,
): AiGeneratedPackagePromotionChecklist[] {
  return checklists.filter((checklist) => checklist.tenantId === tenantId);
}

export const sampleAiGeneratedPackagePromotionChecklistErrors =
  validateAiGeneratedPackagePromotionChecklists(sampleAiGeneratedPackagePromotionChecklists);

export const sampleAiGeneratedPackagePromotionChecklistWarnings =
  getAiGeneratedPackagePromotionChecklistCollectionWarnings(sampleAiGeneratedPackagePromotionChecklists);
