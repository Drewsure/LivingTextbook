export type PackageAdoptionStatus = "base-ready" | "approval-required" | "blocked";

export interface PackageAdoptionReadinessItem {
  adoptionId: string;
  tenantId: string;
  packageId: string;
  label: string;
  status: PackageAdoptionStatus;
  owner: string;
  summary: string;
  requiredApprovals: string[];
  requiredRecords: string[];
  costReviewItems: string[];
  policyReviewItems: string[];
  blockedActions: string[];
  nextStep: string;
}

export const samplePackageAdoptionReadinessItems: PackageAdoptionReadinessItem[] = [
  {
    adoptionId: "adoption-ministar-core-classroom-pwa",
    tenantId: "ministar",
    packageId: "core-classroom-pwa",
    label: "MiniStar core classroom adoption",
    status: "base-ready",
    owner: "Teacher and school operations owner",
    summary:
      "The base classroom PWA can be reviewed with QR/front-door launch, target-language audio, curated games, Training Academy recovery, and teacher report previews without premium services.",
    requiredApprovals: ["Reviewed content package", "Launch safety review", "Teacher operating mode"],
    requiredRecords: ["content_package_release", "classroom_launch_gate", "teacher_session_settings_snapshot"],
    costReviewItems: ["No model calls", "No speech API calls", "No hosted report export"],
    policyReviewItems: ["No real learner data", "No production accounts", "No support-language-only progress"],
    blockedActions: ["No live classroom launch", "No report export", "No production QR redirect"],
    nextStep: "Keep piloting through reviewed demo routes until school launch and persistence gates are accepted.",
  },
  {
    adoptionId: "adoption-sample-publisher-premium-ai-authoring",
    tenantId: "sample-publisher",
    packageId: "premium-ai-authoring",
    label: "Sample publisher premium AI authoring adoption",
    status: "approval-required",
    owner: "Tenant admin and school policy owner",
    summary:
      "AI authoring can be planned as a paid teacher/admin package, but model billing, live generation, voice generation, and direct publishing remain blocked until entitlement, rate-card, and policy records exist.",
    requiredApprovals: [
      "Tenant AI generation entitlement",
      "School AI usage policy approval",
      "Model rate-card acceptance",
      "Teacher review workflow acceptance",
    ],
    requiredRecords: [
      "premium_ai_cost_gate",
      "tenant_ai_generation_entitlement",
      "usage_budget_ceiling",
      "model_rate_card_snapshot",
      "teacher_draft_review_handoff",
    ],
    costReviewItems: ["Monthly tenant cap", "Teacher request cap", "No student-triggered cost", "Separate voice package"],
    policyReviewItems: ["Prompt retention policy", "Output review policy", "Media rights review", "No direct AI publish"],
    blockedActions: ["No live model call", "No billing event", "No package writer activation", "No route or playlist creation"],
    nextStep: "Create durable entitlement and budget records before any AI generation toggle is designed.",
  },
  {
    adoptionId: "adoption-ministar-premium-voice-tutor",
    tenantId: "ministar",
    packageId: "premium-voice-tutor",
    label: "MiniStar premium Voice Tutor adoption",
    status: "approval-required",
    owner: "School policy owner and teacher lead",
    summary:
      "Voice Tutor, speech matching, pronunciation scoring, and AI Tutor feedback stay optional for upper levels only and require separate approval from the base classroom package.",
    requiredApprovals: [
      "AI Tutor package entitlement",
      "Microphone policy acceptance",
      "Speech API cost acceptance",
      "Transcript retention decision",
    ],
    requiredRecords: [
      "ai_tutor_entitlement_packet",
      "microphone_policy_acceptance",
      "speech_api_budget_ceiling",
      "transcript_retention_policy",
      "teacher_enablement_persisted",
    ],
    costReviewItems: ["Speech API budget", "Tutor response cap", "No lower-level default tutor", "No child-triggered spending"],
    policyReviewItems: ["No raw audio storage by default", "No transcript storage by default", "Teacher-gated microphone use"],
    blockedActions: ["No microphone permission prompt", "No AI speech scoring", "No tutor chat route", "No transcript export"],
    nextStep: "Prototype browser-local record/replay first; do not enable speech scoring or AI Tutor until upper-level policy is accepted.",
  },
  {
    adoptionId: "adoption-sample-publisher-enterprise-storage-local",
    tenantId: "sample-publisher",
    packageId: "enterprise-storage-and-local",
    label: "Sample publisher enterprise storage and local adoption",
    status: "blocked",
    owner: "Platform admin, tenant admin, and school data owner",
    summary:
      "Hosted persistence, report export, evidence attachment storage, and closed local companion delivery need a stricter adoption path because they touch learner data, retention, support, release, rollback, and local package duties.",
    requiredApprovals: [
      "Persistence vendor selection",
      "School privacy and retention approval",
      "Report export format approval",
      "Local companion support acceptance",
      "Release-control signoff",
    ],
    requiredRecords: [
      "backend_selection_gate",
      "school_policy_acceptance_record",
      "teacher_report_export_plan",
      "local_bundle_manifest",
      "release_control_packet",
    ],
    costReviewItems: ["Storage quota policy", "Export support scope", "Local companion support cost", "Backup and rollback duties"],
    policyReviewItems: ["Learner data retention", "Access control", "Evidence attachment storage", "Local media rights"],
    blockedActions: ["No object storage write", "No local folder write", "No report export", "No local package activation"],
    nextStep: "Select persistence and local support policy before turning this into an adoption offer.",
  },
];
