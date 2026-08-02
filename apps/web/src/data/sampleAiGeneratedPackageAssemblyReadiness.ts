import { sampleAiGeneratedPackageManifests } from "@/data/sampleAiGeneratedPackageManifest";
import { sampleAiGeneratedPackagePromotionChecklists } from "@/data/sampleAiGeneratedPackagePromotionChecklist";
import { sampleAiGeneratedPackageReleaseCandidates } from "@/data/sampleAiGeneratedPackageReleaseCandidate";
import { sampleAiGeneratedPublishReadinessGates } from "@/data/sampleAiGeneratedPublishReadinessGate";

export type AiGeneratedPackageAssemblyReadinessStatus = "blocked" | "review-only";
export type AiGeneratedPackageAssemblyLaneStatus = "ready-preview" | "blocked" | "missing";

export interface AiGeneratedPackageAssemblyLane {
  laneId: string;
  label: string;
  status: AiGeneratedPackageAssemblyLaneStatus;
  requiredRecord: string;
  evidence: string;
  assemblyEffect: string;
}

export interface AiGeneratedPackageAssemblyReadiness {
  readinessId: string;
  tenantId: string;
  requestId: string;
  manifestId: string;
  promotionChecklistId: string;
  publishReadinessGateId: string;
  releaseCandidateId: string;
  label: string;
  summary: string;
  status: AiGeneratedPackageAssemblyReadinessStatus;
  readinessState: string;
  packageAssemblyTarget: string;
  routeWriteTarget: string;
  localBundleTarget: string;
  lanes: AiGeneratedPackageAssemblyLane[];
  allowedReviewActions: string[];
  blockedAssemblyActions: string[];
  nextRequiredRecords: string[];
  supportLanguageBoundary: string[];
}

