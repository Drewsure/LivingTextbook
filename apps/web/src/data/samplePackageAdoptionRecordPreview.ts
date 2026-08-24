export type PackageAdoptionRecordStatus = "not-recorded" | "blocked";

export interface PackageAdoptionRecordPreview {
  previewId: string;
  tenantId: string;
  packageId: string;
  label: string;
  status: PackageAdoptionRecordStatus;
  summary: string;
  minimumFields: string[];
  requiredEvidence: string[];
  acceptanceScopes: string[];
  blockedWrites: string[];
  rollbackHooks: string[];
}

export const samplePackageAdoptionRecordPreviews: PackageAdoptionRecordPreview[] = [
  {
    previewId: "record-preview-premium-ai-authoring-sample-publisher",
    tenantId: "sample-publisher",
    packageId: "premium-ai-authoring",
    label: "Premium AI authoring adoption record preview",
    status: "not-recorded",
    summary:
      "A future accepted record would prove tenant entitlement, school AI policy, budget ceilings, rate-card review, prompt/output retention, and teacher review workflow before AI generation can run.",
    minimumFields: [
      "tenant_id",
      "package_id",
      "package_tier",
      "school_policy_acceptance_id",
      "usage_budget_ceiling_id",
      "model_rate_card_snapshot_id",
      "teacher_review_workflow_id",
      "effective_window",
      "revocation_policy_id",
    ],
    requiredEvidence: [
      "School AI usage policy approval",
      "Tenant package selection",
      "Usage budget ceiling",
      "Model rate-card snapshot",
      "Prompt and output retention policy",
    ],
    acceptanceScopes: [
      "Teacher/admin generation only",
      "Draft package creation only",
      "No direct publish",
      "No student-triggered model calls",
    ],
    blockedWrites: [
      "No accepted premium AI adoption record",
      "No billing entitlement write",
      "No model-call enablement write",
      "No route or assignment write",
    ],
    rollbackHooks: ["Revoke model-call entitlement", "Freeze generated draft queue", "Preserve audit evidence"],
  },
  {
    previewId: "record-preview-premium-voice-tutor-ministar",
    tenantId: "ministar",
    packageId: "premium-voice-tutor",
    label: "Premium Voice Tutor adoption record preview",
    status: "not-recorded",
    summary:
      "A future accepted record would prove AI Tutor entitlement, microphone policy, speech API budget, transcript retention choice, teacher enablement, and upper-level scope before tutor or speech scoring features can run.",
    minimumFields: [
      "tenant_id",
      "package_id",
      "allowed_levels",
      "allowed_tutor_modes",
      "microphone_policy_acceptance_id",
      "speech_api_budget_ceiling_id",
      "transcript_retention_policy_id",
      "teacher_enablement_snapshot_id",
      "revocation_policy_id",
    ],
    requiredEvidence: [
      "AI Tutor package entitlement",
      "Microphone policy acceptance",
      "Speech API cost acceptance",
      "Transcript retention decision",
      "Teacher enablement persisted",
    ],
    acceptanceScopes: [
      "Upper-level units only",
      "Teacher-gated microphone use",
      "No raw audio storage by default",
      "No transcript export by default",
    ],
    blockedWrites: [
      "No accepted Voice Tutor adoption record",
      "No microphone scoring enablement write",
      "No transcript storage write",
      "No tutor route activation",
    ],
    rollbackHooks: ["Disable tutor modes", "Disable speech scoring", "Clear pending microphone enablement"],
  },
  {
    previewId: "record-preview-enterprise-storage-local-sample-publisher",
    tenantId: "sample-publisher",
    packageId: "enterprise-storage-and-local",
    label: "Enterprise storage and local adoption record preview",
    status: "blocked",
    summary:
      "A future accepted record would bind hosted persistence, report export, evidence attachment storage, local companion delivery, support duties, and rollback policy before durable storage or local package activation exists.",
    minimumFields: [
      "tenant_id",
      "package_id",
      "backend_selection_gate_id",
      "school_policy_acceptance_id",
      "report_export_plan_id",
      "local_bundle_manifest_id",
      "support_scope_id",
      "backup_and_retention_policy_id",
      "release_control_packet_id",
    ],
    requiredEvidence: [
      "Persistence vendor selection",
      "School privacy and retention approval",
      "Report export format approval",
      "Local companion support acceptance",
      "Release-control signoff",
    ],
    acceptanceScopes: [
      "Hosted learner event storage",
      "Teacher report export",
      "Evidence attachment storage",
      "Closed local companion handoff",
    ],
    blockedWrites: [
      "No accepted enterprise adoption record",
      "No object storage write",
      "No report export enablement write",
      "No local bundle activation write",
    ],
    rollbackHooks: ["Disable exports", "Pause QR redirect changes", "Revoke local package activation"],
  },
];
