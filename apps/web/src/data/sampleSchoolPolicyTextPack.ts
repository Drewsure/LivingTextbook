import {
  sampleSchoolPolicyAcceptancePreflight,
  type SchoolPolicyAcceptancePreflight,
} from "@/data/sampleSchoolPolicyAcceptancePreflight";

export type SchoolPolicyTextPackStatus = "blocked" | "needs-review" | "ready-to-draft";
export type SchoolPolicyTextPackOwner = "school" | "publisher" | "platform" | "teacher" | "shared";

export interface SchoolPolicyTextClause {
  clauseId: string;
  label: string;
  status: SchoolPolicyTextPackStatus;
  owner: SchoolPolicyTextPackOwner;
  source: string;
  requiredText: string[];
  reviewNotes: string[];
  blockedActions: string[];
}

export interface SchoolPolicyTextPack {
  policyTextPackId: string;
  label: string;
  tenantId: string;
  packageId: string;
  releaseCandidate: string;
  versionLabel: string;
  sourceOfTruth: string;
  policyStatus: string;
  summary: string;
  clauses: SchoolPolicyTextClause[];
  minimumVersionFields: string[];
  blockedActions: string[];
  reviewRules: string[];
}

export const sampleSchoolPolicyTextPack = createSchoolPolicyTextPack({
  preflight: sampleSchoolPolicyAcceptancePreflight,
});

export function createSchoolPolicyTextPack({
  preflight,
}: {
  preflight: SchoolPolicyAcceptancePreflight;
}): SchoolPolicyTextPack {
  return {
    policyTextPackId: `${preflight.preflightId}-policy-text-v0`,
    label: "School policy text version pack",
    tenantId: preflight.tenantId,
    packageId: preflight.packageId,
    releaseCandidate: preflight.releaseCandidate,
    versionLabel: "Draft policy text v0.1",
    sourceOfTruth: "Source of truth: school policy acceptance preflight",
    policyStatus: "Policy text blocked",
    summary:
      "This pack lists the policy clauses that must become reviewed, versioned text before a school can ever accept launch terms. It is not acceptance text and cannot be signed.",
    clauses: [
      {
        clauseId: "privacy-retention-learner-data",
        label: "Privacy, retention, and learner data",
        status: "blocked",
        owner: "school",
        source: "school-launch-policy-gate",
        requiredText: [
          "What learner data may be collected during a live classroom session",
          "Retention period, deletion request path, and school export rights",
          "Who can view teacher reports and under which school role",
          "Statement that real learner data remains blocked until this clause is accepted",
        ],
        reviewNotes: [
          "Must be school-specific, not a generic product promise",
          "Must keep demo and dry-run data separate from live learner records",
        ],
        blockedActions: [
          "No real learner data collection",
          "No teacher report export",
          "No production student accounts",
        ],
      },
      {
        clauseId: "teacher-led-qr-progression",
        label: "Teacher-led QR and progression rules",
        status: "needs-review",
        owner: "teacher",
        source: "launch-safety-boundary",
        requiredText: [
          "Teacher QR/front-door entry remains the classroom starting point",
          "Target-language activity is required for progress and unlocks",
          "Support language remains comprehension support only",
          "Media-only activity cannot unlock mastery or game progression",
        ],
        reviewNotes: [
          "Must be understandable to school admins and teachers",
          "Must explicitly protect early readers and English learners",
        ],
        blockedActions: [
          "No support-language-only progression",
          "No media-only mastery",
          "No unreviewed QR route promotion",
        ],
      },
      {
        clauseId: "publisher-media-local-package",
        label: "Publisher media, music, video, and local package",
        status: "needs-review",
        owner: "publisher",
        source: "media-rights-and-local-companion-gates",
        requiredText: [
          "Which audio, music, video, and image assets the publisher owns or licenses",
          "Whether background media is optional, teacher-controlled, and lower priority than learning audio",
          "How yearly media updates are reviewed and versioned",
          "Whether a closed local companion package is included",
        ],
        reviewNotes: [
          "Must separate media rights from classroom learning progress",
          "Must name local backup, update, and replacement responsibilities when local mode is offered",
        ],
        blockedActions: [
          "No playlist creation from uploaded media",
          "No local folder activation",
          "No media-only progress",
        ],
      },
      {
        clauseId: "microphone-ai-tutor-premium",
        label: "Microphone and AI Tutor optional features",
        status: "blocked",
        owner: "shared",
        source: "premium-feature-policy",
        requiredText: [
          "Microphone use is school/teacher controlled and off by default",
          "AI Tutor is an optional premium package with cost-visible limits",
          "Speech scoring, transcripts, and model calls are disabled unless separately adopted",
          "Usage caps, privacy rules, and opt-out behavior are visible before activation",
        ],
        reviewNotes: [
          "This clause must never silently enable premium or privacy-sensitive features",
          "The platform must work cleanly without AI Tutor or microphone scoring",
        ],
        blockedActions: [
          "No AI Tutor activation",
          "No microphone scoring by default",
          "No transcript storage",
          "No model-call entitlement",
        ],
      },
      {
        clauseId: "hosted-local-storage-rollback",
        label: "Hosted, local, storage, and rollback",
        status: "blocked",
        owner: "platform",
        source: "backend-storage-and-release-control",
        requiredText: [
          "Selected storage adapter and deployment channel",
          "Evidence attachment storage, export, and deletion policy",
          "Rollback owner for release, QR route, package, and local bundle changes",
          "Hosted/local fallback responsibilities and outage behavior",
        ],
        reviewNotes: [
          "Must not promise local or hosted behavior before the adapter is accepted",
          "Must keep production QR promises blocked until route promotion policy passes",
        ],
        blockedActions: [
          "No storage activation",
          "No object storage write",
          "No launch-ready status",
          "No production QR promise",
        ],
      },
      {
        clauseId: "evidence-signature-revocation",
        label: "Evidence, signature method, and revocation",
        status: "blocked",
        owner: "shared",
        source: "reviewer-identity-signature-gate",
        requiredText: [
          "Which evidence packet version is being accepted",
          "Accepted signature method and approver identity requirement",
          "Revocation path, rollback effect, and audit retention period",
          "Statement that acceptance cannot override missing release-control gates",
        ],
        reviewNotes: [
          "Must bind to a specific release candidate and evidence packet",
          "Must be revocable and auditable before live classroom use",
        ],
        blockedActions: [
          "No accept button",
          "No signed approval capture",
          "No evidence export",
          "No release-state mutation",
        ],
      },
    ],
    minimumVersionFields: [
      "policy_text_pack_id",
      "policy_text_version",
      "tenant_id",
      "school_id",
      "package_id",
      "release_candidate_id",
      "school_policy_acceptance_preflight_id",
      "clause_versions",
      "premium_feature_terms",
      "storage_and_rollback_terms",
      "support_language_progression_terms",
      "review_owner",
      "review_status",
      "supersedes_policy_text_version",
    ],
    blockedActions: [
      "No policy acceptance from text pack",
      "No accept button",
      "No signed approval capture",
      "No evidence export",
      "No storage activation",
      "No launch-ready status",
      "No live classroom workflow",
    ],
    reviewRules: [
      "Policy text must be versioned before any school acceptance workflow exists.",
      "Policy text must distinguish controlled demo, teacher dry run, and live classroom launch.",
      "Support-language text cannot become a progress trigger.",
      "AI Tutor and microphone terms must stay optional, premium, cost-visible, and disabled by default.",
      "A policy text pack cannot approve release, activate storage, export evidence, or create production QR promises.",
    ],
  };
}
