import { sampleAiGeneratedPackageManifests } from "@/data/sampleAiGeneratedPackageManifest";
import { sampleAiGeneratedPackagePromotionChecklists } from "@/data/sampleAiGeneratedPackagePromotionChecklist";
import { sampleAiGeneratedPublishReadinessGates } from "@/data/sampleAiGeneratedPublishReadinessGate";
import {
  getAiGeneratedPackageReleaseCandidateCollectionWarnings,
  validateAiGeneratedPackageReleaseCandidates,
  type AiGeneratedPackageReleaseCandidate,
  type AiGeneratedPackageReleaseCandidateSignal,
} from "@living-textbook/content-model/src/aiGeneratedPackageReleaseCandidate";

export const sampleAiGeneratedPackageReleaseCandidates: AiGeneratedPackageReleaseCandidate[] =
  sampleAiGeneratedPackageManifests.map((manifest) => {
    const promotionChecklist = sampleAiGeneratedPackagePromotionChecklists.find(
      (checklist) => checklist.requestId === manifest.requestId,
    );
    const publishReadinessGate = sampleAiGeneratedPublishReadinessGates.find(
      (gate) => gate.requestId === manifest.requestId,
    );
    const isMiniStar = manifest.tenantId === "ministar";
    const manifestMissingRecordCount = manifest.records.filter((record) => record.status === "missing").length;
    const promotionBlockerCount =
      promotionChecklist?.steps.filter((step) => step.status !== "ready-preview").length ?? 1;
    const publishBlockerCount =
      publishReadinessGate?.checks.filter((check) => check.status !== "ready-preview").length ?? 1;

    const signals: AiGeneratedPackageReleaseCandidateSignal[] = [
      {
        signalId: "manifest-captured",
        label: "Generated manifest captured",
        status: manifestMissingRecordCount === 0 ? "ready-preview" : "missing",
        sourceRecord: "ai_generated_package_manifest",
        evidence: `${manifest.records.length} package manifest record(s) listed; ${manifestMissingRecordCount} missing record(s) remain.`,
        releaseEffect: "Blocks candidate promotion until manifest, media rights, audio, and approval records are complete.",
      },
      {
        signalId: "promotion-checklist-reviewed",
        label: "Promotion checklist reviewed",
        status: promotionBlockerCount === 0 ? "ready-preview" : "blocked",
        sourceRecord: "ai_generated_package_promotion_checklist",
        evidence: `${promotionBlockerCount} promotion blocker(s) remain before draft-to-playable handoff.`,
        releaseEffect: "Blocks private library handoff until lineage, correction, audio, verifier, reward, and rollout evidence pass.",
      },
      {
        signalId: "publish-readiness-attached",
        label: "Publish readiness attached",
        status: publishBlockerCount === 0 ? "ready-preview" : "blocked",
        sourceRecord: "ai_generated_publish_readiness_gate",
        evidence: `${publishBlockerCount} publish readiness blocker(s) remain.`,
        releaseEffect: "Blocks student-facing route creation until release-control, approval, and policy gates pass.",
      },
      {
        signalId: "private-library-target-reserved",
        label: "Private tenant library target reserved",
        status: "blocked",
        sourceRecord: "tenant_library_item",
        evidence: "No private tenant library item is written from the generated package candidate.",
        releaseEffect: "Private library handoff remains a review target, not a saved resource.",
      },
      {
        signalId: "release-candidate-write-reserved",
        label: "Release candidate write reserved",
        status: "blocked",
        sourceRecord: "package_release_candidate",
        evidence: "No package release candidate write occurs from the AI generator route.",
        releaseEffect: "The generated candidate can be discussed without becoming pilot-publishable.",
      },
      {
        signalId: "student-facing-release-blocked",
        label: "Student-facing release blocked",
        status: "blocked",
        sourceRecord: "route_registry_write + teacher_assignment_rollout_gate",
        evidence: "No launch route, route registry entry, assignment, local bundle, or student-ready marker is created.",
        releaseEffect: "Students cannot reach this generated package until the normal release pipeline accepts it.",
      },
      ...(isMiniStar
        ? [
            {
              signalId: "ministar-support-language-release-blocked",
              label: "Japanese support release blocked",
              status: "blocked" as const,
              sourceRecord: "assist_language_policy_snapshot",
              evidence: "MiniStar Japanese support remains hiragana-only support and cannot release or promote the English package.",
              releaseEffect: "English remains the target-language trigger for release, scoring, and progression.",
            },
          ]
        : []),
    ];

    return {
      candidateId: `ai-generated-release-candidate-${manifest.manifestId}`,
      tenantId: manifest.tenantId,
      requestId: manifest.requestId,
      manifestId: manifest.manifestId,
      promotionChecklistId: promotionChecklist?.checklistId ?? "missing-promotion-checklist",
      publishReadinessGateId: publishReadinessGate?.gateId ?? "missing-publish-readiness-gate",
      label: isMiniStar
        ? "MiniStar generated package release candidate"
        : "AI generated package release candidate",
      summary: isMiniStar
        ? "A review-only candidate handoff showing how the MiniStar generated greetings package would eventually move toward a private tenant library item while English remains the release trigger and Japanese remains support-only."
        : "A review-only candidate handoff showing how a generated package would eventually move toward a private tenant library item without creating a live student route.",
      status: signals.some((signal) => signal.status !== "ready-preview") ? "blocked" : "ready-for-review",
      candidateState: "Private tenant library handoff blocked",
      packageTarget: isMiniStar
        ? "MiniStar L1 Greetings generated package candidate"
        : "Sample publisher L1 Daily Routines generated package candidate",
      privateLibraryTarget: isMiniStar
        ? "/teacher/library/ministar#generated-candidate-blocked"
        : "/teacher/library/sample-publisher#generated-candidate-blocked",
      routePreview: isMiniStar
        ? "/launch/ministar-generated-greetings-blocked"
        : "/launch/generated-package-preview-blocked",
      signals,
      candidateRecords: [
        "ai_generated_package_manifest",
        "ai_generated_package_promotion_checklist",
        "ai_generated_publish_readiness_gate",
        "package_release_candidate",
        "tenant_library_item",
        "package_publish_gate",
        "package_approval_ledger",
        "teacher_assignment_rollout_gate",
      ],
      allowedNow: [
        "Review generated release candidate evidence",
        "Compare candidate with private tenant library policy",
        "Return generated package for correction",
        "Prepare release-control evidence packet",
      ],
      blockedActions: [
        "No generated package library publish",
        "No release candidate write",
        "No tenant library item write",
        "No student-facing release",
        "No generated assignment from release candidate",
        "No generated local bundle release",
        "No support-language-only release",
        ...(isMiniStar ? ["No Japanese support-language release"] : []),
      ],
      nextRecords: [
        "tenant_library_item",
        "package_release_candidate",
        "package_publish_gate",
        "package_approval_ledger",
        "reviewer_identity_signature_gate",
        "school_launch_policy_gate",
        "teacher_assignment_rollout_gate",
      ],
    };
  });

export function filterAiGeneratedPackageReleaseCandidatesByTenant(
  candidates: AiGeneratedPackageReleaseCandidate[],
  tenantId: string,
): AiGeneratedPackageReleaseCandidate[] {
  return candidates.filter((candidate) => candidate.tenantId === tenantId);
}

export const sampleAiGeneratedPackageReleaseCandidateErrors =
  validateAiGeneratedPackageReleaseCandidates(sampleAiGeneratedPackageReleaseCandidates);

export const sampleAiGeneratedPackageReleaseCandidateWarnings =
  getAiGeneratedPackageReleaseCandidateCollectionWarnings(sampleAiGeneratedPackageReleaseCandidates);
