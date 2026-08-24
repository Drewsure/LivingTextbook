export type PackageAdoptionStorageGuardStatus = "contracted-preview" | "policy-required" | "blocked";

export interface PackageAdoptionStorageGuard {
  guardId: string;
  label: string;
  status: PackageAdoptionStorageGuardStatus;
  summary: string;
  storageContractIds: string[];
  visibleStorageFields: string[];
  requiredBeforeActivation: string[];
  blockedActivations: string[];
}

export const samplePackageAdoptionStorageGuards: PackageAdoptionStorageGuard[] = [
  {
    guardId: "package-adoption-storage-contract-core",
    label: "Package adoption storage contract",
    status: "contracted-preview",
    summary:
      "Future premium package adoption must be represented as a reviewable storage contract before an accepted adoption record, billing write, model-call enablement, speech scoring, report export, hosted storage activation, or local companion activation can exist.",
    storageContractIds: [
      "package-adoption-record-preview-record",
      "hosted-package-adoption-record-preview-write",
      "local-package-adoption-record-preview-write",
      "m097-package-adoption-record-preview-storage",
      "spec-package-adoption-record-preview",
    ],
    visibleStorageFields: [
      "package_adoption_record_preview_id",
      "school_policy_acceptance_id",
      "tenant_package_selection_id",
      "usage_budget_ceiling_id",
      "model_rate_card_snapshot_id",
      "microphone_policy_acceptance_id",
      "transcript_retention_policy_id",
      "report_export_plan_id",
      "billing_entitlement_write_allowed",
      "premium_feature_activation_allowed",
      "model_call_enablement_allowed",
      "microphone_scoring_enablement_allowed",
      "report_export_enablement_allowed",
      "local_companion_activation_allowed",
    ],
    requiredBeforeActivation: [
      "Authenticated school policy acceptance",
      "Tenant package selection",
      "Budget and rate-card review",
      "Microphone and transcript policy review",
      "Report export and storage policy review",
      "Release-control and rollback binding",
    ],
    blockedActivations: [
      "No accepted adoption record",
      "No billing entitlement write",
      "No premium feature activation",
      "No live model call",
      "No microphone scoring enablement",
      "No report export enablement",
      "No hosted storage activation",
      "No local companion activation",
    ],
  },
];
