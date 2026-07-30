import { sampleAiDraftCorrectionQueues } from "@/data/sampleAiDraftCorrectionQueue";
import { sampleAiGeneratedPackageManifests } from "@/data/sampleAiGeneratedPackageManifest";
import { sampleAiRewardReadinessGates } from "@/data/sampleAiRewardReadinessGate";
import { sampleAiVerifierSubmissionPackets } from "@/data/sampleAiVerifierSubmissionPacket";

export type AiGeneratedPublishReadinessStatus = "blocked" | "ready-for-review";
export type AiGeneratedPublishReadinessCheckStatus = "ready-preview" | "blocked" | "missing";

export interface AiGeneratedPublishReadinessCheck {
  checkId: string;
  label: string;
  status: AiGeneratedPublishReadinessCheckStatus;
  evidence: string;
  requiredRecord: string;
  studentUseEffect: string;
}

export interface AiGeneratedPublishReadinessGate {
  gateId: string;
  tenantId: string;
  requestId: string;
  manifestId: string;
  label: string;
  summary: string;
  status: AiGeneratedPublishReadinessStatus;
  publishState: string;
  futureStudentRoute: string;
  checks: AiGeneratedPublishReadinessCheck[];
  allowedNow: string[];
  blockedActions: string[];
  nextRecords: string[];
}

export const sampleAiGeneratedPublishReadinessGates: AiGeneratedPublishReadinessGate[] =
  sampleAiGeneratedPackageManifests.map((manifest) => {
    const verifierPacket = sampleAiVerifierSubmissionPackets.find((packet) => packet.requestId === manifest.requestId);
    const rewardGate = sampleAiRewardReadinessGates.find((gate) => gate.requestId === manifest.requestId);
    const correctionQueue = sampleAiDraftCorrectionQueues.find((queue) => queue.requestId === manifest.requestId);

    const verifierBlockedCount = verifierPacket?.checks.filter((check) => check.status === "blocked").length ?? 1;
    const manifestMissingRecordCount = manifest.records.filter((record) => record.status === "missing").length;
    const rewardBlockedCount = rewardGate?.checks.filter((check) => check.status === "blocked").length ?? 1;

    const checks: AiGeneratedPublishReadinessCheck[] = [
      {
        checkId: "draft-correction-queue-clear",
        label: "Correction queue clear",
        status: correctionQueue?.validationBlockCount === 0 ? "ready-preview" : "blocked",
        evidence: `${correctionQueue?.validationBlockCount ?? "Missing"} validation block(s) and ${correctionQueue?.warningCount ?? "missing"} warning(s) remain.`,
        requiredRecord: "ai_draft_correction_queue",
        studentUseEffect: "Blocks publish because generated drafts must be repaired before verifier submission.",
      },
      {
        checkId: "verifier-packet-approved",
        label: "Verifier packet approved",
        status: verifierBlockedCount === 0 && verifierPacket?.submissionState !== "Submit verifier packet blocked" ? "ready-preview" : "blocked",
        evidence: `${verifierBlockedCount} verifier block(s) remain and submission state is ${verifierPacket?.submissionState ?? "missing"}.`,
        requiredRecord: "ai_verifier_submission_packet",
        studentUseEffect: "Blocks route creation because the Vision/Reasoning layer has not accepted the generated package.",
      },
      {
        checkId: "manifest-records-complete",
        label: "Manifest records complete",
        status: manifestMissingRecordCount === 0 ? "ready-preview" : "missing",
        evidence: `${manifest.records.length} package record(s) listed; ${manifestMissingRecordCount} required record(s) are missing.`,
        requiredRecord: "ai_generated_package_manifest",
        studentUseEffect: "Blocks package assembly until missing media-rights and teacher-approval records exist.",
      },
      {
        checkId: "reward-readiness-passed",
        label: "Reward readiness passed",
        status: rewardGate?.status === "ready-for-review" && rewardBlockedCount === 0 ? "ready-preview" : "blocked",
        evidence: `${rewardBlockedCount} reward readiness block(s) remain for deterministic Star Dust and collection unlocks.`,
        requiredRecord: "ai_reward_readiness_gate",
        studentUseEffect: "Blocks reward publishing, inventory writes, Spin Wheel tickets, avatar evolution, and assignment.",
      },
      {
        checkId: "release-control-bound",
        label: "Release-control binding attached",
        status: "blocked",
        evidence: `${manifest.releaseLocks.length} release lock(s) remain on package assembly, route, playlist, assignment, local bundle, and student-ready state.`,
        requiredRecord: "package_publish_gate",
        studentUseEffect: "Blocks student route publishing until the generated package is attached to the normal publish gate.",
      },
      {
        checkId: "teacher-approval-ledger",
        label: "Teacher approval ledger captured",
        status: "missing",
        evidence: "No reviewer identity, approval ledger entry, or signed school policy record exists for this generated package.",
        requiredRecord: "package_approval_ledger",
        studentUseEffect: "Blocks publish because AI drafts cannot approve themselves.",
      },
    ];

    return {
      gateId: `ai-generated-publish-readiness-${manifest.manifestId}`,
      tenantId: manifest.tenantId,
      requestId: manifest.requestId,
      manifestId: manifest.manifestId,
      label: "AI generated publish readiness gate",
      summary:
        "A last-mile review preview that gathers manifest, verifier, audio, reward, approval, and release-control blockers before any generated package can become a student-facing route.",
      status: checks.some((check) => check.status !== "ready-preview") ? "blocked" : "ready-for-review",
      publishState: "Student route publish blocked",
      futureStudentRoute: "/launch/generated-package-preview-blocked",
      checks,
      allowedNow: [
        "Review generated draft evidence",
        "Return generated draft for correction",
        "Compare against curated activity pathway",
        "Prepare missing media-rights evidence",
      ],
      blockedActions: [
        "Create launch route from generated package blocked",
        "Write tenant route registry entry blocked",
        "Write media playlist from generated package blocked",
        "Create assignment from generated package blocked",
        "Write local bundle from generated package blocked",
        "Mark generated package student-ready blocked",
      ],
      nextRecords: [
        "ai_generated_package_manifest",
        "ai_verifier_submission_packet",
        "package_game_audio_coverage",
        "media_rights_manifest",
        "ai_reward_readiness_gate",
        "package_publish_gate",
        "package_approval_ledger",
      ],
    };
  });

export function filterAiGeneratedPublishReadinessGatesByTenant(
  gates: AiGeneratedPublishReadinessGate[],
  tenantId: string,
): AiGeneratedPublishReadinessGate[] {
  return gates.filter((gate) => gate.tenantId === tenantId);
}