export const sampleAiGeneratedPackageAssemblyReadiness: AiGeneratedPackageAssemblyReadiness[] =
  sampleAiGeneratedPackageManifests.map((manifest) => {
    const promotionChecklist = sampleAiGeneratedPackagePromotionChecklists.find(
      (checklist) => checklist.requestId === manifest.requestId,
    );
    const publishReadinessGate = sampleAiGeneratedPublishReadinessGates.find(
      (gate) => gate.requestId === manifest.requestId,
    );
    const releaseCandidate = sampleAiGeneratedPackageReleaseCandidates.find(
      (candidate) => candidate.requestId === manifest.requestId,
    );
    const isMiniStar = manifest.tenantId === "ministar";
    const manifestMissingCount = manifest.records.filter((record) => record.status === "missing").length;
    const promotionBlockedCount =
      promotionChecklist?.steps.filter((step) => step.status !== "ready-preview").length ?? 1;
    const publishBlockedCount =
      publishReadinessGate?.checks.filter((check) => check.status !== "ready-preview").length ?? 1;
    const releaseBlockedCount =
      releaseCandidate?.signals.filter((signal) => signal.status !== "ready-preview").length ?? 1;

    const lanes: AiGeneratedPackageAssemblyLane[] = [
      {
        laneId: "manifest-completeness",
        label: "Manifest completeness",
        status: manifestMissingCount === 0 ? "ready-preview" : "missing",
        requiredRecord: "ai_generated_package_manifest",
        evidence: `${manifest.records.length} manifest record(s) listed; ${manifestMissingCount} missing record(s) remain.`,
        assemblyEffect: "Blocks package assembly until manifest records, media rights, and teacher approval evidence are complete.",
      },
      {
        laneId: "promotion-checklist",
        label: "Promotion checklist",
        status: promotionBlockedCount === 0 ? "ready-preview" : "blocked",
        requiredRecord: "ai_generated_package_promotion_checklist",
        evidence: `${promotionBlockedCount} promotion blocker(s) remain.`,
        assemblyEffect: "Blocks draft-to-playable handoff until lineage, correction, audio, verifier, reward, and rollout evidence pass.",
      },
      {
        laneId: "publish-readiness",
        label: "Publish readiness",
        status: publishBlockedCount === 0 ? "ready-preview" : "blocked",
        requiredRecord: "ai_generated_publish_readiness_gate",
        evidence: `${publishBlockedCount} publish readiness blocker(s) remain.`,
        assemblyEffect: "Blocks student-facing route creation until release-control, teacher approval, and school policy gates pass.",
      },
      {
        laneId: "release-candidate",
        label: "Release candidate handoff",
        status: releaseBlockedCount === 0 ? "ready-preview" : "blocked",
        requiredRecord: "ai_generated_package_release_candidate",
        evidence: `${releaseBlockedCount} release candidate blocker(s) remain.`,
        assemblyEffect: "Blocks private library handoff and release-candidate writes from the generator route.",
      },
      {
        laneId: "teacher-approval",
        label: "Teacher approval evidence",
        status: "missing",
        requiredRecord: "package_approval_ledger",
        evidence: "No reviewer identity or approval-ledger entry is captured from the generator route.",
        assemblyEffect: "Blocks package assembly, route registry writes, playlist writes, assignments, and local bundles.",
      },
      {
        laneId: "media-rights",
        label: "Media rights evidence",
        status: "missing",
        requiredRecord: "evidence_attachment + media_rights_manifest",
        evidence: isMiniStar ? "MiniStar media rights evidence attachments are not attached." : "Publisher media rights proof is not attached.",
        assemblyEffect: "Blocks multimedia playlist and local package assembly until rights are reviewed.",
      },
      {
        laneId: "target-language-audio",
        label: "Target-language audio approval",
        status: "blocked",
        requiredRecord: "package_game_audio_coverage",
        evidence: isMiniStar
          ? "English term, sentence, instruction, and Speak It audio must be approved before assembly."
          : "Target-language term, sentence, instruction, and game-control audio must be approved before assembly.",
        assemblyEffect: "Blocks student assignment; children must hear the target language for every learner-facing text.",
      },
      ...(isMiniStar
        ? [
            {
              laneId: "ministar-hiragana-support",
              label: "Hiragana support boundary",
              status: "ready-preview" as const,
              requiredRecord: "assist_language_policy_snapshot",
              evidence: "Japanese support remains hiragana-only and support-only for Foundation/Bronze/Plus.",
              assemblyEffect: "Support Japanese cannot assemble, release, score, or unlock the English package.",
            },
          ]
        : []),
    ];

    return {
      readinessId: `ai-generated-package-assembly-readiness-${manifest.requestId}`,
      tenantId: manifest.tenantId,
      requestId: manifest.requestId,
      manifestId: manifest.manifestId,
      promotionChecklistId: promotionChecklist?.checklistId ?? "missing-promotion-checklist",
      publishReadinessGateId: publishReadinessGate?.gateId ?? "missing-publish-readiness-gate",
      releaseCandidateId: releaseCandidate?.candidateId ?? "missing-release-candidate",
      label: isMiniStar ? "MiniStar generated package assembly readiness" : "AI generated package assembly readiness",
      summary: isMiniStar
        ? "Review-only assembly readiness for the MiniStar generated greetings package. It shows the exact blockers before any English learning package can become a playable reviewed package."
        : "Review-only assembly readiness for a generated textbook companion package. It shows the exact blockers before a draft can become a playable reviewed package.",
      status: "blocked",
      readinessState: "Package assembly blocked",
      packageAssemblyTarget: isMiniStar
        ? "MiniStar L1 Greetings reviewed package candidate"
        : "Sample publisher L1 Daily Routines reviewed package candidate",
      routeWriteTarget: isMiniStar ? "/launch/ministar-generated-greetings-blocked" : "/launch/generated-package-preview-blocked",
      localBundleTarget: isMiniStar ? "MiniStar closed package bundle blocked" : "Sample publisher closed package bundle blocked",
      lanes,
      allowedReviewActions: [
        "Inspect generated package assembly evidence",
        "Compare blockers with teacher review queue",
        "Return generated draft for correction",
        "Prepare missing audio, media-rights, and approval evidence",
      ],
      blockedAssemblyActions: [
        "No package assembly from readiness preview",
        "No route registry write from readiness preview",
        "No media playlist write from readiness preview",
        "No local bundle write from readiness preview",
        "No student-ready marker from readiness preview",
        "No assignment from readiness preview",
        "No support-language-only assembly",
      ],
      nextRequiredRecords: [
        "package_approval_ledger",
        "package_publish_gate",
        "teacher_draft_verifier_submission",
        "package_game_audio_coverage",
        "media_rights_manifest",
        "tenant_library_item",
        "teacher_assignment_rollout_gate",
      ],
      supportLanguageBoundary: isMiniStar
        ? [
            "English is the target-language assembly trigger.",
            "Japanese hiragana support is support-only.",
            "Support-language taps cannot satisfy package assembly readiness.",
          ]
        : ["Assist language remains support-only and cannot satisfy package assembly readiness."],
    };
  });

export function filterAiGeneratedPackageAssemblyReadinessByTenant(
  readiness: AiGeneratedPackageAssemblyReadiness[],
  tenantId: string,
): AiGeneratedPackageAssemblyReadiness[] {
  return readiness.filter((item) => item.tenantId === tenantId);
}
